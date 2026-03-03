import { useState, useEffect, useCallback } from "react";
import type { ToastVariant } from "@/components/Toast";

interface ToastState {
  message: string | null;
  variant: ToastVariant;
}

export function useToast(autoDismissMs = 4000) {
  const [toast, setToast] = useState<ToastState>({
    message: null,
    variant: "default",
  });

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(
      () => setToast({ message: null, variant: "default" }),
      autoDismissMs
    );
    return () => clearTimeout(timer);
  }, [toast.message, autoDismissMs]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "default") => {
      setToast({ message, variant });
    },
    []
  );

  const dismissToast = useCallback(() => {
    setToast({ message: null, variant: "default" });
  }, []);

  return { toast, showToast, dismissToast };
}
