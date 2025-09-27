import React from "react";
import CalmCam from "./components/CalmCam.jsx";
import AllRoutes from "./components/AllRoutes.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
    <div className="scroll-smooth">
    <Nav />
      <AllRoutes />
      {/* <CalmCam /> */}
      <Footer/>
    </div>
     
    </>
  );
}
