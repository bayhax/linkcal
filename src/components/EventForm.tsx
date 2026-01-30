import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, X, MapPin, AlignLeft, Clock, CalendarDays } from 'lucide-react';
import type { CalendarEvent } from '../types';

interface EventFormProps {
  onAdd: (event: CalendarEvent) => void;
  onCancel?: () => void;
}

export function EventForm({ onAdd, onCancel }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const event: CalendarEvent = {
      id: crypto.randomUUID(),
      title,
      start: allDay ? `${date}T00:00:00` : `${date}T${startTime}:00`,
      end: allDay ? `${date}T23:59:59` : `${date}T${endTime}:00`,
      allDay,
      description: description || undefined,
      location: location || undefined,
    };
    
    onAdd(event);
    
    // Reset form
    setTitle('');
    setDescription('');
    setLocation('');
    setShowOptional(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="card p-6 animate-fade-in-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          New Event
        </h3>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn-icon !p-2 !rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Title Input */}
      <div className="mb-5">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Event title"
          className="input-borderless text-xl font-medium placeholder:font-normal"
        />
      </div>
      
      {/* Date & Time Row */}
      <div className="flex flex-wrap items-start gap-4 mb-5">
        {/* Date */}
        <div className="flex-1 min-w-[140px]">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            <CalendarDays className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input"
          />
        </div>
        
        {/* Time Range */}
        {!allDay && (
          <div className="flex-1 min-w-[200px]">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <Clock className="w-4 h-4" />
              Time
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input flex-1"
              />
              <span className="text-gray-400">→</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input flex-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* All Day Toggle */}
      <label className="flex items-center gap-3 mb-5 cursor-pointer group">
        <input
          type="checkbox"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
          className="peer"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
          All-day event
        </span>
      </label>

      {/* Optional Fields Toggle */}
      {!showOptional && (
        <button
          type="button"
          onClick={() => setShowOptional(true)}
          className="w-full py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors mb-5"
        >
          + Add location or description
        </button>
      )}

      {/* Optional Fields */}
      {showOptional && (
        <div className="space-y-4 mb-5 animate-fade-in">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location or meeting link"
              className="input"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <AlignLeft className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add notes or details"
              className="input resize-none"
            />
          </div>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={!title.trim()}
        className="btn-primary w-full"
      >
        <Plus className="w-5 h-5" />
        <span>Add Event</span>
      </button>
    </form>
  );
}
