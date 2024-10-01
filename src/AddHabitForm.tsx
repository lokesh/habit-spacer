import React, { useState } from 'react';
import { useHabits } from './HabitContext';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Music } from 'lucide-react';

const AddHabitForm: React.FC = () => {
  const [newHabit, setNewHabit] = useState<string>('');
  const { addHabit } = useHabits();

  const handleAddHabit = () => {
    if (newHabit.trim()) {
      addHabit(newHabit);
      setNewHabit('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };

  return (
    <div className="flex mb-4">
      <Input
        type="text"
        value={newHabit}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewHabit(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter a song..."
        className="mr-2"
      />
      <Button onClick={handleAddHabit}><Music size={20} className="mr-2" /> Add Song</Button>
    </div>
  );
};

export default AddHabitForm;