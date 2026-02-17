"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { confirmPayment } from "@/app/events/actions";
import { PASS_PRICES } from "@/lib/constants";
import { notFound } from "next/navigation";
import Button from "@/components/Button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PaymentPage({ params }: PageProps) {
  const { id } = use(params);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    transactionId: "",
    proofFile: undefined as File | undefined,
  });

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/registrations/${id}`);
        
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        setRegistration(data);
      } catch (err) {
        setError("Failed to load registration details");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, and PDF files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setFormData(prev => ({ ...prev, proofFile: file }));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.transactionId.trim()) {
      setError("UPI Transaction ID is required");
      return;
    }

    if (!formData.proofFile) {
      setError("Payment screenshot is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await confirmPayment(
        id,
        formData.transactionId.toUpperCase(),
        formData.proofFile
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/60 text-lg"
        >
          Loading payment details...
        </motion.div>
      </div>
    );
  }

  if (!registration) {
    notFound();
  }

  const totalCost = PASS_PRICES[registration.passType] || 199;
  const displayName = `${registration.firstName} ${registration.lastName}`;

  if (success) {
    return (
      <div className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-lg bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center mb-6"
            >
              <span className="text-4xl text-green-400">✓</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Payment Submitted!</h1>
            <p className="text-white/60 text-base">
              Your payment has been submitted for verification. You'll receive a confirmation email shortly.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
            <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Transaction ID</p>
            <p className="text-lg font-mono text-[#E45A92] break-all">{formData.transactionId}</p>
          </div>

          <Button
            variant="primary"
            onClick={() => window.location.href = "/events"}
            className="w-full"
          >
            Back to Events
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md overflow-y-auto z-50">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-5xl bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl relative"
        >
        {/* Header */}
        <div className="border-b border-white/10 px-6 md:px-8 py-4">
          <h1 className="text-2xl md:text-3xl font-bold font-sans antialiased text-white text-center tracking-wider bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
            PAYMENT
          </h1>
        </div>

        {/* Content - Two Column Layout */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Information */}
            <div className="space-y-6">

              {/* Total Cost */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl border-2 border-[#E45A92] bg-[#E45A92]/5 p-6 md:p-8 backdrop-blur-xl"
              >
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="absolute -inset-32 bg-gradient-to-br from-[#E45A92]/30 to-[#E45A92]/10 blur-3xl" />
                </div>
                                <div className="relative space-y-2">
                  <p className="text-xs uppercase tracking-widest text-[#E45A92] font-semibold">User Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Name</span>
                      <span className="text-base font-medium text-white">{displayName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Registration No</span>
                      <span className="text-base font-mono text-white">{registration.regNo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Pass Type</span>
                      <span className="text-base font-medium text-white capitalize">{registration.passType}</span>
                    </div>
                  </div>
                </div><br></br>
                <div className="relative space-y-2">
                  <p className="text-xs uppercase tracking-widest text-[#E45A92] font-semibold">Total Cost</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white/60 text-xl">₹</span>
                    <span className="text-5xl md:text-3xl font-bold text-white">{totalCost}</span>
                  </div>
                  <p className="text-sm text-white/60">One-time payment for event registration</p>
                </div>
              </motion.div>

              {/* Bank Transfer Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-6 md:p-8 backdrop-blur-xl"
              >
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }} />
                <div className="relative space-y-4">
                  <p className="text-xs uppercase tracking-widest text-white/50 font-semibold">Bank Transfer Details</p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-white/50 text-xs mb-1">Bank Name</p>
                      <p className="text-white font-medium">Indian Bank, VIT Bhopal University, Kothri Kalan</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/50 text-xs mb-1">Account Number</p>
                        <p className="text-white font-mono">656552XXXX</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs mb-1">IFSC Code</p>
                        <p className="text-white font-mono">IDIB000V143</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs mb-1">Account Name</p>
                      <p className="text-white font-medium">Software Developement Club</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Action */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-6 md:p-8 backdrop-blur-xl space-y-2"
              >
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute -inset-32 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 blur-3xl" />
                </div>
                
                <div className="relative space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Payment Submission</h3>
                    <p className="text-sm text-white/60">Fill in your transaction details below</p>
                  </div>

                  {/* UPI Transaction ID */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-white/70 font-semibold flex items-center gap-1">
                      UPI Transaction ID <span className="text-[#E45A92]">*</span>
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleChange}
                      placeholder="Enter UTR / Transaction Reference ID"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-base outline-none focus:border-[#E45A92] focus:ring-2 focus:ring-[#E45A92]/20 transition-all placeholder:text-white/30"
                      required
                    />
                    <p className="text-xs text-white/40">Enter the 12-digit UPI transaction ID from your payment app</p>
                  </div>

                  {/* Screenshot Upload */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-white/70 font-semibold flex items-center gap-1">
                      Payment Screenshot <span className="text-[#E45A92]">*</span>
                    </label>
                    <label className="cursor-pointer block relative group">
                      <div className="border-2 border-solid border-[#E45A92]/30 hover:border-[#E45A92] rounded-2xl p-8 hover:bg-[#E45A92]/5 transition-all text-center group-hover:scale-[1.02] duration-300">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                        <div className="space-y-3">
                          <div className="w-12 h-12 mx-auto bg-[#E45A92]/10 rounded-full flex items-center justify-center group-hover:bg-[#E45A92]/20 transition-colors">
                            <span className="text-2xl">📤</span>
                          </div>
                          <div>
                            <p className="text-base font-medium text-[#E45A92] group-hover:text-[#dd4b85]">Upload Screenshot</p>
                            <p className="text-xs text-white/50 mt-1">JPG, PNG, or PDF (Max 5MB)</p>
                          </div>
                        </div>
                      </div>
                    </label>
                    {formData.proofFile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl p-3"
                      >
                        <span className="text-green-400">✓</span>
                        <span className="text-sm text-green-400 font-medium truncate">{formData.proofFile.name}</span>
                      </motion.div>
                    )}
                  </div>

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

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="flex-1 text-white/60 hover:text-white font-semibold py-3 transition-colors text-sm uppercase tracking-wider"
                    >
                      BACK
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="flex-1 shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/30 transition-shadow"
                    >
                      {submitting ? "Processing..." : "SUBMIT"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
        </motion.div>
      </div>
    </div>
  );
}
