import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Habit {
  id: number;
  name: string;
  completedDates: string[];
  dueDate: string;
  completionCount: number;
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<string>('');
  const [editingHabit, setEditingHabit] = useState<number | null>(null);
  const [dates, setDates] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());

  useEffect(() => {
    updateDates();
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const updateDates = () => {
    const currentDate = new Date(startDate);
    const previousThreeDays = [...Array(3)].map((_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - (3 - i));
      return date;
    });
    const nextTenDays = [...Array(11)].map((_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      return date;
    });
    setDates([...previousThreeDays, ...nextTenDays]);
  };

  const navigateDates = (direction: 'back' | 'forward') => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + (direction === 'back' ? -7 : 7));
    setStartDate(newStartDate);
  };

  const addHabit = (): void => {
    if (newHabit.trim()) {
      const today = new Date();
      setHabits([...habits, { 
        id: Date.now(), 
        name: newHabit.trim(), 
        completedDates: [], 
        dueDate: today.toISOString(),
        completionCount: 0
      }]);
      setNewHabit('');
    }
  };

  const editHabit = (id: number, newName: string): void => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, name: newName } : habit
    ));
    setEditingHabit(null);
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          value={newHabit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewHabit(e.target.value)}
          placeholder="Enter a new habit"
          className="mr-2"
        />
        <Button onClick={addHabit}><Plus size={16} className="mr-2" /> Add Habit</Button>
      </div>
      <div className="flex justify-between mb-2">
        <Button onClick={() => navigateDates('back')} variant="outline" size="icon"><ChevronLeft size={16} /></Button>
        <Button onClick={() => navigateDates('forward')} variant="outline" size="icon"><ChevronRight size={16} /></Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Habit</th>
              <th className="border p-2" style={{ width: '10em' }}>Due Date</th>
              {dates.map(date => (
                <th key={date.toISOString()} className="border p-2">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map(habit => (
              <tr key={habit.id}>
                <td className="border p-2">
                  {editingHabit === habit.id ? (
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={habit.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => editHabit(habit.id, e.target.value)}
                        className="mr-2"
                      />
                      <Button onClick={() => setEditingHabit(null)} variant="ghost" size="icon"><Check size={16} /></Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      {habit.name}
                      <div>
                        <Button onClick={() => setEditingHabit(habit.id)} variant="ghost" size="icon"><Edit2 size={16} /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 size={16} /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the habit.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteHabit(habit.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </td>
                <td className="border p-2 text-center" style={{ width: '10em' }}>
                  {formatDate(habit.dueDate)}
                </td>
                {dates.map(date => {
                  const dateString = date.toISOString().split('T')[0];
                  const isCompleted = habit.completedDates.includes(dateString);
                  const isDueDate = habit.dueDate.split('T')[0] === dateString;
                  return (
                    <td key={dateString} className={`border p-2 text-center ${isDueDate ? 'bg-yellow-200' : ''}`}>
                      <Button
                        variant={isCompleted ? "default" : "outline"}
                        size="icon"
                        onClick={() => toggleHabitCompletion(habit.id, date)}
                      >
                        {isCompleted ? <Check size={16} /> : <X size={16} />}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitTracker;