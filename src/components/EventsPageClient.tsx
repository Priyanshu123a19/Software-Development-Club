"use client";

import { motion } from "framer-motion";
import EventCard from "@/components/events/EventCard";
import Tag from "@/components/Tag";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  venue: string;
  capacity: number;
  price: number;
  image: string | null;
  _count: {
    registrations: number;
  };
}

interface EventsPageClientProps {
  events: Event[];
}

export default function EventsPageClient({ events }: EventsPageClientProps) {
  return (
    <>
      <main className="min-h-screen bg-neutral-950 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative mb-5 text-center">
            <div className="relative mb-5 text-center">
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="pointer-events-none absolute -inset-8 -z-10"
              >
                <motion.div
                  className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-r from-fuchsia-500/15 via-purple-500/10 to-indigo-500/15 blur-3xl"
                  animate={{ opacity: [0.6, 0.9, 0.6], y: [0, -6, 0] }}
                  transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                />
              </motion.div>
            </div>

            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="pointer-events-none absolute -inset-x-20 -top-20 bottom-0 -z-10"
            >
              <motion.div
                className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-fuchsia-500/20 via-purple-500/15 to-indigo-500/20 blur-[100px]"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </motion.div>

            <Tag className="mx-auto">Our Events</Tag>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-4 text-balance text-4xl font-semibold md:text-6xl"
            >
              <span>Events</span>{" "}
              <span className="text-white/60">organized by</span>{" "}
              <span className="text-[#E45A92]">the club</span>
            </motion.h2>
          </div>

          <div className="text-center mb-16">
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Join our exciting events, workshops, and competitions. Learn new
              skills, network with peers, and take your development journey to
              the next level.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                venue={event.venue}
                capacity={event.capacity}
                price={event.price}
                image={event.image || ""}
                registeredCount={event._count.registrations}
              />
            ))}
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
