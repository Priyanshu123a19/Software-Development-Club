"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { confirmPayment } from "@/app/events/actions";
import Button from "@/components/Button";
import type { MemberData } from "../MultiStepRegistrationForm";

interface Props {
  passType: string;
  passPrice: number;
  member1: MemberData;
  member2?: MemberData;
  onTransactionIdChange: (id: string) => void;
  onFileChange: (file: File | undefined) => void;
  transactionId: string;
  screenshotFile?: File;
  onSubmit: () => Promise<void>;
  onPrevious: () => void;
  onReset: () => void;
  isLoading: boolean;
  errors: Record<string, string>;
  eventId: string;
}

export default function PaymentStep({
  passType,
  passPrice,
  member1,
  member2,
  onTransactionIdChange,
  onFileChange,
  transactionId,
  screenshotFile,
  onSubmit,
  onPrevious,
  onReset,
  isLoading,
  errors,
  eventId,
}: Props) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalCost = passPrice;
  const isCouplePass = passType === "couple";
  const primaryMember = member1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, and PDF files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      onFileChange(file);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      setError("Transaction ID is required");
      return;
    }

    if (!screenshotFile) {
      setError("Payment screenshot is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit();
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit payment. Please try again.");
      console.error("Payment submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/40">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 max-w-md relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 mx-auto mb-6 bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center"
          >
            <span className="text-4xl text-green-400">✓</span>
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Payment Submitted!
          </h3>
          <p className="text-white/60 mb-8">
            Your registration has been submitted for verification. You'll receive
            a confirmation email shortly.
          </p>
          <Button
            onClick={onReset}
            variant="primary"
            className="w-full"
          >
            Return to Events
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full mx-4 max-w-6xl h-[90vh] rounded-3xl border border-white/20 bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-8 backdrop-blur-2xl shadow-2xl flex flex-col"
      >

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
          {/* LEFT COLUMN: User Details & Cost */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-4">
            {/* User Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-6 backdrop-blur-xl"
            >
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute -inset-32 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 blur-3xl" />
              </div>

              <div className="relative space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white mb-4">
                    {isCouplePass ? "Primary Contact" : "Registered User"}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-white/50 uppercase">Full Name</p>
                    <p className="text-white font-medium">
                      {primaryMember.firstName} {primaryMember.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/50 uppercase">Registration No</p>
                    <p className="text-white font-mono text-sm">{primaryMember.regNo}</p>
                  </div>

                  <div>
                    <p className="text-xs text-white/50 uppercase">Email</p>
                    <p className="text-white text-sm break-all">{primaryMember.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-white/50 uppercase">Mobile</p>
                    <p className="text-white font-mono">+91 {primaryMember.mobile}</p>
                  </div>
                </div>

                {isCouplePass && member2 && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h5 className="text-sm font-semibold text-[#E45A92]">
                      Member 2
                    </h5>
                    <div>
                      <p className="text-xs text-white/50 uppercase">Full Name</p>
                      <p className="text-white font-medium">
                        {member2.firstName} {member2.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase">Registration No</p>
                      <p className="text-white font-mono text-sm">{member2.regNo}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cost Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-6 backdrop-blur-xl"
            >
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute -inset-32 bg-gradient-to-br from-pink-500/20 to-rose-500/20 blur-3xl" />
              </div>

              <div className="relative space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white mb-4">Total Cost</h4>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70 text-sm">
                      {passType.charAt(0).toUpperCase() + passType.slice(1)} Pass
                    </span>
                    <span className="text-white font-semibold">₹{passPrice}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-semibold">Total</span>
                    <div className="flex items-baseline">
                      <span className="text-white/60">₹</span>
                      <span className="text-3xl font-bold text-[#E45A92] ml-1">
                        {totalCost}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 mt-4">
                  <p className="text-xs text-cyan-400/80">
                    <strong className="text-cyan-300">Method:</strong> Bank Transfer
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Bank Details & Payment Form */}
          <div className="flex flex-col gap-6 overflow-y-auto pl-4">
            {/* Bank Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-6 backdrop-blur-xl"
            >
              <div className="relative space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                  Bank Transfer Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/50 text-xs mb-1">Bank Name</p>
                    <p className="text-white font-medium text-sm">Indian Bank</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Account Number</p>
                    <p className="text-white font-mono text-sm">656552XXXX</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">IFSC Code</p>
                    <p className="text-white font-mono text-sm">IDIB000V143</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Account Name</p>
                    <p className="text-white text-sm">SDC</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Transaction ID */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="text-xs uppercase tracking-widest text-white/70 font-semibold flex items-center gap-1">
                UPI Transaction ID <span className="text-[#E45A92]">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => onTransactionIdChange(e.target.value)}
                placeholder="Enter UTR / Reference ID"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#E45A92] focus:ring-2 focus:ring-[#E45A92]/20 transition-all placeholder:text-white/30"
                required
              />
              <p className="text-xs text-white/40">
                12-digit UPI transaction ID
              </p>
            </motion.div>

            {/* Screenshot Upload */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="text-xs uppercase tracking-widest text-white/70 font-semibold flex items-center gap-1">
                Payment Screenshot <span className="text-[#E45A92]">*</span>
              </label>
              <label className="cursor-pointer block relative group">
                <div className="border-2 border-solid border-[#E45A92]/30 hover:border-[#E45A92] rounded-2xl p-6 hover:bg-[#E45A92]/5 transition-all text-center duration-300">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto bg-[#E45A92]/10 rounded-full flex items-center justify-center group-hover:bg-[#E45A92]/20 transition-colors">
                      <span className="text-lg">📤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#E45A92]">
                        Upload Screenshot
                      </p>
                      <p className="text-xs text-white/50 mt-0.5">
                        JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </label>
              {screenshotFile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl p-3"
                >
                  <span className="text-green-400">✓</span>
                  <span className="text-xs text-green-400 font-medium truncate">
                    {screenshotFile.name}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
              >
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4 mt-auto">
              <button
                onClick={onPrevious}
                disabled={submitting}
                className="flex-1 text-white/60 hover:text-white font-semibold py-3 transition-colors text-sm uppercase tracking-wider hover:bg-white/5 rounded-lg"
              >
                BACK
              </button>
              <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={submitting}
                className="flex-1 shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/30 transition-shadow"
              >
                {submitting ? "Processing..." : "SUBMIT PAYMENT"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
