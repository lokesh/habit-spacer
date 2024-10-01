import React, { useState, useEffect } from 'react';
import { useHabits } from './HabitContext';
import HabitList from './HabitList';
import AddHabitForm from './AddHabitForm';
import DateNavigation from './DateNavigation';

const HabitTracker: React.FC = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());

  useEffect(() => {
    updateDates();
  }, [startDate]);

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

  const navigateDates = (direction: 'back' | 'forward' | 'today') => {
    let newStartDate: Date;
    if (direction === 'today') {
      const today = new Date();
      newStartDate = new Date(today.setDate(today.getDate())); // Set to 3 days before today
    } else {
      newStartDate = new Date(startDate);
      newStartDate.setDate(startDate.getDate() + (direction === 'back' ? -14 : 14));
    }
    console.log(newStartDate);
    setStartDate(newStartDate);
  };

  return (
    <div className="p-4">
      <AddHabitForm />
      <div className="bg-white p-4 rounded-lg border-2">  
        <DateNavigation onNavigate={navigateDates} />
        <HabitList dates={dates} />
      </div>
    </div>
  );
};

export default HabitTracker;