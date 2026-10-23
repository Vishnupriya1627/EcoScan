import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Camera lifecycle: open/close, stream start/stop, facing mode, capture.
 * `onCapture(file)` receives the captured JPEG as a File.
 */
export default function useCamera(onCapture) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState("environment");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    async function startCamera() {
      setError("");

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access requires HTTPS or localhost.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.name === "NotAllowedError"
              ? "Camera permission was denied. Allow camera access in your browser settings."
              : err.name === "NotFoundError"
                ? "No camera was found on this device."
                : err.message || "Unable to open the camera."
          );
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [isOpen, facingMode, stopStream]);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    stopStream();
    setError("");
    setIsOpen(false);
  }, [stopStream]);

  const toggleFacing = useCallback(
    () => setFacingMode((c) => (c === "environment" ? "user" : "environment")),
    []
  );

  const capture = useCallback(() => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setError("The camera is not ready. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture the image. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Could not capture the image. Please try again.");
          return;
        }

        const file = new File([blob], `ecoscan-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        close();
        onCapture?.(file);
      },
      "image/jpeg",
      0.92
    );
  }, [close, onCapture]);

  return { videoRef, isOpen, error, open, close, toggleFacing, capture };
}
