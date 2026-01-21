import "./Features.css";

export default function Features() {
  return (
    <section className="features">
      <div className="features-title">
        <h2>why SkoolMitra ?</h2>
        <p>Everything you need to run academic operations smoothly.</p>
      </div>

      <div className="features-grid">
        <div className="feature">
          <div className="feature-icon">🎓</div>
          <h3>Batch & Course Control</h3>
          <p>
            Create courses, assign them to batches, and track batch status
            in real-time.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">👨‍🏫</div>
          <h3>Counselor Workspace</h3>
          <p>
            Counselors manage students, submit reports, and track progress
            without confusion.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">📊</div>
          <h3>Smart Reports</h3>
          <p>
            Progress, discipline, and drop-out risk reports visible to both
            Admin and Counselor.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">🔐</div>
          <h3>Role-Based Access</h3>
          <p>
            Clean separation between Admin and Counselor dashboards with
            secure access.
          </p>
        </div>
      </div>
    </section>
  );
}
