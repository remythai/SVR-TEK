"use client";

import { useState } from "react";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Event {
  id: number;
  name: string;
  description?: string;
  dates?: string;
  event_type?: string;
  location?: string;
  target_audience?: string;
  imageUrl?: string | null;
}

interface CalendarViewProps {
  eventsWithImages: Event[];
}

function CalendarView({ eventsWithImages }: CalendarViewProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('fr-FR', { month: 'short' }),
      year: date.getFullYear(),
      weekday: date.toLocaleString('fr-FR', { weekday: 'short' }),
      fullDate: date
    };
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    if (view === 'month') {
      newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setSelectedDate(newDate);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(null);
    }
    
    return days;
  };

  const getEventsForDate = (day: number | null) => {
    if (day === null) return [];
    
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return eventsWithImages.filter(event => {
      if (!event.dates) return false;
      const eventDate = new Date(event.dates);
      return eventDate.getDate() === date.getDate() && 
             eventDate.getMonth() === date.getMonth() && 
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const getMonthYearString = () => {
    return selectedDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getWeekRange = () => {
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek,
      end: endOfWeek
    };
  };

  const renderMonthView = () => {
    const days = generateMonthDays();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Calendar - {getMonthYearString()}</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Today
            </button>
            <button 
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day === new Date().getDate() && 
                           selectedDate.getMonth() === new Date().getMonth() && 
                           selectedDate.getFullYear() === new Date().getFullYear();
            
            return (
              <div 
                key={index} 
                className={`min-h-24 p-2 border rounded-lg ${
                  day === null ? 'bg-gray-50 border-gray-100' : 
                  isToday ? 'bg-blue-50 border-blue-200' : 
                  'border-gray-200'
                }`}
              >
                {day !== null && (
                  <>
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                      {day}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div 
                          key={event.id} 
                          className="text-xs bg-secondary-500/40 text-secondary-100 rounded px-1 py-0.5 truncate cursor-pointer hover:bg-secondary-500/60 transition-colors duration-300"
                          title={event.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedEvent(expandedEvent === event.id ? null : event.id);
                          }}
                        >
                          {event.name.length > 15 ? event.name.slice(0, 12) + '...' : event.name}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2} de plus</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const { start } = getWeekRange();
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDays.push(date);
    }
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-8 gap-2">
          <div className="text-center text-sm font-medium text-gray-500 py-2">Heure</div>
          {weekDays.map(day => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div 
                key={day.toISOString()} 
                className={`text-center text-sm font-medium py-2 ${isToday ? 'bg-blue-50 text-blue-800 rounded' : 'text-gray-500'}`}
              >
                <div>{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                <div>{day.getDate()}</div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-8 gap-2 mt-2">
          <div className="flex flex-col items-center justify-center text-xs text-gray-500 space-y-8">
            {Array.from({ length: 10 }, (_, i) => i + 8).map(hour => (
              <div key={hour}>{hour}h</div>
            ))}
          </div>
          
          {weekDays.map(day => {
            const dayEvents = eventsWithImages.filter(event => {
              if (!event.dates) return false;
              const eventDate = new Date(event.dates);
              return eventDate.toDateString() === day.toDateString();
            });
            
            return (
              <div key={day.toISOString()} className="relative min-h-80 border rounded-lg p-2">
                {dayEvents.map(event => {
                    if (!event.dates) return null; // sécurité
                    const eventDate = new Date(event.dates);

                    return (
                        <div 
                        key={event.id}
                        className="absolute bg-blue-100 text-blue-800 rounded p-1 text-xs w-full cursor-pointer hover:bg-blue-200"
                        style={{ 
                            top: `${((eventDate.getHours() - 8) * 60 + eventDate.getMinutes()) / 6}%`,
                            height: '40px'
                        }}
                        onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                        >
                        {event.name.length > 20 ? event.name.slice(0, 17) + '...' : event.name}
                        </div>
                    );
                    })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = eventsWithImages.filter(event => {
      if (!event.dates) return false;
      return new Date(event.dates).toDateString() === selectedDate.toDateString();
    });
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
            >
              Today
            </button>
            <button 
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {dayEvents.length > 0 ? (
            dayEvents.map(event => {
                if (!event.dates)
                        return null;
              const formattedDate = formatDate(event.dates);
              return (
                <div 
                  key={event.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-secondary-500/40 rounded-lg flex flex-col items-center justify-center mr-3">
                        <div className="text-sm font-bold text-secondary-100">{formattedDate.day}</div>
                        <div className="text-xs text-secondary-100">{formattedDate.month}</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {event.name.length > 30 ? event.name.slice(0, 27) + "..." : event.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location || "Lieu à préciser"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.dates).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {expandedEvent === event.id && (
                    <div className="mt-4 pl-15">
                      {event.event_type && (
                        <div className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-3">
                          {event.event_type}
                        </div>
                      )}
                      <p className="text-gray-600 text-sm mb-3">
                        {event.description || "Aucune description disponible."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              There is no event for this date
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen mt-30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event&apo;s calendar</h1>
          <p className="text-gray-600">Discover our future events and partnerships</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                view === 'day' 
                  ? 'bg-secondary-500/40 text-secondary-100' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setView('day')}
            >
              Day
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                view === 'month' 
                  ? 'bg-secondary-500/40 text-secondary-100' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setView('month')}
            >
              Month
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
          </div>

          
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsWithImages.map((event) => {
              const formattedDate = event.dates ? formatDate(event.dates) : null;
              
              return (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                  <div className="relative h-48 bg-gray-200">
                    {event.imageUrl ? (
                      <Image 
                        src={event.imageUrl} 
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Calendar className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {formattedDate && (
                      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-sm p-2 text-center">
                        <div className="text-sm font-bold text-gray-800">{formattedDate.day}</div>
                        <div className="text-xs text-gray-600">{formattedDate.month}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {event.name.length > 30 ? event.name.slice(0, 27) + "..." : event.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.location || "Lieu à préciser"}</span>
                    </div>
                    
                    {event.event_type && (
                      <span className="inline-block bg-secondary-500/40 text-secondary-100 text-xs px-3 py-1 rounded-full mb-4">
                        {event.event_type}
                      </span>
                    )}
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description || "Aucune description disponible."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;