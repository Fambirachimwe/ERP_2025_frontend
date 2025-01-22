"use client";

import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";
import { Button } from "@/components/ui/button";

interface SignaturePadComponentProps {
  onSave: (signature: string) => void;
  existingSignature?: string;
}

export function SignaturePadComponent({
  onSave,
  existingSignature,
}: SignaturePadComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current);

      // If there's an existing signature, display it
      if (existingSignature) {
        const image = new Image();
        image.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(image, 0, 0);
          }
        };
        image.src = existingSignature;
      }
    }

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, [existingSignature]);

  const handleSave = () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert("Please provide a signature");
    } else {
      const signatureDataUrl = signaturePadRef.current?.toDataURL();
      if (signatureDataUrl) onSave(signatureDataUrl);
    }
  };

  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md p-2">
        <canvas
          ref={canvasRef}
          className="signature-pad w-full h-40 border rounded-md touch-none"
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Signature
        </Button>
      </div>
    </div>
  );
}
