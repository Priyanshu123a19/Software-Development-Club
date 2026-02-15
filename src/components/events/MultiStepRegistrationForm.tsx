"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionSlot } from "@prisma/client";
import PassSelectionStep from "./steps/PassSelectionStep";
import MemberInfoStep from "./steps/MemberInfoStep";
import PaymentStep from "./steps/PaymentStep";
import SlotSelectionStep from "./steps/SlotSelectionStep";
import ProgressTabs from "./ProgressTabs";

interface Pass {
  id: string;
  type: string;
  price: number;
  benefits: string[];
}

interface Props {
  eventTitle: string;
  passes: Pass[];
  eventId: string;
}

export type RegistrationStep = "pass" | "member1Info" | "member1Details" | "member2Info" | "member2Details" | "slotSelection" | "payment";

export interface MemberData {
  firstName: string;
  middleName: string;
  lastName: string;
  regNo: string;
  email: string;
  mobile: string;
}

export interface RegistrationData {
  passType: string;
  passPrice: number;
  member1: MemberData;
  member2?: MemberData;
  slot: SessionSlot | null;
  transactionId: string;
  screenshotFile?: File;
}

export default function MultiStepRegistrationForm({
  eventTitle,
  passes,
  eventId,
}: Props) {
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SessionSlot | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    passType: "",
    passPrice: 0,
    member1: {
      firstName: "",
      middleName: "",
      lastName: "",
      regNo: "",
      email: "",
      mobile: "",
    },
    member2: {
      firstName: "",
      middleName: "",
      lastName: "",
      regNo: "",
      email: "",
      mobile: "",
    },
    slot: null,
    transactionId: "",
    screenshotFile: undefined,
  });

  const [currentStep, setCurrentStep] = useState<RegistrationStep>("pass");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Determine the steps based on pass type
  const getSteps = (): RegistrationStep[] => {
    if (!selectedPass) return ["pass"];
    
    if (selectedPass.type === "solo") {
      // Solo pass: 5 steps
      return ["pass", "member1Info", "member1Details", "slotSelection", "payment"];
    } else {
      // Couple pass: 7 steps
      return [
        "pass",
        "member1Info",
        "member1Details",
        "member2Info",
        "member2Details",
        "slotSelection",
        "payment",
      ];
    }
  };

  const steps = getSteps();
  const currentStepIndex = steps.indexOf(currentStep);

  const handlePassSelect = (pass: Pass) => {
    setSelectedPass(pass);
    setFormData((prev) => ({
      ...prev,
      passType: pass.type,
      passPrice: pass.price,
    }));
    
    // Move to next step
    const nextSteps = pass.type === "solo"
      ? ["pass", "member1Info", "member1Details", "slotSelection", "payment"]
      : ["pass", "member1Info", "member1Details", "member2Info", "member2Details", "slotSelection", "payment"];
    setCurrentStep(nextSteps[1] as RegistrationStep);
  };

  const handleMemberDataChange = (
    memberNumber: 1 | 2,
    field: keyof MemberData,
    value: string
  ) => {
    if (memberNumber === 1) {
      setFormData((prev) => ({
        ...prev,
        member1: { ...prev.member1, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        member2: { ...(prev.member2 || {}), [field]: value } as MemberData,
      }));
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      setCurrentStep(nextStep);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
      setErrors({});
    }
  };

  const handleReset = () => {
    setSelectedPass(null);
    setSelectedSlot(null);
    setCurrentStep("pass");
    setFormData({
      passType: "",
      passPrice: 0,
      member1: {
        firstName: "",
        middleName: "",
        lastName: "",
        regNo: "",
        email: "",
        mobile: "",
      },
      member2: {
        firstName: "",
        middleName: "",
        lastName: "",
        regNo: "",
        email: "",
        mobile: "",
      },
      slot: null,
      transactionId: "",
      screenshotFile: undefined,
    });
    setErrors({});
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <ProgressTabs
        steps={steps}
        currentStep={currentStep}
        selectedPass={selectedPass}
      />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === "pass" && (
          <PassSelectionStep
            key="pass"
            passes={passes}
            selectedPass={selectedPass}
            onSelect={handlePassSelect}
          />
        )}

        {(currentStep === "member1Info" ||
          currentStep === "member1Details" ||
          currentStep === "member2Info" ||
          currentStep === "member2Details") && (
          <MemberInfoStep
            key={currentStep}
            step={currentStep}
            memberNumber={
              currentStep.startsWith("member1") ? 1 : 2
            }
            data={
              currentStep.startsWith("member1")
                ? formData.member1
                : formData.member2 || {
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    regNo: "",
                    email: "",
                    mobile: "",
                  }
            }
            onChange={handleMemberDataChange}
            errors={errors}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isCouplePass={selectedPass?.type === "couple"}
          />
        )}

        {currentStep === "slotSelection" && (
          <SlotSelectionStep
            key="slotSelection"
            selectedSlot={selectedSlot}
            onSelect={(slot) => {
              setSelectedSlot(slot);
              setFormData((prev) => ({ ...prev, slot }));
            }}
            onNext={handleNext}
            onPrevious={handlePrevious}
            errors={errors}
          />
        )}
      </AnimatePresence>

      {/* Payment Step - Rendered outside AnimatePresence to avoid animation conflicts with fixed modal */}
      {currentStep === "payment" && selectedPass && (
        <PaymentStep
          key="payment"
          passType={selectedPass.type}
          passPrice={selectedPass.price}
          member1={formData.member1}
          member2={formData.member2}
          selectedSlot={selectedSlot}
          onTransactionIdChange={(id) =>
            setFormData((prev) => ({ ...prev, transactionId: id }))
          }
          onFileChange={(file) =>
            setFormData((prev) => ({ ...prev, screenshotFile: file }))
          }
          transactionId={formData.transactionId}
          screenshotFile={formData.screenshotFile}
          onSubmit={async () => {
            setIsLoading(true);
            try {
              // Import multiStepRegister dynamically
              const { multiStepRegister } = await import("@/app/events/actions");
              
              const result = await multiStepRegister({
                eventId,
                passType: formData.passType,
                passPrice: formData.passPrice,
                slot: formData.slot,
                firstName: formData.member1.firstName,
                middleName: formData.member1.middleName,
                lastName: formData.member1.lastName,
                regNo: formData.member1.regNo,
                email: formData.member1.email,
                mobile: formData.member1.mobile,
                member2: formData.member2 && formData.member2.firstName 
                  ? {
                      firstName: formData.member2.firstName,
                      middleName: formData.member2.middleName,
                      lastName: formData.member2.lastName,
                      regNo: formData.member2.regNo,
                      email: formData.member2.email,
                      mobile: formData.member2.mobile,
                    }
                  : null,
                screenshotFile: formData.screenshotFile,
                transactionId: formData.transactionId,
              });

              if (!result.success) {
                setErrors({ submit: result.error || "Registration failed" });
              }
            } catch (err) {
              console.error("Registration error:", err);
              setErrors({ submit: "Failed to submit registration" });
            } finally {
              setIsLoading(false);
            }
          }}
          onPrevious={handlePrevious}
          onReset={handleReset}
          isLoading={isLoading}
          errors={errors}
          eventId={eventId}
        />
      )}
    </div>
  );
}
