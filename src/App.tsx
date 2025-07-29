import { useState } from "react";
import ralfSchuhmacher from "./assets/ralf-schuhmacher.mp4";
import "./App.css";

function App() {

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
