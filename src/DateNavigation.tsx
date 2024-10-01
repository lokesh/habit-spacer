import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface DateNavigationProps {
  onNavigate: (direction: 'back' | 'forward' | 'today') => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ onNavigate }) => {
  return (
    <div className="flex gap-2 mb-2 justify-end">
      <Button onClick={() => onNavigate('back')} size="icon"><ChevronLeft size={24} strokeWidth={2} /></Button>
      <Button onClick={() => onNavigate('today')} size="icon"><Home size={24} strokeWidth={2} /></Button>
      <Button onClick={() => onNavigate('forward')} size="icon"><ChevronRight size={24} strokeWidth={2} /></Button>
    </div>
  );
};

export default DateNavigation;