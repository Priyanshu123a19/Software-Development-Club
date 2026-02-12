"use server";

import { RegistrationSchema, type RegistrationData } from "@/lib/validations/eventSchema";
import { prisma } from "@/lib/db";
import { uploadPaymentScreenshot } from "@/lib/supabase";
import type { SessionSlot } from "@prisma/client";

export async function registerUser(formData: Partial<RegistrationData>) {
  try {
    // 1. Validate data on the server
    const validatedData = RegistrationSchema.safeParse(formData);
    
    if (!validatedData.success) {
      return { 
        error: validatedData.error.issues[0]?.message || "Invalid data provided." 
      };
    }

    const data = validatedData.data;

    // 2. Use transaction to safely check and create registration
    const registration = await prisma.$transaction(async (tx) => {
      // Check for existing registration with regNo and eventId
      const existingRegistration = await tx.registration.findUnique({
        where: { 
          regNo_eventId: {
            regNo: data.regNo,
            eventId: data.eventId || "",
          }
        },
      });

      if (existingRegistration) {
        throw new Error("This registration number is already registered for this event.");
      }

      // Create registration record
      const newRegistration = await tx.registration.create({
        data: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          regNo: data.regNo,
          email: data.email,
          mobile: data.mobile,
          passType: data.passType,
          paymentStatus: 'PENDING',
          eventId: data.eventId || "",
          slot: 'MORNING',
          totalPrice: 0,
        },
      });

      return newRegistration;
    });

    const paymentUrl = `/events/payment/${registration.id}`;

    return { 
      success: true,
      registrationId: registration.id,
      paymentUrl 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    console.error("Registration error:", error);
    
    if (errorMessage.includes("already registered")) {
      return { error: "This registration number is already registered for this event." };
    }
    
    return { error: "Database connection failed. Please try again later." };
  }
}

export async function getEventDetails(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    return { success: true, event };
  } catch (error) {
    console.error("Error fetching event:", error);
    return { error: "Failed to fetch event details" };
  }
}

export async function getAllEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    return { success: true, events };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { error: "Failed to fetch events" };
  }
}

export async function confirmPayment(
  registrationId: string,
  transactionId: string,
  screenshotFile?: File,
  referralCode?: string
) {
  try {
    // Validate registration exists
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return { error: "Registration not found" };
    }

    // If a screenshot file is provided, upload it to Supabase
    let screenshotUrl: string | null = null;
    if (screenshotFile) {
      const { url, error: uploadError } = await uploadPaymentScreenshot(
        screenshotFile,
        registration.firstName,
        registration.regNo
      );

      if (uploadError || !url) {
        return { error: uploadError || "Failed to upload payment screenshot" };
      }

      screenshotUrl = url;
    }

    // Update registration with transaction ID, screenshot URL, and mark as VERIFYING
    const updateData: any = {
      transactionId: transactionId,
      paymentStatus: 'VERIFYING',
    };

    if (screenshotUrl) {
      updateData.screenshotUrl = screenshotUrl;
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: updateData,
    });

    // TODO: Send confirmation email to user
    // TODO: Notify admin for payment verification

    return {
      success: true,
      registration: updatedRegistration,
      message: "Payment submitted for verification. You'll receive a confirmation email shortly.",
    };
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return { error: "Failed to process payment confirmation" };
  }
}

export async function multiStepRegister(
  data: {
    eventId: string;
    passType: string;
    passPrice?: number;
    slot?: SessionSlot | null;
    firstName: string;
    middleName?: string;
    lastName: string;
    regNo: string;
    email: string;
    mobile: string;
    member2?: {
      firstName: string;
      middleName?: string;
      lastName: string;
      regNo: string;
      email: string;
      mobile: string;
    } | null;
    screenshotFile?: File;
    transactionId: string;
  }
) {
  try {
    // Verify Prisma client is initialized
    if (!prisma) {
      console.error("❌ Prisma client is not initialized");
      return { success: false, error: "Database connection is not available. Please try again." };
    }

    // Test database connection
    try {
      await prisma.$connect();
      console.log("✅ Prisma client connected successfully");
    } catch (connectionError) {
      console.error("❌ Prisma connection failed:", connectionError);
      return { success: false, error: "Unable to connect to the database. Please check your connection and try again." };
    }

    // Validate required fields
    if (!data.slot) {
      return { success: false, error: "Session slot is required. Please select a time slot." };
    }

    if (!data.transactionId || data.transactionId.trim().length === 0) {
      return { success: false, error: "Transaction ID is required for payment verification." };
    }

    // Upload payment screenshot if provided
    let screenshotUrl: string | null = null;
    if (data.screenshotFile) {
      const uploadResult = await uploadPaymentScreenshot(
        data.screenshotFile,
        data.firstName,
        data.regNo
      );
      if (uploadResult.url) {
        screenshotUrl = uploadResult.url;
      }
    }

    // Execute all database operations in a transaction for data integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check for existing registration with this regNo and eventId
      const existingRegistration = await tx.registration.findUnique({
        where: {
          regNo_eventId: {
            regNo: data.regNo,
            eventId: data.eventId,
          },
        },
      });

      if (existingRegistration) {
        throw new Error("This registration number is already registered for this event.");
      }

      // 2. Create registration record with primary member
      const registration = await tx.registration.create({
        data: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          regNo: data.regNo,
          email: data.email,
          mobile: data.mobile,
          passType: data.passType.toUpperCase(),
          paymentStatus: 'PENDING',
          transactionId: data.transactionId,
          screenshotUrl: screenshotUrl || undefined,
          eventId: data.eventId,
          slot: data.slot!, // Save selected session slot (validated above)
          totalPrice: data.passPrice || 0,
          // Create participant for primary member
          participants: {
            create: {
              firstName: data.firstName,
              middleName: data.middleName,
              lastName: data.lastName,
              regNo: data.regNo,
              email: data.email,
              mobile: data.mobile,
              memberNumber: 1,
            },
          },
        },
        include: {
          participants: true,
        },
      });

      // 3. If couple pass, create second participant
      if (data.member2 && data.passType.toUpperCase() === 'COUPLE') {
        await tx.participant.create({
          data: {
            firstName: data.member2.firstName,
            middleName: data.member2.middleName,
            lastName: data.member2.lastName,
            regNo: data.member2.regNo,
            email: data.member2.email,
            mobile: data.member2.mobile,
            memberNumber: 2,
            registrationId: registration.id,
          },
        });
      }

      return registration;
    });

    return {
      success: true,
      registrationId: result.id,
    };
  } catch (error) {
    // Enhanced error logging with full details
    console.error("❌ Multi-step registration error occurred:");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Full error object:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace available");
    console.error("Registration data (sanitized):", {
      eventId: data.eventId,
      passType: data.passType,
      regNo: data.regNo,
      email: data.email,
      hasScreenshot: !!data.screenshotFile,
      slot: data.slot,
    });
    
    // Ensure we always return a proper error object
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    // Return user-friendly error messages
    if (errorMessage.includes("already registered")) {
      return { success: false, error: "This registration number is already registered for this event." };
    }
    
    if (errorMessage.includes("Unique constraint")) {
      return { success: false, error: "A registration with this information already exists." };
    }
    
    if (errorMessage.includes("connection") || errorMessage.includes("timeout")) {
      return { success: false, error: "Database connection error. Please try again in a moment." };
    }
    
    // Always return a structured error response, never throw
    return { 
      success: false, 
      error: errorMessage || "Failed to process registration. Please try again." 
    };
  }
}