import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./AboutPage.css";
import logo from "../assets/engex.png";

const AboutPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptDetails, setDeptDetails] = useState(null);
  const [currentStat, setCurrentStat] = useState(0);

  const eventStats = [
    { label: "Engineering Departments", value: "8", icon: "🏛️" },
    { label: "Student Projects", value: "120+", icon: "🚀" },
    { label: "Industry Partners", value: "45", icon: "🤝" },
    { label: "Innovation Exhibits", value: "75", icon: "💡" },
    { label: "Research Papers", value: "200+", icon: "📄" },
    { label: "Guest Speakers", value: "25", icon: "🎤" }
  ];

  const highlights = [
    { icon: "🏆", text: "Award Competitions" },
    { icon: "🎯", text: "Interactive Demos" },
    { icon: "🔬", text: "Research Presentations" },
    { icon: "🤖", text: "Technology Showcases" },
    { icon: "💼", text: "Industry Partnerships" },
    { icon: "🌱", text: "Sustainability Focus" }
  ];

  // Fetch departments from backend
  useEffect(() => {
    axios.get("http://localhost:5000/departments")
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  }, []);

  // Automatic stat rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % eventStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [eventStats.length]);

  // Fetch single department details for modal
  const handleDeptClick = (id) => {
    axios.get(`http://localhost:5000/departments/${id}`)
      .then(res => {
        setDeptDetails(res.data);
        setSelectedDept(id);
      })
      .catch(err => console.error(err));
  };

  // Dynamic gradient and border for modal header
  const linearGradient = deptDetails 
    ? `linear-gradient(${deptDetails.color}, white)` 
    : "linear-gradient(yellow, white)";
  const borderColor = deptDetails 
    ? `5px solid ${deptDetails.color}` 
    : "5px solid #3b82f6";

  return (
    <div className="about-page">
      <div className="about-container">

        {/* Header */}
        <motion.div 
          className="about-header"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="header-content">
            <motion.img 
              src={logo} 
              alt="EngEx 2025 Logo" 
              className="header-logo"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <div className="header-text">
              <h1 className="about-title">EngEx 2025</h1>
              <p className="about-subtitle">
                The Biggest Engineering Exhibition Of The Year
              </p>
            </div>
          </div>
        </motion.div>

        {/* Event Overview & Highlights */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="section-title">Event Overview</h2>
          <div className="event-overview-content">
            <div className="event-description">
              <p>
                EngEx 2025 is the premier engineering exhibition showcasing innovative 
                solutions and cutting-edge research from the Faculty of Engineering, 
                University of Peradeniya.
              </p>
              <p>
                This year’s theme: <b>“Engineering for a Sustainable Future”</b> highlights
                projects addressing global challenges in sustainability, technology, and human welfare.
              </p>
            </div>

            {/* Highlights */}
            <motion.div 
              className="highlights-main-grid"
              initial="hidden"
              whileInView="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            >
              {highlights.map((item, i) => (
                <motion.div 
                  key={i} 
                  className="highlight-item"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="highlight-icon">{item.icon}</span>
                  <span className="highlight-text">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Dynamic Stats */}
            <div className="stats-display-container">
              <motion.div 
                className="dynamic-stats-card"
                key={currentStat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="stat-display">
                  <div className="stat-icon">{eventStats[currentStat].icon}</div>
                  <div className="stat-details">
                    <div className="stat-value">{eventStats[currentStat].value}</div>
                    <div className="stat-label">{eventStats[currentStat].label}</div>
                  </div>
                </div>
                <div className="stat-indicators">
                  {eventStats.map((_, i) => (
                    <div
                      key={i}
                      className={`stat-indicator ${i === currentStat ? "active" : ""}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Departments Grid */}
        <div className="glass-card">
          <h2 className="section-title">🏛️ Engineering Departments</h2>
          <div className="departments-grid">
            {departments.map((dept) => (
              <div key={dept.id} className="department-card-wrapper">
                <motion.div 
                  className="department-card"
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  style={{ borderLeft: `5px solid ${dept.color}` }}
                  onClick={() => handleDeptClick(dept.id)}
                >
                  <h3 className="department-name">{dept.name}</h3>
                  <span className="department-projects">{dept.projects} projects</span>
                  <p className="department-description">{dept.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Modal */}
        <AnimatePresence>
          {selectedDept && deptDetails && (
            <motion.div
              className="department-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDept(null)}
            >
              <motion.div
                className="department-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ borderLeft: borderColor }}
              >
                <div className="modal-header" style={{ background: linearGradient }}>
                  <h3>{deptDetails.name}</h3>
                </div>
                <div className="modal-body">
                  <p><b>Head of Department:</b> {deptDetails.head }</p>
                  
                  <p><b>Number of Projects:</b> {deptDetails.projects}</p>
                  
                  <p><b>Projects: </b></p>
                  <ul>
                    {deptDetails.description.split(",").map((item, index) => (
                      <li key={index}>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <div className="quick-stats-grid">
          {eventStats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="stat-item"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-icon-small">{stat.icon}</div>
              <div className="stat-value-small">{stat.value}</div>
              <div className="stat-label-small">{stat.label}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
