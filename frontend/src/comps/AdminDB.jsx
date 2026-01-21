import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GalaxyBG.css";

function StatCard({ title, count, onAdd, newCount }) {
  return (
    <div className={`stat-box ${newCount > 0 ? "report-stat" : ""}`}>
      <div className="stat-top">
        <span>{title}</span>
        {onAdd && (
          <button className="stat-add-btn" onClick={onAdd}>
            + Add
          </button>
        )}
      </div>
      <h2>{count}</h2>
      {newCount > 0 && (
        <div className="report-indicator">
          <span>{newCount}</span>
        </div>
      )}
    </div>
  );
}


function AdminDB() {
  const navigate = useNavigate();

  const [cName, setCName] = useState("");
  const [cGmail, setCGmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cUsername, setCUsername] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [counselors, setCounselors] = useState([]);
  const [editingCounselor, setEditingCounselor] = useState(null);
  
  const [bName, setBName] = useState("");
  const [bCode, setBCode] = useState("");
  const [batches, setBatches] = useState([]);
  const [editingBatch, setEditingBatch] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const [reports, setReports] = useState([]);
  const [adminReply, setAdminReply] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [error, setError] = useState("");
  const newReportsCount = reports.filter(r => !r.admin_response).length;
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const[deleteAction, setDeleteAction] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLabel, setDeleteLabel] = useState("");
  const [isShaking, setIsShaking] = useState(false);




  const [ui, setUI] = useState({
    tab: "Counselors",   // Counselors | Batches | Courses | Reports
    mode: "view",        // view | add | edit
  });

  useEffect(() => {
    fetchCounselors();
    fetchBatches();
    fetchCourses();
    fetchReports();
  }, []);

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");
    if(!isAdmin) {
      navigate("/admin-login");
    }
  }, []);

  // Handlers (Counselor)
  const handleCounselorSubmit = async(e) => {
    e.preventDefault();
    console.log({
      cName,
      cGmail,
      cPhone,
      cUsername,
      cPassword,
    });
    
    console.log("EDITMODE:", editingCounselor);

    const isEdit = Boolean(editingCounselor);
    const url = editingCounselor
    ? `http://127.0.0.1:8000/api/update-counselor/${editingCounselor.id}/`
    : "http://127.0.0.1:8000/api/add-counselor/";

    const method = isEdit ? "PUT" : "POST";
    console.log("REQUEST:", method, url);

      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cName,
            email: cGmail,
            phone: cPhone,
            username: cUsername,
            password: cPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok){
          setError(data.error || "Failed to add counselor");
          return;
        }
        
        clearForm();
        setUI({ tab: "Counselors", mode: "view" });
        await fetchCounselors();
        showToast(isEdit ? "Counselor Updated" : "New Counselor Added");
      } catch (err){
        setError("Server not responding");
        showToast("Failed to save Counselor", "error");
      }
  };

  const fetchCounselors = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-counselors/");
      setCounselors(await res.json());
    } catch (err) {
      setError("Failed to load counselors");
    }
  };

  const handleCounselorDelete = async(id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/delete-counselor/${id}/`, {method: "DELETE"}
      );

      const data = await res.json();
      if(!res.ok){
        setError(data.error || "Delete field");
        return;
      }

      await fetchCounselors();
      showToast("Counselor Deleted");
    } catch (err) {
      setError("Server not responding");
      showToast("Error occured to Delete Counselor", "error");
    }
  };

  //Batch Handlers...
  const fetchBatches = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-batches/");
      setBatches(await res.json());
    } catch {
      setError("Failed to load batches");
    }
  };

  const handleBatchSubmit = async(e) => {
    e.preventDefault();

    if (!bName || !bCode || !selectedCourseId || !startDate) {
      setError("All required fields must be filled");
      return;
    }
    
    const isEdit = Boolean(editingBatch);
    const url = isEdit
      ? `http://127.0.0.1:8000/api/update-batch/${editingBatch.id}/`
      : "http://127.0.0.1:8000/api/add-batch/"

    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
           name: bName, 
           code: bCode, 
           course_id: selectedCourseId,
           start_date: startDate,
           end_date: endDate || null,
          }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      
      clearForm();
      setUI({ tab: "Batches", mode: "view" });
      await fetchBatches();
      showToast(isEdit ? "Batch Updated" : "New Batch Added");
    } catch (err) {
      setError(err.message || "Batch save Failed");
      showToast("Error occured to save Batch", "error");
    }
  };

  const handleBatchDelete = async(id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/delete-batch/${id}/`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      
      await fetchBatches();
      showToast("Batch Deleted");
    } catch {
      setError("Server not responding");
      showToast("Error occured to Delete Batch");
    }
  };

  // Course Handlers....
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-courses/");
      setCourses(await res.json());
    } catch {
      setError("Failed to load courses");
    }
  };

 const handleCourseSubmit = async (e) => {
  e.preventDefault();

  const isEdit = Boolean(editingCourse);
  const url = isEdit
    ? `http://127.0.0.1:8000/api/update-course/${editingCourse.id}/`
    : "http://127.0.0.1:8000/api/add-course/";

  const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: courseName, code: courseCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }

      clearForm();
      setUI({ tab: "Courses", mode: "view" });
      await fetchCourses();
      showToast(isEdit ? "Course Updated" : "New Course Added");
    } catch (err) {
      setError(err.message || "Course save failed");
      showToast("Failed to save Course", "error");
    }
  };

  const handleCourseDelete = async (id) => {
 
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/delete-course/${id}/`,
          { method: "DELETE" }
        );

        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          return;
        }
 
        await fetchCourses();
        showToast("Course Deleted");
      } catch (err) {
        setError(err.message || "Failed to delete Course");
        showToast("Failed to delete Course");
      }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-reports/");
      const data = await res.json();
      setReports([...data]);
      console.log("REPORTS SAMPLE:", data);
    } catch {
      setError("Failed to load reports");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("token");
    navigate("/");
  }

  const confirmDelete = async () => {
    if (!deleteAction || deleteId === null) return;
    setIsShaking(true);

    setTimeout(async () => {
      await deleteAction(deleteId);

      setIsShaking(false);
      setShowDeleteModal(false);
      setDeleteAction(null);
      setDeleteId(null);
      setDeleteLabel("");
    }, 450);
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 2500);
  };

  const clearForm = () => {
    setCName("");
    setCGmail("");
    setCPhone("");
    setCUsername("");
    setCPassword("");
    setEditingCounselor(null);

    setBName("");
    setBCode("");
    setSelectedCourseId("");
    setStartDate("");
    setEndDate("");
    setEditingBatch(null);

    setCourseName("");
    setCourseCode("");
    setEditingCourse(null);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage counselors, batches, courses & reports</p>
        </div>
        <button className="ghost-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ================= SECTION A ================= */}
      <div className="dash-stats">
        <StatCard
          title="Counselors"
          count={counselors.length}
          onAdd={() => {
            clearForm();
            setUI({ tab: "Counselors", mode: "add" });
          }}
        />
        <StatCard
          title="Batches"
          count={batches.length}
          onAdd={() => {
            clearForm();
            setUI({ tab: "Batches", mode: "add" });
          }}
        />
        <StatCard
          title="Courses"
          count={courses.length}
          onAdd={() => {
            clearForm();
            setUI({ tab: "Courses", mode: "add" });
          }}
        />
        <StatCard 
          title="Reports" 
          count={reports.length}
          newCount={newReportsCount} />
      </div>

      {/* ================= TABS ================= */}
      <div className="dash-tabs">
        {["Counselors", "Batches", "Courses", "Reports"].map(t => (
          <button
            key={t}
            className={ui.tab === t ? "active" : ""}
            onClick={() => setUI({ tab: t, mode: "view" })}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ================= SECTION B ================= */}
      <div className={`section-b ${ui.mode !== "view" ? "two-column" : ""}`}>

        {/* LEFT COLUMN */}
        <div className="card-grid">

          {/* COUNSELORS */}
          {ui.tab === "Counselors" && counselors.map(c => (
            <div className="data-card" key={c.id}>
              <div>
                <h3>{c.name}</h3>
                <p>Email: {c.email}</p>
                <p>Username: {c.username}</p>
                <p>Password: *******</p>
              </div>
              <div className="card-actions">
                <button onClick={() => {
                  setEditingCounselor(c);
                  setCName(c.name);
                  setCGmail(c.email);
                  setCPhone(c.phone);
                  setCUsername(c.username);
                  setCPassword(c.password);
                  setUI({ tab: "Counselors", mode: "edit" });
                }}>
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    setDeleteAction(() => handleCounselorDelete);
                    setDeleteId(c.id);
                    setDeleteLabel("Counselor");
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* BATCHES */}
          {ui.tab === "Batches" && batches.map(b => (
            <div className="data-card" key={b.id}>
              <div>
                <h3>{b.name}</h3>
                <span className={`batch-status ${b.status?.toLowerCase()}`}>
                  {b.status}
                </span>
                <p>Code: {b.code}</p>
                <p>Course: {b.course_name}</p>
                <p>Start-Date: {b.start_date}</p>
                <p>End-Date: {b.end_date}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => {
                  setEditingBatch(b);
                  setBName(b.name);
                  setBCode(b.code);
                  setSelectedCourseId(b.course_id);
                  setStartDate(b.start_date);
                  setEndDate(b.end_date || "");
                  setUI({ tab: "Batches", mode: "edit" });
                }}>
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    setDeleteAction(() => handleBatchDelete);
                    setDeleteId(b.id);
                    setDeleteLabel("Batch");
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* COURSES */}
          {ui.tab === "Courses" && courses.map(c => (
            <div className="data-card" key={c.id}>
              <div>
                <h3>{c.name}</h3>
                <p>Code: {c.code}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => {
                  setEditingCourse(c);
                  setCourseName(c.name);
                  setCourseCode(c.code);
                  setUI({ tab: "Courses", mode: "edit" });
                }}>
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    setDeleteAction(() => handleCourseDelete);
                    setDeleteId(c.id);
                    setDeleteLabel("Course");
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* REPORTS */}
          {ui.tab === "Reports" && reports.map(r => {
            const isOpen = selectedReportId === r.id;

            return (
              <div 
                className={`data-card report-new ${
                  selectedReportId === r.id ? "active-reply" : ""
                }`} key={r.id}>
                {!r.admin_response && (
                  <span className="new-tag">New</span>
                )}
                <div style={{ width: "100%" }}>
                  
                  <div className="report-tags">
                    {r.performance_level && (
                      <span className="tag">Performance: {r.performance_level}</span>
                    )}
                    {r.risk_level && (
                      <span className="tag danger">Risk: {r.risk_level}</span>
                    )}
                    {r.issue_type && (
                      <span className="tag warning">Issue: {r.issue_type}</span>
                    )}
                  </div>
                  <p>{r.type}</p>

                  <h3>Student: {r.student_name}</h3>
                  <div className="report-meta">
                    <span>👨‍🏫Counselor: {r.counselor_name || r.counselor}</span>
                    <span>📘Course: {r.course}</span>
                    <span>🧑‍🎓 {r.batch_name || r.batch}</span>
                  </div>
                  <p>{r.remarks}</p>

                  {/* SHOW ADMIN REPLY (collapsed view) */}
                  {r.admin_response && !isOpen && (
                    <p className="admin-reply-text">
                      <strong>Admin Reply:</strong> {r.admin_response}
                    </p>
                  )}

                  {/* ACTION AREA */}
                  {!isOpen && (
                    <button
                      className="reply-btn"
                      onClick={() => {
                        setSelectedReportId(r.id);
                        setAdminReply(r.admin_response || "");
                      }}
                    >
                      Reply
                    </button>
                  )}

                  {/* EXPANDED REPLY SECTION */}
                  {isOpen && (
                    <div className="reply-box">

                      <div className="replying-indicator">
                        Replying to this report
                      </div>

                      <textarea
                        className="admin-reply-textarea"
                        value={adminReply}
                        onChange={e => setAdminReply(e.target.value)}
                        placeholder="Write admin reply to counselor..."
                      />

                      <div className="reply-actions">
                        <button
                          className="save-btn"
                          onClick={async () => {
                            try {
                              await fetch(
                                `http://127.0.0.1:8000/api/admin-reply/${r.id}/`,
                                {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ admin_response: adminReply })
                                }
                              );

                              await fetchReports();
                              showToast("Reply sent successfully");

                              setSelectedReportId(null);
                              setAdminReply("");
                            } catch {
                              showToast("Failed to send reply", "error");
                            }
                          }}
                        >
                          Save
                        </button>

                        <button
                          className="ghost-btn"
                          onClick={() => {
                            setSelectedReportId(null);
                            setAdminReply("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}


        </div>

        {/* RIGHT COLUMN – FORM */}
        {ui.mode !== "view" && (
          <div className="form-col">

            {ui.tab === "Counselors" && (
              <form onSubmit={handleCounselorSubmit}>
                <h3>{ui.mode === "edit" ? "Update Counselor" : "Add Counselor"}</h3>
                <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Name" />
                <input value={cGmail} onChange={e => setCGmail(e.target.value)} placeholder="Email" />
                <input value={cPhone} onChange={e => setCPhone(e.target.value)} placeholder="Phone" />
                <input value={cUsername} onChange={e => setCUsername(e.target.value)} placeholder="Username" />
                <input value={cPassword} onChange={e => setCPassword(e.target.value)} placeholder="Password" />
                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button type="button" className="ghost-btn" onClick={clearForm}>Cancel</button>
                </div>
              </form>
            )}

            {ui.tab === "Batches" && (
              <form onSubmit={handleBatchSubmit}>
                <h3>{ui.mode === "edit" ? "Update Batch" : "Add Batch"}</h3>

                <div className="field">
                  <input value={bName} onChange={e => setBName(e.target.value)} placeholder="Batch Name" required />
                </div>

                <div className="field">
                  <input value={bCode} onChange={e => setBCode(e.target.value)} placeholder="Batch Code" required />
                </div>

                <div className="field">
                  <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} required>
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                </div>

                <div className="field">
                  <label>End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>

                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button type="button" className="ghost-btn" onClick={clearForm}>Cancel</button>
                </div>
              </form>
            )}

            {ui.tab === "Courses" && (
              <form onSubmit={handleCourseSubmit}>
                <h3>{ui.mode === "edit" ? "Update Course" : "Add Course"}</h3>

                <div className="field">
                  <input value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Course Name" required />
                </div>

                <div className="field">
                  <input value={courseCode} onChange={e => setCourseCode(e.target.value)} placeholder="Course Code" required />
                </div>

                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button type="button" className="ghost-btn" onClick={clearForm}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

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

      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );


}

export default AdminDB;
