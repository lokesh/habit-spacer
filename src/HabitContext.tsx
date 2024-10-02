import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * React Hooks and Context API Explanation
 * 
 * This file demonstrates the use of several key React features:
 * 
 * 1. createContext:
 *    - Creates a Context object, which is a way to pass data through the component tree without 
 *      having to pass props down manually at every level.
 *    - Used here to create a HabitContext that will hold our habit-related state and functions.
 * 
 * 2. useContext:
 *    - A hook that lets you read and subscribe to context from your component.
 *    - Used in the useHabits custom hook to access the HabitContext.
 * 
 * 3. useState:
 *    - A hook that lets you add React state to function components.
 *    - Used here to manage the habits array state.
 * 
 * 4. useEffect:
 *    - A hook for performing side effects in function components.
 *    - Used here for two purposes:
 *      a) To load habits from localStorage when the component mounts.
 *      b) To save habits to localStorage whenever they change.
 * 
 * How they work together:
 * 1. We create a context using createContext.
 * 2. We use useState to manage the habits state within the HabitProvider component.
 * 3. We use useEffect to perform side effects related to localStorage.
 * 4. We provide the context value (including state and functions) to child components using the Context.Provider.
 * 5. Child components can then use the useHabits custom hook (which uses useContext internally) to access the habit context.
 * 
 * This pattern allows us to manage global state (habits) and provide it to any component in our app without prop drilling.
 */

// Define the structure of a Habit
interface Habit {
  id: number;
  name: string;
  url: string; // Add this line
  completedDates: string[];
  dueDate: string;
  completionCount: number;
}

// Define the shape of the context
interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, url: string) => void; // Updated to include url parameter
  editHabit: (id: number, newName: string, newUrl: string) => void; // Updated to include newUrl parameter
  deleteHabit: (id: number) => void;
  toggleHabitCompletion: (habitId: number, date: Date) => void;
}

// Create the context
const HabitContext = createContext<HabitContextType | undefined>(undefined);

/**
 * HabitProvider component
 * 
 * This component serves as a wrapper for our app, providing the HabitContext to all child components.
 * It manages the state of habits and provides functions to manipulate this state.
 * 
 * @param {Object} props - The properties passed to this component
 * @param {React.ReactNode} props.children - The child components to be wrapped by this provider
 */
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold our array of habits
  const [habits, setHabits] = useState<Habit[]>([]);

  // Effect to load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Effect to save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  /**
   * Adds a new habit to the habits array
   * @param {string} name - The name of the new habit
   * @param {string} url - The URL associated with the new habit
   */
  const addHabit = (name: string, url: string): void => {
    const today = new Date();
    setHabits([...habits, { 
      id: Date.now(), 
      name: name.trim(), 
      completedDates: [], 
      dueDate: today.toISOString(),
      completionCount: 0,
      url: url.trim() // Add the URL to the new habit object
    }]);
  };

  /**
   * Edits an existing habit
   * @param {number} id - The id of the habit to edit
   * @param {string} newName - The new name for the habit
   * @param {string} newUrl - The new URL for the habit
   */
  const editHabit = (id: number, newName: string, newUrl: string): void => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === id ? { ...habit, name: newName, url: newUrl } : habit
      )
    );
  };

  /**
   * Deletes a habit from the habits array
   * @param {number} id - The id of the habit to delete
   */
  const deleteHabit = (id: number): void => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  /**
   * Calculates the next due date based on the habit's completion count
   * @param {Habit} habit - The habit to calculate the next due date for
   * @returns {string} The next due date as an ISO string
   */
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

  /**
   * Toggles habit completion for a specific date
   * @param {number} habitId - The id of the habit to toggle
   * @param {Date} date - The date to toggle completion for
   */
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

        // Recalculate the due date based on the updated completion count
        dueDate = calculateNextDueDate({ ...habit, completionCount });

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

/**
 * Custom hook to use the habit context
 * 
 * This hook provides an easy way for components to access the habit context.
 * It also ensures that the hook is used within a HabitProvider.
 * 
 * @returns {HabitContextType} The habit context value
 * @throws {Error} If used outside of a HabitProvider
 */
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};