import React, { useState } from 'react';
import { useHabits } from './HabitContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit2, Trash2, Check } from 'lucide-react';

interface HabitItemProps {
  habit: {
    id: number;
    name: string;
    url: string; // Add this line
    completedDates: string[];
    dueDate: string;
  };
  dates: Date[];
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, dates }) => {
  const { editHabit, deleteHabit, toggleHabitCompletion } = useHabits();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  const [editedUrl, setEditedUrl] = useState(habit.url); // Add this line
  const [isHovering, setIsHovering] = useState(false);

  const handleEdit = () => {
    editHabit(habit.id, editedName, editedUrl); // Update this line
    setIsEditing(false);
  };

  return (
    <tr>
      <td className="border-none">
        <div 
          className="flex items-center justify-between font-bold relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {habit.url ? (
            <a href={habit.url} class="underline" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); window.open(habit.url, '_blank'); }}>
              {habit.name}
            </a>
          ) : (
            habit.name
          )}
          {isHovering && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-md p-1 flex">
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
          )}
        </div>
      </td>
      {/* <td className="border-none" style={{ width: '8em' }}>
        {(() => {
          const dueDate = new Date(habit.dueDate);
          const currentYear = new Date().getFullYear();
          const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
          if (dueDate.getFullYear() !== currentYear) {
            options.year = 'numeric';
          }
          return dueDate.toLocaleDateString('en-US', options);
        })()}
      </td> */}
      {dates.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const isCompleted = habit.completedDates.includes(dateString);
        const isDueDate = habit.dueDate.split('T')[0] === dateString;
        // const isPastDueDate = new Date(habit.dueDate) < date;
        return (
          <td key={dateString} className={`border-none text-center`}>
            <Button
              className={`border-0 ${isDueDate ? 'var(--primary)' : ''}`}
              style={{
                borderWidth: isDueDate ? '3px' : '2px',
                borderColor: isDueDate ? 'rgb(249 115 22)' : 'transparent'
              }}
              variant={isCompleted ? "default" : "outline"}
              size="icon"
              onClick={() => toggleHabitCompletion(habit.id, date)}
            >
              {isCompleted ? <Check size={20} strokeWidth={3} /> : null }
            </Button>
          </td>
        );
      })}
      {/* Add this Dialog component for editing */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{habit.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="url" className="text-right">
                URL
              </label>
              <Input
                id="url"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </tr>
  );
};

export default HabitItem;