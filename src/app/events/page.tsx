import { prisma } from "@/lib/db";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import EventsPageClient from "@/components/EventsPageClient";

// Mark this page as dynamic to avoid prerendering with database queries
export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  });

  return (
    <>
      <Navbar />
      <EventsPageClient events={events} />
      <Footer />
    </>
  );
}
