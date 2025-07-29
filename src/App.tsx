<<<<<<< HEAD
import { useState, useRef } from "react";
import ralfSchuhmacher from "./assets/ralf-schuhmacher.mp4";
import "./App.css";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleStart = () => {
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
          /* Safari */
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
      {/* The video element is shown only after the user has interacted */}
      {hasInteracted && (
        <video
          ref={videoRef}
          style={{
            position: "fixed", // Position fixed relative to the viewport
            top: 0,
            left: 0,
            width: "100vw", // Take full viewport width
            height: "100vh", // Take full viewport height
            objectFit: "cover", // Cover the entire area, cropping if necessary
            zIndex: 1, // Ensure the video is behind the button initially
          }}
          controls // Keep controls for user interaction (pause, volume, etc.)
          preload="auto" // Load video metadata and some data at the beginning
        >
          <source src={ralfSchuhmacher} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* The "Teilnehmen" button is shown only before the user interacts */}
      {!hasInteracted && (
        <button
          onClick={handleStart}
          style={{
            position: "fixed", // Position fixed relative to the viewport
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Center the button
            fontSize: "1.2rem",
            padding: "1rem 2rem",
            zIndex: 10, // Ensure the button is above everything
          }}
        >
          Teilnehmen
        </button>
      )}
=======
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
>>>>>>> parent of 7003caf (revert)
    </>
  );
}

export default App;
