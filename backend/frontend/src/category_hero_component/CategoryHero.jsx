import React from "react";
import "./CategoryHero.css"; // your shared hero styles

const Hero = ({ title, subtitle, bg }) => {
  return (
    <header
      className="hero"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="hero-content">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </div>
    </header>
  );
};

export default Hero;
