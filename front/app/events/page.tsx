import Image from "next/image";
import { getEvents, getEventImage } from "../requests/events";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface Event {
  id: number;
  name: string;
  description?: string;
  dates?: string;
  event_type?: string;
}

export default async function events() {

    const events = await getEvents();

    const eventsWithImages = await Promise.all(
        events.map(async (event: Event) => {
          const imageUrl = await getEventImage(event.id);
          return { ...event, imageUrl };
        })
      );

    return (
        <div className="w-full h-full flex justify-center flex-col items-center mt-30">
            <div className="flex flex-wrap items-center justify-center gap-8 pt-6 max-w-[85rem]">
                {eventsWithImages.map((event) => (
                    <Link
                        href={`/events/${event.id}`}
                        key={event.id}
                        className="relative flex flex-col border border-secondary-200 shadow-sm rounded-lg w-[430px] hover:scale-105 transition-transform duration-300 h-[450px] justify-between"
                    >
                        <Image
                            src={event.imageUrl || "/defaultImage.webp"}
                            alt={event.name || "Event image"}
                            width={400}
                            height={200}
                            className="w-full h-[290px] object-cover rounded-t-md"
                            unoptimized
                        />
                        <div className="fle flex-col items-start p-5">
                            <div className="flex items-center mb-4">
                                <Calendar />
                                <h5 className="ml-3 text-slate-800 text-xl font-semibold">
                                    {event.name.length > 30 ? event.name.slice(0, 20) + "..." : event.name}
                                </h5>
                            </div>
                            <p className="block text-slate-600 leading-normal font-light mb-4">
                            {event.dates} <br />
                            </p>
                            <div>
                            <div className="flex justify-between">
                                <div className="bg-secondary-500 text-secondary-100 px-3 py-1 rounded-full">
                                    {event.event_type}
                                </div>
                                <p className="text-slate-800 font-semibold text-sm hover:underline flex items-center text-right">
                                    Learn More
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </p>
                            </div>
                            </div>
                        </div>
                    </Link>
                ))};
            </div>
        </div>
    );
}