import React from 'react';
import { HabitProvider } from './HabitContext';
import HabitTracker from './HabitTracker';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-custom-bg mx-auto" style={{ maxWidth: '60rem' }}>
      <HabitProvider>
        <HabitTracker />
      </HabitProvider>
    </div>
  );
}

export default App;