import React from "react";
// import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero_section">
      <h1>
        Learn What You Need. <br /> Teach What You Know.
      </h1>

      <p>
        Find people who know what you want to learn – and help those who want
        what you know.
      </p>

      <form className="search_bar" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="searchInput" className="visually-hidden">
          Search for a skill
        </label>
        <input
          type="text"
          id="searchInput"
          placeholder="What do you want to learn?"
          name="search"
        />
        <button type="submit">Find Your Match</button>
      </form>
    </section>
  );
};

export default HeroSection;
