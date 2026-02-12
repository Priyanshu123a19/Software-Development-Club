"use client";

import { motion } from "framer-motion";
import Button from "@/components/Button";
import type { SessionSlot } from "@prisma/client";

interface Props {
  selectedSlot: SessionSlot | null;
  onSelect: (slot: SessionSlot) => void;
  onNext: () => void;
  onPrevious: () => void;
  errors: Record<string, string>;
}

const slots = [
  {
    id: "MORNING",
    label: "Session 1",
    time: "10:00 AM - 1:00 PM",
    description: "Morning session",
  },
  {
    id: "AFTERNOON",
    label: "Session 2",
    time: "1:30 PM - 4:30 PM",
    description: "Afternoon session",
  },
];

export default function SlotSelectionStep({
  selectedSlot,
  onSelect,
  onNext,
  onPrevious,
  errors,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold text-white">
          Select Your Session
        </h2>
        <p className="text-white/60">
          Choose which session slot works best for you
        </p>
      </div>

      {/* Error Message */}
      {errors.slot && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {errors.slot}
        </div>
      )}

      {/* Session Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slots.map((slot) => (
          <motion.button
            key={slot.id}
            onClick={() => onSelect(slot.id as SessionSlot)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`relative group text-left overflow-hidden rounded-2xl transition-all duration-300 ${
              selectedSlot === slot.id
                ? "bg-gradient-to-br from-[#E45A92]/20 to-[#10b981]/10 border-[#E45A92] shadow-lg shadow-[#E45A92]/30 scale-[1.02]"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            } border-2 backdrop-blur-xl p-8 cursor-pointer`}
          >
            {/* Background gradient effect */}
            {selectedSlot === slot.id && (
              <motion.div
                layoutId="slotGlow"
                className="absolute inset-0 bg-gradient-to-br from-[#E45A92]/20 via-purple-500/10 to-[#10b981]/10 rounded-2xl pointer-events-none"
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 space-y-4">
              {/* Title and Time */}
              <div className="space-y-2">
                <h3 className={`text-xl font-semibold transition-colors ${
                  selectedSlot === slot.id ? "text-white" : "text-white/90"
                }`}>
                  {slot.label}
                </h3>
                <p className={`font-medium text-lg transition-colors ${
                  selectedSlot === slot.id ? "text-[#E45A92]" : "text-white/70"
                }`}>
                  {slot.time}
                </p>
                <p className="text-white/60 text-sm">
                  {slot.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {selectedSlot === slot.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#E45A92]/30 to-[#10b981]/20 border border-[#E45A92]/50"
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-[#E45A92]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium text-white">
                    Selected
                  </span>
                </motion.div>
              )}
            </div>

            {/* Hover glow effect */}
            <div
              className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                selectedSlot === slot.id
                  ? "opacity-100"
                  : ""
              }`}
              style={{
                background:
                  "radial-gradient(circle at center, rgba(228, 90, 146, 0.15), transparent 70%)",
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between pt-6">
        <Button
          onClick={onPrevious}
          variant="secondary"
          className="min-w-[120px]"
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            if (selectedSlot) {
              onNext();
            }
          }}
          disabled={!selectedSlot}
          variant="primary"
          className="min-w-[120px]"
        >
          Proceed to Payment
        </Button>
      </div>
    </motion.div>
  );
}
