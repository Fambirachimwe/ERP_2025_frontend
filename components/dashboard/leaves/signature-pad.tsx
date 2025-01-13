"use client";

import { useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSignatureComplete: (signature: string) => void;
}

export function SignaturePadComponent({
  onSignatureComplete,
}: SignaturePadProps) {
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    onSignatureComplete(""); // Clear the signature in parent component
  };

  // Update parent component whenever signature changes
  const handleSignatureChange = () => {
    if (signaturePadRef.current?.isEmpty?.()) {
      onSignatureComplete("");
    } else {
      const signatureDataUrl = signaturePadRef.current?.toDataURL();
      signatureDataUrl && onSignatureComplete(signatureDataUrl);
    }
  };

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
      <Button onClick={handleClear} variant="outline" type="button" size="sm">
        Clear Signature
      </Button>
    </div>
  );
}
