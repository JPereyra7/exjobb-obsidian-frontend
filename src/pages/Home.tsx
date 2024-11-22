import "../styles/home.css";
import Obsidian from '../assets/Obsidian.png';
import { SignInSignUp } from '../components/SignInSignUp'
import ParticlesBackground from "../components/ParticlesBackground";

export const Home = () => {
  return (
    <div className="backgroundWrapper">
      <ParticlesBackground />
      <div className="flex items-start justify-start">
        <img className="w-40 md:w-52 ml-6" src={Obsidian} alt="Logo" />
      </div>
      <div className="flex flex-grow justify-center items-center">
        <SignInSignUp />
      </div>
    </div>
  );
};
