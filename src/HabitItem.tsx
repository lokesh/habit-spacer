import React, { useState } from 'react';
import { useHabits } from './HabitContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface HabitItemProps {
  habit: {
    id: number;
    name: string;
    completedDates: string[];
    dueDate: string;
  };
  dates: Date[];
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, dates }) => {
  const { editHabit, deleteHabit, toggleHabitCompletion } = useHabits();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);

  const handleEdit = () => {
    editHabit(habit.id, editedName);
    setIsEditing(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <tr>
      <td className="border-none">
        {isEditing ? (
          <div className="flex items-center">
            <Input
              type="text"
              value={editedName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value)}
              className="mr-2"
            />
            <Button onClick={handleEdit} variant="ghost" size="icon"><Check size={16} /></Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {habit.name}
            <div>
              <Button onClick={() => setIsEditing(true)} variant="ghost" size="icon"><Edit2 size={16} /></Button>
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
      <td className="border-none" style={{ width: '8em' }}>
        {(() => {
          const dueDate = new Date(habit.dueDate);
          const currentYear = new Date().getFullYear();
          const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
          if (dueDate.getFullYear() !== currentYear) {
            options.year = 'numeric';
          }
          return dueDate.toLocaleDateString('en-US', options);
        })()}
      </td>
      {dates.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const isCompleted = habit.completedDates.includes(dateString);
        const isDueDate = habit.dueDate.split('T')[0] === dateString;
        return (
          <td key={dateString} className={`border-none text-center`}>
            <Button
              className={`rounded-full ${isDueDate ? 'border-orange-500' : ''}`}
              variant={isCompleted ? "default" : "outline"}
              size="icon"
              onClick={() => toggleHabitCompletion(habit.id, date)}
            >
              {isCompleted ? <Check size={16} /> : null }
            </Button>
          </td>
        );
      })}
    </tr>
  );
};

export default HabitItem;