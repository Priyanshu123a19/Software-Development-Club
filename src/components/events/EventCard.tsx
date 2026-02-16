"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";
import homecomingImage from "@/assets/images/Events/homecoming-sdc-26.png";

export interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  venue: string;
  capacity: number;
  price: number;
  image?: string;
  registeredCount?: number;
}

export default function EventCard({ 
  id, 
  title, 
  description, 
  date, 
  venue, 
  capacity, 
  price, 
  image,
  registeredCount = 0 
}: EventCardProps) {
  const eventDate = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const spotsLeft = capacity - registeredCount;
  const isAlmostFull = spotsLeft <= capacity * 0.2;
  const displayImage = image || homecomingImage.src;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl"
    >
      {/* Event Image */}
      {image ? (
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={displayImage} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent" />
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-[#E45A92]/10 px-3 py-1 text-xs font-medium text-[#E45A92] border border-[#E45A92]/20">
            {formattedDate}
          </span>
          {isAlmostFull && (
            <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400 border border-orange-500/20">
              {spotsLeft} spots left
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-white group-hover:text-[#E45A92] transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/60 line-clamp-2">
          {description}
        </p>

        {/* Venue & Capacity */}
        <div className="flex items-center gap-4 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{capacity} Students</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest">Starting at</p>
            <p className="text-2xl font-bold text-white">₹{price}</p>
          </div>
          <Link href={`/events/${id}`}>
            <Button variant="primary">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
