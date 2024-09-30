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

  const navigateDates = (direction: 'back' | 'forward') => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + (direction === 'back' ? -7 : 7));
    setStartDate(newStartDate);
  };

  return (
    <div className="p-4">
      <AddHabitForm />
      <DateNavigation onNavigate={navigateDates} />
      <HabitList dates={dates} />
    </div>
  );
};

export default HabitTracker;