"use client";

import { motion } from "framer-motion";
import type { RegistrationStep } from "./MultiStepRegistrationForm";

interface Pass {
  type: string;
  price: number;
}

interface Props {
  steps: RegistrationStep[];
  currentStep: RegistrationStep;
  selectedPass: Pass | null;
}

const STEP_LABELS: Record<RegistrationStep, string> = {
  pass: "Pass Selection",
  member1Info: "Member 1 Info",
  member1Details: "Member 1 Details",
  member2Info: "Member 2 Info",
  member2Details: "Member 2 Details",
  slotSelection: "Slot Selection",
  payment: "Payment",
};

export default function ProgressTabs({
  steps,
  currentStep,
  selectedPass,
}: Props) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#E45A92] to-pink-600"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step Counter */}
      <div className="flex justify-between items-center text-xs text-white/60">
        <span>Step {currentIndex + 1} of {steps.length}</span>
        {selectedPass && (
          <span className="text-[#E45A92] font-medium">
            {selectedPass.type.toUpperCase()} - ₹{selectedPass.price}
          </span>
        )}
      </div>
    </div>
  );
}
