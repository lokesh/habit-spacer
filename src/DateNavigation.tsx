import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateNavigationProps {
  onNavigate: (direction: 'back' | 'forward') => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ onNavigate }) => {
  return (
    <div className="flex justify-between mb-2">
      <Button onClick={() => onNavigate('back')} variant="outline" size="icon"><ChevronLeft size={16} /></Button>
      <Button onClick={() => onNavigate('forward')} variant="outline" size="icon"><ChevronRight size={16} /></Button>
    </div>
  );
};

export default DateNavigation;