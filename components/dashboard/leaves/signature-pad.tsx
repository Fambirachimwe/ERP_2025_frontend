"use client";

import { useRef, useCallback } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@/components/ui/button";

interface SignaturePadComponentProps {
  onSave: (signature: string) => void;
  existingSignature?: string;
}

export function SignaturePadComponent({
  onSave,
  existingSignature,
}: SignaturePadComponentProps) {
  const signaturePadRef = useRef<SignaturePad>(null);

  // Update parent component whenever signature changes
  const handleSignatureChange = useCallback(() => {
    if (!signaturePadRef.current) return;
    if (!onSave || typeof onSave !== "function") {
      console.error("onSave prop is not a function");
      return;
    }

    if (signaturePadRef.current.isEmpty()) {
      onSave("");
      return;
    }

    const signatureDataUrl = signaturePadRef.current.toDataURL();
    onSave(signatureDataUrl);
  }, [onSave]);

  const handleClear = useCallback(() => {
    if (!signaturePadRef.current) return;
    if (!onSave || typeof onSave !== "function") return;

    signaturePadRef.current.clear();
    onSave("");
  }, [onSave]);

  return (
    <div className="space-y-2">
      <div className="border rounded-lg p-4">
        <SignaturePad
          ref={signaturePadRef}
          onEnd={handleSignatureChange}
          canvasProps={{
            className: "signature-pad w-full h-40 border rounded",
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleClear} variant="outline" type="button" size="sm">
          Clear Signature
        </Button>
      </div>
    </div>
  );
}
