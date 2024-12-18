import { useEffect } from "react";


const ParticlesBackground = () => {
  useEffect(() => {
    // Dynamically load the config file from public folder
    const loadParticlesConfig = async () => {
      const response = await fetch("/particles-config.json");
      const config = await response.json();

      // Checker to see if `particlesJS` globally scoped
      if (window.particlesJS) {
        window.particlesJS("tsparticles", config);
      }
    };

    loadParticlesConfig();
  }, []);

  return (
    <div
      id="tsparticles"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default ParticlesBackground;
