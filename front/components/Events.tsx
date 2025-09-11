import Link from "next/link";
import { getEvents, getEventImage, Event } from "../app/requests/events";
import { Calendar } from "lucide-react";
import Image from "next/image";

export default async function Events() {
  const events = await getEvents();
  const displayedEvents = events.slice(0, 6);

  const eventsWithImages = await Promise.all(
    displayedEvents.map(async (event: Event) => {
      const imageUrl = await getEventImage(event.id);
      return { ...event, imageUrl };
    })
  );

  return (
    <div
      className="flex w-full flex-col items-center mb-20 gap-10 px-4 sm:px-6 md:px-12 lg:px-20"
      id="events"
    >
      <div className="flex flex-col gap-5 text-center">
        <h1 className="text-2xl sm:text-3xl font-medium leading-tight text-secondary-100">
          Upcoming events
        </h1>
        <p className="text-base sm:text-lg max-w-2xl">
          Stay up to date with our latest events. Join conferences, networking
          sessions, and workshops to connect with inspiring founders and
          innovators.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-6 w-full max-w-[85rem]">
        {eventsWithImages.map((event) => (
          <Link
            href={`/events/${event.id}`}
            key={event.id}
            className="relative flex flex-col border border-secondary-200 shadow-sm rounded-lg 
                       w-full sm:w-[calc(50%-1rem)] lg:w-[430px] 
                       hover:scale-105 transition-transform duration-300 
                       h-[450px] justify-between"
          >
            <Image
              src={event.imageUrl || "/defaultImage.webp"}
              alt={event.name || "Event image"}
              width={400}
              height={200}
              className="w-full h-[250px] sm:h-[290px] object-cover rounded-t-lg"
              unoptimized
            />
            <div className="flex flex-col p-4 sm:p-5">
              <div className="flex items-center mb-3 sm:mb-4">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                <h5 className="ml-3 text-slate-800 text-lg sm:text-xl font-semibold">
                  {event.name}
                </h5>
              </div>
              <p className="block text-slate-600 leading-normal font-light mb-3 sm:mb-4 text-sm sm:text-base">
                {event.dates} <br />
              </p>
              <div className="flex justify-between items-center">
                <div className="bg-secondary-500 text-secondary-100 px-3 py-1 rounded-full text-xs sm:text-sm">
                  {event.event_type}
                </div>
                <p className="text-slate-800 font-semibold text-xs sm:text-sm hover:underline flex items-center">
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-3 w-3 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/events"
        className="px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium rounded-md 
                   bg-secondary-300 text-white hover:bg-secondary-200 
                   transition-colors duration-300 mt-6"
      >
        See all events
      </Link>
    </div>
  );
}
