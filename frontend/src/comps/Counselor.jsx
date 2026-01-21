import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GalaxyBG.css";

function Counselor() {
  const navigate = useNavigate();
  const counselorId = localStorage.getItem("counselorId");

  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [activeTab, setActiveTab] = useState("students");

  const [activeReportType, setActiveReportType] = useState("");
  const [reportBatchId, setReportBatchId] = useState("");
  const [reportStudentId, setReportStudentId] = useState("");
  const [reportStudentName, setReportStudentName] = useState("");
  const [reportCourse, setReportCourse] = useState("");
  const [reportPerformance, setReportPerformance] = useState("");
  const [reportIssueType, setReportIssueType] = useState("");
  const [reportRiskLevel, setReportRiskLevel] = useState("");
  const [reportRemarks, setReportRemarks] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLabel, setDeleteLabel] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchBatches();
    fetchReports();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/get-students/?counselor_id=${counselorId}`
    );
    setStudents(await res.json());
  };

  const fetchCourses = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/get-courses/");
    setCourses(await res.json());
  };

  const fetchBatches = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/get-batches/");
    setBatches(await res.json());
  };

  const fetchReports = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/get-reports/?counselor_id=${counselorId}`
    );
    setReports(await res.json());
  };

  useEffect(() => {
    if (!success && !error) return;
    const t = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
    return () => clearTimeout(t);
  }, [success, error]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !gmail || !phone || !selectedBatchId) {
      setError("All fields are required");
      return;
    }

    const isEdit = Boolean(editingStudent);
    const url = isEdit
      ? `http://127.0.0.1:8000/api/update-student/${editingStudent.id}/`
      : "http://127.0.0.1:8000/api/add-student/";

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: gmail,
        phone,
        counselor_id: counselorId,
        batch_id: selectedBatchId,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }

    setSuccess(isEdit ? "Student updated" : "Student added");
    resetStudentForm();
    fetchStudents();
  };

  const resetStudentForm = () => {
    setName("");
    setGmail("");
    setPhone("");
    setSelectedCourseId("");
    setSelectedBatchId("");
    setEditingStudent(null);
  };

  const deleteStudent = async (id) => {
    await fetch(
      `http://127.0.0.1:8000/api/delete-student/${id}/`,
      { method: "DELETE" }
    );
    fetchStudents();
  };

  /* ===============================
     REPORT SUBMIT (BUG FIXED)
  =============================== */
  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reportStudentName || !reportCourse || !reportRemarks) {
      setError("Fill required fields");
      return;
    }

    const payload = {
      type: activeReportType,
      student_name: reportStudentName,
      course: reportCourse,
      remarks: reportRemarks,
      counselor_id: counselorId,
      performance_level:
        activeReportType === "PROGRESS" ? reportPerformance : null,
      issue_type:
        activeReportType === "DISCIPLINE" ? reportIssueType : null,
      risk_level:
        activeReportType === "DROPOUT" ? reportRiskLevel : null,
    };

    const res = await fetch("http://127.0.0.1:8000/api/add-report/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("Failed to submit report");
      return;
    }

    setSuccess("Report submitted");
    resetReportForm();
    fetchReports();
  };

  const resetReportForm = () => {
    setActiveReportType("");
    setReportBatchId("");
    setReportStudentId("");
    setReportStudentName("");
    setReportCourse("");
    setReportPerformance("");
    setReportIssueType("");
    setReportRiskLevel("");
    setReportRemarks("");
  };

  const confirmDelete = async () => {
  if (!deleteAction || deleteId === null) return;

  // trigger shake
  setIsShaking(true);

  // wait for animation
  setTimeout(async () => {
    await deleteAction(deleteId);

    setIsShaking(false);
    setShowDeleteModal(false);
    setDeleteAction(null);
    setDeleteId(null);
    setDeleteLabel("");
  }, 450); // match animation duration
};


  const pendingReplies = reports.filter(r => !r.admin_response).length;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>Counselor Dashboard</h1>
          <p>Manage students & reports</p>
        </div>
        <button className="ghost-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="dash-stats">
        <div className="stat-box">
          <span>Total Students</span>
          <h2>{students.length}</h2>
        </div>
        <div className="stat-box">
          <span>Total Reports</span>
          <h2>{reports.length}</h2>
        </div>
        <div className="stat-box">
          <span>Pending Replies</span>
          <h2>{pendingReplies}</h2>
        </div>
      </div>

      {/* TABS */}
      <div className="dash-tabs">
        <button
          className={activeTab === "students" ? "active" : ""}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Student
        </button>
        <button
          className={activeTab === "report" ? "active" : ""}
          onClick={() => setActiveTab("report")}
        >
          Create Report
        </button>
        <button
          className={activeTab === "myreports" ? "active" : ""}
          onClick={() => setActiveTab("myreports")}
        >
          My Reports
        </button>
      </div>

      {/* ADD STUDENT */}
      {activeTab === "add" && (
        <div className="form-col">
          <h3>{editingStudent ? "Update Student" : "Add Student"}</h3>
          <form onSubmit={handleSubmit}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Student Name" />
            <input value={gmail} onChange={e => setGmail(e.target.value)} placeholder="Gmail" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />

            <select
              value={selectedBatchId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedBatchId(id);
                const batch = batches.find(b => b.id === Number(id));
                if (batch) setSelectedCourseId(batch.course_id);
              }}
            >
              <option value="">Select Batch</option>
              {batches.map(b => (
                <option key={b.id} value={b.id} disabled={b.status === "COMPLETED"}>
                  {b.name} — {b.course_name}
                </option>
              ))}
            </select>

            {selectedCourseId && (
              <div className="tag">
                Course: {courses.find(c => c.id === Number(selectedCourseId))?.name}
              </div>
            )}

            <button type="submit">
              {editingStudent ? "Update Student" : "Add Student"}
            </button>
            {editingStudent && (
              <button
                type="button"
                className="ghost-btn"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  resetStudentForm();
                  setActiveTab("students");
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {/* VIEW STUDENTS */}
      {activeTab === "students" && (
        <div className="card-grid">
          {students.map((s, i) => (
            <div key={s.id} className="data-card">
              <div>
                <h3>{s.name}</h3>
                <p>{s.course_name} — {s.batch_name}</p>
                <small>{s.email} | {s.phone}</small>
              </div>
              <div className="card-actions">
                <button onClick={() => {
                  setEditingStudent(s);
                  setName(s.name);
                  setGmail(s.email);
                  setPhone(s.phone);
                  setSelectedBatchId(s.batch_id);
                  setActiveTab("add");
                }}>
                  Update
                </button>
                <button 
                  className="danger" 
                  onClick={() => {
                    setDeleteAction(() => deleteStudent);
                    setDeleteId(s.id);
                    setDeleteLabel("Student");
                    setShowDeleteModal(true);
                    }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE REPORT */}
      {activeTab === "report" && (
        <div className="form-col">
          <h3>Create Report</h3>

          <select value={activeReportType} onChange={e => setActiveReportType(e.target.value)}>
            <option value="">Select Report Type</option>
            <option value="PROGRESS">Progress</option>
            <option value="DISCIPLINE">Discipline</option>
            <option value="DROPOUT">Dropout</option>
          </select>

          <select
            value={reportBatchId}
            onChange={(e) => {
              const id = e.target.value;
              setReportBatchId(id);
              const batch = batches.find(b => b.id === Number(id));
              if (batch) setReportCourse(batch.course_name);
            }}
          >
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.course_name}
              </option>
            ))}
          </select>

          <select
            value={reportStudentId}
            onChange={(e) => {
              const id = e.target.value;
              setReportStudentId(id);
              const student = students.find(s => s.id === Number(id));
              if (student) setReportStudentName(student.name);
            }}
          >
            <option value="">Select Student</option>
            {students.filter(s => s.batch_id === Number(reportBatchId)).map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {activeReportType === "PROGRESS" && (
            <select value={reportPerformance} onChange={e => setReportPerformance(e.target.value)}>
              <option value="">Performance</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Weak">Weak</option>
            </select>
          )}

          {activeReportType === "DISCIPLINE" && (
            <select value={reportIssueType} onChange={e => setReportIssueType(e.target.value)}>
              <option value="">Issue</option>
              <option value="Late Coming">Late Coming</option>
              <option value="Absenteeism">Absenteeism</option>
              <option value="Misbehavior">Misbehavior</option>
            </select>
          )}

          {activeReportType === "DROPOUT" && (
            <select value={reportRiskLevel} onChange={e => setReportRiskLevel(e.target.value)}>
              <option value="">Risk</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          )}

          <textarea
            placeholder="Remarks"
            value={reportRemarks}
            onChange={e => setReportRemarks(e.target.value)}
          />

          <button onClick={handleReportSubmit}>Submit Report</button>
          <button
            type="button"
            className="ghost-btn"
            style={{ marginTop: "10px" }}
            onClick={() => {
              resetReportForm();
              setActiveTab("students");
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* MY REPORTS */}
      {activeTab === "myreports" && (
        <div className="card-grid">
          {reports.map(r => (
            <div key={r.id} className="data-card report-card">
              {!r.admin_response && <span className="pending-dot" />}
              <div>
                <h3>{r.student_name}</h3>
                <p>{r.type} — {r.course}</p>
                <small>{r.admin_response || "Pending Admin Reply"}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className={`delete-modal ${isShaking ? "shake" : ""}`}>

            <h3>Delete {deleteLabel}?</h3>
            <p>This action cannot be undone.</p>

            <div className="delete-modal-actions">
              <button
                className="ghost-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteAction(null);
                  setDeleteId(null);
                  setDeleteLabel("");
                }}
              >
                Cancel
              </button>

              <button className="danger-pop" onClick={confirmDelete}>
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TOAST */}
      {(error || success) && (
        <div className={`toast ${error ? "error" : "success"}`}>
          {error || success}
        </div>
      )}
    </div>
  );
}

export default Counselor;
