import React, { createContext, useContext, useState, useEffect } from 'react';

interface Habit {
  id: number;
  name: string;
  completedDates: string[];
  dueDate: string;
  completionCount: number;
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string) => void;
  editHabit: (id: number, newName: string) => void;
  deleteHabit: (id: number) => void;
  toggleHabitCompletion: (habitId: number, date: Date) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = (name: string): void => {
    const today = new Date();
    setHabits([...habits, { 
      id: Date.now(), 
      name: name.trim(), 
      completedDates: [], 
      dueDate: today.toISOString(),
      completionCount: 0
    }]);
  };

  const editHabit = (id: number, newName: string): void => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, name: newName } : habit
    ));
  };

  const deleteHabit = (id: number): void => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const calculateNextDueDate = (habit: Habit): string => {
    const today = new Date();
    if (habit.completionCount === 0) {
      return today.toISOString();
    }
    const daysToAdd = Math.pow(2, habit.completionCount - 1);
    const nextDueDate = new Date(today);
    nextDueDate.setDate(today.getDate() + daysToAdd);
    return nextDueDate.toISOString();
  };

  const toggleHabitCompletion = (habitId: number, date: Date): void => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const dateString = date.toISOString().split('T')[0];
        let completedDates = habit.completedDates;
        let completionCount = habit.completionCount;
        let dueDate = habit.dueDate;

        if (completedDates.includes(dateString)) {
          completedDates = completedDates.filter(d => d !== dateString);
          completionCount = Math.max(0, completionCount - 1);
          dueDate = calculateNextDueDate({ ...habit, completionCount });
        } else {
          completedDates = [...completedDates, dateString];
          completionCount += 1;
          dueDate = calculateNextDueDate({ ...habit, completionCount });
        }

        return { ...habit, completedDates, completionCount, dueDate };
      }
      return habit;
    }));
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, editHabit, deleteHabit, toggleHabitCompletion }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};