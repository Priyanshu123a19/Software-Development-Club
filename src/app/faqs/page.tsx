"use client"
import Image from "next/image";
import * as React from "react";
import Navbar from "@/sections/Navbar";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Tag from "@/components/Tag";
import design1 from "@/assets/images/design-example-1.png";
import design2 from "@/assets/images/design-example-2.png";

type Event = {
  key: string;
  label: string;
  images: any[];
};

const EVENTS: Event[] = [
  { key: "hackathon", label: "Hackathon", images: [design1, design2, design1] },
  { key: "workshop", label: "Workshop", images: [design2, design1, design2] },
  { key: "meetup", label: "Community Meetup", images: [design1, design2] },
];

export default function FaqsPage() {
  const [activeEvent, setActiveEvent] = React.useState<string>(EVENTS[0].key);
  const event = React.useMemo(() => EVENTS.find(e => e.key === activeEvent)!, [activeEvent]);
  const [slide, setSlide] = React.useState(0);
  React.useEffect(() => {
    setSlide(0);
  }, [activeEvent]);

  return (
    <>
      <Navbar />
      <section className="relative pt-20 pb-20">
        <div className="container max-w-6xl">
          <div className="relative mb-6 text-center">
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
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-4 text-balance text-4xl font-semibold md:text-6xl"
            >
              <span>Find answers,</span>{" "}
              <span className="text-white/60">updates and</span>{" "}
              <span className="text-[#E45A92]">view past events</span>
            </motion.h2>
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-3xl font-semibold md:text-4xl">Past events</h3>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <LayoutGroup>
              {EVENTS.map((e) => (
                <button
                  key={e.key}
                  onClick={() => setActiveEvent(e.key)}
                  className={`group relative overflow-hidden rounded-full border px-4 py-2 text-sm backdrop-blur transition hover:border-white/25 hover:bg-white/10 ${activeEvent === e.key ? "border-fuchsia-400/40 text-white" : "border-white/15 bg-white/5 text-white/80"}`}
                >
                  <span className="relative z-[1] inline-flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${activeEvent === e.key ? "bg-fuchsia-300" : "bg-white/50"}`} />
                    <span className={activeEvent === e.key ? "text-fuchsia-200" : ""}>{e.label}</span>
                  </span>
                  {activeEvent === e.key && (
                    <motion.span layoutId="active-event" className={`absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20`} />
                  )}
                </button>
              ))}
            </LayoutGroup>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/60 p-6 md:p-10 backdrop-blur">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="relative">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <motion.div
                      className="flex"
                      drag="x"
                      dragConstraints={{ left: -((event.images.length - 1) * 100), right: 0 }}
                      dragElastic={0.02}
                      animate={{ x: `${-slide * 100}%` }}
                      transition={{ type: "spring", stiffness: 140, damping: 28, mass: 0.9 }}
                      style={{ width: `${event.images.length * 100}%` }}
                    >
                      {event.images.map((img, i) => {
                        const isActive = i === slide;
                        return (
                          <div key={i} className="relative w-full shrink-0" style={{ width: `${100 / event.images.length}%` }}>
                            <motion.div
                              initial={isActive ? { opacity: 0.8, scale: 0.985 } : false}
                              animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.95, scale: 1 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="h-full w-full"
                            >
                              <Image src={img} alt={`${event.label} ${i + 1}`} className="h-72 w-full object-cover md:h-[22rem]" />
                            </motion.div>
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                        );
                      })}
                    </motion.div>
                  </div>

                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <motion.button
                        whileHover={{ y: -1, scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSlide(Math.max(0, slide - 1))}
                        className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 shadow-[0_0_30px_rgba(255,255,255,0.08)] backdrop-blur transition hover:border-white/25 hover:bg-white/15"
                        aria-label="Previous slide"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                      </motion.button>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <motion.button
                        whileHover={{ y: -1, scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSlide(Math.min(event.images.length - 1, slide + 1))}
                        className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 shadow-[0_0_30px_rgba(255,255,255,0.08)] backdrop-blur transition hover:border-white/25 hover:bg-white/15"
                        aria-label="Next slide"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {event.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlide(i)}
                        className={`h-2.5 w-2.5 rounded-full transition ${slide === i ? "bg-white" : "bg-white/30 hover:bg-white/60"}`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative my-12">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>

          <div className="mt-16">
            <div className="mb-6 text-center">
              <Tag className="mx-auto">Ask a question</Tag>
              <h3 className="mt-3 text-3xl font-semibold md:text-4xl">We'd love to help</h3>
            </div>
            <form className="mx-auto grid max-w-2xl gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Name</label>
                  <input className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none backdrop-blur placeholder:text-white/40" placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Email</label>
                  <input type="email" className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none backdrop-blur placeholder:text-white/40" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Your question</label>
                <textarea rows={4} className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none backdrop-blur placeholder:text-white/40" placeholder="Ask us anything..." />
              </div>
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="mx-auto mt-2 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/25 hover:bg-white/10">
                Submit
              </motion.button>
            </form>
            <div className="relative my-12">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </div>
          </div>

          <div className="mt-20">
            <div className="mb-6 text-center">
              <Tag className="mx-auto">Latest news</Tag>
              <h3 className="mt-3 text-3xl font-semibold md:text-4xl">What’s happening in the club</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1,2,3].map((n) => (
                <motion.article key={n} whileHover={{ y: -2 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/60 p-5 backdrop-blur">
                  <div className="mb-2 text-xs uppercase tracking-widest text-white/60">Announcement</div>
                  <div className="text-lg font-semibold text-white/90">Club update {n}</div>
                  <p className="mt-2 text-sm text-white/70">Quick update about events, achievements, and what’s coming next.</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


