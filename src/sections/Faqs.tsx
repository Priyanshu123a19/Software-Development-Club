'use client'
import Tag from "@/components/Tag";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {AnimatePresence, motion } from "framer-motion";

const faqs = [
    {
        question: "What makes our Dev Club different from other technical clubs?",
        answer: "We focus on hands-on, project-based learning. Instead of just theory, we build real applications and solve real-world problems. Our goal is to bridge the gap between classroom concepts and industry-level skills in a fun, collaborative environment.",
    },
    {
        question: "Do I need to be an expert coder to join?",
        answer: "Not at all! Our club is for everyone, from absolute beginners to seasoned coders. We host beginner-friendly workshops to cover the basics and have advanced projects for experienced members. We believe in growing together!",
    },
    {
        question: "What kind of tools and technologies will I learn?",
        answer: "You'll learn the tools that professionals use every day. We emphasize fundamentals like Git for version control, and we regularly host workshops on popular languages (like Python, JavaScript), frameworks, and cloud technologies.",
    },
    {
        question: "What is the time commitment like?",
        answer: "We know you're busy with coursework. Our activities are flexible! You can attend weekly sessions, join a project team, or just pop in for a workshop that interests you. You get out what you put in, with no strict hour requirements.",
    },
    {
        question: "How does the club handle team projects and collaboration?",
        answer: "Collaboration is at our core. We organize members into project teams to build applications together, participate in hackathons, and contribute to open-source projects. It's a great way to learn teamwork and make new friends.",
    },
];

export default function Faqs() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    return <section className="py-24">
        <div className="container">
            <div className="flex justify-center">
            <Tag>Faqs</Tag>
            </div>
            <h2 className="text-6xl font-medium mt-6 text-center max-w-xl mx-auto">
                Questions? we've got <span className="text-pink-400">answers</span>
            </h2>
            <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
                {faqs.map((faq, faqIndex) => (
                    <div key={faq.question} className="bg-neutral-900 rounded-2xl border border-white/10 p-6">
                        <div className="flex justify-between items-center" onClick={()=> {setSelectedIndex(faqIndex)}}>
                        <h3 className="font-medium">{faq.question}</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={twMerge("feather feather-plus text-pink-400 flex-shrink-0 transition duration-300", selectedIndex === faqIndex && "rotate-45")}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        </div>
                        <AnimatePresence>
                        {selectedIndex === faqIndex && (
                            <motion.div 
                            initial={{height:0,marginTop:0}}
                            animate={{height:"auto",marginTop:"24"}}
                            exit={{height:0,marginTop:0}}
                            className={twMerge("overflow-hidden")}>
                                <p className="text-white/50">{faq.answer}</p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    </section>;
}
