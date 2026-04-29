"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, CameraOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface VirtualTryOnModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productImage: string
}

export function VirtualTryOnModal({
  isOpen,
  onClose,
  productName,
  productImage,
}: VirtualTryOnModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraState, setCameraState] = useState<"idle" | "loading" | "active" | "denied" | "error">("idle")

  const startCamera = useCallback(async () => {
    setCameraState("loading")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraState("active")
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraState("denied")
      } else {
        setCameraState("error")
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraState("idle")
  }, [])

  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [isOpen, startCamera, stopCamera])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-serif text-xl">
            Virtual Try-On
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {productName} — Position your face in the frame
          </p>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          {/* Camera viewport */}
          <div className="camera-overlay aspect-[4/3] w-full rounded-xl bg-muted">
            <AnimatePresence mode="wait">
              {cameraState === "active" && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Eyewear overlay — placeholder positioning
                      Ready for integration with Jeeliz or similar AR library */}
                  <div className="glasses-overlay">
                    <Image
                      src={productImage}
                      alt={`${productName} virtual try-on`}
                      width={300}
                      height={100}
                      className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-64 border-2 border-dashed border-white/30 rounded-[50%]" />
                  </div>
                </motion.div>
              )}

              {cameraState === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center w-full h-full gap-3"
                >
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
                  <p className="text-sm text-muted-foreground">Starting camera...</p>
                </motion.div>
              )}

              {cameraState === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center w-full h-full gap-4"
                >
                  <Camera className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera will start automatically</p>
                </motion.div>
              )}

              {cameraState === "denied" && (
                <motion.div
                  key="denied"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center w-full h-full gap-3 px-8 text-center"
                >
                  <CameraOff className="h-12 w-12 text-destructive" />
                  <p className="text-sm font-medium text-foreground">Camera Access Denied</p>
                  <p className="text-xs text-muted-foreground">
                    Please allow camera access in your browser settings to use Virtual Try-On.
                  </p>
                  <Button variant="outline" size="sm" onClick={startCamera} className="mt-2">
                    Try Again
                  </Button>
                </motion.div>
              )}

              {cameraState === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center w-full h-full gap-3 px-8 text-center"
                >
                  <AlertCircle className="h-12 w-12 text-destructive" />
                  <p className="text-sm font-medium text-foreground">Camera Unavailable</p>
                  <p className="text-xs text-muted-foreground">
                    We couldn&apos;t access your camera. Make sure no other app is using it.
                  </p>
                  <Button variant="outline" size="sm" onClick={startCamera} className="mt-2">
                    Retry
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AR Integration Note */}
          <p className="mt-3 text-xs text-center text-muted-foreground/60">
            AR face tracking powered by Jeeliz (integration ready)
          </p>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Button
              className="flex-1"
              disabled={cameraState !== "active"}
              onClick={() => {
                // Placeholder: capture photo functionality
                // Can be extended with canvas snapshot
              }}
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
