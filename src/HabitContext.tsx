import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the structure of a Habit
interface Habit {
  id: number;
  name: string;
  completedDates: string[];
  dueDate: string;
  completionCount: number;
}

// Define the shape of the context
interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string) => void;
  editHabit: (id: number, newName: string) => void;
  deleteHabit: (id: number) => void;
  toggleHabitCompletion: (habitId: number, date: Date) => void;
}

// Create the context
const HabitContext = createContext<HabitContextType | undefined>(undefined);

// HabitProvider component
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Add a new habit
  const addHabit = (name: string): void => {
    const today = new Date();
    setHabits([...habits, { 
      id: Date.now(), 
      name: name.trim(), 
      completedDates: [], 
      dueDate: today.toISOString(), // Initially set due date to today
      completionCount: 0
    }]);
  };

  // Edit an existing habit
  const editHabit = (id: number, newName: string): void => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, name: newName } : habit
    ));
  };

  // Delete a habit
  const deleteHabit = (id: number): void => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // Calculate the next due date based on the habit's completion count
  const calculateNextDueDate = (habit: Habit): string => {
    const today = new Date();
    if (habit.completionCount === 0) {
      return today.toISOString(); // If never completed, due date is today
    }
    // Calculate days to add using exponential backoff: 2^(completionCount - 1)
    const daysToAdd = Math.pow(2, habit.completionCount - 1);
    const lastCompletedDate = new Date(habit.completedDates[habit.completedDates.length - 1] || today);
    const nextDueDate = new Date(lastCompletedDate);
    
    nextDueDate.setDate(lastCompletedDate.getDate() + daysToAdd);
    return nextDueDate.toISOString();

  };

  // Toggle habit completion for a specific date
  const toggleHabitCompletion = (habitId: number, date: Date): void => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const dateString = date.toISOString().split('T')[0];
        let completedDates = habit.completedDates;
        let completionCount = habit.completionCount;
        let dueDate = habit.dueDate;

        if (completedDates.includes(dateString)) {
          // If the date is already completed, remove it
          completedDates = completedDates.filter(d => d !== dateString);
          completionCount = Math.max(0, completionCount - 1);
        } else {
          // If the date is not completed, add it
          completedDates = [...completedDates, dateString];
          completionCount += 1;
        }

        // Recalculate the due date based on the updated completion count and dates
        dueDate = calculateNextDueDate({ 
          ...habit, 
          completionCount, 
          completedDates 
        });

        return { ...habit, completedDates, completionCount, dueDate };
      }
      return habit;
    }));
  };

  // Provide the context value
  return (
    <HabitContext.Provider value={{ habits, addHabit, editHabit, deleteHabit, toggleHabitCompletion }}>
      {children}
    </HabitContext.Provider>
  );
};

// Custom hook to use the habit context
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

// Additional documentation on how the due date is set:
/*
The due date for a habit is set and updated based on the habit's completion count.
This implements a spaced repetition system, where the interval between due dates
increases exponentially as the habit is consistently completed.

1. When a new habit is added:
   - The initial due date is set to the current date (today).
   - The completion count is set to 0.

2. When a habit is marked as completed:
   - The completion count is incremented.
   - A new due date is calculated using the `calculateNextDueDate` function.

3. The `calculateNextDueDate` function:
   - If the completion count is 0, it returns today's date.
   - Otherwise, it calculates the next due date using the formula: 
     nextDueDate = today + 2^(completionCount - 1) days
   
   This results in the following pattern:
   - 1st completion: Due tomorrow (2^0 = 1 day)
   - 2nd completion: Due in 2 days (2^1 = 2 days)
   - 3rd completion: Due in 4 days (2^2 = 4 days)
   - 4th completion: Due in 8 days (2^3 = 8 days)
   And so on...

4. When a habit completion is toggled off:
   - The completion count is decremented (minimum 0).
   - The due date is recalculated based on the new completion count.

This system encourages consistent habit formation by gradually increasing the
interval between due dates as the user successfully maintains the habit.
*/