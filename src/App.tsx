import React from 'react';
import { HabitProvider } from './HabitContext';
import HabitTracker from './HabitTracker';

function App() {
  return (
    <div className="min-h-screen bg-custom-bg">
      <HabitProvider>
        <HabitTracker />
      </HabitProvider>
    </div>
  );
}

export default App;