import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import ralfSchuhmacher from "./assets/ralf-schuhmacher.mp4";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* Video Player Start */}
      <div style={{ margin: '2rem 0' }}>
        <video width="480" controls>
          <source src={ralfSchuhmacher} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* Video Player End */}  
    </>
  );
}

export default App;
