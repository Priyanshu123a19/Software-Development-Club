"use client"
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import Navbar from "@/sections/Navbar";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Tag from "@/components/Tag";

// Admins Team
import hiya from "@/assets/images/Admins/hiya.webp";
import purnendu from "@/assets/images/Admins/purnendu.png";
import ritika from "@/assets/images/Admins/Ritika.jpg";
// import sakshiAdmin from "@/assets/images/Admins/Sakshi.jpg"; // Corrupted file

// Placeholder for missing images
import placeholderImage from "@/assets/images/nalle log.jpg";

// Tech Team
import priyanshu from "@/assets/images/techteam/Priyanshu.jpg";

// Event Management Team
import aarav from "@/assets/images/Event Management Team/Aarav.jpeg";
import daksh from "@/assets/images/Event Management Team/DAKSH.jpg";

// PR and Outreach Team
import ananya from "@/assets/images/PR and Outreach Team/Ananya.jpg";
import mridul from "@/assets/images/PR and Outreach Team/mridul.jpg";

// Social Media and Content Team
import unnati from "@/assets/images/Social Media and Content Team/Unnati.jpg";
import vaibhavi from "@/assets/images/Social Media and Content Team/vaibhavi.jpg";

// Design and Videography Team
import sakshiSharma from "@/assets/images/Design and Videography Team/Sakshi Sharma.jpg";

type TeamKey =
  | "event-management"
  | "tech"
  | "pr-outreach"
  | "social-media"
  | "content"
  | "design";

type TeamInfo = {
  key: TeamKey;
  name: string;
  gradientFrom: string;
  gradientTo: string;
  summary: string;
  duties: string[];
  lead: {
    name: string;
    role: string;
    avatar: string | StaticImageData;
    bio: string;
    socials: { label: string; href: string }[];
  };
  coLead: {
    name: string;
    role: string;
    avatar: string | StaticImageData;
    bio: string;
    socials: { label: string; href: string }[];
  };
  vicePresident?: {
    name: string;
    role: string;
    avatar: string | StaticImageData;
    bio: string;
    socials: { label: string; href: string }[];
  };
  additionalMember?: {
    name: string;
    role: string;
    avatar: string | StaticImageData;
    bio: string;
    socials: { label: string; href: string }[];
  };
};

const TEAMS: TeamInfo[] = [
  {
    key: "event-management",
    name: "Admins",
    gradientFrom: "from-fuchsia-500/20",
    gradientTo: "to-purple-500/20",
    summary: "The crew that architects moments — planning, logistics, and flawless execution for every gathering.",
    duties: [
      "End‑to‑end event planning and run‑of‑show",
      "Venue, vendors, and volunteer coordination",
      "On‑site experience and attendee flow",
    ],
    lead: {
      name: "Purnendu Tiwari",
      role: "President",
      avatar: purnendu,
      bio: "A passionate tech enthusiast and visionary leader, Purnendu Tiwari guides the Software Development Club with a mission to inspire creativity, collaboration, and technical excellence. With his strong vision for growth, he drives the club toward impactful projects and learning experiences that empower every member to build and excel together.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "X", href: "https://x.com/" },
        { label: "GitHub", href: "https://github.com/" },
      ],
    },
    coLead: {
      name: "Hiya Dullu",
      role: "General Secretary",
      avatar: hiya,
      bio: "As the organizational backbone of the club, Hiya Dullu is the driving force ensuring seamless operation and clear communication across all levels. Combining meticulous planning with an enthusiastic approach to community building, she channels the club's energy into structured initiatives, guaranteeing that every event and project is executed flawlessly to maximize member engagement and success.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "X", href: "https://x.com/" },
      ],
    },
    vicePresident: {
      name: "Ritika Raghuvanshi",
      role: "Vice President",
      avatar: ritika,
      bio: "Ritika Raghuvanshi, our Vice President, is the driving engine behind the club's collaborative spirit. She bridges the gap between vision and execution, fostering an inclusive and productive atmosphere where every member is heard and supported. By streamlining operations and empowering teams, she ensures we don't just dream big—we build effectively together.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "GitHub", href: "https://github.com/" },
      ],
    },
    additionalMember: {
      name: "Sakshi Verma",
      role: "Operation Lead",
      avatar: placeholderImage,
      bio: "As operation lead, Sakshi Verma is a strategic planner who ensures the seamless execution of every club initiative. She turns ambitious plans into achievable goals with a keen eye for detail and a talent for streamlining processes. Her dedication to organization and efficiency serves as the cornerstone that keeps the club's creative and technical wheels turning smoothly and ensures that every project is a success.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
    },
  },
  {
    key: "tech",
    name: "Tech Team",
    gradientFrom: "from-cyan-500/20",
    gradientTo: "to-blue-500/20",
    summary: "Builders of tools and platforms — shipping stable systems with a focus on DX and performance.",
    duties: [
      "Web/app development and maintenance",
      "Platform reliability and CI/CD",
      "Performance, security, and documentation",
    ],
    lead: {
      name: "Devyanshu Negi",
      role: "Lead, Engineering",
      avatar: placeholderImage,
      bio: "Devyanshu Negi steps up as the chief architect and technical navigator for the club's projects. With deep expertise in modern software architecture and full-stack integration, he leads the development team by setting high standards for code quality and innovation. His mission is to mentor aspiring developers.",
      socials: [
        { label: "GitHub", href: "https://github.com/" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "X", href: "https://x.com/" },
      ],
    },
    coLead: {
      name: "Priyanshu Yadav",
      role: "Co‑lead, Platform",
      avatar: priyanshu,
      bio: "Collaborating closely with the Lead, Priyanshu Yadav is the dynamic partner focused on empowering and mobilizing the developer community. He specializes in optimizing collaborative coding practices and streamlining project workflows, ensuring the technical process is efficient and inclusive.",
      socials: [
        { label: "GitHub", href: "https://github.com/" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
    },
  },
  {
    key: "pr-outreach",
    name: "PR & Outreach",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-orange-500/20",
    summary: "Relationships and reputation — amplifying our story with partners and press.",
    duties: [
      "Partner relationships and sponsorships",
      "Press coordination and speaking ops",
      "Community engagement and outreach",
    ],
    lead: {
      name: "Mridul Jha",
      role: "Lead, Partnerships",
      avatar: mridul,
      bio: "The driving force behind club visibility and external engagement, Mridul Jha shapes the perception of the Software Development Club in the broader community. He actively looks for chances for development, collaborations, and public recognition. He has a strategic mindset and outstanding communication skills. His efforts guarantee that the club's reputation endures and draw in a wide range of talent and joint ventures.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "X", href: "https://x.com/" },
      ],
    },
    coLead: {
      name: "Ananya Pandey",
      role: "Co‑lead, Communications",
      avatar: ananya,
      bio: "As PR and Outreach co-lead, Ananya Pandey gives her best to maintain the dynamics of the club. She offers vital assistance with project management and governance, making sure that resources are maximized and innovative ideas are fostered. Her steady hand and dual emphasis on innovation and process are essential to maintaining the club's high standards.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "X", href: "https://x.com/" },
      ],
    },
  },
  {
    key: "social-media",
    name: "Social Media",
    gradientFrom: "from-pink-500/20",
    gradientTo: "to-rose-500/20",
    summary: "Where voice meets audience — content that feels native and builds community.",
    duties: [
      "Content calendars and publishing",
      "Channel growth and moderation",
      "Campaigns and collaborations",
    ],
    lead: {
      name: "Vaibhavi Agrawal",
      role: "Lead, Social",
      avatar: vaibhavi,
      bio: "Vaibhavi Agarwal serves as the architect of our digital narrative, transforming the club's technical projects and collaborative spirit into a compelling online presence. With a strategic mindset, she doesn't just post content—she crafts a cohesive story that builds our brand, engages a growing audience, and showcases the innovation happening within our walls. From defining our content pillars to analysing engagement metrics, she ensures our voice is heard, our work is seen, and our community is connected.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "X", href: "https://x.com/" },
      ],
    },
    coLead: {
      name: "Unnati Lohana",
      role: "Co‑lead, Community",
      avatar: unnati,
      bio: "As social media & Content Co-Lead, Unnati Lohana is the creative force who brings our digital story to life. Working in tandem with the Lead, she focuses on producing engaging content, from dynamic posts to insightful articles, that captures the pulse of the club. Her dedication ensures our community stays connected and informed about all our activities and successes.",
      socials: [
        { label: "GitHub", href: "https://github.com/" },
        { label: "X", href: "https://x.com/" },
      ],
    },
  },
  {
    key: "content",
    name: "Event Management",
    gradientFrom: "from-emerald-500/20",
    gradientTo: "to-teal-500/20",
    summary: "Ideas into words — writing that is clear, useful, and memorable.",
    duties: [
      "Editorial planning and guidelines",
      "Copywriting across surfaces",
      "Proofing and knowledge base",
    ],
    lead: {
      name: "Aarav Singh",
      role: "Lead, Editorial",
      avatar: aarav,
      bio: "A dynamic organizer and creative strategist, Aarav Singh leads the Event Management Department of the Software Development Club with remarkable precision and enthusiasm. With a knack for turning ideas into impactful experiences, he ensures every event reflects the club's spirit of innovation and teamwork. Aarav's leadership blends professionalism with creativity, making each initiative not just well-executed but truly memorable for every participant.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "X", href: "https://x.com/" },
      ],
    },
    coLead: {
      name: "Daksh Rathore",
      role: "Co‑lead, Copy",
      avatar: daksh,
      bio: "A resourceful planner and energetic collaborator, Daksh Rathore serves as the Co-Lead of the Event Management Department of the Software Development Club. Known for his attention to detail and innovative mindset, he plays a key role in orchestrating events that foster engagement, learning, and creativity. Daksh's enthusiasm and teamwork spirit ensure that every event runs seamlessly while leaving a lasting impression on participants.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
    },
  },
  {
    key: "design",
    name: "Design",
    gradientFrom: "from-violet-500/20",
    gradientTo: "to-indigo-500/20",
    summary: "Taste meets systems — brand, product, and motion in harmony.",
    duties: [
      "Design system and components",
      "Brand visuals and assets",
      "Motion and micro‑interactions",
    ],
    lead: {
      name: "Sakshi Sharma",
      role: "Lead, Design",
      avatar: sakshiSharma,
      bio: "A creative visionary and design perfectionist, Sakshi Sharma leads the Design Department of the Software Development Club with an artistic flair and a keen eye for detail. She transforms ideas into visually compelling designs that capture the essence of the club's initiatives. With her innovative approach and dedication to aesthetic excellence, Sakshi ensures that every project not only communicates effectively but also inspires creativity across the team.",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
        { label: "Dribbble", href: "https://dribbble.com/" },
      ],
    },
    coLead: {
      name: "",
      role: "Co‑lead, Motion",
      avatar: placeholderImage,
      bio: "",
      socials: [],
    },
  },
];

function MemberCard({
  title,
  name,
  avatar,
  accent,
  layoutId,
  bio,
  socials,
}: {
  title: string;
  name: string;
  avatar: string | StaticImageData;
  accent: string;
  layoutId: string;
  bio: string;
  socials: { label: string; href: string }[];
}) {
  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col h-full"
    >
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500">
        <div className={`absolute -inset-32 bg-gradient-to-br ${accent} blur-3xl`} />
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />
      
      {/* Top section with image and name - fixed height */}
      <div className="relative flex flex-col items-center text-center gap-4 p-6 md:p-8 pb-4">
        {/* Larger, clearer image with enhanced styling */}
        <div className="relative group/avatar">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-xl group-hover/avatar:blur-2xl transition-all duration-300" />
          <div className="relative h-28 w-28 md:h-36 md:w-36 shrink-0 overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl ring-1 ring-white/10 group-hover/avatar:border-white/30 group-hover/avatar:scale-105 transition-all duration-300">
            <Image 
              src={avatar} 
              alt={name} 
              fill 
              className="object-cover" 
              quality={95}
              priority
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <div className="text-xs font-medium uppercase tracking-widest text-white/70">{title}</div>
          </div>
          <div className="text-2xl md:text-3xl font-bold leading-tight bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
            {name}
          </div>
        </div>
      </div>
      
      {/* Scrollable bio section */}
      <div className="relative flex-1 px-6 md:px-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
        <p className="text-sm md:text-base leading-relaxed text-center text-white/75 pb-4">{bio}</p>
      </div>
      
      {/* Bottom section with socials - fixed */}
      <div className="relative px-6 md:px-8 pb-6 pt-2 flex flex-wrap justify-center gap-2 border-t border-white/5 mt-2">
        {socials.map((s) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group/social inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:shadow-lg"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/60 group-hover/social:bg-white group-hover/social:shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all" />
            <span>{s.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

export default function MembersPage() {
  const [activeKey, setActiveKey] = useState<TeamKey | null>(null);
  const [adminPage, setAdminPage] = useState(0); // Pagination for Admins team
  const activeTeam = useMemo(
    () => TEAMS.find((t) => t.key === activeKey) ?? null,
    [activeKey]
  );

  return (
    <>
      <Navbar />
      <section className="relative pt-24 pb-20">
        <div className="container max-w-6xl">
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
                animate={{
                  opacity: [0.6, 0.9, 0.6],
                  y: [0, -6, 0],
                }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.div>
            <Tag className="mx-auto">Our Members</Tag>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-4 text-balance text-4xl font-semibold md:text-6xl"
            >
              <span>Meet</span>{" "}
              <span className="text-white/60">the</span>{" "}
              <span className="text-[#E45A92]">teams</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <aside className="md:col-span-4 lg:col-span-3">
              <LayoutGroup>
                <nav className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/60 p-2 backdrop-blur">
                  {TEAMS.map((team) => {
                    const isActive = team.key === activeKey;
                    return (
                      <button
                        key={team.key}
                        onClick={() => setActiveKey(team.key)}
                        className="group relative flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-white/40 group-hover:bg-white/70" />
                          <span className="font-medium">{team.name}</span>
                        </div>
                        {isActive && (
                          <motion.span
                            layoutId="active-dot"
                            className="h-6 w-6 rounded-full border border-white/15 bg-white/10"
                          />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="active-bg"
                            className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r ${team.gradientFrom} ${team.gradientTo}`}
                          />
                        )}
                      </button>
                    );
                  })}
                  <div className="mt-auto hidden md:block p-3 text-xs text-white/50">
                    Select a team to explore its members and mission.
                  </div>
                </nav>
              </LayoutGroup>
            </aside>

            <div className="md:col-span-8 lg:col-span-9">
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/60 p-6 md:p-10 backdrop-blur">
                <AnimatePresence mode="wait">
                  {!activeTeam ? (
                    <motion.div
                      key="quote"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="mx-auto max-w-2xl text-center"
                    >
                      <div className="mb-4 text-sm uppercase tracking-widest text-white/50">
                        Our People
                      </div>
                      <p className="text-balance text-2xl font-medium text-white/90 md:text-3xl">
                        “Great teams aren’t just built — they’re designed, iterated, and brought to life with care.”
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeTeam.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-1 flex-col"
                    >
                      {activeTeam.key === "event-management" ? (
                        // Admins team with pagination
                        <>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {adminPage === 0 ? (
                              <>
                                <MemberCard
                                  title="Lead"
                                  name={activeTeam.lead.name}
                                  avatar={activeTeam.lead.avatar}
                                  accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                                  layoutId={`card-${activeTeam.key}-lead`}
                                  bio={activeTeam.lead.bio}
                                  socials={activeTeam.lead.socials}
                                />
                                <MemberCard
                                  title="Co‑lead"
                                  name={activeTeam.coLead.name}
                                  avatar={activeTeam.coLead.avatar}
                                  accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                                  layoutId={`card-${activeTeam.key}-co`}
                                  bio={activeTeam.coLead.bio}
                                  socials={activeTeam.coLead.socials}
                                />
                              </>
                            ) : (
                              <>
                                {activeTeam.vicePresident && (
                                  <MemberCard
                                    title="Vice President"
                                    name={activeTeam.vicePresident.name}
                                    avatar={activeTeam.vicePresident.avatar}
                                    accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                                    layoutId={`card-${activeTeam.key}-vp`}
                                    bio={activeTeam.vicePresident.bio}
                                    socials={activeTeam.vicePresident.socials}
                                  />
                                )}
                                {activeTeam.additionalMember && (
                                  <MemberCard
                                    title={activeTeam.additionalMember.role}
                                    name={activeTeam.additionalMember.name}
                                    avatar={activeTeam.additionalMember.avatar}
                                    accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                                    layoutId={`card-${activeTeam.key}-additional`}
                                    bio={activeTeam.additionalMember.bio}
                                    socials={activeTeam.additionalMember.socials}
                                  />
                                )}
                              </>
                            )}
                          </div>
                          
                          {/* Pagination controls */}
                          <div className="mt-6 flex items-center justify-center gap-3">
                            <motion.button
                              onClick={() => setAdminPage(0)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                adminPage === 0
                                  ? "bg-white/20 text-white border-2 border-white/30"
                                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                              }`}
                            >
                              Page 1
                            </motion.button>
                            <motion.button
                              onClick={() => setAdminPage(1)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                adminPage === 1
                                  ? "bg-white/20 text-white border-2 border-white/30"
                                  : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                              }`}
                            >
                              Page 2
                            </motion.button>
                          </div>
                        </>
                      ) : (
                        // Other teams without pagination
                        <div className={`grid grid-cols-1 gap-6 ${activeTeam.vicePresident || activeTeam.additionalMember ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
                          <MemberCard
                            title="Lead"
                            name={activeTeam.lead.name}
                            avatar={activeTeam.lead.avatar}
                            accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                            layoutId={`card-${activeTeam.key}-lead`}
                            bio={activeTeam.lead.bio}
                            socials={activeTeam.lead.socials}
                          />
                          <MemberCard
                            title="Co‑lead"
                            name={activeTeam.coLead.name}
                            avatar={activeTeam.coLead.avatar}
                            accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                            layoutId={`card-${activeTeam.key}-co`}
                            bio={activeTeam.coLead.bio}
                            socials={activeTeam.coLead.socials}
                          />
                          {activeTeam.vicePresident && (
                            <MemberCard
                              title="Vice President"
                              name={activeTeam.vicePresident.name}
                              avatar={activeTeam.vicePresident.avatar}
                              accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                              layoutId={`card-${activeTeam.key}-vp`}
                              bio={activeTeam.vicePresident.bio}
                              socials={activeTeam.vicePresident.socials}
                            />
                          )}
                          {activeTeam.additionalMember && (
                            <MemberCard
                              title={activeTeam.additionalMember.role}
                              name={activeTeam.additionalMember.name}
                              avatar={activeTeam.additionalMember.avatar}
                              accent={`${activeTeam.gradientFrom} ${activeTeam.gradientTo}`}
                              layoutId={`card-${activeTeam.key}-additional`}
                              bio={activeTeam.additionalMember.bio}
                              socials={activeTeam.additionalMember.socials}
                            />
                          )}
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
                        className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="max-w-2xl">
                            <div className="text-sm uppercase tracking-widest text-white/50">{activeTeam.name}</div>
                            <p className="mt-1 text-white/85">{activeTeam.summary}</p>
                          </div>
                          <ul className="grid list-disc gap-1 pl-5 text-sm text-white/75 md:w-80">
                            {activeTeam.duties.map((duty) => (
                              <li key={duty}>{duty}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-white/60">
                <div>
                  <span className="text-white/70">Tip:</span> Click a team to view leads
                </div>
                <Link href="/" className="underline decoration-white/20 underline-offset-4 hover:decoration-white/50">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


