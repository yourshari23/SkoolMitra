import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Modern <span>Student Management</span> <br />
          Done the Smart Way
        </h1>

        <p>
          Manage students, counselors, batches, and reports in one secure,
          intelligent platform.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" onClick={() => navigate("/login")}>Get Started</button>
          <button className="secondary-btn">Learn More</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
