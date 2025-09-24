--
-- PostgreSQL database dump
--

-- Dumped from database version 15.7 (Ubuntu 15.7-0ubuntu0.23.10.1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-0ubuntu0.23.10.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: myuser
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO myuser;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: myuser
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BotStatus; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."BotStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'DEPLOYED',
    'ARCHIVED'
);


ALTER TYPE public."BotStatus" OWNER TO myuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO myuser;

--
-- Name: bot_analytics; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.bot_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "botId" uuid NOT NULL,
    date date NOT NULL,
    conversations integer DEFAULT 0 NOT NULL,
    messages integer DEFAULT 0 NOT NULL,
    "uniqueUsers" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.bot_analytics OWNER TO myuser;

--
-- Name: bots; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.bots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    avatar character varying(500),
    status public."BotStatus" DEFAULT 'DRAFT'::public."BotStatus" NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    flows jsonb DEFAULT '[]'::jsonb NOT NULL,
    intents jsonb DEFAULT '[]'::jsonb NOT NULL,
    entities jsonb DEFAULT '[]'::jsonb NOT NULL,
    "deploymentUrl" character varying(500),
    "apiKey" character varying(255),
    "totalConversations" integer DEFAULT 0 NOT NULL,
    "totalMessages" integer DEFAULT 0 NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.bots OWNER TO myuser;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "sessionId" character varying(255) NOT NULL,
    "userId" uuid,
    "botId" uuid NOT NULL,
    messages jsonb DEFAULT '[]'::jsonb NOT NULL,
    context jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.conversations OWNER TO myuser;

--
-- Name: knowledge_base; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.knowledge_base (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "botId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.knowledge_base OWNER TO myuser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    image text,
    "createdAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(6) without time zone
);


ALTER TABLE public.users OWNER TO myuser;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3e15cf3d-ff85-429e-ab0a-d7c135658a0d	656f7a6998bb6fa39084fc424c8f45b0f408513db362ca4e7ac569b7f9211774	2025-09-17 11:38:21.586971+05:30	20250917060821_init	\N	\N	2025-09-17 11:38:21.551108+05:30	1
0ef7b14b-8a9c-42a8-b96e-ba5f1948f7d2	545a9ef0d0241a5f5f90a00befbf1a9a7f3fecafc90d1787c55946f923f03b66	2025-09-19 11:06:31.567334+05:30	20250919053631_add_knowledge_base	\N	\N	2025-09-19 11:06:31.534221+05:30	1
\.


--
-- Data for Name: bot_analytics; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.bot_analytics (id, "botId", date, conversations, messages, "uniqueUsers", "createdAt") FROM stdin;
\.


--
-- Data for Name: bots; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.bots (id, name, description, avatar, status, "isPublic", config, flows, intents, entities, "deploymentUrl", "apiKey", "totalConversations", "totalMessages", "userId", "createdAt", "updatedAt") FROM stdin;
2ddc0d76-441d-42a5-8800-35c29503f079	klmaml	sdasdassac sacsa sa das sa csac 		DEPLOYED	f	{"tags": [], "theme": {"fontFamily": "Inter", "primaryColor": "#0ea5e9"}, "category": "general", "language": "en", "welcomeMessage": "Hello! How can I help you today?", "fallbackMessage": "I'm sorry, I didn't understand that. Could you please rephrase?"}	[{"id": "main", "name": "Main Flow", "edges": [{"id": "start-welcome", "source": "start", "target": "welcome"}], "nodes": [{"id": "start", "data": {"label": "Start"}, "type": "start", "position": {"x": 100, "y": 100}}, {"id": "welcome", "data": {"text": "Hello! How can I help you today?", "label": "Welcome Message"}, "type": "text", "position": {"x": 300, "y": 100}}]}]	[]	[]	http://localhost:3000/embed/2ddc0d76-441d-42a5-8800-35c29503f079	bp_sxm12zeqv2mquyyha04ams	0	0	86d4ee97-d7b6-4917-b799-fbec8729c910	2025-09-18 10:17:16.037	2025-09-18 12:51:19.485
a2f23bf6-9f56-490b-850b-1a2988e4b5e2	asdad			DRAFT	f	{"language": "en", "template": "blank", "personality": "friendly", "welcomeMessage": "Hello! How can I help you today?"}	[]	[]	[]	\N	bp_e81k5z8fjav67h55vt8d2x	0	0	86d4ee97-d7b6-4917-b799-fbec8729c910	2025-09-19 06:39:00.012	2025-09-19 06:39:00.012
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.conversations (id, "sessionId", "userId", "botId", messages, context, metadata, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: knowledge_base; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.knowledge_base (id, "botId", title, content, metadata, "createdAt", "updatedAt") FROM stdin;
f471fdc7-ed0a-490b-a5ca-ed7624b7e474	a2f23bf6-9f56-490b-850b-1a2988e4b5e2	url	asdasdd	{"type": "url", "status": "pending"}	2025-09-19 06:39:00.012	2025-09-19 06:39:00.012
60794846-a74a-4c4d-82f9-89c4c4f39006	a2f23bf6-9f56-490b-850b-1a2988e4b5e2	url	sdadasdsad	{"type": "url", "status": "pending"}	2025-09-19 06:39:00.012	2025-09-19 06:39:00.012
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public.users (id, name, email, image, "createdAt", "updatedAt") FROM stdin;
86d4ee97-d7b6-4917-b799-fbec8729c910	Karan singh	karan@codedrillinfotech.com	https://lh3.googleusercontent.com/a/ACg8ocJ8xqQk4BQfjOTR3Rq4nFOW91ge_uc6Bhtq6XjQqmHaQXg6JcE=s96-c	2025-09-17 06:09:39.587	2025-09-17 06:09:39.587
087a3528-a3a8-4085-9397-c13550b05e1c	Kārän 	karan523thakur@gmail.com	https://lh3.googleusercontent.com/a/ACg8ocJIslO_FG5O0K9pxH8boebMeFTjllsKlLNft219sVMKlEvPCBDY=s96-c	2025-09-18 05:54:19.992	2025-09-18 08:20:37.961
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: bot_analytics bot_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.bot_analytics
    ADD CONSTRAINT bot_analytics_pkey PRIMARY KEY (id);


--
-- Name: bots bots_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.bots
    ADD CONSTRAINT bots_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base knowledge_base_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.knowledge_base
    ADD CONSTRAINT knowledge_base_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bot_analytics_botId_date_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "bot_analytics_botId_date_key" ON public.bot_analytics USING btree ("botId", date);


--
-- Name: conversations_botId_sessionId_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX "conversations_botId_sessionId_idx" ON public.conversations USING btree ("botId", "sessionId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: bot_analytics bot_analytics_botId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.bot_analytics
    ADD CONSTRAINT "bot_analytics_botId_fkey" FOREIGN KEY ("botId") REFERENCES public.bots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bots bots_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.bots
    ADD CONSTRAINT "bots_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversations conversations_botId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "conversations_botId_fkey" FOREIGN KEY ("botId") REFERENCES public.bots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversations conversations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT "conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: knowledge_base knowledge_base_botId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.knowledge_base
    ADD CONSTRAINT "knowledge_base_botId_fkey" FOREIGN KEY ("botId") REFERENCES public.bots(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: myuser
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

