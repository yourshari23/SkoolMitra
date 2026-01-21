function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h4>Student Management System</h4>
            <p>
              A modern platform to manage students, batches, counselors,
              and performance reports with clarity.
            </p>
          </div>

          <div>
            <h4>Platform</h4>
            <ul>
              <li>Admin Dashboard</li>
              <li>Counselor Workspace</li>
              <li>Reports & Insights</li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} SkoolMitra. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
