import vindictiveLogo from "../assets/vindictive-white-vector.png";

export const ObsidianSpinner = () => {
  return (
    <>
      <div className="spinner-container">
        <div className="spinner-content">
          <img src={vindictiveLogo} className="obsidian-spinner" alt="" />
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
          <p className="loading-text">Initializing...</p>
        </div>
      </div>
    </>
  );
};
