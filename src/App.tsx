import { useState, useRef } from "react";
import ralfSchuhmacher from "./assets/ralf-schuhmacher.mp4";
import "./App.css";

function App() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const handleStart = () => {
    setShowVideo(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100); // short delay to ensure video is mounted
  };

  return (
    <>
      {!showVideo ? (
        <button
          onClick={handleStart}
          style={{ fontSize: "1.2rem", padding: "1rem 2rem" }}
        >
          Teilnehmen
        </button>
      ) : (
        <div style={{ margin: "2rem 0" }}>
          <video
            ref={videoRef}
            style={{ maxWidth: "100%", height: "auto" }}
            controls
            playsInline
          >
            <source src={ralfSchuhmacher} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
}

export default App;
