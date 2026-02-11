"use client";

import { motion } from "framer-motion";

interface Pass {
  id: string;
  type: string;
  price: number;
  benefits: string[];
}

interface Props {
  passes: Pass[];
  selectedPass: Pass | null;
  onSelect: (pass: Pass) => void;
}

export default function PassSelectionStep({
  passes,
  selectedPass,
  onSelect,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Select Your Pass Type</h3>
        <p className="text-sm text-white/60">
          Choose the option that best suits your preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {passes.map((pass) => (
          <motion.button
            key={pass.id}
            onClick={() => onSelect(pass)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group ${
              selectedPass?.id === pass.id
                ? "border-[#E45A92] bg-[#E45A92]/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E45A92]/10 to-transparent blur-xl" />
            </div>

            {/* Content */}
            <div className="relative space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white capitalize">
                    {pass.type} Pass
                  </h4>
                  <p className="text-sm text-white/60 mt-1">
                    {pass.type === "solo"
                      ? "Individual registration"
                      : "Couple registration"}
                  </p>
                </div>
                {selectedPass?.id === pass.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-[#E45A92] rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>

              {/* Price */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-3xl font-bold text-white">
                  ₹{pass.price}
                </p>
                <p className="text-xs text-white/50 mt-1">One-time payment</p>
              </div>

              {/* Benefits */}
              {pass.benefits && pass.benefits.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-widest text-[#E45A92] font-semibold">
                    Includes
                  </p>
                  <ul className="space-y-2">
                    {pass.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-white/70"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E45A92]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
