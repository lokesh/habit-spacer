import React, { useState } from 'react';
import { useHabits } from './HabitContext';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Music } from 'lucide-react';

const AddHabitForm: React.FC = () => {
  const [newHabit, setNewHabit] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const { addHabit } = useHabits();

  const handleAddHabit = () => {
    let formattedUrl = newUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'http://' + formattedUrl;
    }
    if (newHabit.trim()) {
      addHabit(newHabit, formattedUrl.trim());
      setNewHabit('');
      setNewUrl('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <div className="flex mb-2">
        <Input
          type="text"
          value={newHabit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewHabit(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a song..."
          className="mr-2"
        />
        <Input
          type="url"
          value={newUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter song URL (optional)"
          className="mr-2"
        />
         <Button onClick={handleAddHabit}><Music size={20} className="mr-2" /> Add Song</Button>
      </div>
    </div>
  );
};

export default AddHabitForm;