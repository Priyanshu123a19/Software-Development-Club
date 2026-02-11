import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a payment screenshot to Supabase Storage
 * @param file - The file to upload
 * @param firstName - User's first name
 * @param regNo - User's registration number
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export async function uploadPaymentScreenshot(
  file: File,
  firstName: string,
  regNo: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Rename file: ${firstName}_${regNo}.extension
    const fileExtension = file.name.split('.').pop();
    const newFileName = `${firstName}_${regNo}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(newFileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        url: null,
        error: `Upload failed: ${error.message}`,
      };
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(newFileName);

    return {
      url: publicUrlData.publicUrl,
      error: null,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      url: null,
      error: 'Failed to upload file. Please try again.',
    };
  }
}
