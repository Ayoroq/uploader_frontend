import "./reset.css";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { gsap } from "gsap";
import { ReactLenis } from "lenis/react";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const lenisRef = useRef();
  

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);
  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <AuthProvider>
        <>
          <Navbar />
          <Outlet />
        </>
      </AuthProvider>
    </ReactLenis>
  );
}
