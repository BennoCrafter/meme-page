import { useState, useRef } from "react";
import ralfSchuhmacher from "./assets/ralf-schuhmacher.mp4";
import "./App.css";

// Load JSONBin config from env
const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK;

function logVisit() {
  const STORAGE_KEY = "app_userId";
  const ACTION = "ralf schuhmacherd";

  const getOrCreateUserId = () => {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        window.crypto?.randomUUID?.() ??
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  };

  async function updateLog(visit: {
    userId: string;
    timestamp: string;
    action: string;
    page: string;
    userAgent: string;
  }) {
    try {
      // Send to Discord webhook
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "New visit logged! @everyone",
          embeds: [
            {
              title: "New Visit Logged",
              color: 5814783,
              fields: [
                { name: "User ID", value: visit.userId },
                { name: "Timestamp", value: visit.timestamp },
                { name: "Page", value: visit.page },
                { name: "Action", value: visit.action },
                { name: "User Agent", value: visit.userAgent },
              ],
            },
          ],
        }),
      });
    } catch (err) {
      console.error("Failed to log visit", err);
    }
  }

  const userId = getOrCreateUserId();
  const visit = {
    userId,
    timestamp: new Date().toISOString(),
    action: ACTION,
    page: window.location.pathname,
    userAgent: navigator.userAgent,
  };

  updateLog(visit);
}

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleStart = () => {
    logVisit(); // log on click
    setHasInteracted(true);

    setTimeout(() => {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.play().catch((error) => {
          console.error("Error playing video:", error);
        });

        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen().catch((error) => {
            console.error("Error entering fullscreen:", error);
          });
        } else if ((videoElement as any).webkitRequestFullscreen) {
          (videoElement as any)
            .webkitRequestFullscreen()
            .catch((error: any) => {
              console.error("Error entering fullscreen (Safari):", error);
            });
        }
      }
    }, 0);
  };

  return (
    <>
      {hasInteracted && (
        <video
          ref={videoRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 1,
          }}
          controls
          preload="auto"
        >
          <source src={ralfSchuhmacher} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {!hasInteracted && (
        <button
          onClick={handleStart}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.2rem",
            padding: "1rem 2rem",
            zIndex: 10,
          }}
        >
          Teilnehmen
        </button>
      )}
    </>
  );
}

export default App;
