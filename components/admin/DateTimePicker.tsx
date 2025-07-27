'use client';

import React, { useState, useEffect } from 'react';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  minDate?: Date;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  error,
  minDate = new Date()
}) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  // Format the date and time when the value changes
  useEffect(() => {
    if (value) {
      const formattedDate = formatDate(value);
      const formattedTime = formatTime(value);
      setDate(formattedDate);
      setTime(formattedTime);
    } else {
      // Default to tomorrow at 9:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      setDate(formatDate(tomorrow));
      setTime(formatTime(tomorrow));
      onChange(tomorrow);
    }
  }, [value, onChange]);

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format time to HH:MM
  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    updateDateTime(e.target.value, time);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    updateDateTime(date, e.target.value);
  };

  // Update the combined date and time
  const updateDateTime = (dateStr: string, timeStr: string) => {
    if (dateStr && timeStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const newDate = new Date(year, month - 1, day, hours, minutes);
      onChange(newDate);
    }
  };

  // Calculate minimum date string
  const minDateString = formatDate(minDate);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          min={minDateString}
          className={`w-full px-3 py-2 bg-purple-900 bg-opacity-50 border ${
            error ? 'border-red-500' : 'border-purple-500'
          } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
      </div>
      <div className="flex-1">
        <input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className={`w-full px-3 py-2 bg-purple-900 bg-opacity-50 border ${
            error ? 'border-red-500' : 'border-purple-500'
          } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;