import Image from "next/image";
import { getEvents, getEventImage } from "../requests/events";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
  id: number;
  name: string;
  description?: string;
  dates?: string;
  event_type?: string;
  location?: string;
  target_audience?: string;
}

export default async function EventsCalendar() {
  const events = await getEvents();

  const eventsWithImages = await Promise.all(
    events.map(async (event: Event) => {
      const imageUrl = await getEventImage(event.id);
      return { ...event, imageUrl };
    })
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('fr-FR', { month: 'short' }),
      year: date.getFullYear(),
      weekday: date.toLocaleString('fr-FR', { weekday: 'short' })
    };
  };

  return (
    <div className="min-h-screen mt-30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendrier des Événements</h1>
          <p className="text-gray-600">Découvrez nos prochains événements et activités</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Calendrier</h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {/* Jours du mois (simplifié) */}
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const dayEvents = eventsWithImages.filter(event => {
                  if (!event.dates) return false;
                  const eventDate = new Date(event.dates);
                  return eventDate.getDate() === day;
                });
                
                return (
                  <div 
                    key={day} 
                    className={`min-h-20 p-2 border rounded-lg ${
                      dayEvents.length > 0 ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-700">{day}</div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div 
                          key={event.id} 
                          className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate"
                          title={event.name}
                        >
                          {event.name.length > 15 ? event.name.slice(0, 12) + '...' : event.name}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2} de plus</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Liste des événements à venir */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Événements à venir</h2>
            <div className="space-y-6">
              {eventsWithImages.map((event) => {
                const formattedDate = event.dates ? formatDate(event.dates) : null;
                
                return (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {formattedDate && (
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center mr-3">
                          <div className="text-sm font-bold text-blue-800">{formattedDate.day}</div>
                          <div className="text-xs text-blue-600">{formattedDate.month}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formattedDate.weekday}</div>
                          <div className="text-xs text-gray-500">{formattedDate.year}</div>
                        </div>
                      </div>
                    )}
                    
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {event.name.length > 30 ? event.name.slice(0, 27) + "..." : event.name}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location || "Lieu à préciser"}</span>
                    </div>
                    
                    {event.event_type && (
                      <div className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-3">
                        {event.event_type}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                      <Link 
                        href={`/events/${event.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        Voir détails <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tous les événements</h2>
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
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-4">
                        {event.event_type}
                      </span>
                    )}
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description || "Aucune description disponible."}
                    </p>
                    
                    <Link 
                      href={`/events/${event.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg block transition-colors"
                    >
                      Voir détails
                    </Link>
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