import React from 'react';
import { HabitProvider } from './HabitContext';
import HabitTracker from './HabitTracker';

const App: React.FC = () => {
  return (
    <HabitProvider>
      <HabitTracker />
    </HabitProvider>
  );
};

export default App;