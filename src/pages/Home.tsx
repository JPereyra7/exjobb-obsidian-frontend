import "../styles/home.css";
import Obsidian from '../assets/ObsidianCropped.png';
import { SignInSignUp } from '../components/SignInSignUp';
import ParticlesBackground from "../components/ParticlesBackground";

export const Home = () => {
  return (
    <div className="backgroundWrapper">
      <ParticlesBackground />
      {/* Logo Container */}
      <div className="flex justify-center lg:justify-start w-full">
        <img 
          className="w-40 mt-20 lg:ml-16" 
          src={Obsidian} 
          alt="Logo" 
        />
      </div>
      {/* Auth Container */}
      <div className="flex flex-grow justify-center items-center">
        <SignInSignUp />
      </div>
    </div>
  );
};