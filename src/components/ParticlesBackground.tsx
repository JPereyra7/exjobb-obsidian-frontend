import { useEffect } from "react";


const ParticlesBackground = () => {
  useEffect(() => {
    // Dynamiskt ladda config-filen från public-mappen
    const loadParticlesConfig = async () => {
      const response = await fetch("/particles-config.json"); // Public mappen root
      const config = await response.json();

      // Kontrollera om `particlesJS` är tillgängligt globalt
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
