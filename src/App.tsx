import { useState, useRef } from "react";
import "./App.css";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [randomVideoUrl, setRandomVideoUrl] = useState<string | null>(null);

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
        } else if (hasWebkitRequestFullscreen(videoElement)) {
          /* Safari */
          videoElement.webkitRequestFullscreen().catch((error: unknown) => {
            console.error("Error entering fullscreen (Safari):", error);
          });
        }
      }
    }, 0);
  };

  // Video upload handler
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadMessage("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setUploadMessage("Upload successful!");
    } catch {
      setUploadMessage("Upload failed");
    } finally {
      setUploading(false);
      e.currentTarget.reset();
    }
  };

  const handlePlayRandom = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/random");
      if (!res.ok) throw new Error("No video found");
      const data = await res.json();
      setRandomVideoUrl(`http://localhost:4000/uploads/${data.filename}`);
      setHasInteracted(true);
      setTimeout(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.play().catch(() => {});
          if (videoElement.requestFullscreen) videoElement.requestFullscreen();
        }
      }, 0);
    } catch {
      alert("No video found on server.");
    }
  };

  return (
    <>
      {/* Video Upload Form */}
      <form onSubmit={handleUpload} style={{ margin: "2rem 0" }}>
        <input type="file" name="video" accept="video/mp4" required />
        <button type="submit" disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
        {uploadMessage && (
          <span style={{ marginLeft: 12 }}>{uploadMessage}</span>
        )}
      </form>
      <button onClick={handlePlayRandom} style={{ marginBottom: 16 }}>
        Play Random Video
      </button>
      {/* The video element is shown only after the user has interacted */}
      {hasInteracted && (
        <video
          ref={videoRef}
          src={randomVideoUrl || undefined}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 1,
          }}
          preload="auto"
          controls
        >
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

// Type guard for webkitRequestFullscreen
function hasWebkitRequestFullscreen(
  el: Element,
): el is Element & { webkitRequestFullscreen: () => Promise<void> } {
  return (
    typeof (el as unknown as { webkitRequestFullscreen?: () => Promise<void> })
      .webkitRequestFullscreen === "function"
  );
}

export default App;
