// app/events/page.tsx (composant serveur)
import { getEvents, getEventImage } from "../requests/events";
import CalendarView from "./CalendarView";

interface Event {
  id: number;
  name: string;
  description?: string;
  dates?: string;
  event_type?: string;
  location?: string;
  target_audience?: string;
}

export default async function EventsPage() {
  const events = await getEvents();

  const eventsWithImages = await Promise.all(
    events.map(async (event: Event) => {
      const imageUrl = await getEventImage(event.id);
      return { ...event, imageUrl };
    })
  );

  return <CalendarView eventsWithImages={eventsWithImages} />;
}