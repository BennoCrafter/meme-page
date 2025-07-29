import { useState, useRef } from "react";
import ralfSchuhmacher from "./assets/ralf-schuhmacher.mp4";
import "./App.css";

// Load JSONBin config from env
const BIN_ID = import.meta.env.VITE_JSONBIN_ID;
const API_KEY = import.meta.env.VITE_JSONBIN_MASTER_KEY;

function logVisit() {
  const STORAGE_KEY = "app_userId";
  const ACTION = "ralf schuhmacherd";
  const THROTTLE_MS = 5 * 60 * 1000; // 5 minutes

  // get or create a stable user ID in localStorage
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

  // fetch current log, update the per-user bucket, then PUT back
  async function updateLog(visit) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { "X-Master-Key": API_KEY },
      });
      const { record } = await res.json();

      // ensure our new structure exists
      const log = {
        visitsByUser: {},
        ...record,
      };

      const userBucket = log.visitsByUser[visit.userId] || {
        count: 0,
        visits: [],
      };

      const lastTs = userBucket.visits.slice(-1)[0] || 0;
      if (
        new Date(visit.timestamp).getTime() - new Date(lastTs).getTime() <
        THROTTLE_MS
      ) {
        // too soon—skip
        return;
      }

      userBucket.visits.push(visit.timestamp);
      userBucket.count++;
      log.visitsByUser[visit.userId] = userBucket;

      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(log),
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
