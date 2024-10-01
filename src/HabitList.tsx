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
      <table className="w-full border-collapse border-none table-auto">
        <thead>
          <tr>
            <th className="p-2 text-left"></th>
            <th className="p-2 text-left"><div>Due Date</div></th>
            {dates.map((date, index) => (
              <th 
                key={date.toISOString()} 
                className={`p-2 text-center align-bottom ${date.toDateString() === today.toDateString() ? 'bg-green-100' : ''}`}
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