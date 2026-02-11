import MultiStepRegistrationForm from "@/components/events/MultiStepRegistrationForm";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/sections/Navbar"; 
import Footer from "@/sections/Footer";

// Mark this page as dynamic to avoid prerendering with database queries
export const dynamic = 'force-dynamic';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      passes: {
        orderBy: { price: 'asc' }
      },
      _count: {
        select: { registrations: true }
      }
    }
  });

  if (!event) {
    notFound();
  }

  const formattedDate = event.date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Event Details */}
          <div className="space-y-6">
            <span className="text-[#E45A92] uppercase tracking-widest text-sm font-semibold">
              Event Registration
            </span>
            <h1 className="text-5xl md:text-6xl font-medium text-white leading-tight">
              {event.title}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              {event.description}
            </p>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#E45A92]/10 p-2">
                    <svg className="h-5 w-5 text-[#E45A92]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">Date</p>
                    <p className="text-white font-medium">{formattedDate}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#E45A92]/10 p-2">
                    <svg className="h-5 w-5 text-[#E45A92]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">Venue</p>
                    <p className="text-white font-medium">{event.venue}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#E45A92]/10 p-2">
                    <svg className="h-5 w-5 text-[#E45A92]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">Capacity</p>
                    <p className="text-white font-medium">{event.capacity} Students</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#E45A92]/10 p-2">
                    <svg className="h-5 w-5 text-[#E45A92]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">Starting at</p>
                    <p className="text-white font-medium">₹{event.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 backdrop-blur">
              <p className="text-sm text-cyan-400/80">
                <strong className="text-cyan-300">Important:</strong> Fill in your details accurately. 
                Your registration number will be verified against VIT Bhopal registration number format.
              </p>
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <MultiStepRegistrationForm 
            eventTitle={event.title} 
            passes={event.passes} 
            eventId={event.id}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
