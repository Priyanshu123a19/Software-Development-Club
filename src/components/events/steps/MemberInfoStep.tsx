"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import type { RegistrationStep, MemberData } from "../MultiStepRegistrationForm";

interface Props {
  step: RegistrationStep;
  memberNumber: 1 | 2;
  data: MemberData;
  onChange: (
    memberNumber: 1 | 2,
    field: keyof MemberData,
    value: string
  ) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrevious: () => void;
  isCouplePass: boolean;
}

const isInfoStep = (step: RegistrationStep): boolean => {
  return step === "member1Info" || step === "member2Info";
};

export default function MemberInfoStep({
  step,
  memberNumber,
  data,
  onChange,
  errors,
  onNext,
  onPrevious,
  isCouplePass,
}: Props) {
  const isInfo = isInfoStep(step);
  const memberLabel = `Member ${memberNumber}`;
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange =
    (field: keyof MemberData) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(memberNumber, field, e.target.value);
        // Clear error for this field when user starts typing
        setValidationErrors((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      };
    };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (isInfo) {
      // Validate names
      if (!data.firstName || data.firstName.trim().length < 2) {
        newErrors.firstName = "First name must be at least 2 characters";
      } else if (!/^[a-zA-Z\s]+$/.test(data.firstName)) {
        newErrors.firstName = "First name can only contain letters";
      }

      if (!data.lastName || data.lastName.trim().length < 1) {
        newErrors.lastName = "Last name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(data.lastName)) {
        newErrors.lastName = "Last name can only contain letters";
      }

      if (
        data.middleName &&
        !/^[a-zA-Z\s]*$/.test(data.middleName)
      ) {
        newErrors.middleName = "Middle name can only contain letters";
      }
    } else {
      // Validate VIT credentials
      const VIT_REGNO_PATTERN =
        /^(21|22|23|24|25)(MEI|MIM|MIP|MIB|MSI|BAC|BAI|BAS|BBA|BCA|BCE|BCG|BCY|BCC|BCH|BEC|BET|BEY|BHI|BME|BMR|BOE|BSA|BAR|MCS|MVT|MDS|MAL|MBM|MCA|PHD)\d{5}$/;

      if (!data.regNo) {
        newErrors.regNo = "Registration number is required";
      } else if (data.regNo.length !== 10) {
        newErrors.regNo = "Registration number must be exactly 10 characters";
      } else if (!VIT_REGNO_PATTERN.test(data.regNo.toUpperCase())) {
        newErrors.regNo =
          "Invalid format. Expected: 25BCE10001 (Year 21-25 + Valid Branch)";
      }

      if (!data.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = "Invalid email format";
      } else if (!data.email.toLowerCase().endsWith("@vitbhopal.ac.in")) {
        newErrors.email = "Must be a @vitbhopal.ac.in email";
      }

      if (!data.mobile) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(data.mobile)) {
        newErrors.mobile = "Must be exactly 10 digits (without +91)";
      }
    }

    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length === 0) {
      setValidationErrors({});
      onNext();
    } else {
      setValidationErrors(validationErrors);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-white mb-2">
          {memberLabel} {isInfo ? "Information" : "Details"}
        </h3>
        <p className="text-sm text-white/60">
          {isInfo
            ? "Enter basic information"
            : "Enter VIT credentials and contact details"}
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {isInfo ? (
          <>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                  First Name <span className="text-[#E45A92]">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={data.firstName}
                  onChange={handleInputChange("firstName")}
                  placeholder="John"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all ${
                    validationErrors.firstName
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-white/10 focus:ring-[#E45A92]/20 focus:border-[#E45A92]"
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="text-xs text-red-400 mt-1">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                  Last Name <span className="text-[#E45A92]">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={data.lastName}
                  onChange={handleInputChange("lastName")}
                  placeholder="Doe"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all ${
                    validationErrors.lastName
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-white/10 focus:ring-[#E45A92]/20 focus:border-[#E45A92]"
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="text-xs text-red-400 mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                Middle Name (Optional)
              </label>
              <input
                type="text"
                name="middleName"
                value={data.middleName}
                onChange={handleInputChange("middleName")}
                placeholder="Optional"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all ${
                  validationErrors.middleName
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:ring-[#E45A92]/20 focus:border-[#E45A92]"
                }`}
              />
              {validationErrors.middleName && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.middleName}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Registration Number */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                VIT Registration Number <span className="text-[#E45A92]">*</span>
              </label>
              <input
                type="text"
                name="regNo"
                value={data.regNo}
                onChange={handleInputChange("regNo")}
                placeholder="25BCE10001"
                maxLength={10}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all uppercase ${
                  validationErrors.regNo
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:ring-[#E45A92]/20 focus:border-[#E45A92]"
                }`}
              />
              {validationErrors.regNo && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.regNo}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                VIT Email <span className="text-[#E45A92]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleInputChange("email")}
                placeholder="john.25bce10001@vitbhopal.ac.in"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all ${
                  validationErrors.email
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:ring-[#E45A92]/20 focus:border-[#E45A92]"
                }`}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">
                Mobile Number <span className="text-[#E45A92]">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={data.mobile}
                onChange={handleInputChange("mobile")}
                placeholder="9876543210"
                maxLength={10}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all ${
                  validationErrors.mobile
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:ring-[#E45A92]/20 focus:border-[#E45A92]"
                }`}
              />
              {validationErrors.mobile && (
                <p className="text-xs text-red-400 mt-1">{validationErrors.mobile}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6">
        <button
          onClick={onPrevious}
          className="flex-1 px-6 py-3 border border-white/20 text-white/70 font-semibold rounded-xl hover:bg-white/5 hover:text-white transition-all"
        >
          Previous
        </button>
        <Button
          onClick={handleNext}
          variant="primary"
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
