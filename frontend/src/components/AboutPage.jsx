import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AboutPage.css";
import logo from "../assets/engex.png";

const AboutPage = () => {
  const [currentStat, setCurrentStat] = useState(0);

  const eventStats = [
    { label: "Engineering Departments", value: "8", icon: "🏛️" },
    { label: "Student Projects", value: "120+", icon: "🚀" },
    { label: "Industry Partners", value: "45", icon: "🤝" },
    { label: "Innovation Exhibits", value: "75", icon: "💡" },
    { label: "Research Papers", value: "200+", icon: "📄" },
    { label: "Guest Speakers", value: "25", icon: "🎤" }
  ];

  const departments = [
    { name: "Computer Engineering", description: "AI, Software, Cybersecurity", projects: 18, color: "#3b82f6" },
    { name: "Electrical Engineering", description: "Power Systems, Renewable Energy, Smart Grids", projects: 16, color: "#f59e0b" },
    { name: "Mechanical Engineering", description: "Robotics, Manufacturing, Automotive Technology", projects: 15, color: "#10b981" },
    { name: "Civil Engineering", description: "Infrastructure, Construction, Environmental Engineering", projects: 14, color: "#8b5cf6" },
    { name: "Chemical & Process Engineering", description: "Process Engineering, Materials Science, Sustainability", projects: 12, color: "#ef4444" },
    { name: "Manufacturing & Industrial Engineering", description: "Production, Automation, Quality Control", projects: 11, color: "#06b6d4" },
    { name: "Engineering Management", description: "Project Leadership, Operations Optimization, Tech Management", projects: 11, color: "#d406a7" },
    { name: "Engineering Mathematics", description: "Computational Methods, Modeling, Data Analysis", projects: 11, color: "#d3d15e" }
  ];

  const highlights = [
    { icon: "🏆", text: "Award Competitions" },
    { icon: "🎯", text: "Interactive Demos" },
    { icon: "🔬", text: "Research Presentations" },
    { icon: "🤖", text: "Technology Showcases" },
    { icon: "💼", text: "Industry Partnerships" },
    { icon: "🌱", text: "Sustainability Focus" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % eventStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [eventStats.length]);

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

        {/* Event Overview */}
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

            {/* Highlights Grid */}
            <motion.div 
              className="highlights-main-grid"
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
              }}
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

        {/* Departments */}
        <div className="glass-card">
          <h2 className="section-title">🏛️ Engineering Departments</h2>
          <div className="departments-grid">
            {departments.map((dept, i) => (
              <motion.div 
                key={i} 
                className="department-card"
                whileHover={{ scale: 1.08, y: -5 }}
                transition={{ type: "spring", stiffness: 150 }}
                style={{ borderLeft: `5px solid ${dept.color}` }}
              >
                <h3 className="department-name">{dept.name}</h3>
                <span className="department-projects">{dept.projects} projects</span>
                <p className="department-description">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

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
