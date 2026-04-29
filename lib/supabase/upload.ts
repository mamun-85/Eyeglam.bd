"use client"

import { createClient } from "@/lib/supabase/client"

const FALLBACK_BUCKETS = ["public", "images", "uploads", "product-images"]

function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-")
}

export async function uploadImageAndGetPublicUrl(file: File, folder: string) {
  const supabase = createClient()
  const configuredBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim()
  const candidateBuckets = [configuredBucket, ...FALLBACK_BUCKETS].filter(
    (bucket, index, arr): bucket is string => !!bucket && arr.indexOf(bucket) === index
  )
  const originalName = file.name.replace(/\.[^/.]+$/, "")
  const ext = file.name.split(".").pop() || "jpg"
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${sanitizeFileName(originalName)}`
  const filePath = `${folder}/${fileName}.${ext}`
  let lastErrorMessage = "Unknown upload error"

  for (const bucket of candidateBuckets) {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: false })

    if (uploadError) {
      lastErrorMessage = uploadError.message || lastErrorMessage
      continue
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return data.publicUrl
  }

  throw new Error(
    `Image upload failed. ${lastErrorMessage}. Configure NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET or create a storage bucket and allow authenticated upload access.`
  )
}
