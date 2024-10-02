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
    <div>
      <table className="w-full border-collapse border-none table-auto">
        <thead>
          <tr>
            <th className="p-2 w-40"></th>

            {dates.map((date, index) => (
              <th 
                key={date.toISOString()} 
                className="p-2 text-center align-bottom uppercase"
              >
                <div className="flex flex-col items-center justify-center">
                  {(() => {
                    if (index === 0 || date.getDate() === 1) {
                      return (
                        <div className="text-sm font-bold">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <div className={`w-10 flex items-center justify-center ${date.toDateString() === today.toDateString() ? 'bg-blue-500 text-white rounded-full' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>
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