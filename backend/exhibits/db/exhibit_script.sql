
-- Use lowercase database name to avoid case-sensitivity issues when connecting
DROP DATABASE IF EXISTS exhibits;
CREATE DATABASE exhibits;
\c exhibits;
-- 1. Zones (create first because other tables reference it)
CREATE TABLE zone ( 
    zone_ID INT PRIMARY KEY,
    zone_name VARCHAR(10) NOT NULL UNIQUE
);

-- 2. Buildings (depends on zone)
CREATE TABLE building (
    building_ID INT PRIMARY KEY,
    zone_ID INT NOT NULL,
    building_name VARCHAR(150) NOT NULL UNIQUE,  -- enforce unique names
    location VARCHAR(200),
    department VARCHAR(100) NOT NULL,
    CONSTRAINT fk_building_zone FOREIGN KEY (zone_ID) REFERENCES zone(zone_ID) ON DELETE CASCADE
);

-- 3. Exhibits (depends on building)
CREATE TABLE exhibits (
    exhibit_ID SERIAL PRIMARY KEY,
    exhibit_name VARCHAR(150) NOT NULL,
    building_ID INT NOT NULL,
    tags TEXT[],
    CONSTRAINT fk_exhibit_building FOREIGN KEY (building_ID) REFERENCES building(building_ID) ON DELETE CASCADE
);
INSERT INTO zone (zone_ID, zone_name) VALUES
(1,'A'),
(2,'B'),
(3,'C'),
(4,'D');

INSERT INTO building (building_ID, zone_ID, building_name, location, department) VALUES
(1, 1, 'Industry and VR Zone and Smart City by PeraCom', 'Drawing Office 2', 'Computer Engineering'),
(2, 2, 'EngMath Nexus, School Innovation Hub & Computer Museum', 'Drawing Office 1', 'Mathematics & Computer Engineering'),
(3, 2, 'Innovating a Greener Tomorrow', 'Department of Chemical Engineering', 'Chemical and Process Engineering'),
(4, 3, 'Smart Mobility Hub', 'Surveying Lab', 'Civil Engineering'),
(5, 3, 'GeoFrontiers Hub', 'Soil Lab', 'Civil Engineering'),
(6, 4, 'Applied Thermodynamics, Automobiles and Aeronautical Zone', 'Thermodynamics Lab', 'Mechanical Engineering'),
(7, 1, 'Creovate DMIE', 'Department of Manufacturing And Industrial Engineering', 'Manufacture and Industrial Engineering'),
(8, 3, 'Spark Street DEEE', 'Department of Electrical and Electronic Engineering', 'Electrical and Electronic Engineering');



INSERT INTO exhibits (exhibit_ID, exhibit_name, building_ID, tags) VALUES
(1, 'Smart Power Socket', 1, ARRAY['Electronics and Embedded Systems']),
(2, 'Oral Cancer Screening Booth (OASIS AI App)', 1, ARRAY['Artificial Intelligence Machine Learning and Data Science ', 'Biomedical Engineering and Mechatronics','Electronics and Embedded Systems']),
(3, 'ICT Museum', 2, ARRAY['Information Technology and Computing']),
(4, 'Maths in Fine Arts', 2, ARRAY['Science, Entertainment and Mathematics of Engineering']),
(5, 'Nano corner exhibits', 3, ARRAY['Materials and Nanotechnology']),
(6, 'Sustainable biodiesel production', 3, ARRAY['Energy Environment and Sustainability & Nature Based Technologies']),
(7, 'Evolution of Survey Instruments', 4, ARRAY['Road Safety, Transportation Planning and Engineering Survey']),
(8, 'Planetarium', 4, ARRAY['Road Safety, Transportation Planning and Engineering Survey']),
(9, 'Natural fibre reinforced composites', 5, ARRAY['Energy Environment and Sustainability & Nature Based Technologies']),
(10, 'Liquid Extractor', 5, ARRAY['Pilot Plant']),
(11, 'Solar cooker', 6, ARRAY['Renewable energy and sustainability']),
(12, 'Valve Timing demonstration', 6, ARRAY['Automobile']),
(13, '3D Printer', 7, ARRAY['Additive Manufacturing and 3D Printing']),
(14, 'CNC Milling Machine', 7, ARRAY['Computer Numerical Control (CNC)']),
(15, 'Robotics Arm', 8, ARRAY['Robotics and Automation']),
(16, 'Smart Grid Model', 8, ARRAY['Power Systems and Smart Grids']);