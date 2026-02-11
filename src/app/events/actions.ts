"use server";

import { RegistrationSchema, type RegistrationData } from "@/lib/validations/eventSchema";
import { prisma } from "@/lib/db";
import { uploadPaymentScreenshot } from "@/lib/supabase";

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

    // 2. Check for existing registration to prevent duplicates
    const existingRegistration = await prisma.registration.findUnique({
      where: { 
        regNo: data.regNo 
      },
    });

    if (existingRegistration) {
      return { error: "This registration number is already registered for the event." };
    }

    // 3. Create registration record with PENDING payment status
    const registration = await prisma.registration.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        regNo: data.regNo,
        email: data.email,
        mobile: data.mobile,
        passType: data.passType,
        paymentStatus: 'PENDING',
        eventId: data.eventId,
      },
    });

    const paymentUrl = `/events/payment/${registration.id}`;

    return { 
      success: true,
      registrationId: registration.id,
      paymentUrl 
    };
  } catch (error) {
    console.error("Registration error:", error);
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
    // Check for existing registration with primary member
    const existingRegistration = await prisma.registration.findUnique({
      where: { regNo: data.regNo },
    });

    if (existingRegistration) {
      return { success: false, error: "This registration number is already registered for the event." };
    }

    // Upload payment screenshot if provided
    let screenshotUrl: string | null = null;
    if (data.screenshotFile) {
      const { uploadPaymentScreenshot } = await import("@/lib/supabase");
      const uploadResult = await uploadPaymentScreenshot(
        data.screenshotFile,
        data.firstName,
        data.regNo
      );
      if (uploadResult.url) {
        screenshotUrl = uploadResult.url;
      }
    }

    // Create registration with primary member
    const registration = await prisma.registration.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        regNo: data.regNo,
        email: data.email,
        mobile: data.mobile,
        passType: data.passType,
        paymentStatus: 'PENDING',
        transactionId: data.transactionId,
        screenshotUrl,
        eventId: data.eventId,
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

    // If couple pass, create second participant
    if (data.member2 && data.passType === 'couple') {
      await prisma.participant.create({
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

    return {
      success: true,
      registrationId: registration.id,
    };
  } catch (error) {
    console.error("Multi-step registration error:", error);
    return { success: false, error: "Failed to process registration. Please try again." };
  }
}