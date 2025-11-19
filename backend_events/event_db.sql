--
DROP DATABASE IF EXISTS event_db;
CREATE DATABASE event_db;
\c event_db;
-- PostgreSQL database dump
--

-- \restrict jgffjSfHiwxilTezyrhsJOjNgssLLnmtSpnDa954TaSMyKr5KtQVHv8nz6gT26j

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-25 21:13:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16767)
-- Name: event_category_map; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_category_map (
    event_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.event_category_map OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16752)
-- Name: eventcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventcategories (
    category_id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.eventcategories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16751)
-- Name: eventcategories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventcategories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventcategories_category_id_seq OWNER TO postgres;

--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 219
-- Name: eventcategories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventcategories_category_id_seq OWNED BY public.eventcategories.category_id;


--
-- TOC entry 218 (class 1259 OID 16742)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    event_id integer NOT NULL,
    event_title character varying(255) NOT NULL,
    description text,
    location character varying(255),
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category_id integer
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16741)
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_event_id_seq OWNER TO postgres;

--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 217
-- Name: events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;


--
-- TOC entry 4753 (class 2604 OID 16755)
-- Name: eventcategories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventcategories ALTER COLUMN category_id SET DEFAULT nextval('public.eventcategories_category_id_seq'::regclass);


--
-- TOC entry 4751 (class 2604 OID 16745)
-- Name: events event_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);


--
-- TOC entry 4914 (class 0 OID 16767)
-- Dependencies: 221
-- Data for Name: event_category_map; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_category_map (event_id, category_id) FROM stdin;
4	10
5	5
5	6
5	12
6	11
6	12
7	5
7	8
7	12
8	7
8	11
8	12
9	5
9	7
9	11
\.


--
-- TOC entry 4913 (class 0 OID 16752)
-- Dependencies: 220
-- Data for Name: eventcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventcategories (category_id, category_name, description) FROM stdin;
2	Conference	Tech or professional conferences
1	Ceremony	Hands-on learning events
3	Workshop	Opening or closing ceremonies
5	Robotics & Automation	Robotic systems, automation, and control engineering
6	Aerospace / Avionics	Drones, flight demonstrations and aerospace engineering
7	Biomedical / Bioengineering	Medical devices, bioengineering and health technologies
8	Agricultural / AgriTech	Precision agriculture, farm technology and agronomy demos
9	Control Systems & Instrumentation	Sensors, measurement and instrumentation systems
10	Civil Architecture / Building	Construction methods, architecture and building demos
11	Computer Science / Software	Software, AI, simulation, data systems and apps
12	Electrical/Electronic	Power systems, electric machines,Circuit design, sensors
\.


--
-- TOC entry 4911 (class 0 OID 16742)
-- Dependencies: 218
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (event_id, event_title, description, location, start_time, end_time, created_at, category_id) FROM stdin;
1	Opening Ceremony	Official inauguration of EngEx 2025	EOE Perera Theater	2025-10-15 10:00:00	2025-10-15 11:30:00	2025-10-15 13:13:11.142257	1
3	AI Workshop	\N	DO II	2025-11-12 10:00:00	2025-11-12 16:00:00	2025-10-22 10:48:46.256091	3
2	Tech Summit 2025	\N	EOE Perera Theater	2025-11-10 09:00:00	2025-11-10 17:00:00	2025-10-22 10:48:46.256091	2
4	Bridge Competition	Competition aimed at school students to demonstrate civil engineering principles.	Material lab	2025-09-23 10:00:00	2025-09-23 14:00:00	2025-10-25 21:03:44.601606	10
5	Drone Show	Coordinator: Nipun. Timing may vary due to weather.	In front of AR	2025-09-23 18:30:00	2025-09-23 18:41:00	2025-10-25 21:03:44.631248	6
6	3D Project Mapping	A short 3D projection mapping piece shown after the drone show.	AR building	2025-09-23 18:42:00	2025-09-23 19:00:00	2025-10-25 21:03:44.645709	11
7	Smart Irrigation Workshop	Demonstration of IoT-enabled smart irrigation systems for efficient water management.	Agricultural Lab	2025-09-23 09:00:00	2025-09-23 12:00:00	2025-10-25 21:03:51.981197	8
8	Wearable Health Devices Showcase	Showcasing prototypes of wearable health monitors, smart band sensors, and biofeedback devices.	Biomedical Lab	2025-09-23 13:00:00	2025-09-23 16:00:00	2025-10-25 21:03:57.268824	7
9	AI-Powered Simulation Challenge	Participants design and test AI models for simulations, including robotics, healthcare, and agricultural scenarios.	Computer Science Lab	2025-09-23 14:00:00	2025-09-23 18:00:00	2025-10-25 21:04:02.662117	11
\.


--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 219
-- Name: eventcategories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventcategories_category_id_seq', 12, true);


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 217
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_event_id_seq', 9, true);


--
-- TOC entry 4761 (class 2606 OID 16771)
-- Name: event_category_map event_category_map_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_category_map
    ADD CONSTRAINT event_category_map_pkey PRIMARY KEY (event_id, category_id);


--
-- TOC entry 4757 (class 2606 OID 16761)
-- Name: eventcategories eventcategories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventcategories
    ADD CONSTRAINT eventcategories_category_name_key UNIQUE (category_name);


--
-- TOC entry 4759 (class 2606 OID 16759)
-- Name: eventcategories eventcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventcategories
    ADD CONSTRAINT eventcategories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4755 (class 2606 OID 16750)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- TOC entry 4763 (class 2606 OID 16777)
-- Name: event_category_map event_category_map_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_category_map
    ADD CONSTRAINT event_category_map_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.eventcategories(category_id) ON DELETE CASCADE;


--
-- TOC entry 4764 (class 2606 OID 16772)
-- Name: event_category_map event_category_map_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_category_map
    ADD CONSTRAINT event_category_map_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- TOC entry 4762 (class 2606 OID 16762)
-- Name: events events_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.eventcategories(category_id);


-- Completed on 2025-10-25 21:13:55

--
-- PostgreSQL database dump complete
--

\unrestrict jgffjSfHiwxilTezyrhsJOjNgssLLnmtSpnDa954TaSMyKr5KtQVHv8nz6gT26j

