import { useEffect } from "react";
import particlesConfig from "../../src/particles-config.json";

const ParticlesBackground = () => {
  useEffect(() => {
    // Kontrollera om `particlesJS` är tillgängligt globalt
    if (window.particlesJS) {
        window.particlesJS("tsparticles", particlesConfig);
    }
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
