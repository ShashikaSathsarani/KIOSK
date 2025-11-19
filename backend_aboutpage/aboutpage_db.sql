
DROP DATABASE IF EXISTS engex;
-- Database creation
CREATE DATABASE engex WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';

-- Table creation
\connect engex

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    projects integer NOT NULL,
    color character varying(20),
    head character varying(100),
    description text
);

-- Sequence creation
CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set default value
ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);

-- Data inserts with your requested departments
-- Data inserts with your requested departments (using INSERT to avoid COPY marker issues)
INSERT INTO public.departments (id, name, projects, color, head, description) VALUES
    (1, 'Computer Engineering', 8, '#FF6B6B', 'Dr. Sarah Chen', 'Hardware, software, and embedded systems design and development'),
    (2, 'Electrical and Electronic Engineering', 12, '#4ECDC4', 'Prof. James Wilson', 'Power systems, electronics, telecommunications and control systems'),
    (3, 'Chemical and Process Engineering', 6, '#45B7D1', 'Dr. Maria Rodriguez', 'Chemical processes, manufacturing, and material transformation'),
    (4, 'Manufacturing and Industrial Engineering', 9, '#96CEB4', 'Mr. David Lee', 'Production systems, optimization, and manufacturing processes'),
    (5, 'Civil Engineering', 11, '#FECA57', 'Dr. Robert Brown', 'Infrastructure, construction, and structural engineering projects'),
    (6, 'Mechanical Engineering', 10, '#FF9FF3', 'Prof. Anna Kumar', 'Machine design, thermodynamics, and mechanical systems'),
    (7, 'Engineering Management', 5, '#54A0FF', 'Ms. Lisa Johnson', 'Project management, operations, and engineering business leadership'),
    (8, 'Engineering Mathematics', 4, '#5F27CD', 'Dr. Michael Zhang', 'Mathematical modeling, computation, and analytical methods for engineering');

-- Ensure the sequence for id is set to the current max(id)
SELECT setval('public.departments_id_seq', COALESCE((SELECT MAX(id) FROM public.departments), 1));