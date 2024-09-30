import React from 'react';
import { useHabits } from './HabitContext';
import HabitItem from './HabitItem';

interface HabitListProps {
  dates: Date[];
}

const HabitList: React.FC<HabitListProps> = ({ dates }) => {
  const { habits } = useHabits();
  const today = new Date();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2"></th>
            <th className="border p-2" style={{ width: '10em' }}>Due Date</th>
            {dates.map((date, index) => (
              <th 
                key={date.toISOString()} 
                className={`border p-2 ${date.toDateString() === today.toDateString() ? 'bg-green-200' : ''}`}
              >
                {(index === 0 || date.getDate() === 1) ? (
                  <>
                    <div>{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div>{date.getDate()}</div>
                  </>
                ) : (
                  date.getDate()
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => (
            <HabitItem key={habit.id} habit={habit} dates={dates} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitList;