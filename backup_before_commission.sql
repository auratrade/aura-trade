--
-- PostgreSQL database dump
--

\restrict EtSuwK6gT3bi1j7hqOcbJBK3DXh96w3odfGzC0otjqlsiNUwMWcymGlN4fEkMQy

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: ReferralTier; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReferralTier" AS ENUM (
    'STARTER',
    'LEVEL1',
    'LEVEL2',
    'LEVEL3',
    'LEVEL4',
    'LEVEL5',
    'VIP'
);


ALTER TYPE public."ReferralTier" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_actions (
    id text NOT NULL,
    "adminId" text NOT NULL,
    action text NOT NULL,
    "targetType" text,
    "targetId" text,
    details text,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.admin_actions OWNER TO postgres;

--
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_notifications (
    id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "referenceId" text,
    "isRead" boolean DEFAULT false NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.admin_notifications OWNER TO postgres;

--
-- Name: admin_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_sessions (
    id text NOT NULL,
    "adminId" text NOT NULL,
    token text NOT NULL,
    "adminSlug" text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.admin_sessions OWNER TO postgres;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id text NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "fullName" text,
    role text DEFAULT 'admin'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "lastLoginIP" text,
    "loginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: earnings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.earnings (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    amount double precision NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.earnings OWNER TO postgres;

--
-- Name: identity_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.identity_verifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    "idType" text NOT NULL,
    "frontImage" text NOT NULL,
    "backImage" text,
    "selfieImage" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    reason text,
    "reviewedBy" text,
    "reviewedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.identity_verifications OWNER TO postgres;

--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_attempts (
    id text NOT NULL,
    identifier text NOT NULL,
    type text NOT NULL,
    success boolean NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.login_attempts OWNER TO postgres;

--
-- Name: mission_completions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mission_completions (
    id text NOT NULL,
    "userId" text NOT NULL,
    "missionId" text NOT NULL,
    reward double precision NOT NULL,
    "depositBase" double precision NOT NULL,
    percent double precision DEFAULT 2 NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mission_completions OWNER TO postgres;

--
-- Name: missions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.missions (
    id text NOT NULL,
    title text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endsAt" timestamp(3) without time zone NOT NULL,
    "endedAt" timestamp(3) without time zone,
    "endedBy" text,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.missions OWNER TO postgres;

--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp_codes (
    id text NOT NULL,
    email text NOT NULL,
    code text NOT NULL,
    type text DEFAULT 'register'::text NOT NULL,
    used boolean DEFAULT false NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.otp_codes OWNER TO postgres;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: referral_bonuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_bonuses (
    id text NOT NULL,
    "userId" text NOT NULL,
    tier public."ReferralTier" NOT NULL,
    amount double precision NOT NULL,
    milestone integer NOT NULL,
    claimed boolean DEFAULT false NOT NULL,
    "claimedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.referral_bonuses OWNER TO postgres;

--
-- Name: referral_earnings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_earnings (
    id text NOT NULL,
    "referrerId" text NOT NULL,
    "referredId" text NOT NULL,
    amount double precision NOT NULL,
    level integer NOT NULL,
    "sourceType" text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.referral_earnings OWNER TO postgres;

--
-- Name: referral_relations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_relations (
    id text NOT NULL,
    "referrerId" text NOT NULL,
    "referredId" text NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "activatedAt" timestamp(3) without time zone
);


ALTER TABLE public.referral_relations OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    amount double precision NOT NULL,
    network text,
    txid text,
    address text,
    status text DEFAULT 'pending'::text NOT NULL,
    reason text,
    meta text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: user_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    icon text DEFAULT 'bell'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    "actionUrl" text,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_notifications OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "fullName" text,
    "accountLevel" integer DEFAULT 0 NOT NULL,
    "referralCount" integer DEFAULT 0 NOT NULL,
    "referralCode" text NOT NULL,
    "referredBy" text,
    "isVerified" boolean DEFAULT false NOT NULL,
    "withdrawableBalance" double precision DEFAULT 0 NOT NULL,
    "availableBalance" double precision DEFAULT 0 NOT NULL,
    "lockedBalance" double precision DEFAULT 0 NOT NULL,
    "totalValue" double precision DEFAULT 0 NOT NULL,
    "totalDeposited" double precision DEFAULT 0 NOT NULL,
    "totalWithdrawn" double precision DEFAULT 0 NOT NULL,
    "totalProfit" double precision DEFAULT 0 NOT NULL,
    "totalLoss" double precision DEFAULT 0 NOT NULL,
    "referralEarnings" double precision DEFAULT 0 NOT NULL,
    "level1Referrals" integer DEFAULT 0 NOT NULL,
    "level2Referrals" integer DEFAULT 0 NOT NULL,
    "level3Referrals" integer DEFAULT 0 NOT NULL,
    "referralTier" public."ReferralTier" DEFAULT 'STARTER'::public."ReferralTier" NOT NULL,
    "totalReferrals" integer DEFAULT 0 NOT NULL,
    "weeklySalaryUnlockedAt" timestamp(3) without time zone,
    "lastSalaryPaidAt" timestamp(3) without time zone,
    "totalSalaryEarned" double precision DEFAULT 0 NOT NULL,
    "totalBonusEarned" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: weekly_salaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_salaries (
    id text NOT NULL,
    "userId" text NOT NULL,
    tier public."ReferralTier" NOT NULL,
    amount double precision NOT NULL,
    "weekStart" timestamp(3) without time zone NOT NULL,
    "weekEnd" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.weekly_salaries OWNER TO postgres;

--
-- Data for Name: admin_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_actions (id, "adminId", action, "targetType", "targetId", details, "ipAddress", "createdAt") FROM stdin;
1d8cbb22-1cca-4625-b252-657021f72695	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.252.202, 89.222.123.193	2026-09-25 11:50:53.467
56f42f37-5a2a-40a6-a740-b4d29d92c9e6	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	ea9b62f6-cba7-4a87-ba26-954fb933b6a2	\N	94.47.252.202, 89.222.123.193	2026-09-25 11:51:15.537
41b9a7f0-48ff-4157-b5d2-ac02d91cb3c0	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	538e7d3c-6dba-411c-8d1e-276b8b6b9dc6	{"title":"شراء","endsAt":"2026-09-25T12:51:35.844Z"}	\N	2026-09-25 11:51:35.849
22bd319e-74f4-4991-9821-7f843ddf8177	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 89.222.123.193	2026-09-26 07:54:47.42
57f4ddcd-0ba7-44f3-a86c-93cbe91bf479	2fe13236-701f-4faa-9315-d0a132362bb9	delete_user	user	ea9b62f6-cba7-4a87-ba26-954fb933b6a2	{"email":"osamaforit@gmail.com","username":"Osama"}	191.44.127.2, 212.102.36.193	2026-09-26 08:25:59.701
492b1fd8-2ee6-4f9f-a1ad-c89ccec136f3	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 212.102.36.194	2026-09-26 10:19:58.897
760f2b36-9bec-49b7-b5b3-7b1668ba3aaf	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 212.102.36.194	2026-09-26 10:20:21.095
3b32dec2-4a00-45c7-9398-a9087699f36e	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.13.166	2026-09-26 10:34:26.349
ded8a7ff-10e2-49c4-bd9f-e4a40c8a014c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.12.242	2026-09-26 11:24:23.684
4b81747e-4812-44c5-aade-298bd488ab48	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	9cb9d2d9-dfd2-40e8-8c93-3c72462b19ef	{"amount":100,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4"}	201.4.71.13, 212.102.36.194	2026-09-26 11:27:43.023
48da3cfa-a712-4022-963b-35fdefc65adf	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.13.166	2026-09-26 14:13:02.509
a41d544b-5ac2-4752-95d4-9e5845ee349f	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":100,"lockedBalance":0,"totalProfit":0},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":false,"withdrawableBalance":0,"availableBalance":100,"lockedBalance":0,"totalValue":100,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":0,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-26T12:15:54.880Z"}}	201.4.71.13, 152.233.13.166	2026-09-26 14:13:35.255
c602bbb5-0aea-42ef-a0cb-348210bc2bc8	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	{"updates":{"fullName":"عمر  العنزي","email":"alhlwsh6@gmail.com","username":"A5xzii","accountLevel":0,"isVerified":true,"availableBalance":0,"lockedBalance":0,"totalProfit":0},"before":{"id":"36ccfffd-1e41-46c7-bf81-5a8d0451bd30","email":"alhlwsh6@gmail.com","username":"A5xzii","password":"$2b$10$EZ9r4VOwXh2U9OSJzYE8KuFOZBYJB9wV5USdqN2Cu5FQItY1o0rBO","fullName":"عمر  العنزي","accountLevel":0,"referralCount":0,"referralCode":"AURA-NXRWT8","referredBy":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","isVerified":false,"withdrawableBalance":0,"availableBalance":0,"lockedBalance":0,"totalValue":0,"totalDeposited":0,"totalWithdrawn":0,"totalProfit":0,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":0,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T12:15:54.848Z","updatedAt":"2026-09-26T12:15:54.856Z"}}	201.4.71.13, 152.233.13.166	2026-09-26 14:14:16.08
a8c01cbd-c5d9-4fc7-9850-a05cf2abc9c2	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.13.166	2026-09-26 14:14:29.406
31066f67-40c9-49d4-895f-2fb4a5bd3f99	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	{"updates":{"fullName":"عمر  العنزي","email":"alhlwsh6@gmail.com","username":"A5xzii","accountLevel":0,"isVerified":true,"availableBalance":0,"lockedBalance":0,"totalProfit":0},"before":{"id":"36ccfffd-1e41-46c7-bf81-5a8d0451bd30","email":"alhlwsh6@gmail.com","username":"A5xzii","password":"$2b$10$EZ9r4VOwXh2U9OSJzYE8KuFOZBYJB9wV5USdqN2Cu5FQItY1o0rBO","fullName":"عمر  العنزي","accountLevel":0,"referralCount":0,"referralCode":"AURA-NXRWT8","referredBy":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","isVerified":true,"withdrawableBalance":0,"availableBalance":0,"lockedBalance":0,"totalValue":0,"totalDeposited":0,"totalWithdrawn":0,"totalProfit":0,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":0,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T12:15:54.848Z","updatedAt":"2026-09-26T14:14:16.076Z"}}	201.4.71.13, 152.233.13.166	2026-09-26 14:14:54.813
e5f89aff-99ba-4c15-ba9d-3bb79d8ebf4c	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":100,"lockedBalance":0,"totalProfit":150},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":0,"availableBalance":100,"lockedBalance":0,"totalValue":100,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":0,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-26T14:13:35.252Z"}}	201.4.71.13, 152.233.13.166	2026-09-26 14:15:20.386
eb17f451-4b0f-4a21-9fbc-db2622236d57	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":250,"lockedBalance":100,"totalProfit":150},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":0,"availableBalance":250,"lockedBalance":0,"totalValue":250,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":150,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-26T14:15:20.384Z"}}	201.4.71.13, 89.222.123.194	2026-09-26 14:16:37.79
7e4fc399-7633-471f-b6b6-b18960233169	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 89.222.123.194	2026-09-26 14:17:16.173
d30d6b8e-e9ec-4f4a-8ecf-7f54f38e40f0	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.12.245	2026-09-26 19:57:12.351
50d597f0-1912-4aa5-81b6-7c36cdcac048	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	05af3a8c-29cc-42bb-923d-e661d3c63860	{"amount":100,"userId":"555f4616-37a0-4d17-a4e6-d58d3a4c1d04","referralActivated":true,"referralCount":1,"referralTier":"STARTER"}	129.224.207.240, 152.233.12.241	2026-09-26 19:57:49.423
292abde1-b3ef-46bc-aa8a-5baa6c97a3ff	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	{"updates":{"fullName":"مهند عايد المحمد","email":"mohandeeee64@gmail.com","username":"dgot","accountLevel":0,"isVerified":true,"availableBalance":100,"lockedBalance":0,"totalProfit":0},"before":{"id":"555f4616-37a0-4d17-a4e6-d58d3a4c1d04","email":"mohandeeee64@gmail.com","username":"dgot","password":"$2b$10$eca9N3WHx2Nx2LiBjAoJ5.4d00gLYeN3HttAtEkQAf8sTCwe9grVC","fullName":"مهند عايد المحمد","accountLevel":0,"referralCount":0,"referralCode":"AURA-QDTLSZ","referredBy":"02de29c4-69e7-4a30-9119-dd38ffc662aa","isVerified":false,"withdrawableBalance":0,"availableBalance":100,"lockedBalance":0,"totalValue":100,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":0,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":0,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T19:52:25.304Z","updatedAt":"2026-09-26T19:57:49.421Z"}}	129.224.207.240, 152.233.12.241	2026-09-26 19:59:17.358
3791db7a-9048-4620-acff-b0d674223ab7	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	82a5a5e1-1ac2-40c4-a65f-5b319810d9c2	{"title":"شراء سهم AlDlVN","endsAt":"2026-09-26T21:02:42.909Z"}	\N	2026-09-26 20:02:42.912
e4cf56ba-8713-4c53-9656-c5b6872e5f80	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.194	2026-09-27 06:32:01.598
e5bdfb40-e888-4c25-8d77-affca0a0d054	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	89.39.107.200, 152.233.12.241	2026-09-27 06:34:19.761
c74dd37f-2fc2-4dfa-b21e-8d2fb82a8ae5	2fe13236-701f-4faa-9315-d0a132362bb9	reject_deposit	transaction	bca33b91-45c2-4bf0-ad07-752f22b7b868	{"amount":300}	191.44.127.2, 212.102.36.194	2026-09-27 06:35:49.578
c313090b-11d7-4fc1-91b2-6d13064b76b3	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.233, 89.222.123.193	2026-09-27 06:43:27.796
dc9265fb-4b3c-4fc2-af9b-a23b277f6394	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.194	2026-09-27 06:48:20.971
c87a2cf0-124c-4309-9896-ff1f02411663	2fe13236-701f-4faa-9315-d0a132362bb9	reject_verification	user	1108910e-6177-4d20-8f9d-a0cf7e3d5026	{}	94.47.248.233, 89.222.123.193	2026-09-27 06:48:34.4
06c232a1-6615-4b49-ba57-5b9caef54cff	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 152.233.12.241	2026-09-27 08:22:08.299
533af10f-274c-47a6-ab15-9971461b44d9	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 152.233.13.165	2026-09-27 08:23:23.941
23409b0a-9469-4063-9720-12eaa7de26ab	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 89.222.123.194	2026-09-27 09:42:27.837
a1c0f86c-f5ba-4629-b21f-86d3ef7a9417	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 152.233.12.242	2026-09-27 10:23:21.377
a4359c12-65d6-4e4d-b414-f443d2fcb3af	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 89.222.123.193	2026-09-27 10:25:43.675
0eb4bf6a-5394-47c9-bf6f-4e5eb621b62e	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	\N	191.44.127.2, 89.222.123.193	2026-09-27 10:27:37.155
ae80bbb0-3475-47cc-9606-d015f08a6984	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.193	2026-09-27 11:47:44.271
67e1020e-12cb-4a55-a389-2423d5af8998	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	\N	191.44.127.2, 212.102.36.193	2026-09-27 11:51:09.623
8976c1c9-8e2a-4427-946f-6e7ad647bb26	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.13.166	2026-09-27 12:25:58.567
71c68416-91bd-4ca4-a2f3-3bc26dde5efc	2fe13236-701f-4faa-9315-d0a132362bb9	reject_deposit	transaction	4233aab7-f672-4fd9-8575-fba8351cf399	{"amount":200}	201.4.71.13, 152.233.13.166	2026-09-27 12:26:19.6
5daebd24-85c3-4847-8d19-afaf7a685a31	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":500,"lockedBalance":100,"totalProfit":500},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":0,"availableBalance":150,"lockedBalance":100,"totalValue":250,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":150,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-27T10:27:37.097Z"}}	201.4.71.13, 152.233.13.166	2026-09-27 12:28:31.612
f4995811-567c-4765-832f-a31a916615ce	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	215248fe-0927-4244-beda-f2a7fd1c4d37	{"title":"شراء سهم VGKB","endsAt":"2026-09-27T13:30:48.997Z"}	\N	2026-09-27 12:30:49.002
d7a240fb-66ff-4733-bff6-99826ed37726	2fe13236-701f-4faa-9315-d0a132362bb9	end_mission	mission	215248fe-0927-4244-beda-f2a7fd1c4d37	{"title":"شراء سهم VGKB"}	\N	2026-09-27 12:42:12.741
03b73068-9dc0-4506-85ef-271f95e9aba6	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.233, 212.102.36.194	2026-09-27 14:39:20.989
2b1a3157-345e-4220-b807-b3821faca646	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	bb485f4c-fc9e-4900-ae36-0e89c8663b40	\N	94.47.248.233, 212.102.36.194	2026-09-27 14:40:21.154
0b2b1ee9-b5f2-456c-932d-4511bd8ec407	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.194	2026-09-27 15:30:17.143
6fb26a50-c8a2-4065-8c29-043df212cef3	2fe13236-701f-4faa-9315-d0a132362bb9	delete_user	user	c556a3ac-9185-490e-8a60-c69e3d832ebe	{"email":"osamadsa130@gmail.com","username":"Osama"}	191.44.127.2, 152.233.13.164	2026-09-27 15:31:43.633
3ea66083-8e3e-4b3a-9107-ed4262d5ae2c	2fe13236-701f-4faa-9315-d0a132362bb9	delete_user	user	bb485f4c-fc9e-4900-ae36-0e89c8663b40	{"email":"osamaforit@gmail.com","username":"Nan"}	191.44.127.2, 152.233.13.164	2026-09-27 15:32:52.525
0afe7893-d5e5-4427-85f2-235e9392d3eb	2fe13236-701f-4faa-9315-d0a132362bb9	delete_user	user	1108910e-6177-4d20-8f9d-a0cf7e3d5026	{"email":"darwinmark337@gmail.com","username":"darwin"}	191.44.127.2, 152.233.13.164	2026-09-27 15:33:31.171
4c620126-e1a0-46ae-b13a-ada826231a32	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 89.222.123.194	2026-09-27 20:42:25.053
ee9788f6-d1e6-4c64-9c10-69978576847f	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.183, 89.222.123.193	2026-09-29 13:47:07.591
7b0cc019-ce44-4d08-875b-1bfa170efaa0	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	a83aae85-2dcd-4d27-9912-0d639ca09f37	{"title":"شراء سهم GKTD","endsAt":"2026-09-27T21:43:19.229Z"}	\N	2026-09-27 20:43:19.236
48699c59-0749-4843-baff-f83b0fdb44a6	2fe13236-701f-4faa-9315-d0a132362bb9	end_mission	mission	a83aae85-2dcd-4d27-9912-0d639ca09f37	{"title":"شراء سهم GKTD"}	\N	2026-09-27 20:44:18.43
cc5b6006-07ea-45ae-9110-2a9bb824a513	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 212.102.36.193	2026-09-28 12:41:52.083
ce18010a-b09a-492e-b4fb-054930371457	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	02de29c4-69e7-4a30-9119-dd38ffc662aa	{"updates":{"fullName":"انا","email":"majid2005225@gmail.com","username":"vdivjbd","accountLevel":0,"isVerified":true,"availableBalance":0,"lockedBalance":0,"totalProfit":0},"before":{"id":"02de29c4-69e7-4a30-9119-dd38ffc662aa","email":"majid2005225@gmail.com","username":"vdivjbd","password":"$2b$10$I2A1Ok01H0pUXjhwI9afl.ISAkQQgkjawJsqUlFTuRQ68qFlTFx02","fullName":"انا","accountLevel":0,"referralCount":1,"referralCode":"AURA-4PWNG8","referredBy":null,"isVerified":false,"withdrawableBalance":0,"availableBalance":0,"lockedBalance":0,"totalValue":0,"totalDeposited":0,"totalWithdrawn":0,"totalProfit":0,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T19:38:54.224Z","updatedAt":"2026-09-26T19:57:49.413Z"}}	201.4.71.13, 89.222.123.194	2026-09-28 12:42:15.639
5d814ea9-a451-46d2-9565-d33ff0f8a7ff	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 212.102.36.193	2026-09-28 13:01:18.474
f7e4f52d-ba32-446d-b2b8-5c886ac412af	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 89.222.123.193	2026-09-28 13:24:46.546
b2580631-402d-4bc6-a735-933bc537260b	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 89.222.123.194	2026-09-28 14:14:23.127
58964552-e77c-4444-8139-4a7697f32183	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.233, 89.222.123.194	2026-09-28 14:36:35.584
f2fb7bad-20e4-4d37-be2a-f59b26651ba9	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 89.222.123.193	2026-09-28 15:56:57.372
60d6e6d8-9bc2-4859-a182-9a04afc341f1	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.193	2026-09-28 16:54:35.671
4e9e86be-7eb7-4daf-a44a-825bec5bc608	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.13.164	2026-09-28 18:58:03.734
9941b613-83ca-4d02-90a6-e8a3aaabb43b	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.193	2026-09-28 22:26:10.438
e41be68d-3b5a-413f-ab2f-d44cb056448a	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":1,"isVerified":true,"availableBalance":502,"lockedBalance":50,"totalProfit":1023},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":502,"lockedBalance":100,"totalValue":600,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":502,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-27T12:31:08.016Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:43:10.634
23a883ba-6e37-4a0c-913e-25fdbe16db08	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":1,"isVerified":true,"availableBalance":100,"lockedBalance":50,"totalProfit":1023},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":1,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":1073,"lockedBalance":50,"totalValue":1123,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":1023,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-28T22:43:10.631Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:44:38.072
efc6d67a-466a-4f84-8055-f24979fcdc02	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":1,"lockedBalance":1,"totalProfit":10023},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":1,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":1073,"lockedBalance":50,"totalValue":1123,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":1023,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-28T22:44:38.069Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:46:50.72
4b87d0c4-7253-4485-b201-e1ccf6c89dcc	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":100,"lockedBalance":5,"totalProfit":5},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":10122,"lockedBalance":1,"totalValue":10123,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":10023,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-28T22:46:50.718Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:47:45.552
e94bfd9e-0aa7-4d57-83c8-407d84ed5749	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	b1ff47f4-ce3f-433f-a2ee-4ddb01e54a57	{"amount":100,"userId":"606d790f-e7db-477d-977f-6ceeeaa0d0ec","referralActivated":false,"referralCount":null,"referralTier":null}	94.47.248.183, 89.222.123.193	2026-09-29 13:47:18.05
7f6f238a-e8da-41de-bca3-768e5517efce	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.183, 89.222.123.193	2026-09-29 13:47:58.643
31b7ae97-da81-4939-b2a7-bb21fc67d573	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":500,"lockedBalance":5,"totalProfit":1276},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":100,"lockedBalance":5,"totalValue":105,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":5,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-28T22:47:45.550Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:48:48.87
72913ecf-1c20-446f-b360-1f8a938b3a3c	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":500,"lockedBalance":5,"totalProfit":1276},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":1371,"lockedBalance":5,"totalValue":1376,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":1276,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-28T22:48:48.868Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:49:20.935
0af93790-287d-45bd-aeac-aeaa7a6d810c	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":500,"lockedBalance":5,"totalProfit":1276},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":1371,"lockedBalance":5,"totalValue":1376,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":1276,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-28T22:49:20.933Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:49:44.429
bd534139-2110-49dc-8f61-82ff453d892d	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":100,"lockedBalance":5,"totalProfit":5},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":1,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":2,"availableBalance":1371,"lockedBalance":5,"totalValue":1376,"totalDeposited":100,"totalWithdrawn":0,"totalProfit":1276,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":1,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-09-28T22:49:44.428Z"}}	191.44.127.2, 212.102.36.193	2026-09-28 22:50:16.598
aae7db0a-10ab-47e2-8cb5-559f6368fb3c	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	764acc2b-e4a1-4a42-ba8c-a9d57d641b88	{"amount":500,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","referralActivated":false,"referralCount":null,"referralTier":null}	191.44.127.2, 212.102.36.193	2026-09-28 22:50:41.94
b96b1b97-142f-4001-bb97-7cbfc04322c8	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	d56d70bb-d1ea-494b-87b1-7bb293723471	{"title":"شراء سهم FJBT","endsAt":"2026-09-28T23:51:25.303Z"}	\N	2026-09-28 22:51:25.309
e393effe-e885-42f3-b96a-28c74c395a51	2fe13236-701f-4faa-9315-d0a132362bb9	end_mission	mission	d56d70bb-d1ea-494b-87b1-7bb293723471	{"title":"شراء سهم FJBT"}	\N	2026-09-28 22:53:05.484
757b12ea-2d59-484e-8142-5a404e4c619c	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	27937bfe-f8cb-4b59-9110-eb04770fa2e7	{"title":"شراء سهم VSAJ","endsAt":"2026-09-28T23:53:20.982Z"}	\N	2026-09-28 22:53:20.984
ff598db3-83ff-4bdf-9080-59f998da2a08	2fe13236-701f-4faa-9315-d0a132362bb9	end_mission	mission	27937bfe-f8cb-4b59-9110-eb04770fa2e7	{"title":"شراء سهم VSAJ"}	\N	2026-09-28 22:54:45.5
d26a2dc4-db60-48cc-8e09-5ae00d24b5d4	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	c26645eb-4928-40e8-a430-64d25ae803c8	{"title":"fgnky","endsAt":"2026-09-28T23:54:54.064Z"}	\N	2026-09-28 22:54:54.067
c229ddf2-95fe-43f4-8ba7-8c1872e8e5d3	2fe13236-701f-4faa-9315-d0a132362bb9	end_mission	mission	c26645eb-4928-40e8-a430-64d25ae803c8	{"title":"fgnky"}	\N	2026-09-28 22:56:07.174
cb09a68c-4243-46a1-85c2-5a8de97cf38f	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	d37cc25e-922f-4854-863e-dedf79010438	{"amount":60,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4"}	191.44.127.2, 89.222.123.194	2026-09-28 22:58:27.848
563c52f2-e22c-42c6-9e10-0d533e4cdcac	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	51.38.124.66, 152.233.12.245	2026-09-29 10:28:42.351
12cb137b-0b38-4fd6-ae0c-9a787dc92e0d	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	eec62280-9eb6-405d-bfe3-bddd97f3351e	{"amount":50,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4"}	51.38.124.66, 152.233.12.245	2026-09-29 10:28:59.716
27ba4f18-6cac-4cac-85b4-2d246e2242ba	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	89.47.234.229, 79.127.177.113	2026-09-29 12:42:49.645
72f4d4f0-b2e3-4a87-aa95-7e7ed9d41dc9	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	4900e249-21a1-4050-a88a-17ddcc726e95	{"title":"mnmnmn","endsAt":"2026-09-29T13:43:23.339Z"}	\N	2026-09-29 12:43:23.347
113175e1-c573-4695-9f0f-b6efb5dde8bf	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	761f1ba1-58e0-4f54-9daa-3c1d03525793	{"amount":1000,"userId":"3fe9376c-8a8b-4a4a-b197-9d1e70901b25","referralActivated":false,"referralCount":null,"referralTier":null}	89.47.234.229, 79.127.177.113	2026-09-29 12:43:52.62
effa9f20-e77a-4235-85ad-8d4614137671	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	7e080e4f-09f2-426d-abb8-7b016738e794	{"amount":200,"userId":"3fe9376c-8a8b-4a4a-b197-9d1e70901b25","referralActivated":false,"referralCount":null,"referralTier":null}	89.47.234.229, 79.127.177.113	2026-09-29 12:59:12.192
7bfdf460-7b78-4339-9850-9d0820c040a8	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	0635ff0d-6e42-4b68-98a5-98f150ce2a03	{"title":"Gg","endsAt":"2026-09-29T14:48:12.017Z"}	\N	2026-09-29 13:48:12.025
57aa5204-8fa9-4838-a157-8fad1baf3ca6	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.183, 89.222.123.193	2026-09-29 13:49:32.983
0846b577-4756-469c-8950-186eea7fec2a	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.183, 89.222.123.193	2026-09-29 13:49:44.317
640807c2-289e-4b5e-bedb-6541e8dbeaf0	2fe13236-701f-4faa-9315-d0a132362bb9	end_mission	mission	0635ff0d-6e42-4b68-98a5-98f150ce2a03	{"title":"Gg"}	\N	2026-09-29 13:49:51.208
404067c7-2622-46c5-9391-68dc6e05d285	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	1e1bb8df-aeb4-438b-8dac-762db9af6757	{"title":"Gh","endsAt":"2026-09-29T14:49:56.626Z"}	\N	2026-09-29 13:49:56.63
00a583c5-30cd-4a71-8e59-671b2dbd2860	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	606d790f-e7db-477d-977f-6ceeeaa0d0ec	\N	94.47.248.183, 89.222.123.193	2026-09-29 13:51:52.784
083f0ea5-9c92-4bcf-bfdd-64c85799dbe9	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.183, 89.222.123.193	2026-09-29 13:52:37.022
f02b670a-b322-40da-9a7c-99be68e01cb3	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	d582fddb-47cf-4377-b3a0-71ee15f6ebdc	{"amount":1000,"userId":"606d790f-e7db-477d-977f-6ceeeaa0d0ec","referralActivated":false,"referralCount":null,"referralTier":null}	94.47.248.183, 89.222.123.193	2026-09-29 13:52:44.288
ab2d63b9-cf3a-43f0-8ec2-c1ab9d65b220	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.248.183, 89.222.123.193	2026-09-29 13:54:17.115
c7745bc7-f7d2-44ee-8228-7142b947427b	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	3ba164a5-a567-452c-b0c8-4c076f605fe8	{"amount":39,"userId":"606d790f-e7db-477d-977f-6ceeeaa0d0ec"}	94.47.248.183, 89.222.123.193	2026-09-29 13:54:24.769
54be633f-d17a-425f-a353-87b8fdbefbfc	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	45.149.24.18, 152.233.13.165	2026-09-29 16:17:12.585
22a05a9a-9076-41e5-a75b-a3f490adf19c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	45.149.24.18, 152.233.13.164	2026-09-29 16:20:34.247
60778417-4db9-437d-9532-bd83f8d8b02b	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	45.149.24.18, 212.102.36.194	2026-09-29 16:23:26.575
e473911b-f1a6-4e44-a73b-44b5d1839b2c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	45.149.24.18, 89.222.123.193	2026-09-29 17:49:24.199
3adb2417-4db6-4f73-b88e-ea607b6e1983	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	003cb43d-ce1e-43ff-ba6c-86ca6a7d2310	\N	45.149.24.18, 89.222.123.193	2026-09-29 17:52:56.982
9c2b49ce-e2a1-489b-a975-0376d40d6206	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	45.149.24.18, 89.222.123.193	2026-09-29 17:58:11.551
6348d569-efbe-4acc-b587-c379828cc910	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 152.233.12.241	2026-09-29 22:46:40.452
4addaeda-9e7e-422a-8950-27ebcb2cb7bc	2fe13236-701f-4faa-9315-d0a132362bb9	reject_verification	user	c556a3ac-9185-490e-8a60-c69e3d832ebe	{}	191.44.127.7, 89.222.123.194	2026-09-29 22:48:02.762
c7e79c1a-a47e-4355-a0ae-252cc28554f3	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	\N	191.44.127.7, 89.222.123.194	2026-09-29 22:48:25.604
0e82d555-dad1-41e3-a9d5-3afd585f9dca	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	1de0acc9-47c8-4707-ad36-b1a045473477	{"amount":61,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4"}	191.44.127.7, 89.222.123.194	2026-09-29 22:49:45.784
8ebc1155-5523-4c7e-9d8d-8174194e952c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 152.233.13.166	2026-09-30 23:34:28.419
6d9bb52b-7922-488d-bca4-3b3ce6a1be77	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	93.88.156.62, 152.233.12.245	2026-10-01 06:05:48.414
649fd1f4-91cb-4b63-a672-deef5bea691a	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.254.100, 212.102.36.193	2026-10-01 17:08:03.296
feaac092-5cd2-443a-9e4c-e925d30102e1	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	129.224.207.216, 152.233.13.165	2026-10-01 17:29:18.302
01dbbdfd-40c4-432e-9373-9cabb6754a67	2fe13236-701f-4faa-9315-d0a132362bb9	delete_user	user	606d790f-e7db-477d-977f-6ceeeaa0d0ec	{"email":"darwinmark337@gmail.com","username":"Suzan"}	129.224.207.216, 152.233.13.165	2026-10-01 17:29:48.528
1f8a0594-0c0c-4946-bb0d-f9ba877a6b1c	2fe13236-701f-4faa-9315-d0a132362bb9	delete_user	user	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	{"email":"osamadsa130@gmail.com","username":"Osama"}	129.224.207.216, 152.233.13.165	2026-10-01 17:30:02.774
251cf069-885f-473c-a12a-2120dd289af9	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	129.224.207.216, 152.233.13.166	2026-10-01 18:42:36.807
f61fdfb6-6f7b-4d12-b0ff-d6881c19fe75	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	7103cc14-77a0-494d-9fc4-570285f45c84	\N	129.224.207.216, 152.233.13.166	2026-10-01 18:43:21.715
8d6c6c6a-ae53-4bac-ae25-4b4ad3ffb6ed	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	129.224.207.216, 152.233.13.166	2026-10-01 19:01:22.042
b3b6fec3-90c2-4ef7-a6bb-034cb076cad2	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.13.166	2026-10-01 19:28:58.328
fd39b4c2-c86e-45ba-a56d-0399c551c80d	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	129.224.207.216, 152.233.13.166	2026-10-01 19:43:52.478
cd98d32d-be02-441a-8ab8-0c36813ac584	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.13.166	2026-10-02 14:05:54.295
7d7be89e-ea0b-424e-94e2-7740eded5aa6	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.194	2026-10-02 16:52:10.796
4a938ad5-56c8-4a51-b2ae-6c529053066e	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 89.222.123.194	2026-10-02 19:18:29.627
036303e7-2c19-40c4-b5ee-e80dc05e9c8b	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	4e351b76-af96-4067-afdc-600288f3605a	\N	201.4.71.221, 89.222.123.194	2026-10-02 19:21:00.438
947333cd-2237-4921-8e0b-dd1e4f7a077c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 212.102.36.194	2026-10-03 16:06:02.507
9d6836b8-3ff6-4f11-b3df-fee06972e2db	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.193	2026-10-03 18:21:30.789
b8217660-0d0e-4ac8-9bbe-c82d1f746f91	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 89.222.123.194	2026-10-03 22:44:48.673
c1a3db53-b009-4486-9a9e-93f412c8df6d	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.251.172, 89.222.123.194	2026-10-04 06:58:02.84
97853ed1-57cd-438f-a38d-d3e34c372af1	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.251.172, 89.222.123.194	2026-10-04 07:04:39.114
ab05099e-0b80-4f98-bc37-26cdb20a9e18	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	016dddc4-d1ab-402e-90b1-536ccd90d807	\N	94.47.251.172, 89.222.123.194	2026-10-04 07:04:51.181
63b20177-fbc3-4f54-9975-50f1eb43bbb4	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.13.166	2026-10-04 12:07:05.106
45d9043b-75eb-4344-bef1-a9bc53728f35	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.194	2026-10-04 12:48:40.047
efaf2073-9cd9-46e3-85ea-d4873bff2d9a	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	d9aeedfe-2467-4f82-8444-66a684323c54	\N	191.44.127.2, 212.102.36.194	2026-10-04 12:49:22.033
af9c2849-33dc-4066-8eca-878d776871e3	2fe13236-701f-4faa-9315-d0a132362bb9	reject_deposit	transaction	6a3acd5c-66a7-4d8f-ab84-8fa98b54d0f4	{"amount":60}	201.4.71.221, 212.102.36.193	2026-10-04 13:11:17.159
a86e6107-833f-4293-88c4-32f4f33ef215	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 212.102.36.193	2026-10-04 18:14:41.853
6b79e7c5-3ef0-4337-b3a6-3f09bdb5d07c	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	46b31d93-cf20-4e3f-949d-4c03c581050b	{"amount":500,"userId":"36ccfffd-1e41-46c7-bf81-5a8d0451bd30","referralActivated":true,"referralCount":2,"referralTier":"STARTER"}	191.44.127.7, 152.233.12.245	2026-10-04 18:32:47.607
2f294926-5930-4f84-a8a7-e6ea615ba6f8	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	f0c8a3ef-763c-4ac0-9e4d-62601b4df667	{"title":"شراء سهم AKRM","endsAt":"2026-10-04T19:33:27.067Z"}	\N	2026-10-04 18:33:27.073
eeeae14f-e188-4502-8dd6-965de3bb2875	2fe13236-701f-4faa-9315-d0a132362bb9	end_mission	mission	f0c8a3ef-763c-4ac0-9e4d-62601b4df667	{"title":"شراء سهم AKRM"}	\N	2026-10-04 18:33:52.102
24fd4594-07fe-4eb8-911b-f06fdd4777e1	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 152.233.13.166	2026-10-04 19:49:01.633
2423f5a6-02d5-41e0-9658-c4afc77a9c0a	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 89.222.123.193	2026-10-04 20:06:03.863
d38c60f4-c0fc-4f8a-b194-28d41aceb2a5	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 89.222.123.194	2026-10-04 20:10:25.991
6b8dbac5-b356-4a62-9cc7-0694bec5519d	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 212.102.36.193	2026-10-04 20:13:55.986
74893beb-ea7c-4510-94c5-37338ebf5862	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 212.102.36.194	2026-10-04 22:46:01.628
5a667f70-11ad-4429-abd3-a5b74420076c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.252.241, 89.222.123.193	2026-10-05 07:45:31.551
b4962c82-4dcd-4c08-ba3d-3f9164bcb1a1	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 212.102.36.193	2026-10-05 07:46:34.816
6369e200-95d4-4a91-b6e0-2dbfb5c8bb33	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 152.233.13.165	2026-10-05 09:20:17.977
19e6fba2-8021-4c7b-b719-988a6b1b592e	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.7, 212.102.36.193	2026-10-05 09:31:01.635
43a2bbb1-5922-4534-a151-7ae8ad6ebe08	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.193	2026-10-05 14:53:07.727
44e8873f-a4dc-46b4-9c07-83f5a653df81	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.194	2026-10-05 16:00:09.862
f78ac5c3-e7f5-413d-ac87-80bbc1e3c081	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.40.1	2026-10-05 18:49:57.637
51652af0-9d5c-4b71-aeab-494bf7393471	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 152.233.40.1	2026-10-05 19:55:48.922
a9184ecb-421f-41c0-8bb0-23a9c47debea	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	9067689f-eacd-469f-9750-01dcf7b56639	\N	191.44.127.2, 152.233.40.2	2026-10-05 19:57:04.391
91654215-560b-4cc2-a8e4-33896c48f9e4	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 212.102.36.193	2026-10-05 20:06:25.933
19302318-d161-43d2-8e9d-c72e2f7c9ebf	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 89.222.123.193	2026-10-05 20:23:31.553
f2ebe0ab-9d48-4bb3-af4d-0608092c54e1	2fe13236-701f-4faa-9315-d0a132362bb9	reject_deposit	transaction	da5238b8-21ba-4ef8-9b0d-66d45feac87c	{"amount":60}	191.44.127.2, 212.102.36.193	2026-10-05 21:53:15.287
ea42465b-3caf-40b7-8a9a-38ec958b2935	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 89.222.123.194	2026-10-06 08:14:51.158
88ca3843-3268-4b54-81d9-c1f54f2cd4f4	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 212.102.36.193	2026-10-06 09:50:37.993
89105460-dbc9-47d4-841e-16f17bb2bc9f	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	095ecc95-41a7-43b6-a263-1886b4c22c9f	\N	201.4.71.221, 212.102.36.193	2026-10-06 09:50:59.721
e75dc342-97cd-4f43-ab51-f7f980e16c98	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.13.165	2026-10-06 10:00:33.457
606f1a95-1ae1-40e1-af7b-0b06d1491e75	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	94ec8984-f9b7-4bb9-a679-257baa1c07bd	{"title":"BTC_USDT","endsAt":"2026-10-06T11:00:46.793Z"}	\N	2026-10-06 10:00:46.798
34efff8c-8310-4a3e-9dde-087833b5f370	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	89.38.97.174, 152.233.12.241	2026-10-06 11:37:46.616
f8e19e5a-e36e-413d-9d8f-c9d8b87c55dc	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	1874ddbe-0885-4216-bd9d-7adae5f742d8	{"amount":100,"userId":"016dddc4-d1ab-402e-90b1-536ccd90d807","referralActivated":false,"referralCount":null,"referralTier":null}	89.38.97.174, 152.233.12.241	2026-10-06 11:38:01.5
2bb381c9-5237-4316-bef1-d3e2b94ec3aa	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	825a51ce-ccb3-4a43-9d22-e66aba39900a	{"title":"osama","endsAt":"2026-10-06T12:40:38.323Z"}	\N	2026-10-06 11:40:38.333
049034e4-07ac-4fcd-8e1f-0f661ed18521	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	191.44.127.2, 152.233.12.241	2026-10-06 13:41:48.799
f18b78d3-2a75-404c-8228-760cc383696d	2fe13236-701f-4faa-9315-d0a132362bb9	reject_deposit	transaction	069bd3f7-b161-4f8a-aff0-5e37326df8ee	{"amount":100}	191.44.127.2, 152.233.12.241	2026-10-06 13:42:20.86
6b5f87d7-b54e-4947-b13e-a8d1d63e71a1	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 89.222.123.194	2026-10-06 14:09:32.518
017bcb5d-ca70-4d76-9d07-d290069f443e	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.13.166	2026-10-06 14:11:10.027
d2f99a4a-c634-488e-a6d3-09d21ff20f72	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	fd9cbf58-a022-4516-8043-a4cf7a6a8ca8	{"amount":100,"userId":"095ecc95-41a7-43b6-a263-1886b4c22c9f","referralActivated":true,"referralCount":3,"referralTier":"STARTER"}	201.4.71.221, 152.233.13.166	2026-10-06 14:11:18.574
6897d5b9-3493-4555-be7a-6953e33e9c6b	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.12.242	2026-10-06 15:34:20.315
2d6293b4-cbf4-448a-8776-4e4e7615a4b8	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 89.222.123.194	2026-10-07 09:39:27.676
52c51447-ab4e-4fc1-b22c-5b757eecb89a	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 89.222.123.194	2026-10-07 09:58:52.272
3477cded-66d1-49ec-a593-26ca95877087	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	e2522a97-d55f-436a-bc5b-669e19b6ebbe	{"title":"BTC_USDT","endsAt":"2026-10-07T11:00:01.600Z"}	\N	2026-10-07 10:00:01.603
01776801-c148-45d5-8359-341c6466a541	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	1f4045d6-b8b4-419e-960d-5f550ab8806e	{"amount":100,"userId":"4e351b76-af96-4067-afdc-600288f3605a","referralActivated":true,"referralCount":4,"referralTier":"STARTER"}	191.44.127.11, 152.233.12.241	2026-10-07 10:07:26.474
0b69b2b6-c970-4d59-ae97-f4c9c64ea838	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.13.164	2026-10-07 12:01:07.235
78efeeed-edb7-475f-99d9-7c25a9fe6cba	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 89.222.123.194	2026-10-07 16:02:21.968
da263335-1d25-4fa0-bb79-fbe2f9f35193	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 212.102.36.193	2026-10-08 09:12:38.832
9cdb4bfd-2c6b-4222-b83c-8db00351f521	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	\N	222.167.236.49, 212.102.36.193	2026-10-08 09:13:02.002
4156a1c8-be8c-4e7e-b2ca-72b8cf8c8f67	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	4a8cb759-1115-4f56-a09f-4513fda12b15	{"amount":100,"userId":"0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc","referralActivated":true,"referralCount":5,"referralTier":"LEVEL1"}	222.167.236.49, 152.233.12.242	2026-10-08 09:14:20.156
90401fa6-6894-47ed-860a-d421fd44da6c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 212.102.36.194	2026-10-08 10:01:41.78
ee207199-923a-4c02-ae84-ea2ba3b6d6bc	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	b8c21a07-80a5-4da0-8813-3a48ba4383ba	{"title":"BTC_USDT","endsAt":"2026-10-08T11:01:55.233Z"}	\N	2026-10-08 10:01:55.236
05e3119d-76f7-4079-b5b0-13411a377077	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.12.241	2026-10-08 10:53:12.927
d6fab455-dcef-4c8e-990c-132bb059a4f7	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 152.233.13.164	2026-10-09 10:57:24.097
bfbdd7e2-aa01-4690-a5ff-84c096350a76	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	5ec7fc06-8f18-4575-9b5f-3ffa6795665a	{"title":"BTC_USDT","endsAt":"2026-10-09T12:00:02.347Z"}	\N	2026-10-09 11:00:02.352
49458977-deae-4a11-aead-f20da76d200a	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 152.233.12.241	2026-10-09 16:36:34.655
5937800a-a04f-4b24-9d2a-148534433c15	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 152.233.13.164	2026-10-10 09:57:59.624
aa8a6922-b5a0-4046-98db-b6b5dbb948cf	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	6ab9ff9d-3847-466a-8a70-bddf5a164303	{"title":"BTC_USDT","endsAt":"2026-10-10T11:00:00.969Z"}	\N	2026-10-10 10:00:00.973
44e562d9-ada2-410b-9d77-cf4bf1e4c66c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	91.144.20.75, 79.127.178.81	2026-10-10 10:16:29.04
4830f039-91b7-4c22-a444-7e48faa6fda1	2fe13236-701f-4faa-9315-d0a132362bb9	change_admin_password	\N	\N	\N	\N	2026-10-10 10:25:38.843
8f1e4dad-03d6-4e9c-a85a-f2576c0cb2c8	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	89.238.156.195, 79.127.177.113	2026-10-10 10:25:56.184
435268f4-461f-42e2-a480-6194a662dac3	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.255.70, 152.233.12.245	2026-10-12 09:04:38.395
5c7484d6-4410-41c4-8d72-77f6a70f3843	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 89.222.123.194	2026-10-12 09:08:12.189
9da77023-a410-4927-9bed-aadec5a680ac	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	a370ba7d-b6c1-4529-a1be-fdd8e1da7fdd	{"title":"BTC_USDT","endsAt":"2026-10-12T11:01:04.642Z"}	\N	2026-10-12 10:01:04.645
e7976877-7b76-4f4f-ba5c-ab68417e365b	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.221, 212.102.36.194	2026-10-13 10:02:20.484
04a5c4b6-a3a4-434b-ab6f-1de450c6150c	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	15811c25-4a2d-4b2f-8c9a-a7174197f185	{"title":"BTC_USDT","endsAt":"2026-10-13T11:02:29.877Z"}	\N	2026-10-13 10:02:29.882
83550d71-3d00-439b-a2ef-0604e8308059	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 212.102.36.193	2026-10-14 10:07:00.333
6b0e2ff0-aa42-4230-9428-457a46b3323a	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	e7ac1796-e9e8-49f9-9a17-868a44154375	{"title":"BTC_USDT","endsAt":"2026-10-14T11:07:09.640Z"}	\N	2026-10-14 10:07:09.655
e77113a4-4e9b-485c-a595-1f9e5e5a2daf	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	178.52.192.192, 79.127.178.82	2026-10-14 19:49:03.506
f0656d6b-eba9-42d0-b4d4-448272ec1b50	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 89.222.123.194	2026-10-15 08:54:42.496
109c0b02-9b78-45be-aae4-5ecc0dbc0bc6	2fe13236-701f-4faa-9315-d0a132362bb9	reject_verification	user	df7d86f3-9359-4464-9b32-4d34a7b8a688	{}	94.252.215.66, 212.102.36.194	2026-10-15 08:55:17.045
bbdc81a2-0bf7-4d38-97fa-eb6d591e4d28	2fe13236-701f-4faa-9315-d0a132362bb9	reject_deposit	transaction	a7044b8f-79df-4a5d-8661-1218ce0eb803	{"amount":60}	94.252.215.66, 212.102.36.194	2026-10-15 09:57:35.99
8bf6918b-5ad2-4319-b553-2f95a1651a27	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	b7538c43-73f4-4ab6-8bb3-af0ef8d65a49	{"title":"BTC_USDT","endsAt":"2026-10-15T11:00:02.322Z"}	\N	2026-10-15 10:00:02.331
7a61d3a3-a451-417b-a957-785770a3ac9c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 212.102.36.194	2026-10-15 13:50:44.88
96a7599d-8d5a-4080-8b83-95f9cc5df15b	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	bef59b09-59a0-4a3a-a7c4-acb245f11e37	{"amount":170,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4"}	94.252.215.66, 212.102.36.194	2026-10-15 13:50:53.633
8e2beeac-5dbd-4020-b7a4-9bbe5c1ea61e	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 212.102.36.194	2026-10-15 18:09:49.672
68830413-b638-4370-adce-0b50caaa4be8	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	39482d13-9b34-4b8a-ade4-18f453675c06	{"amount":10000,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","referralActivated":false,"referralCount":null,"referralTier":null}	94.252.215.66, 212.102.36.194	2026-10-15 18:09:59.592
11783873-c218-41ff-b482-8131f83a22d6	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 152.233.13.165	2026-10-15 21:03:43.437
901a2c2c-65e5-4fb3-8181-383998c8d719	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.47.253.84, 152.233.39.33	2026-10-16 07:51:52.296
c72e7427-8bde-4585-8538-bf6aa2f03096	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 212.102.36.194	2026-10-16 09:59:21.608
7343b6de-8fbb-4719-ae7d-4b08ef36edd1	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	c99ff41a-e05a-4b12-ac9e-27f3f79c499e	{"title":"BTC_USDT","endsAt":"2026-10-16T11:00:02.219Z"}	\N	2026-10-16 10:00:02.229
1140a9a0-3543-4a74-8f50-244f32323b6c	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 152.233.13.166	2026-10-16 12:31:29.786
602c1171-75d0-43d8-b44a-1d8622081336	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 89.222.123.193	2026-10-17 06:29:14.405
0e2ac9e1-8108-4a2e-8802-21e71f5ebfcf	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	{"updates":{"fullName":"ماجد الدخيل","email":"fcc320c13b@emailnox.live","username":"majid","accountLevel":0,"isVerified":true,"availableBalance":500,"lockedBalance":5,"totalProfit":602.0971804186864},"before":{"id":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","email":"fcc320c13b@emailnox.live","username":"majid","password":"$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS","fullName":"ماجد الدخيل","accountLevel":0,"referralCount":5,"referralCode":"AURA-79K5EM","referredBy":null,"isVerified":true,"withdrawableBalance":373.78000000000003,"availableBalance":10966.097180418687,"lockedBalance":5,"totalValue":10618.117180418687,"totalDeposited":10600,"totalWithdrawn":231,"totalProfit":602.0971804186864,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"LEVEL1","totalReferrals":5,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":50,"createdAt":"2026-09-26T10:29:57.260Z","updatedAt":"2026-10-16T10:09:09.240Z"}}	94.252.215.66, 89.222.123.193	2026-10-17 06:30:55.157
deb51e9d-b46a-45ae-bb35-2e29588b9a5f	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 212.102.36.193	2026-10-17 11:03:15.439
7c1ad535-d294-4a71-8e7d-d9299368012d	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.215.66, 89.222.123.194	2026-10-17 15:08:43.724
edb53478-8325-461a-a949-1e7fb5c2fcd0	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.199.127, 152.233.13.164	2026-10-17 20:44:38.281
b4f1e60c-3a0c-4439-a74c-ed7adfcc548b	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	3b514599-3777-4cd7-9b34-aa00942a3be2	\N	94.252.199.127, 152.233.13.164	2026-10-17 20:45:17.213
d253d44d-778f-4689-b7e4-d17b23f6b42b	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	31b656fc-de59-436b-becf-c7d894737e5c	\N	94.252.199.127, 152.233.13.164	2026-10-17 20:46:00.895
3dc6569d-a542-46d0-9c98-de9bd7d00349	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	5219262a-e6a2-4b89-bd23-23a1b9d6ddff	{"amount":200,"userId":"3b514599-3777-4cd7-9b34-aa00942a3be2","referralActivated":true,"referralCount":6,"referralTier":"LEVEL1"}	94.252.199.127, 152.233.13.164	2026-10-17 20:46:22.176
a33d4e6e-4da5-4858-a4cc-c2f81248b767	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	de18627b-9684-4979-9f17-3147d35cbf56	{"amount":130,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4"}	94.252.199.127, 152.233.13.164	2026-10-17 20:47:46.529
0f7668d0-aa5a-41bc-bb07-555c338db2a7	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	3b514599-3777-4cd7-9b34-aa00942a3be2	{"updates":{"fullName":"عيسى عناد السويدان","email":"ysyalnzyy130@gmail.com","username":"shb134","accountLevel":0,"isVerified":true,"availableBalance":200,"lockedBalance":0,"totalProfit":200},"before":{"id":"3b514599-3777-4cd7-9b34-aa00942a3be2","email":"ysyalnzyy130@gmail.com","username":"shb134","password":"$2b$10$kiRzUnfoAjvTIkeExLKnjOCJZ5qi5f6dGzGiu8rVkiEY3Z47qYtUy","fullName":"عيسى عناد السويدان","accountLevel":0,"referralCount":0,"referralCode":"AURA-9DKETU","referredBy":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","isVerified":true,"withdrawableBalance":0,"availableBalance":200,"lockedBalance":0,"totalValue":200,"totalDeposited":200,"totalWithdrawn":0,"totalProfit":0,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":0,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-10-17T20:44:02.354Z","updatedAt":"2026-10-17T20:46:22.169Z"}}	94.252.199.127, 152.233.13.164	2026-10-17 20:49:26.113
322a8290-6e70-4aad-b74d-4f1ccd1b063c	2fe13236-701f-4faa-9315-d0a132362bb9	update_user	user	3b514599-3777-4cd7-9b34-aa00942a3be2	{"updates":{"fullName":"عيسى عناد السويدان","email":"ysyalnzyy130@gmail.com","username":"shb134","accountLevel":0,"isVerified":true,"availableBalance":200,"lockedBalance":0,"totalProfit":205.33},"before":{"id":"3b514599-3777-4cd7-9b34-aa00942a3be2","email":"ysyalnzyy130@gmail.com","username":"shb134","password":"$2b$10$kiRzUnfoAjvTIkeExLKnjOCJZ5qi5f6dGzGiu8rVkiEY3Z47qYtUy","fullName":"عيسى عناد السويدان","accountLevel":0,"referralCount":0,"referralCode":"AURA-9DKETU","referredBy":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4","isVerified":true,"withdrawableBalance":0,"availableBalance":200,"lockedBalance":0,"totalValue":200,"totalDeposited":200,"totalWithdrawn":0,"totalProfit":200,"totalLoss":0,"referralEarnings":0,"level1Referrals":0,"level2Referrals":0,"level3Referrals":0,"referralTier":"STARTER","totalReferrals":0,"weeklySalaryUnlockedAt":null,"lastSalaryPaidAt":null,"totalSalaryEarned":0,"totalBonusEarned":0,"createdAt":"2026-10-17T20:44:02.354Z","updatedAt":"2026-10-17T20:49:26.111Z"}}	94.252.199.127, 152.233.13.164	2026-10-17 20:50:23.744
50752b87-004b-4566-989b-23701887183c	2fe13236-701f-4faa-9315-d0a132362bb9	reject_withdrawal	transaction	61f5b1c1-ced3-4e56-b2c5-12efb0d20f06	{"amount":243}	94.252.199.127, 152.233.13.164	2026-10-17 20:52:40.436
f9de360c-1991-4af0-a245-9ba2638c3364	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.13.165	2026-10-17 23:35:40.795
d91cf674-a291-4ae8-bb85-555df99446ba	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.12.242	2026-10-18 01:47:29.684
04a46454-335d-489b-942e-458a868a4548	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	14d657c1-afed-4016-ba10-192e4dfaeccb	\N	201.4.71.13, 89.222.123.194	2026-10-18 02:09:05.609
afe63b09-9b51-422f-9a09-db96589f20a1	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	724466d9-e061-421d-979b-fdec80405018	{"amount":100,"userId":"14d657c1-afed-4016-ba10-192e4dfaeccb","referralActivated":true,"referralCount":7,"referralTier":"LEVEL1"}	201.4.71.13, 212.102.36.193	2026-10-18 02:12:13.093
a47b010f-4064-4be8-ba46-883f14c43f22	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	c5cd8217-8a89-494f-9b96-f611c4f56a67	\N	201.4.71.13, 152.233.12.245	2026-10-18 02:23:50.938
06d423f9-9f5b-4c91-89a5-8dea0cc88ea1	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.199.127, 212.102.36.194	2026-10-18 04:44:04.666
0c0c5498-7a2d-45be-8b60-76fe71eda2aa	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	5930523a-6006-405b-8c85-204ab26872c1	{"amount":29,"userId":"095ecc95-41a7-43b6-a263-1886b4c22c9f"}	94.252.199.127, 212.102.36.194	2026-10-18 08:28:37.8
70809e7b-0aa8-4e57-8a6f-e4dea57b4917	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.199.127, 89.222.123.193	2026-10-18 08:58:45.212
e6cd076c-c740-4a83-b603-0dc789116d3e	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	73b387f2-92c5-4cd3-af4c-6811ee83245c	{"title":"BTC_USDT","endsAt":"2026-10-18T11:00:01.141Z"}	\N	2026-10-18 10:00:01.149
1d3f8e79-519e-42c3-8d61-e6ada2dd4423	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 212.102.36.193	2026-10-18 16:44:26.587
0ce69812-a8eb-44cb-bf3a-09e7a63b89be	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	1b2898e2-82d8-424c-bde3-c788d60a2694	\N	222.167.236.49, 152.233.12.242	2026-10-18 16:50:35.292
22b15c8d-7e5c-4290-8593-0d45c5e55e2b	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	391de937-e58f-4f29-859b-b85533f2c744	\N	222.167.236.49, 212.102.36.193	2026-10-18 18:01:38.55
fe37c812-915e-4f66-8d23-0183486eb7a0	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	e113b178-19d4-496c-9b43-e0f2a4e53de3	{"amount":100,"userId":"d9aeedfe-2467-4f82-8444-66a684323c54","referralActivated":false,"referralCount":null,"referralTier":null}	222.167.236.49, 152.233.12.245	2026-10-18 20:13:49.993
bd055cb1-7f22-42cb-bc7e-29fd269bb460	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 95.173.199.193	2026-10-18 20:45:11.365
98ee9d79-a647-4d06-a7a2-dfff296f32a3	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	38aa6fa0-b076-48c3-bb60-a1ad2a69aec9	{"amount":299,"userId":"4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4"}	222.167.236.49, 95.173.199.193	2026-10-18 20:45:19.836
ac06e3f9-cd7b-45c5-b0d9-afb9cf77f2d8	2fe13236-701f-4faa-9315-d0a132362bb9	approve_withdrawal	transaction	0d981e55-c713-424e-b86e-46969618e95b	{"amount":23,"userId":"0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc"}	222.167.236.49, 212.102.36.194	2026-10-18 20:47:09.801
2f80ade8-cbd4-4a2a-8be3-ce4db70b3484	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 152.233.13.166	2026-10-19 06:46:49.717
204c1542-7d7c-4e78-bf9e-488ccf576dd7	2fe13236-701f-4faa-9315-d0a132362bb9	reject_verification	user	592313e4-4fc0-4e1f-a8bf-eae574995ef2	{}	222.167.236.49, 95.173.199.193	2026-10-19 06:51:30.441
99b7903b-b03d-4c12-b5b6-b78ccf081c4c	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	592313e4-4fc0-4e1f-a8bf-eae574995ef2	\N	222.167.236.49, 95.173.199.194	2026-10-19 07:59:51.235
6d218f38-632e-41b6-b9c0-cb0bdeb5bf91	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	2d20f1d9-f3e9-4853-9061-7a62f5e16674	{"title":"BTC_USDT","endsAt":"2026-10-19T11:00:07.066Z"}	\N	2026-10-19 10:00:07.08
75a5c154-35d3-4141-9c62-6676f3194699	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.12.242	2026-10-19 11:09:19.14
5fd7fc61-1eaa-4241-8101-c72d0e441f71	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	\N	201.4.71.13, 152.233.12.242	2026-10-19 11:10:11.252
9171b2d0-c92b-4fc5-b557-3d830d6d9ddf	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	13de3fce-19f3-450b-a5e2-c329e3d2c135	\N	94.252.216.234, 152.233.13.165	2026-10-19 11:32:10.368
8e8fe200-bb6d-4aef-8670-002b62c351a6	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	6cb9dd48-d72a-42f4-a672-d3e4827284d9	\N	94.252.234.208, 212.102.36.193	2026-10-19 13:01:53.136
7d19bf8b-5f61-4d9e-baaf-d2c6a7c800df	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	162166a0-298d-49e5-974c-b90d1d2d1d16	\N	94.252.234.208, 212.102.36.193	2026-10-19 13:02:34.827
d40b2525-0d2e-4b53-b9d1-b45802a374e2	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	3ba58e78-7249-421b-8de1-ffcc423cc770	{"amount":60,"userId":"1b2898e2-82d8-424c-bde3-c788d60a2694","referralActivated":true,"referralCount":1,"referralTier":"STARTER"}	222.167.236.49, 212.102.36.194	2026-10-19 14:38:37.864
4606d21f-3b18-4eb5-8202-1e202a6876c7	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	222.167.236.49, 212.102.36.194	2026-10-19 15:14:03.634
e8502ff3-7824-4f3d-b8b3-f03e987562fd	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	ecb90262-10ae-42a6-8cac-e8563bb30e60	\N	222.167.236.49, 152.233.13.164	2026-10-19 16:43:58.863
2eea798e-e666-4cc6-bffb-4929628fc387	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	58e6b8c8-c075-4558-99c2-4889448030d8	\N	222.167.236.49, 152.233.13.166	2026-10-19 17:37:40.089
3ca00f8a-ec60-4809-bd40-c5a46a83bf57	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	ec50e182-904f-4840-a3a5-18d3169f0a75	{"amount":100,"userId":"58e6b8c8-c075-4558-99c2-4889448030d8","referralActivated":true,"referralCount":1,"referralTier":"STARTER"}	222.167.236.49, 212.102.36.193	2026-10-19 17:42:56.101
48c8297a-d0bb-48ad-a50c-3031aaa6b95d	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 95.173.199.194	2026-10-19 21:00:35.393
4e173a1c-d5ad-4832-afcf-02399c9b194f	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 95.173.199.194	2026-10-19 22:26:07.998
d454a833-f2c0-4968-835e-918697d7fea9	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.12.245	2026-10-19 23:02:25.284
a029904d-3cb4-4662-8efe-1aeabbe8f86d	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	201.4.71.13, 152.233.13.166	2026-10-20 03:09:15.316
9eedf351-1675-446c-bda4-6d6d816e8399	2fe13236-701f-4faa-9315-d0a132362bb9	admin_login	\N	\N	\N	94.252.253.137, 89.222.123.194	2026-10-20 07:55:58.005
b72b53f7-20f9-4c27-a9fa-d6fdb617a8a9	2fe13236-701f-4faa-9315-d0a132362bb9	approve_deposit	transaction	966adfa4-dfac-4143-874b-30344b127917	{"amount":60,"userId":"ecb90262-10ae-42a6-8cac-e8563bb30e60","referralActivated":true,"referralCount":2,"referralTier":"STARTER"}	94.252.253.137, 89.222.123.193	2026-10-20 08:10:41.265
3395fceb-93bd-4771-824d-c7ff911bd48e	2fe13236-701f-4faa-9315-d0a132362bb9	create_mission	mission	c665e2bf-377c-419b-9671-6f27236b7329	{"title":"BTC_USDT","endsAt":"2026-10-20T11:00:01.258Z"}	\N	2026-10-20 10:00:01.265
59aca0f4-279e-46e4-8217-9c45dbedd386	2fe13236-701f-4faa-9315-d0a132362bb9	approve_verification	user	040b9796-2ddd-4e8e-b55a-f2e85bb2c172	\N	94.252.253.137, 89.222.123.193	2026-10-20 10:47:32.568
\.


--
-- Data for Name: admin_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_notifications (id, type, title, message, "referenceId", "isRead", priority, "createdAt") FROM stdin;
1d3c9af2-39ff-43de-abb8-7e985a78fc26	system	طلب تحقق هوية جديد	Osama أرسل طلب تحقق هوية (national_id)	ea9b62f6-cba7-4a87-ba26-954fb933b6a2	f	high	2026-09-25 11:47:42.666
d7725e98-9bf4-4be5-8323-6d842bc5827e	system	طلب تحقق هوية جديد	majid أرسل طلب تحقق هوية (national_id)	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	f	high	2026-09-26 10:30:16.042
001e9adf-2ce2-4b8d-8946-a0a8e2657415	deposit	طلب إيداع جديد	المستخدم majid أرسل طلب إيداع بقيمة $100 USDT	9cb9d2d9-dfd2-40e8-8c93-3c72462b19ef	f	high	2026-09-26 11:26:50.844
58ba72b8-fad6-42ac-996a-64f6922c69d9	system	طلب تحقق هوية جديد	dgot أرسل طلب تحقق هوية (national_id)	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	f	high	2026-09-26 19:52:46.762
02484c11-46b5-4db5-8335-b200070e89c3	deposit	طلب إيداع جديد	المستخدم dgot أرسل طلب إيداع بقيمة $100 USDT	05af3a8c-29cc-42bb-923d-e661d3c63860	f	high	2026-09-26 19:56:36.189
66f656a0-cc49-42b8-b8c9-d1c8a518ce9b	system	طلب تحقق هوية جديد	Osama أرسل طلب تحقق هوية (national_id)	c556a3ac-9185-490e-8a60-c69e3d832ebe	f	high	2026-09-26 21:14:30.147
efdcb2c1-127a-4820-8060-cdb44d4072cf	deposit	طلب إيداع جديد	المستخدم Osama أرسل طلب إيداع بقيمة $300 USDT	bca33b91-45c2-4bf0-ad07-752f22b7b868	f	high	2026-09-26 21:15:38.595
792457e2-1ab9-4b49-a291-33ec6737b5e9	system	طلب تحقق هوية جديد	darwin أرسل طلب تحقق هوية (national_id)	1108910e-6177-4d20-8f9d-a0cf7e3d5026	f	high	2026-09-27 06:42:27.267
9646b140-32fe-4265-8544-f973b5cdf46d	deposit	طلب إيداع جديد	المستخدم darwin أرسل طلب إيداع بقيمة $200 USDT	4233aab7-f672-4fd9-8575-fba8351cf399	f	high	2026-09-27 06:49:31.039
25a6fdde-b134-4069-8c8f-3cceee8ee6ef	system	طلب تحقق هوية جديد	Nan أرسل طلب تحقق هوية (national_id)	bb485f4c-fc9e-4900-ae36-0e89c8663b40	f	high	2026-09-27 14:38:39.374
f7efb23c-a87c-4805-9b9e-deffd1df2a59	system	طلب تحقق هوية جديد	Osama أرسل طلب تحقق هوية (national_id)	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	f	high	2026-09-28 14:35:09.234
13451fe7-3cab-404f-acfd-2147f9f3f1f9	deposit	طلب إيداع جديد	المستخدم majid أرسل طلب إيداع بقيمة $500 USDT	764acc2b-e4a1-4a42-ba8c-a9d57d641b88	f	high	2026-09-28 22:50:31.402
1c73603b-066d-4594-858e-260aeddf1bdd	withdraw	طلب سحب جديد	المستخدم majid طلب سحب $60 USDT إلى vxjxbixxih...	d37cc25e-922f-4854-863e-dedf79010438	f	high	2026-09-28 22:57:32.579
2d977acd-c3ea-41e9-a36a-f687e788f660	withdraw	طلب سحب جديد	المستخدم majid طلب سحب $50 USDT إلى vdjdidjbdk...	eec62280-9eb6-405d-bfe3-bddd97f3351e	f	high	2026-09-29 10:27:22.046
2515f1f7-0d3e-4434-915c-d6f4a4b5a4ad	deposit	طلب إيداع جديد	المستخدم Osama أرسل طلب إيداع بقيمة $1000 USDT	761f1ba1-58e0-4f54-9daa-3c1d03525793	f	high	2026-09-29 12:42:31.643
6849ef0b-6d8c-4694-84fb-4abeaa10c6ee	system	طلب تحقق هوية جديد	djy47 أرسل طلب تحقق هوية (national_id)	003cb43d-ce1e-43ff-ba6c-86ca6a7d2310	f	high	2026-09-29 12:53:35.082
0ab4c571-470d-4318-98a7-337c065f5611	deposit	طلب إيداع جديد	المستخدم Osama أرسل طلب إيداع بقيمة $200 USDT	7e080e4f-09f2-426d-abb8-7b016738e794	f	high	2026-09-29 12:59:00.103
d294deaf-7852-4a14-988c-1e6297939987	system	طلب تحقق هوية جديد	Suzan أرسل طلب تحقق هوية (national_id)	606d790f-e7db-477d-977f-6ceeeaa0d0ec	f	high	2026-09-29 13:46:23.007
3b0ce815-eb43-4b7a-9e5e-38c4eddfc947	deposit	طلب إيداع جديد	المستخدم Suzan أرسل طلب إيداع بقيمة $100 USDT	b1ff47f4-ce3f-433f-a2ee-4ddb01e54a57	f	high	2026-09-29 13:46:39.352
fdc14e73-b321-41f9-b77c-62ef861f0c7c	deposit	طلب إيداع جديد	المستخدم Suzan أرسل طلب إيداع بقيمة $1000 USDT	d582fddb-47cf-4377-b3a0-71ee15f6ebdc	f	high	2026-09-29 13:48:52.318
f3d18655-e502-48b6-af04-fbf5f93cf672	withdraw	طلب سحب جديد	المستخدم Suzan طلب سحب $39 USDT إلى He63662626...	3ba164a5-a567-452c-b0c8-4c076f605fe8	f	high	2026-09-29 13:54:01.166
55ccdd18-51c0-4909-a7bd-fcba5ec30c2a	withdraw	طلب سحب جديد	المستخدم majid طلب سحب $61 USDT إلى cghjknbghu...	1de0acc9-47c8-4707-ad36-b1a045473477	f	high	2026-09-29 22:49:19.985
89b47d68-2ed0-45db-94af-6ab91bc5a283	system	طلب تحقق هوية جديد	dbjdjjsuu أرسل طلب تحقق هوية (national_id)	7103cc14-77a0-494d-9fc4-570285f45c84	f	high	2026-10-01 17:45:41.189
ecd4a1aa-b11a-4c9b-b3a5-f3a6433fdd55	system	طلب تحقق هوية جديد	vdkv6 أرسل طلب تحقق هوية (national_id)	4e351b76-af96-4067-afdc-600288f3605a	f	high	2026-10-02 14:34:39.328
ff2cfc47-eaa4-4f6a-896a-08621844c641	system	طلب تحقق هوية جديد	Mazen أرسل طلب تحقق هوية (national_id)	016dddc4-d1ab-402e-90b1-536ccd90d807	f	high	2026-10-04 07:04:07.804
948354e4-b1f6-4330-a254-40b08667a7b2	system	طلب تحقق هوية جديد	ekxjcjndmxk111 أرسل طلب تحقق هوية (national_id)	d9aeedfe-2467-4f82-8444-66a684323c54	f	high	2026-10-04 07:19:59.189
36010602-1d03-406e-b11d-84e42cd56cc4	deposit	طلب إيداع جديد	المستخدم ekxjcjndmxk111 أرسل طلب إيداع بقيمة $60 USDT	6a3acd5c-66a7-4d8f-ab84-8fa98b54d0f4	f	high	2026-10-04 10:12:35.125
5aef914d-cfbd-4330-b070-c8529dca9380	deposit	طلب إيداع جديد	المستخدم A5xzii أرسل طلب إيداع بقيمة $500 USDT	46b31d93-cf20-4e3f-949d-4c03c581050b	f	high	2026-10-04 18:32:15.262
adc140d7-75bf-4fb8-89f3-b4a4a9793807	system	طلب تحقق هوية جديد	ahmd123 أرسل طلب تحقق هوية (passport)	9067689f-eacd-469f-9750-01dcf7b56639	f	high	2026-10-05 19:35:50.849
d6b6b050-036b-4517-bc13-e64ea8d37982	deposit	طلب إيداع جديد	المستخدم ahmd123 أرسل طلب إيداع بقيمة $60 USDT	da5238b8-21ba-4ef8-9b0d-66d45feac87c	f	high	2026-10-05 20:13:49.334
3f966814-42b7-4980-a149-aad006218d1b	system	طلب تحقق هوية جديد	www1996 أرسل طلب تحقق هوية (national_id)	095ecc95-41a7-43b6-a263-1886b4c22c9f	f	high	2026-10-06 09:22:14.216
fa4dece1-0b88-425c-b17c-31d07fbeae11	deposit	طلب إيداع جديد	المستخدم www1996 أرسل طلب إيداع بقيمة $100 USDT	069bd3f7-b161-4f8a-aff0-5e37326df8ee	f	high	2026-10-06 09:57:37.857
eb30da46-e26c-4ba0-8298-24d625b0dbd6	deposit	طلب إيداع جديد	المستخدم Mazen أرسل طلب إيداع بقيمة $100 USDT	1874ddbe-0885-4216-bd9d-7adae5f742d8	f	high	2026-10-06 11:37:15.426
a25c34a7-b299-4ead-9f78-5d6e968c6dc4	deposit	طلب إيداع جديد	المستخدم www1996 أرسل طلب إيداع بقيمة $100 USDT	fd9cbf58-a022-4516-8043-a4cf7a6a8ca8	f	high	2026-10-06 14:07:40.928
5369dee3-59dc-4b6f-852d-aff37a35f5e9	deposit	طلب إيداع جديد	المستخدم vdkv6 أرسل طلب إيداع بقيمة $100 USDT	1f4045d6-b8b4-419e-960d-5f550ab8806e	f	high	2026-10-07 10:04:39.067
b6e5d12a-ed4d-4f9f-9dcd-00f7261e6c63	system	طلب تحقق هوية جديد	hlal أرسل طلب تحقق هوية (national_id)	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	f	high	2026-10-08 09:10:20.916
3690d3a7-9fac-4089-bb7e-69ca194772e5	deposit	طلب إيداع جديد	المستخدم hlal أرسل طلب إيداع بقيمة $100 USDT	4a8cb759-1115-4f56-a09f-4513fda12b15	f	high	2026-10-08 09:11:04.208
af48f788-da68-418e-865c-ab54e339cf0a	system	طلب تحقق هوية جديد	AIMBIT أرسل طلب تحقق هوية (national_id)	df7d86f3-9359-4464-9b32-4d34a7b8a688	f	high	2026-10-14 20:39:24.535
fa73b247-080e-43cf-8712-29c54bba9d4c	deposit	طلب إيداع جديد	المستخدم AIMBIT أرسل طلب إيداع بقيمة $60 USDT	a7044b8f-79df-4a5d-8661-1218ce0eb803	f	high	2026-10-14 20:40:46.413
999b42c0-acef-4229-8e37-06f796862d27	withdraw	طلب سحب جديد	المستخدم majid طلب سحب $170 USDT إلى 0x44190cd8...	bef59b09-59a0-4a3a-a7c4-acb245f11e37	f	high	2026-10-15 08:16:02.553
b17347da-fbfc-468b-b10f-07e2028a62b2	deposit	طلب إيداع جديد	المستخدم majid أرسل طلب إيداع بقيمة $10000 USDT	39482d13-9b34-4b8a-ade4-18f453675c06	f	high	2026-10-15 18:09:41.681
85dfca60-2fd9-40b0-b94a-2d8c574606e9	withdraw	طلب سحب جديد	المستخدم www1996 طلب سحب $29 USDT إلى 0x44190cd8...	5930523a-6006-405b-8c85-204ab26872c1	f	high	2026-10-17 15:28:58.028
0d997bf6-fded-43e9-84ba-8b64187ccddf	system	طلب تحقق هوية جديد	Ahmed242 أرسل طلب تحقق هوية (national_id)	31b656fc-de59-436b-becf-c7d894737e5c	f	high	2026-10-17 20:27:23.014
18988f4a-18b9-4ecb-88a9-2414db467ff7	system	طلب تحقق هوية جديد	shb134 أرسل طلب تحقق هوية (national_id)	3b514599-3777-4cd7-9b34-aa00942a3be2	f	high	2026-10-17 20:44:04.989
84eee960-3a17-4d85-bce3-c123f265b648	deposit	طلب إيداع جديد	المستخدم shb134 أرسل طلب إيداع بقيمة $200 USDT	5219262a-e6a2-4b89-bd23-23a1b9d6ddff	f	high	2026-10-17 20:45:39.541
4be1d143-3cd8-48d5-9b2e-2b55244d466b	withdraw	طلب سحب جديد	المستخدم majid طلب سحب $130 USDT إلى AURA-79K5E...	de18627b-9684-4979-9f17-3147d35cbf56	f	high	2026-10-17 20:47:26.652
aa31d4fe-35bd-4b2a-a5a4-34a51e18b14e	withdraw	طلب سحب جديد	المستخدم majid طلب سحب $243 USDT إلى hdidhfjfbh...	61f5b1c1-ced3-4e56-b2c5-12efb0d20f06	f	high	2026-10-17 20:52:03.193
79daa033-913c-4649-b57e-19a827fc8770	system	طلب تحقق هوية جديد	question أرسل طلب تحقق هوية (national_id)	14d657c1-afed-4016-ba10-192e4dfaeccb	f	high	2026-10-18 02:06:54.144
14d67cbb-d31b-4850-8279-c900759ae920	deposit	طلب إيداع جديد	المستخدم question أرسل طلب إيداع بقيمة $100 USDT	724466d9-e061-421d-979b-fdec80405018	f	high	2026-10-18 02:10:14.18
5af041da-5e99-411c-a796-38290ff209e5	system	طلب تحقق هوية جديد	ganm-2026 أرسل طلب تحقق هوية (national_id)	c5cd8217-8a89-494f-9b96-f611c4f56a67	f	high	2026-10-18 02:23:20.33
a6ff84ee-bd90-40ef-b873-c91597ac02e9	withdraw	طلب سحب جديد	المستخدم hlal طلب سحب $23 USDT إلى 0x58Ac17cF...	0d981e55-c713-424e-b86e-46969618e95b	f	high	2026-10-18 10:33:53.123
b3c12619-3efd-4a39-bea8-70158af70bc2	system	طلب تحقق هوية جديد	hsnthmam9595 أرسل طلب تحقق هوية (national_id)	1b2898e2-82d8-424c-bde3-c788d60a2694	f	high	2026-10-18 14:37:04.186
3495f244-4a35-4270-bf38-d39862b11089	system	طلب تحقق هوية جديد	Ahmad19881988 أرسل طلب تحقق هوية (national_id)	391de937-e58f-4f29-859b-b85533f2c744	f	high	2026-10-18 17:55:58.701
46fa0067-4e47-420e-8491-ed85e06bf950	withdraw	طلب سحب جديد	المستخدم majid طلب سحب $299 USDT إلى 0x44190cd8...	38aa6fa0-b076-48c3-bb60-a1ad2a69aec9	f	high	2026-10-18 19:16:15.88
7a797514-8c9e-45ed-8285-161ea561cb32	deposit	طلب إيداع جديد	المستخدم ekxjcjndmxk111 أرسل طلب إيداع بقيمة $100 USDT	e113b178-19d4-496c-9b43-e0f2a4e53de3	f	high	2026-10-18 19:51:51.547
50207965-0efc-4def-a153-63e0decba844	system	طلب تحقق هوية جديد	abdullah332 أرسل طلب تحقق هوية (national_id)	592313e4-4fc0-4e1f-a8bf-eae574995ef2	f	high	2026-10-19 06:48:46.23
4d37824f-1431-41ca-aaf5-18e48f31b415	system	طلب تحقق هوية جديد	abdullah332 أرسل طلب تحقق هوية (national_id)	592313e4-4fc0-4e1f-a8bf-eae574995ef2	f	high	2026-10-19 06:51:42.855
df9e17ac-4619-4d2e-9f7a-416a7d4be592	system	طلب تحقق هوية جديد	fhd_b52 أرسل طلب تحقق هوية (national_id)	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	f	high	2026-10-19 10:36:33.646
686523a7-295a-43e7-8a7b-e4cf137c53d9	system	طلب تحقق هوية جديد	Yasyn أرسل طلب تحقق هوية (national_id)	13de3fce-19f3-450b-a5e2-c329e3d2c135	f	high	2026-10-19 11:29:05.784
3faa8640-98b7-4f98-872f-f0c567c2c9a9	system	طلب تحقق هوية جديد	ahmdalsyah أرسل طلب تحقق هوية (passport)	162166a0-298d-49e5-974c-b90d1d2d1d16	f	high	2026-10-19 12:51:50.701
4bada0c1-1c1c-4eb0-88e2-c9c83e61513e	system	طلب تحقق هوية جديد	Mahmso23awx أرسل طلب تحقق هوية (national_id)	6cb9dd48-d72a-42f4-a672-d3e4827284d9	f	high	2026-10-19 12:59:29.882
c9491b90-84a0-4300-8285-a2a4e23d2e47	deposit	طلب إيداع جديد	المستخدم hsnthmam9595 أرسل طلب إيداع بقيمة $60 USDT	3ba58e78-7249-421b-8de1-ffcc423cc770	f	high	2026-10-19 14:33:40.081
1081827e-5fac-4d35-a15d-1f0f581adb1b	deposit	طلب إيداع جديد	المستخدم hsnthmam9595 أرسل طلب إيداع بقيمة $60 USDT	99dfef66-bc2a-498f-ae04-60796a269a3d	f	high	2026-10-19 14:34:42.605
f6063a2b-9395-4d17-b0c3-3c8708739cfe	deposit	طلب إيداع جديد	المستخدم hsnthmam9595 أرسل طلب إيداع بقيمة $60 USDT	4f567206-c580-440c-805a-ca07033887e2	f	high	2026-10-19 14:37:19.185
6f3c61b7-72b8-46ae-af08-fe6d3e6ebe98	system	طلب تحقق هوية جديد	Mnbvcxy21 أرسل طلب تحقق هوية (national_id)	ecb90262-10ae-42a6-8cac-e8563bb30e60	f	high	2026-10-19 16:30:37.353
d1128885-7c2b-408f-82a6-c7441a1135ae	system	طلب تحقق هوية جديد	ASAMA2003 أرسل طلب تحقق هوية (national_id)	58e6b8c8-c075-4558-99c2-4889448030d8	f	high	2026-10-19 17:31:25.428
63a850aa-1298-40d2-b662-23d06a743e00	deposit	طلب إيداع جديد	المستخدم ASAMA2003 أرسل طلب إيداع بقيمة $100 USDT	ec50e182-904f-4840-a3a5-18d3169f0a75	f	high	2026-10-19 17:40:39.621
7168055a-fc7e-4d1a-8843-fff0426d114b	deposit	طلب إيداع جديد	المستخدم Mnbvcxy21 أرسل طلب إيداع بقيمة $60 USDT	966adfa4-dfac-4143-874b-30344b127917	f	high	2026-10-20 08:06:10.99
38f96c39-bb0e-407f-a525-37ca5e0bc47d	system	طلب تحقق هوية جديد	serdar أرسل طلب تحقق هوية (national_id)	040b9796-2ddd-4e8e-b55a-f2e85bb2c172	f	high	2026-10-20 10:46:18.224
\.


--
-- Data for Name: admin_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_sessions (id, "adminId", token, "adminSlug", "ipAddress", "userAgent", "createdAt", "expiresAt") FROM stdin;
b8c8871e-71a5-47a2-a25b-2e23420ee90a	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwMzM3MDUzLCJleHAiOjE3OTAzNTE0NTN9.5VSERktkqT_7Ld7LxzbaHeZdydjPs0KfuCW67gDWamE	b83308cd1ed4396b94fd1cea58c1035508050d445d5b86ba	94.47.252.202, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-25 11:50:53.454	2026-09-25 15:50:53.452
92787a17-b6a8-42f2-b718-18c47fae1182	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDA5Mjg3LCJleHAiOjE3OTA0MjM2ODd9.Mb7D-dE4xoV_IQ81K9zksN5mXqD-qMGbo6Ei4NI_YME	4781e3c200a17ba85109dbb95d41ca8a4a92f2ead3c16dc8	191.44.127.2, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	2026-09-26 07:54:47.416	2026-09-26 11:54:47.413
fac501e2-5971-4e66-99e4-35dd73339283	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDE3OTk4LCJleHAiOjE3OTA0MzIzOTh9.K_s5lHmHZcoP6_HTCYQ5ISzY00GIkrVdU_RHGVgM7VM	476dea44d2284a536127705d1c0b1e2957c86f5877e1b6b8	201.4.71.13, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-26 10:19:58.892	2026-09-26 14:19:58.891
076b2ed3-e029-4512-b7bb-6f1ba006de29	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDE4MDIxLCJleHAiOjE3OTA0MzI0MjF9.ojpBDpRXixI7ta2VKb1ez9BxYW4dlSiuXNERZUaj0s0	0174e4145f2edd0a729133d50bae3d2b9955d36d6ed33352	201.4.71.13, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-26 10:20:21.088	2026-09-26 14:20:21.087
5eb6b0be-bafe-4f2c-a8cf-173844ff40b0	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDE4ODY2LCJleHAiOjE3OTA0MzMyNjZ9.qjtj71Uc6RdU6cIkmDhAguwcPHGey-NdtrxTAnZAS9w	89c9bd5b728fee7c90bcd3476af4ead71d522e6c8c502b4e	201.4.71.13, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-26 10:34:26.347	2026-09-26 14:34:26.347
53c6cfbc-d284-4236-a2a9-e068f7d9c6db	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDIxODYzLCJleHAiOjE3OTA0MzYyNjN9.zxnq5X0Guxj_PboqehaCsLBw42P9rtkTVjQxEhWC3XQ	34ea5b5195c5bb93c6bcb5357d4a433f925cf95a023e034f	201.4.71.13, 152.233.12.242	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-26 11:24:23.68	2026-09-26 15:24:23.68
e320715b-04fd-4623-aa56-54cebb34938e	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDMxOTgyLCJleHAiOjE3OTA0NDYzODJ9.khagna2sPXlV6CXNXkIjHTzy5Ts8-RPNhWkwvheIhkI	f8ea3657f864406c0d108be2d68c84a743ded928924c1b6a	201.4.71.13, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-26 14:13:02.503	2026-09-26 18:13:02.501
2491128f-1d81-4d17-8a85-d15832b8044e	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDMyMDY5LCJleHAiOjE3OTA0NDY0Njl9.L81N0qeJZ8dAqOMyTZd6Ugntj5A3FEVFUnyGrW2SRRY	cf3bbd770964f24220e35ee3b50d033d7a1374fbd344d45d	201.4.71.13, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-26 14:14:29.4	2026-09-26 18:14:29.399
bfc6af6f-cdb8-4436-af3c-4a400011ef5e	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDMyMjM2LCJleHAiOjE3OTA0NDY2MzZ9.YwoERZIXc_me-jCrbawLsT6KtzPr8NXP39QE3GQvIuk	00b6541f6b2373a4df821dbfc903e421f373daab9639294a	201.4.71.13, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-26 14:17:16.168	2026-09-26 18:17:16.166
cda1db45-41f0-4820-b9e4-a8795827265c	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDUyNjMyLCJleHAiOjE3OTA0NjcwMzJ9.f9VLL9bK1JS5sY0KrY3-3daCiejjmGlIN2M7ZgZoh_0	50b1a13ebfe054de273bfeca7b1f2de0ee1a79dcc5fc6663	201.4.71.13, 152.233.12.245	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-09-26 19:57:12.346	2026-09-26 23:57:12.345
11a6a19a-b0c0-4a2d-a2bf-43084eb61a51	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDkwNzIxLCJleHAiOjE3OTA1MDUxMjF9.PHMHfY22rG2AQXlt9uiPnjmuFWAvFSGATBAQhw6dOGs	80a1aeec989e65845856ee7ff055a579248f346b8e185585	191.44.127.2, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 06:32:01.593	2026-09-27 10:32:01.591
215b358e-6cbe-480f-872a-0d6f8b5b02e7	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDkwODU5LCJleHAiOjE3OTA1MDUyNTl9.wIKOfInH8laUE1bsP5rR40zyzOv2X70hA7xiLh1Z20s	667e0e72c1353064b67c9c49607541aad7c225e520cef422	89.39.107.200, 152.233.12.241	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-09-27 06:34:19.756	2026-09-27 10:34:19.756
54838650-038c-4902-87f7-246b663a9871	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDkxNDA3LCJleHAiOjE3OTA1MDU4MDd9.WYLNA95_dWqXTH4663lgM0B2y7e_1JzkSa-cWv8H2F0	82b7e61727f8eb18e7a11abd948c4d599d7dc44b2f9a9a63	94.47.248.233, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-27 06:43:27.791	2026-09-27 10:43:27.791
27d19960-878a-468f-87b7-2dba1549211d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDkxNzAwLCJleHAiOjE3OTA1MDYxMDB9.oJRlmhYs_UcSj4di3z6cmvR0wAo23lclZY1BiLgyVYM	1f34412c17a2278fd1798615282eaeaf411c859826b08368	191.44.127.2, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 06:48:20.959	2026-09-27 10:48:20.959
e539d239-5cb1-439a-b415-518755789624	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDk3MzI4LCJleHAiOjE3OTA1MTE3Mjh9.1ScGeiWY6I0b80faUUUzPg0pZjUB5M6-TUlJU8ilG2Y	85ca32d3eff4dfd0875e7f2c67952121edeb2eea1c34d888	191.44.127.2, 152.233.12.241	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 08:22:08.289	2026-09-27 12:22:08.289
b89e71ed-40c2-4d7f-be30-63d0529dc036	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNDk3NDAzLCJleHAiOjE3OTA1MTE4MDN9.kUvpOOGlysKfn8jy_TLexcNgZhLj1s3JiQAxZhsTMtw	4a09c85b8b62af6dcd33403bc67307cd3452ef744004b073	191.44.127.2, 152.233.13.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 08:23:23.935	2026-09-27 12:23:23.935
42fdb872-7c7d-4284-a18f-e6c5b459cd10	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTAyMTQ3LCJleHAiOjE3OTA1MTY1NDd9.dlA0FGEPZ4HouFec37B-81M64j4QtX90e0Vzg0_CMMw	5592be05a7469ed5c68fc10d5444a8f3108387980797246a	191.44.127.2, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 09:42:27.83	2026-09-27 13:42:27.83
9373565a-cb0c-42fc-ae2e-5aecf021d087	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTA0NjAxLCJleHAiOjE3OTA1MTkwMDF9.UDbAwRJASA4tQFjHpaF1YfsnaN_9Gq358b1O_iq8BzE	4ceacc15f2986743447334c37a4eac03177a155c401d55ed	191.44.127.2, 152.233.12.242	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 10:23:21.362	2026-09-27 14:23:21.362
e5fe4325-b391-4689-98df-835ab16146c4	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTA0NzQzLCJleHAiOjE3OTA1MTkxNDN9.e3qi_d4YdADnj2kjeV9H_q8H59jV1jBwahdxaBSfbzY	b0a8b10c16b22c72e50dac453a3c53c5b46eaf36a4f1d131	191.44.127.2, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 10:25:43.662	2026-09-27 14:25:43.661
e96a8e2b-fcc2-46b9-b778-9c2184fef54e	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTA5NjY0LCJleHAiOjE3OTA1MjQwNjR9.BODdHFujTDiff9KkAs8bVx-PWf1luN8yuzDA3kphaxo	a9c2d2bd92502e67f239040bd4c5f7e74cd83d19381fcb36	191.44.127.2, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 11:47:44.263	2026-09-27 15:47:44.263
b882fe84-980f-4460-a79f-bf1e3375597f	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTExOTU4LCJleHAiOjE3OTA1MjYzNTh9.IS9exwfCbLeXqhcuibOddLs1ZMe2mDdyLh-8U12-D8U	2273ca067fab20b4fbe7de0a247842a48dc6139bc40a7ef9	201.4.71.13, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 12:25:58.562	2026-09-27 16:25:58.562
9a12462b-2603-4a18-bd10-70aeb004ad43	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTE5OTYwLCJleHAiOjE3OTA1MzQzNjB9.h8ueJW3KYp8EQgcRikRLgcdp_zU4n5fGBtJWlYHvuqc	f1bec4ad877fd3d0e969f9b06b7ea455ca988383c771dc3f	94.47.248.233, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-27 14:39:20.984	2026-09-27 18:39:20.982
547bb4d2-4c53-4823-8455-f216ffa9a6cc	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTIzMDE3LCJleHAiOjE3OTA1Mzc0MTd9.jnmeR2tAMGNs4nf0YjEGzlhX6bf5pMiAESYpPo6_Yno	d5e9f43e1f251111a41e7a044d2d09054c8255d547a467dd	191.44.127.2, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 15:30:17.139	2026-09-27 19:30:17.138
3ab097fe-3ff5-44d7-9c96-1635c8d4603b	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTQxNzQ1LCJleHAiOjE3OTA1NTYxNDV9.ZjY4b1NEaTKSa8Dx4_qdyk0tHw405a2kIpBdoXu1StY	c89e2470ba72b4119f0360962b77dc3c5c4c458357573d8e	201.4.71.13, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-27 20:42:25.041	2026-09-28 00:42:25.037
003aac83-a623-42b1-8bfe-2345cfa908c5	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNTk5MzEyLCJleHAiOjE3OTA2MTM3MTJ9.e0Y9hS12M6FZ2A00DZhrRBSaVxHHSAhpSrrjHKQBMBA	27fe2a0f4cb5ce161967318432302478d876674f4cf96121	201.4.71.13, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 12:41:52.072	2026-09-28 16:41:52.071
62bf08ee-81e9-4110-8ff9-2fae10de6ac7	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjAwNDc4LCJleHAiOjE3OTA2MTQ4Nzh9.zVFGJmNvOiS2JwJPliij_-_6Ha_gRTWNipJ8jZjWKKo	79a3b98a118df020d85a471830bf9c3350b945d75ce7d1bf	201.4.71.13, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 13:01:18.468	2026-09-28 17:01:18.468
98304fd4-6b01-4d2f-a12d-da4272950ffe	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjAxODg2LCJleHAiOjE3OTA2MTYyODZ9.mpEE9o7betqvjKgGpB6W-EV8ufGA688SuXAB2KoG0Eg	d00d2de2707deb908a4c56fe72480e4aca4ddd43f3ce3b26	201.4.71.13, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 13:24:46.541	2026-09-28 17:24:46.541
22a1d79f-7fda-4678-ac3f-55994802fd21	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjA0ODYzLCJleHAiOjE3OTA2MTkyNjN9.6_tURKNLbT_4d7Oq_one_4_CrRdj8LppPdCw86BqMKw	8a063be1ad8f20ae00521eb0e96943617dfa15546f9df014	201.4.71.13, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 14:14:23.124	2026-09-28 18:14:23.123
220e52a5-fa93-4ef8-bb05-c14e6fb8844e	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjA2MTk1LCJleHAiOjE3OTA2MjA1OTV9.N9WxWf0QOPceBnTpErgk8Uzv2RqwweHojhBe6f6aUVo	c079973c7e84f2465e82018895dd326de0d5a2fed6615b22	94.47.248.233, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-28 14:36:35.578	2026-09-28 18:36:35.577
51cb2bcc-0a6d-4fe4-8dcb-80883ef2eebe	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjExMDE3LCJleHAiOjE3OTA2MjU0MTd9.FT5gyuiIoJVcKD0B4aHQXDfF56fc48MmhFCpiuwjam8	c06b248b2207c425969e4aaf97e11b2c2a29f6ce78cb2636	191.44.127.2, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 15:56:57.367	2026-09-28 19:56:57.367
ecb83c92-952f-4d74-b2f9-34e4e495f8b2	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjE0NDc1LCJleHAiOjE3OTA2Mjg4NzV9._zLsNUXywO6FFF23VTFFkAIPWZWXyU_UIEKuc2NPZpQ	a619af52d1e42ed6ca09e67dd4af9e969bfa487677874d68	191.44.127.2, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 16:54:35.661	2026-09-28 20:54:35.66
d5934c1f-f2a4-4273-93c9-b3a0452df8a2	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjIxODgzLCJleHAiOjE3OTA2MzYyODN9.OBaatqegGBSZVHjPlS51NWdNoeTwOaeDXuSuGaTl9cc	6f0a70439fed42134fb54a09de7867a59ff5c2dd641c0581	201.4.71.13, 152.233.13.164	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 18:58:03.73	2026-09-28 22:58:03.73
85b0508d-bfd2-4891-8068-352527a934cd	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjM0MzcwLCJleHAiOjE3OTA2NDg3NzB9._zKQyIZBrlYXIMOXyGSFq-SbjmUCJWgNv427Al_cRFg	3330c722012bb032156ed130a964d53bdd1b286c03fc515e	191.44.127.2, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-28 22:26:10.432	2026-09-29 02:26:10.431
a5cd6a48-5096-40b9-8519-e23775106274	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjc3NzIyLCJleHAiOjE3OTA2OTIxMjJ9.0uiPgwMsH5zmWVPgimC7mc6mKJFyQdkO1ttiWUZjO2c	176cac5bcb3be06a1fb37f5ce23fc07d680f8349d102501b	51.38.124.66, 152.233.12.245	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-29 10:28:42.344	2026-09-29 14:28:42.344
1d37443e-f45b-4e20-aabc-647836133d95	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjg1NzY5LCJleHAiOjE3OTA3MDAxNjl9.Z3SRCYFRDZUrqsq1GY574xNfNwLX_-Uq3SgGtsJc4Aw	b074c2c326576f271011e21c701a2e3fdde257ccddcb86e8	89.47.234.229, 79.127.177.113	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-09-29 12:42:49.631	2026-09-29 16:42:49.63
f64a0db6-2f51-4bee-8c18-a6f38c64dd8b	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjg5NjI3LCJleHAiOjE3OTA3MDQwMjd9.ZEOqlssMZ_Dc-djG-F9t7S56uw0ra0eAHnPXyqBYvzk	9036ad59d7a95c1f9a5d27d7c523eb71eb0df25442bb1def	94.47.248.183, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-29 13:47:07.585	2026-09-29 17:47:07.583
63aac24f-29a3-429b-bbb7-3c37fe8c4c34	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjg5Njc4LCJleHAiOjE3OTA3MDQwNzh9.-1VUkfeSfPEW0Luqrx9APskDlSNdij1BHDX7tiMigVo	5e58d55f492bc71b853a41cf7a12684d5b6bfbbeb3dac4a2	94.47.248.183, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-29 13:47:58.639	2026-09-29 17:47:58.639
f908e0e3-aac2-41c2-83b4-6da94ef43953	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjg5NzcyLCJleHAiOjE3OTA3MDQxNzJ9.QKndSkbKRr4Vn-2sK-hsNF15dh5w8GChkl73FhQcVTw	7931ea46c502153622ecb2a6fd5ec2cb8e4b262c398c002f	94.47.248.183, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-29 13:49:32.978	2026-09-29 17:49:32.977
e31de199-faf6-4034-ab73-97d5f2a59821	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjg5Nzg0LCJleHAiOjE3OTA3MDQxODR9.R2YySOMOjKDU-YnXyGj0bN79xi0NuF3q_SL908w1Pn8	1d731e064e3c72736c0a1b7daf9768d7cfe8588ddb38259f	94.47.248.183, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-29 13:49:44.314	2026-09-29 17:49:44.313
45a816d9-2f43-48ea-87d8-8af56a2a01ff	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjg5OTU3LCJleHAiOjE3OTA3MDQzNTd9.KxDJmIdHTDEapwEIYnuRB3Y2WwofWkOvMIwIjFVimfg	4b47fe04a3adf67bc6485a62b9b0ad306172669fe5183aca	94.47.248.183, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-29 13:52:37.017	2026-09-29 17:52:37.016
2a376bbb-245a-4b32-a655-87cbda0dd133	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjkwMDU3LCJleHAiOjE3OTA3MDQ0NTd9.HPlUuCPtHCItqH6PwYpgy7x3KaFn5ivtqIm6hONI_mo	5cb965e1e9c2d35db824fff08140b6badddbc3705f530011	94.47.248.183, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-29 13:54:17.108	2026-09-29 17:54:17.108
8dcd54af-17e9-46b7-a71c-b15105e47558	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjk4NjMyLCJleHAiOjE3OTA3MTMwMzJ9.j_iJG0EjbiXXB36mysVzfmkp_rkOboccPP_9zveJths	15df773031df060aea702724b97ed8c59486c152c06f357f	45.149.24.18, 152.233.13.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-29 16:17:12.579	2026-09-29 20:17:12.578
0a0b36a8-7812-47e0-9fab-94f099208783	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjk4ODM0LCJleHAiOjE3OTA3MTMyMzR9.i9iEpfVogsucyBTyziv-jFZrENVMZlVBvKS3ClE0Jm4	417388c4301949728739f9e202cfaf7b0e800e514876b251	45.149.24.18, 152.233.13.164	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-29 16:20:34.241	2026-09-29 20:20:34.241
6caf03b9-5673-4c13-b540-d373490ef730	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNjk5MDA2LCJleHAiOjE3OTA3MTM0MDZ9.1j6jH4EzJDihMaz5fU2FrWRm0zPTRq7p3RCGmmM27zs	ee7a493510c6065cc41851ddb88a998be90e56d8bc45aad6	45.149.24.18, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-29 16:23:26.57	2026-09-29 20:23:26.569
65015905-4a32-41ec-aad1-6548590799a4	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNzA0MTY0LCJleHAiOjE3OTA3MTg1NjR9.YT7-PmOWDt6AgI-7dRCK7XylT71Xx3h8AUvCJb1tC-U	088e458bb376753c8ee2e8e82b167c70a01d100896dc7530	45.149.24.18, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-29 17:49:24.191	2026-09-29 21:49:24.184
e57375e1-1607-4052-a07f-6634ce88dd2e	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNzA0NjkxLCJleHAiOjE3OTA3MTkwOTF9.Sz-_fYM262gJMu_geYLUqopXIF21xijhJMS_9MeSIY4	f776e732bb61b4189c5dbfd747ecdf22737fa0c15522f9b3	45.149.24.18, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-29 17:58:11.545	2026-09-29 21:58:11.544
0d188a48-675a-42c4-81ef-e050eb3a9aa5	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwNzIyMDAwLCJleHAiOjE3OTA3MzY0MDB9.XGmnI2EtFOplWR2GK_m9uNZBHibLfA3JBOtbD5LyNa0	8801a771266a96e45d05f3a2ad0d27ef93f4144124e61191	191.44.127.7, 152.233.12.241	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-29 22:46:40.431	2026-09-30 02:46:40.431
d885183d-0cff-4fd3-af3d-9192a06607ca	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODExMjY4LCJleHAiOjE3OTA4MjU2Njh9.2MMelhaCN8GSzkXYL1WcnbfIETAluo8RVBOy4jF1rdg	611d85d0192dcef5420050b71bd09140d16c3203e0b4ab1e	191.44.127.2, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-09-30 23:34:28.4	2026-10-01 03:34:28.4
7b143275-f595-4229-87aa-5cac12068116	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODM0NzQ4LCJleHAiOjE3OTA4NDkxNDh9.itW4AtQj3Acqs8ORrtuiVDoTZgSBcozUD6OII5Ui5BI	ad4d4d46761c73d069718389436cdc346f6d339a4a6ad206	93.88.156.62, 152.233.12.245	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-10-01 06:05:48.407	2026-10-01 10:05:48.407
dd24ef6b-7be2-4251-bfb0-70e561edaf78	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODc0NDgzLCJleHAiOjE3OTA4ODg4ODN9.nPJzcdR20o4iXsddy_Vnx5xnsF6yqvxp6TteEZ7INWk	7306cec22194d5b3791c5367f9f877fc41acb35ff2133047	94.47.254.100, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-10-01 17:08:03.287	2026-10-01 21:08:03.286
02605fc7-297e-4fe4-8929-7a629c9dd1d7	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODc1NzU4LCJleHAiOjE3OTA4OTAxNTh9.-5T1KUd1tSdaS5FuRy27gz8TMEMOokU10ZUIe2cYpBI	ce4dd9d65ed4964e9903fc1930f989533a3a30448ac9c52e	129.224.207.216, 152.233.13.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-01 17:29:18.292	2026-10-01 21:29:18.292
13c8f672-de99-445a-a439-ac56ee4aeeee	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODgwMTU2LCJleHAiOjE3OTA4OTQ1NTZ9.4frAB5sERB2MMTxCXw4sw3m0y_yumu3IJVuHBLHJpMk	125b397aefa16f0092e425623b0335fa4ff8884b0b97934c	129.224.207.216, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-01 18:42:36.799	2026-10-01 22:42:36.799
64d0d841-f0f4-4fc8-b861-066b61d87a51	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODgxMjgyLCJleHAiOjE3OTA4OTU2ODJ9.F1d6FePzRRC5aHrBq1floFL_nkHyeIelZtzkBkOyQQs	009ed75c351555613ac4624c4e8403301697d7ba1102ff63	129.224.207.216, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-01 19:01:22.034	2026-10-01 23:01:22.033
ded3643a-14ae-4831-bb72-71fe47f6db55	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODgyOTM4LCJleHAiOjE3OTA4OTczMzh9.et1KK9Tz-7P3VZVtOCIjVQMI-E_TUk0lC5suasGv40k	6dfa2eab30fad7128c38a67c55f43156da55a02920f2abcc	201.4.71.221, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-01 19:28:58.323	2026-10-01 23:28:58.323
9bbd8f2d-196d-482f-a434-41085df0e23d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwODgzODMyLCJleHAiOjE3OTA4OTgyMzJ9.gVRQFykGeKhR394n0-DHn6RLUT5w5GCRJ49tJRjzTI0	61231f9520558a42a8adfd45afc26ec5a7e5600cf3d25327	129.224.207.216, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-01 19:43:52.471	2026-10-01 23:43:52.471
0c7174b8-e7c6-42a4-bcbd-faa46658bc14	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwOTQ5OTU0LCJleHAiOjE3OTA5NjQzNTR9.nEMdNP5DWbo1JzAUwDXU0VKXGzh-CFtbzyHENzybFNc	d0957bf502f1c143432b38555f70f035f617fcbaf2ae3315	201.4.71.221, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-02 14:05:54.28	2026-10-02 18:05:54.28
b390d0f8-44ac-4972-a7ec-e5caf652801b	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwOTU5OTMwLCJleHAiOjE3OTA5NzQzMzB9.IX5DWR2yh3ImJV-cgnowYE6iv8NvsU1OBnxQ_bfQ-mQ	38344bc1c9927f0a8f99395b8d83ae54db54b977ce2d8d8b	191.44.127.2, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-02 16:52:10.786	2026-10-02 20:52:10.785
a4f2def7-6479-4744-8ab0-e3df0ba843fa	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkwOTY4NzA5LCJleHAiOjE3OTA5ODMxMDl9.AXcX4dnsbhW5Dj_Ykptl9TYUMFX8KA3jJZYFdrzVL3A	456781c45624b8bf348e3dcff932cd4574f114e83fc32a6d	201.4.71.221, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-02 19:18:29.619	2026-10-02 23:18:29.618
23189520-222c-483b-b125-d47bdb2c1d3d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMDQzNTYyLCJleHAiOjE3OTEwNTc5NjJ9.v7lJ4OLASBEVGkAq-e5Pi7ZuHSG6rGbTjb4UbIO7oe0	7f91af6f9670472d27d3ad2888313a92a635cb655383eda3	201.4.71.221, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-03 16:06:02.499	2026-10-03 20:06:02.499
e67c5d29-9d68-4e7f-a88e-786f41c294fa	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMDUxNjkwLCJleHAiOjE3OTEwNjYwOTB9.b6n_srMFuoJ6SyzCtUoZOcmM_sB12jOU8uDwv3PJVSk	9a567939569a2eaef015c2878313859ae07ac08945dd1329	191.44.127.2, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-03 18:21:30.766	2026-10-03 22:21:30.766
833aad58-6da3-4644-a5ab-c2cc8d727db9	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMDY3NDg4LCJleHAiOjE3OTEwODE4ODh9.HUjIJSWB1r6DC58iMql-kRgoQU8e_nblcqHkAgFj7-Q	3b96e45fafeb2725d853eda1685dbb422a02040667506eba	191.44.127.2, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-03 22:44:48.662	2026-10-04 02:44:48.661
16ef077b-e102-458d-9bcb-1db57259c102	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMDk3MDgyLCJleHAiOjE3OTExMTE0ODJ9.jc2Ub6FRVUI8U_Mbeq9FPnuyqqRFfqEYTCRsk9pQ8Ag	04345f8b1c1ac325d4728d7731afafc356c5d4892ef42501	94.47.251.172, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-10-04 06:58:02.832	2026-10-04 10:58:02.83
ddf9ea82-de7d-400a-8e33-329196a7168c	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMDk3NDc5LCJleHAiOjE3OTExMTE4Nzl9.--_YrZnuhXGpyaKhsYVLH8_QND5oWNCS0at20kgWVbg	d7fada2b5123ff3bb9905588f4e5ce7bc3f081ef08affd92	94.47.251.172, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-10-04 07:04:39.107	2026-10-04 11:04:39.107
0054d6fd-598f-42f2-b63e-b20046ee9662	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTE1NjI1LCJleHAiOjE3OTExMzAwMjV9.xgIpuEjKdHVc4_YXkQB-HAm9HKxeDAXPs11ET76sR-M	99c23f21d5634467307dc3549135684f6d9aba3d1c21952c	201.4.71.221, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 12:07:05.091	2026-10-04 16:07:05.09
e89b9ebe-77ec-49bc-9531-c9b2e38bcc6b	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTE4MTIwLCJleHAiOjE3OTExMzI1MjB9.GzwqH75SDez81fCONZWggRO4JfVSFjo0dhmS1grURk4	83d5715db222ac8653ff38eca19df0ddf1f617ff91fe2950	191.44.127.2, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 12:48:40.042	2026-10-04 16:48:40.041
7655b1b1-447c-4964-8d07-623cff792dc3	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTM3NjgxLCJleHAiOjE3OTExNTIwODF9.P-w-yxm1IWb7sjtd4IOBbFuX0av0M4tI6ktJKZna1qU	f6fc55e462b21a25a0d4ba9e1c07d37a7912483050a27195	191.44.127.7, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 18:14:41.848	2026-10-04 22:14:41.847
5be59909-b8b5-428a-ab7c-1cb24e590047	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTQzMzQxLCJleHAiOjE3OTExNTc3NDF9.xh3clDVjcg83arUSFb9SVVIwEiAg6-0WUtgRksQJNik	519d2b4275ab236d2f0b6495e16963e7fadebd3166d6de1b	191.44.127.7, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 19:49:01.624	2026-10-04 23:49:01.623
c52d43e0-84ef-4c71-b200-27356bd65024	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTQ0MzYzLCJleHAiOjE3OTExNTg3NjN9.aOge9G63lh6ZHTpVyUNdXlnWakBPxpNbfHQgTwkJszk	ccd8fdded384df850f443a56233bc019aad5f58870236d3f	191.44.127.7, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 20:06:03.858	2026-10-05 00:06:03.858
b4074540-d9cf-471b-b015-cd2c06389147	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTQ0NjI1LCJleHAiOjE3OTExNTkwMjV9.iIk4WKw5De6djJaoFq7lqnpXFQskQfdeRN3nG1GArCI	ce8967c6bb44be9eecee7fad9ad85c4c71106c8d5eae149d	191.44.127.7, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 20:10:25.971	2026-10-05 00:10:25.971
005996c6-04ad-4030-af68-ea37a0969f4e	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTQ0ODM1LCJleHAiOjE3OTExNTkyMzV9.qWmxZe4j2og8CJoR5di2YB8Y7mvNtRiZ-xSAeWxm3M0	6e06affb7637bdfad404fd0dd8f0f0d1111c16071661f038	191.44.127.7, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 20:13:55.978	2026-10-05 00:13:55.978
2a4ee1c3-2573-487b-93ac-544a908073b3	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTUzOTYxLCJleHAiOjE3OTExNjgzNjF9.QFBtrmISFz3ttJ5YCwBLeHRGB6YgNv3wQCF0pl13FqM	212368829b3b706cd42953ab63227a2231ce1388395b0f97	191.44.127.7, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-04 22:46:01.612	2026-10-05 02:46:01.612
765476a3-e903-4260-990e-f5bdf10d2658	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTg2MzMxLCJleHAiOjE3OTEyMDA3MzF9.bFsHmcrv_2i7W39BxyjkDP1BFTt0nf8Sg6RX6h0ts6c	2b67479a30678f3ca6781f90e2c0c8f94efe67c6b430bff4	94.47.252.241, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-10-05 07:45:31.519	2026-10-05 11:45:31.519
b8212348-62d5-41ce-8a60-7dd0788c1d4a	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTg2Mzk0LCJleHAiOjE3OTEyMDA3OTR9.BTdVnKIc9Lh0KUYRjlQb8kQUYVCb2R1KnKwHQXquFfw	e557ece78e5cdada1af4ea2aec12509524f51c6bf88f9932	191.44.127.7, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 07:46:34.812	2026-10-05 11:46:34.812
f1d93d41-d7f4-4da4-8b1f-374b133d1a15	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTkyMDE3LCJleHAiOjE3OTEyMDY0MTd9.FrztNA_cygqaR9lFfKbZv1E_iTZMeOTTfAXjwKT6pzA	a849840bc979a8cb9cf3c41d636e10095a6c8fa3b564af74	191.44.127.7, 152.233.13.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 09:20:17.972	2026-10-05 13:20:17.972
a8f0e860-3869-4a9b-8448-cc4f4cd66afc	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMTkyNjYxLCJleHAiOjE3OTEyMDcwNjF9.duin9nyewYIHSrbtONRe_jbLdx0c24EjwVML2FM4FHA	8f3ee4dc837627546b60e8f167149c20d6f2a07ef4058927	191.44.127.7, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 09:31:01.628	2026-10-05 13:31:01.627
3d4206f4-323e-4785-b165-8667b3533f2c	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjExOTg3LCJleHAiOjE3OTEyMjYzODd9.OEvrkE3w2N-jXoxz0tqelQm7nZSFGwrdA13FuDU1laU	1e82520b4bf42b272f363dd751ffa62074304d55558c4714	191.44.127.2, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 14:53:07.721	2026-10-05 18:53:07.721
004b621c-927a-47a9-9897-6a193216485a	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjE2MDA5LCJleHAiOjE3OTEyMzA0MDl9.EAzZLWasTECK4Z68ivG2WsJ1UMIYkHJHUbp70o4_1fY	55b6d1629958a413c47a7b46d3bbf49e5c0c19f3b0b0434f	191.44.127.2, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 16:00:09.844	2026-10-05 20:00:09.844
36ef0c74-0362-4dd9-9667-6a031054401d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjI2MTk3LCJleHAiOjE3OTEyNDA1OTd9.HbG8ahpOclb-q-1xcPdVy01Eydx6yzF3wIaPvJIuxfY	7234ee95dd4aec315ad90b0dcc7bfaedbd9d7bc1473fcc5b	201.4.71.221, 152.233.40.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 18:49:57.632	2026-10-05 22:49:57.631
5c3443d9-50b2-4e1f-9c9d-df05f06cf30f	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjMwMTQ4LCJleHAiOjE3OTEyNDQ1NDh9.43Vnt_IEvFPTii3T_BQtQx9KDI5tSI2wCzVAx3S_ZHc	2c663a5def0ea9cb52b8a6b5922f0bcbdd460025fecd8424	191.44.127.2, 152.233.40.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 19:55:48.918	2026-10-05 23:55:48.918
0db4e775-39d9-4563-8843-19dd06026099	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjMwNzg1LCJleHAiOjE3OTEyNDUxODV9.AECtV7zFWdIoPwKXj0BwNk40_5V5RI_BlTs6BZU0608	14bfc3ce647c98eec4d8399d8ffdeae8976d7bda3ea9a1d0	191.44.127.2, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 20:06:25.928	2026-10-06 00:06:25.928
990e9fbf-81d6-456d-b297-5229e8596e1a	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjMxODExLCJleHAiOjE3OTEyNDYyMTF9.fUhMZQu1tdVRVEcjvhAgTQc_rN3J-3nT7yL6uf5ucSg	7f2a863eacd57dbacd0b18c100a8f6c91c6017fa8b83919c	191.44.127.2, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-05 20:23:31.549	2026-10-06 00:23:31.549
b711e0c4-094e-4059-9b17-b1df9df6b470	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjc0NDkxLCJleHAiOjE3OTEyODg4OTF9.yN5lNvW435Fec8fdKcoTADq0t02rItG3hSGhrlvw3F4	eafa19e22aab073732a8169eac1207b3927424912e50513d	191.44.127.2, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-06 08:14:51.154	2026-10-06 12:14:51.154
548243e0-79a7-4ae8-acc9-cb08ecd72b61	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjgwMjM3LCJleHAiOjE3OTEyOTQ2Mzd9.wTZ5rT_mENrKc0vAbTXDJDiQoQs04T3HFXU1I3dSWz4	5369eb32eee2fbb1fcb93f19f681e2d237234681b3aaf2da	201.4.71.221, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-06 09:50:37.988	2026-10-06 13:50:37.988
9051ab1d-5b6e-45b6-907f-e4f6f4002d44	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjgwODMzLCJleHAiOjE3OTEyOTUyMzN9.Kh6HoW7IfC3DJBc8y4QGUSjJ0RHg8WTtuDbOjTPmBvA	4db8fec3ba396392d6fe37082061476b8691f8da658a9dc0	201.4.71.221, 152.233.13.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-06 10:00:33.451	2026-10-06 14:00:33.451
bf585ce2-4a28-4d5b-8137-2f2e5ec7ef8f	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjg2NjY2LCJleHAiOjE3OTEzMDEwNjZ9.n7ZUbFfATSCQ7XXuYi-m-HxewNUc0L8sUFjZlc8QHps	c7e57d8e7f43f7cb9bf4c5870191198b40b92cf2ce87cdcf	89.38.97.174, 152.233.12.241	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-10-06 11:37:46.609	2026-10-06 15:37:46.608
408c4696-1305-4a49-b6a3-1fbae05753b3	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjk0MTA4LCJleHAiOjE3OTEzMDg1MDh9.sPTxRkTkUzKlX_DpGw1MliGCWuIbUAtpNbJtlwb1xVo	1012ea5258e80dbbb8daafe6279d5bf4604ee20a4f27fa0b	191.44.127.2, 152.233.12.241	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-06 13:41:48.795	2026-10-06 17:41:48.795
f084357d-4bb5-49cb-afe5-6703b7427218	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjk1NzcyLCJleHAiOjE3OTEzMTAxNzJ9.HKnIQiwGGUU0A6n-WjU20gTsrMBuPlXVVrRtKJvnaKg	5642f108875504b358bf4d21f8c8a81c0ad7e4fe40a84ba6	201.4.71.221, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-06 14:09:32.513	2026-10-06 18:09:32.513
999bdd91-0f7d-42f2-9049-c5779035e87d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMjk1ODcwLCJleHAiOjE3OTEzMTAyNzB9.X7oNB3pEZR_L6167VuDbzeDcNypsOPknBNfzJrFpYio	77694d3c7dd30aa15c92d9c493d904184c7bd67ce4f2b924	201.4.71.221, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-06 14:11:10.022	2026-10-06 18:11:10.022
0128ae50-7d01-4ea1-9f53-41e32fd47e61	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMzAwODYwLCJleHAiOjE3OTEzMTUyNjB9.oemNl8150PdjhfMmpV9CHfCNueldWoGSB8btb0Jd8pw	7c679125a44fe2210aefbf2fb4c38e064fb283b3f41e5c9b	201.4.71.221, 152.233.12.242	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-06 15:34:20.311	2026-10-06 19:34:20.311
df9144ad-f202-409c-91ec-c53afa18fca3	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMzY1OTY3LCJleHAiOjE3OTEzODAzNjd9.CfYbM6IdlVxT6LE4TIUiKkC3UVmjbragKsezStEv3fI	8b76aa0213264d3cd4b8d1826dcf63406e60e431e44feeab	201.4.71.221, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-07 09:39:27.671	2026-10-07 13:39:27.671
22538141-e4e1-46ac-b356-0e14142ff0a7	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMzY3MTMyLCJleHAiOjE3OTEzODE1MzJ9.TKKZghLmXNVfHMcQ5oFsYKeBSNdhoZzFISBHeujmFsA	0373957bf78a904e7057eba441e338ae0456d4eb2e262f32	201.4.71.221, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-07 09:58:52.268	2026-10-07 13:58:52.268
3d697b72-be3b-443e-b36d-dbf091e69e85	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMzc0NDY3LCJleHAiOjE3OTEzODg4Njd9.2pmEO7a3TIl_sTpO8iq-P7bs1_yVflyViO5uEcaD3cU	8a5758cb907b580e8fdf9efa3cb5140055427ae5a47db9db	201.4.71.221, 152.233.13.164	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-07 12:01:07.23	2026-10-07 16:01:07.23
9d0926a0-3efe-43bf-ae65-e3572cbbe48a	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxMzg4OTQxLCJleHAiOjE3OTE0MDMzNDF9.zWbcJs4PiMP8ze4yVzm7NSovQo9jVmnWh5eIryywfxc	c3a4891cf862420c32a66cb3418ab5945239c35658d28fdf	201.4.71.221, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-07 16:02:21.963	2026-10-07 20:02:21.963
22287b53-0151-447f-a6ac-5cc9b6ce61b4	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNDUwNzU4LCJleHAiOjE3OTE0NjUxNTh9.zu6baM9k8WZ7VM1tFpA9oMduTCmfmGxRj1iGV7dkGCU	0db09872c84de5288b77edd88c4d75556f6f68966efab1d7	222.167.236.49, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-08 09:12:38.828	2026-10-08 13:12:38.828
6765f694-a4cc-49b0-8526-88a76fa51787	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNDUzNzAxLCJleHAiOjE3OTE0NjgxMDF9.MBEcmSU0ZmGLr0hgOmTCks1_OQgrBpTqZeQLXwIjQpw	de690b0f5c845e37cd83d9f78e48ef587ebd45e73ee32397	201.4.71.221, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-08 10:01:41.776	2026-10-08 14:01:41.775
2e4ea59c-d0d4-4d1a-a126-4145e4cce68d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNDU2NzkyLCJleHAiOjE3OTE0NzExOTJ9.O_sgMpFtnfqlRAJaP00F-s5esa75ItKyJS9r2Fw9Y6A	b459c03b362e3a9bd62f788a5ee7b3c1b54f2589d3e304ee	201.4.71.221, 152.233.12.241	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-08 10:53:12.922	2026-10-08 14:53:12.921
cd3a5365-e172-492e-b259-96d993170032	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNTQzNDQ0LCJleHAiOjE3OTE1NTc4NDR9.vjenaxM-ZHYn0gMAm7FmXLzSB328hxaanvjU-Ku_-1c	3f5e4766d9f2f9fa4dda3c89539ec364caa1f7d2be4cf109	222.167.236.49, 152.233.13.164	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-09 10:57:24.093	2026-10-09 14:57:24.093
639c92ea-c3cc-4f46-9cab-788f30f32ec7	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNTYzNzk0LCJleHAiOjE3OTE1NzgxOTR9.spMO1bQyNELaaAPYDnXfh1lw9OrurcYqTfUFml8T_8g	460a5e00f4b7f7ae78be4a499e0d1450e6cff354c4250631	201.4.71.221, 152.233.12.241	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-09 16:36:34.648	2026-10-09 20:36:34.648
6af91899-c953-43a6-a3a8-004550cd5628	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNjI2Mjc5LCJleHAiOjE3OTE2NDA2Nzl9.WHi6G4ndhZV02I5B2OeGEie0prtkpcpkmKNxgPBQmfM	dcce64bb9f6166db4618db9cdb5745226d6f11501a6e659d	222.167.236.49, 152.233.13.164	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-10 09:57:59.617	2026-10-10 13:57:59.617
78b645a3-d645-43cb-b4a7-0fe8efa5a60f	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNjI3Mzg5LCJleHAiOjE3OTE2NDE3ODl9.NvLtkglki6e5l9JKkjkhdpjbkNoG1-sSirG3eZeH8sA	ad5ce0b43ec148c833909b35ea4ad9bcb3d909c08bc2d6d1	91.144.20.75, 79.127.178.81	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-10-10 10:16:29.032	2026-10-10 14:16:29.031
dd37c6d8-cef8-45d1-90fd-98416b44e2c2	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNjI3OTU2LCJleHAiOjE3OTE2NDIzNTZ9.YOMK4HvkLyomuIZqOYUSD5xm4vbTXPLaZpCVZye6y6U	823ef55523560c1954d4a3f44a677e9262517f3b40fc541f	89.238.156.195, 79.127.177.113	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-10-10 10:25:56.171	2026-10-10 14:25:56.171
45e76400-d109-4601-934d-e85508cc85f2	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNzk1ODc4LCJleHAiOjE3OTE4MTAyNzh9.vg1e_rkk1A8Q-NeHXEY1tC86-mdeCjHtaWE23zeuoqA	af32cb2fb413715d45a9df01ec7e5ac0d87f57eba66d50d8	94.47.255.70, 152.233.12.245	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-10-12 09:04:38.39	2026-10-12 13:04:38.39
422f7659-732c-4427-b150-4f0865af03dd	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxNzk2MDkyLCJleHAiOjE3OTE4MTA0OTJ9.ZdlavRtlaWU9JGAhiKPP72cK-7lvFc8UZhpta9qXUuc	ad07224c7a40cac2eda8c43184d04c66748f8ccb0080fdd4	222.167.236.49, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-12 09:08:12.185	2026-10-12 13:08:12.185
00a9b5d6-fca3-45a2-99a7-8eddf85f7469	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxODg1NzQwLCJleHAiOjE3OTE5MDAxNDB9.L5muis75Aiy0_khUxQ1QBjMN3F7OHMjuQlQnJX1dl4o	547a635f50227424ad0e49d8d58302dd47e77dd16b7fc145	201.4.71.221, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-13 10:02:20.476	2026-10-13 14:02:20.476
bd1f9c59-a147-4a7d-a31b-c59eda8e2678	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkxOTcyNDIwLCJleHAiOjE3OTE5ODY4MjB9.aPB8_m32W1y08qA07mx05l8KTOnypk1msQyJ3VoBInE	280151025f8b5c9849fb2b2f7d66d50357ad819eb667e1eb	222.167.236.49, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-14 10:07:00.326	2026-10-14 14:07:00.326
0ee746ee-b3f3-4ca5-95a8-2b058e0dbb28	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMDA3MzQzLCJleHAiOjE3OTIwMjE3NDN9.IVd_EHG-O-ki3GJQPWoGgbLFDBmcuqC1jY-pIUOhES8	b4f5f6ff263b385732d10f9ce181d32af5d59b729449dc62	178.52.192.192, 79.127.178.82	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-14 19:49:03.488	2026-10-14 23:49:03.488
b068ed12-1b82-48c0-b67c-08543e0b2518	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMDU0NDgyLCJleHAiOjE3OTIwNjg4ODJ9.01yc5z8lxiXiKrCsfKTaP-rl9yXXcXoG6QaLIQLTKmI	4bcda295e5d7c8f8b2613c16e65408b03e99c27d210db406	94.252.215.66, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-15 08:54:42.485	2026-10-15 12:54:42.485
78fc98ff-5233-4211-8736-a774fdff13c5	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMDcyMjQ0LCJleHAiOjE3OTIwODY2NDR9.f1wbVOmaADR9zjSorgg02KWKlvOwdAcfAvHVo248m5E	b57aad4eb8454f37a3d4a6a1360ed6c5e3b945119c42c493	94.252.215.66, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-15 13:50:44.87	2026-10-15 17:50:44.869
28951c2c-2b0a-44ab-8be7-9f11006b7a60	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMDg3Nzg5LCJleHAiOjE3OTIxMDIxODl9.aUQFyqWORiU0F1S1w3RQK1RcidBhgaRl9KW7DQbxfYE	30cc7fef7ea13e0a45ddbcd092eb61afd09bffe0b28728bf	94.252.215.66, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-15 18:09:49.656	2026-10-15 22:09:49.656
bfa02b46-fe30-40ae-814d-03bc657e4c2d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMDk4MjIzLCJleHAiOjE3OTIxMTI2MjN9.GZAz3dgKh0SmnFDwZ1U6woxPGgn6i9b4WXZpxp6KpTs	87e711ab170b5adb32502201e4d9152dec8685ece0a549cd	94.252.215.66, 152.233.13.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-15 21:03:43.427	2026-10-16 01:03:43.426
e5362a34-b2bf-44f2-8e4e-10a94812a6fa	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMTM3MTEyLCJleHAiOjE3OTIxNTE1MTJ9.iu5erA0FZ5ag-3f6ke2M7HKzo49TioqSe3zagBpPJag	c07b62c0f951785d1568932e97d41e47bfc7d75fa97e5c02	94.47.253.84, 152.233.39.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-10-16 07:51:52.292	2026-10-16 11:51:52.292
457193d2-ef57-4739-9a53-cf4188ebe469	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMTQ0NzYxLCJleHAiOjE3OTIxNTkxNjF9.d3I5tsV0oY0el3mnVZ_jG8NQ7DTj_ZG49wI21vi5GFg	8add8cf0a596eee5e735cc9190bb84bd6b3659a9915c37c8	94.252.215.66, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-16 09:59:21.599	2026-10-16 13:59:21.599
2fc00412-6c7f-4dc8-b993-5e728c7fc94f	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMTUzODg5LCJleHAiOjE3OTIxNjgyODl9.jwyoBSEec139ScubTqV967s0kWsVfsKkzHQO7WL6ZqY	2533743715308f9c7bcc4794f808d721874e4587d8d9d49b	94.252.215.66, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-16 12:31:29.777	2026-10-16 16:31:29.777
e63db91f-5722-4b3f-be05-21f8724ecce6	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMjE4NTU0LCJleHAiOjE3OTIyMzI5NTR9.IXrOhgjCMbjl3yYU0-LJS7f8LS-9LZyI-_kbKeyKlQQ	c47ffb76f74ff784b10e036d0dab4868cf793111c5e9123c	94.252.215.66, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-17 06:29:14.397	2026-10-17 10:29:14.397
7652f543-aeb0-4b01-a003-e5d0e3bd003d	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMjM0OTk1LCJleHAiOjE3OTIyNDkzOTV9.2dK_Hi1Mxb33HyjyEgkzetWV89cHO3S5i9ArbeLKPa8	9bf5e3f2fbb97960e764fc05043c7fab33f09299f7b1e1e6	94.252.215.66, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-17 11:03:15.431	2026-10-17 15:03:15.431
5f49cab8-de3a-426a-af1a-2be297b54fe1	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMjQ5NzIzLCJleHAiOjE3OTIyNjQxMjN9.I6XMIRgH04n7GRP9nF0I9lYevnvoFxxomeSl_p5afqY	b6f513eac014b32099fac093882fceb80737b5b8da24bc73	94.252.215.66, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-17 15:08:43.718	2026-10-17 19:08:43.717
8e6d3ee9-4c0f-4e73-9c16-3b4680197a35	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMjY5ODc4LCJleHAiOjE3OTIyODQyNzh9.HLj6Vy6XeoEXnKYikEGJG_oktSPlg_m_De5Ecz6_Ly4	1e510071b53a92075c752157dde705380c83c87c0a7132ae	94.252.199.127, 152.233.13.164	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-17 20:44:38.271	2026-10-18 00:44:38.271
70b392ac-f016-461e-8edd-1ea5d69f7a46	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMjgwMTQwLCJleHAiOjE3OTIyOTQ1NDB9.jqO7DtbNUwJimIYHuSJPgEMijO9yKm3fR3QoNEHPznE	4c05d294126909e20b34ab532f67ed531cf4663210fd407b	201.4.71.13, 152.233.13.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-17 23:35:40.789	2026-10-18 03:35:40.789
1a109619-3c3d-4a88-8ff7-bff4464c1fdf	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMjg4MDQ5LCJleHAiOjE3OTIzMDI0NDl9.OCRXScZXrukNamQEc_3yyQTXSOMLzwNpk71nijectCQ	983328dff85157727a755c02116c9430d95f2366cf33c943	201.4.71.13, 152.233.12.242	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-18 01:47:29.675	2026-10-18 05:47:29.674
6a920940-d1ce-4a95-9c54-917655b3d0ab	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMjk4NjQ0LCJleHAiOjE3OTIzMTMwNDR9.oPJPDLAJ4OMIAQG2jN2rNJQVnZC-P5S84MUqeVr6KHM	15661da3e7f6b076ff2fe028792fb35a2394f377bfa0f854	94.252.199.127, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-18 04:44:04.658	2026-10-18 08:44:04.658
eb7c5335-1b66-4a07-a3d3-b31b438d7d0c	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMzEzOTI1LCJleHAiOjE3OTIzMjgzMjV9.N7TDYkVxU5LyY-2VbMv3KXe8OZTGRngmEk8PmLWuYrY	e7fe540eb5707305685c0ff3b72f485d011ec599f50cdfe7	94.252.199.127, 89.222.123.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-18 08:58:45.204	2026-10-18 12:58:45.204
6b92fec5-9c9b-4667-815b-99bb1d7e48e1	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMzQxODY2LCJleHAiOjE3OTIzNTYyNjZ9.HVl_cbhZ_8GaxOy9-j4LiNKZyRQC0eKfmj7kGPcPPOY	582784e8b5e5994ac21b770b34866c7ed687334f3aa5a1a1	222.167.236.49, 212.102.36.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-18 16:44:26.571	2026-10-18 20:44:26.571
86019174-5f95-4958-8559-c39f07bef773	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMzU2MzExLCJleHAiOjE3OTIzNzA3MTF9.32Oat_AXKZ4fubKMJYw_iiiOXH9Nkoe_n0JUbIzzRPk	5722d264b046cce21c759f93f56a1e78d8baf18842e34746	222.167.236.49, 95.173.199.193	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-18 20:45:11.359	2026-10-19 00:45:11.359
61dcc6c9-9370-46eb-a1fb-0e755a300e08	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyMzkyNDA5LCJleHAiOjE3OTI0MDY4MDl9.brK2UirZPUl2ZNvD0Oupd4d6GDa1-48voczvnu0s3Gw	00bc698ced32b1e5e33bb2e919f17ff709e6a2cc00c917e7	222.167.236.49, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 06:46:49.707	2026-10-19 10:46:49.707
5663f0be-a425-4af6-a7e9-c73b57b8253a	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyNDA4MTU5LCJleHAiOjE3OTI0MjI1NTl9.wu9D2mtZZVXinN4c_0U8xUOuB85PIKIPqw4IAmnGFjw	f7456b18197a274e9bc9a170f791fa8abbb13bf5fa805aca	201.4.71.13, 152.233.12.242	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 11:09:19.136	2026-10-19 15:09:19.136
96a86093-5838-4541-b0bf-4ba9fba90e40	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyNDIyODQzLCJleHAiOjE3OTI0MzcyNDN9.iUQ_ika78Lo6Vl6f1TrtHSu3YQ2qgNI-r3gMckp7hNM	00ffed880d91b527fbf0d3f3f1dcda8c5aa5e8529836cff4	222.167.236.49, 212.102.36.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 15:14:03.63	2026-10-19 19:14:03.629
c2c0e26b-eb02-45ea-b52b-98887b3796e2	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyNDQzNjM1LCJleHAiOjE3OTI0NTgwMzV9.yxX7S2j12Fz7yvWSFyR5WyekSrqJVfPvWr61H_Uw_qM	a3cb6c6f90cff93cf6c87a69e7d6bbf477251da4e6ceb7fd	201.4.71.13, 95.173.199.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 21:00:35.38	2026-10-20 01:00:35.379
4d335158-62b7-47f4-91a8-bfa536d6ddf7	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyNDQ4NzY3LCJleHAiOjE3OTI0NjMxNjd9.T5hF3NjNq_lE2xQbjFyJ1KFwlUK7Luh5AYnY2XZ6s1c	f304698144dff39603118fc3dc56bed95dfc04764f36c38a	201.4.71.13, 95.173.199.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 22:26:07.995	2026-10-20 02:26:07.994
25199c98-dd89-4274-8b05-2092f7e5bafc	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyNDUwOTQ1LCJleHAiOjE3OTI0NjUzNDV9.iNjZgkuk_LQW-aFqb5nWMZaY5Iv4_0fZw-8KnmRaKAI	9bba2ecb5c16a1bbd9143fa12eba2ee6ef2c398e13fca36e	201.4.71.13, 152.233.12.245	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 23:02:25.279	2026-10-20 03:02:25.279
c75c539f-e4a9-4db6-b862-ab8155e0e3d7	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyNDY1NzU1LCJleHAiOjE3OTI0ODAxNTV9._sLSJrxduUUEFfcC6cbi4QVCVRUxsomWSkz8b5GMK_A	9c9220495d674b715127628f03b0b7bac719748b5bf6c9ae	201.4.71.13, 152.233.13.166	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-20 03:09:15.311	2026-10-20 07:09:15.31
6028249c-ef37-4041-b802-3276510c8d32	2fe13236-701f-4faa-9315-d0a132362bb9	eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbklkIjoiMmZlMTMyMzYtNzAxZi00ZmFhLTkzMTUtZDBhMTMyMzYyYmI5IiwiZW1haWwiOiJhZG1pbkBhdXJhLXRyYWRlLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzkyNDgyOTU3LCJleHAiOjE3OTI0OTczNTd9.5pxF6v0KO6F7nwYanvddbYOSNBm934wFJ4umZr54-VM	8403841fced43b3a1a1a0c9e54e0fd1c700124d905bbafcb	94.252.253.137, 89.222.123.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-20 07:55:57.997	2026-10-20 11:55:57.996
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, email, username, password, "fullName", role, "isActive", "lastLoginAt", "lastLoginIP", "loginAttempts", "lockedUntil", "createdAt", "updatedAt") FROM stdin;
2fe13236-701f-4faa-9315-d0a132362bb9	admin@aura-trade.com	admin	$2b$12$JNsqQklK9oJ9yub0uZ1vvOuEmOydpu9Nkw4xclPXp6mr3lAkdAs0y	Super Admin	superadmin	t	2026-10-20 07:55:57.992	94.252.253.137, 89.222.123.194	0	\N	2026-09-25 11:49:40.325	2026-10-20 07:55:57.992
\.


--
-- Data for Name: earnings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.earnings (id, "userId", type, amount, description, "createdAt") FROM stdin;
1a712c36-79b4-4486-a34c-0dd7fbe642ed	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	mission	2	مكافأة مهمة: شراء سهم AlDlVN	2026-09-26 20:03:30.009
44275d2c-fe8b-4da9-ad1b-425feb1093f8	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	2	مكافأة مهمة: شراء سهم VGKB	2026-09-27 12:31:08.019
abbdf23e-fb85-4251-990f-ef181c292574	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	mission	3.33	مكافأة مهمة: شراء سهم GKTD	2026-09-27 20:44:08.117
29f9967b-d784-4884-901e-3a71fcbe05b1	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: شراء سهم FJBT	2026-09-28 22:52:09.925
6a03b9bd-dac8-4463-a87b-6b0ecea72b28	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: شراء سهم VSAJ	2026-09-28 22:53:54.307
b1b1877a-fafd-46ba-af73-58dd84c36ef1	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: fgnky	2026-09-28 22:55:37.718
40e446fb-d6b8-492b-a10d-75c0b240c568	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	mission	16.65	مكافأة مهمة: شراء سهم AKRM	2026-10-04 18:33:43.358
188d6880-1efc-49ae-8e8b-64e80e2c36c7	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: BTC_USDT	2026-10-06 10:01:21.302
357889c6-3ddc-483a-8a80-bbf1b212ccb1	016dddc4-d1ab-402e-90b1-536ccd90d807	mission	3.33	مكافأة مهمة: osama	2026-10-06 11:40:59.653
dfc8ee98-f350-40d1-b058-878669203419	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: BTC_USDT	2026-10-07 10:00:26.23
48b4dea1-0b19-439d-ae5a-c388ecba16b3	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-07 10:06:41.135
1a762cfd-d206-4a65-b9f9-ad3cc319af22	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-07 10:08:12.643
9381847f-81b4-451f-bb4e-5856987a1b5e	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	mission	16.65	مكافأة مهمة: BTC_USDT	2026-10-07 10:31:18.438
3bfaafca-5693-4b78-aab2-ca8bfd19f3ce	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	referral	50	مكافأة ترقية — المستوى الأول	2026-10-08 09:14:20.106
82d3b298-ace0-4f34-b0d5-1f3e52092707	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: BTC_USDT	2026-10-08 10:02:20.716
34e91842-ec11-4213-8767-cc7bad445c20	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-08 10:02:45.652
5d39008d-0b89-4a91-931f-8fe5d17b9ec7	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-08 10:07:00.611
9b6275bf-1dce-491b-bcfd-46d17ca8d0ea	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-08 10:13:20.435
0fd96ee2-307e-485f-86ac-9021a24ebc6e	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	mission	16.65	مكافأة مهمة: BTC_USDT	2026-10-08 10:40:11.5
ed51b7b1-a4be-44e0-9841-279fed6b0a1d	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: BTC_USDT	2026-10-09 11:00:36.497
c3ff69e2-80ff-4fa8-a502-2e5d197a4afe	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-09 11:02:31.471
a7170462-caa4-40a2-995c-fb36a17f4745	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-09 11:02:37.983
f79d82e6-fc38-492e-970f-c51deea56e48	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-09 11:03:18.941
4162497a-1de5-48bf-8047-395ca9b949c3	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-10 10:00:15.03
2651a29c-4f25-45ea-8080-dbce036069a7	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: BTC_USDT	2026-10-10 10:00:23.824
b554bb61-4d71-469a-a5ad-fac488f089db	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-10 10:12:22.954
c3b77679-2ac8-4bec-a08c-13935c3d8867	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	mission	16.65	مكافأة مهمة: BTC_USDT	2026-10-10 10:21:30.139
554c6142-ff65-4234-98c0-258ad0db4f72	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-12 10:03:54.35
aa70b05a-d958-4bce-86ce-ce2fa70bfcb7	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-12 10:21:59.939
d2d61fa1-b250-40fb-a1ba-e283fdf15aa0	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-12 10:36:44.302
f74d2fd6-ef1e-4b28-927c-1b95ff07e68b	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: BTC_USDT	2026-10-13 10:02:41.977
ab416b22-f4a3-44b0-b414-969fd0441eeb	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-13 10:02:59.31
5f0dac75-bda5-49e0-9dac-819f6297b68c	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-13 10:08:43.032
5169c777-8cd4-4535-b89b-035e0c1fc4ef	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-13 10:18:14.687
8260c6e5-76b7-4e2d-b446-cbab2b10179d	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-14 10:08:12.182
7517cf44-5a83-4e03-a7cd-d0aec82544e9	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-14 10:09:09.862
a9124e28-121e-4877-a871-87dcb4a9052e	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-15 10:01:35.662
13b3ac15-5aa9-4e1f-8d2c-500b05a7306e	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	19.98	مكافأة مهمة: BTC_USDT	2026-10-15 10:02:56.871
c8e8d442-2b9a-479a-a27f-3ca864d32a8e	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-15 10:06:34.893
d34aae2b-ecd2-44bf-8616-408daf430d48	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-15 10:06:48.427
3de8dc26-1cf6-47b7-b31c-a0a51d7f7fa8	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-16 10:05:26.49
1533931b-bad4-4b91-9e3b-9ffb3143e006	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-16 10:06:15.17
1d4bb2c0-9c63-4e1f-922b-4a2bed71ce3d	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	352.98	مكافأة مهمة: BTC_USDT	2026-10-16 10:09:09.241
0948e7d6-4d8e-41e2-bf4d-da75899fab25	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-16 10:10:46.699
b1a28860-7bbc-49ed-8761-1a52ae5ca907	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-18 10:02:43.76
957d215b-ca48-4ce7-b81f-41cd2e140a8d	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-18 10:07:51.378
2fabb81a-e616-4470-af8b-416ac1ae6411	3b514599-3777-4cd7-9b34-aa00942a3be2	mission	6.66	مكافأة مهمة: BTC_USDT	2026-10-18 10:08:30.685
28c8b098-9923-4321-bbfe-b829f7db490b	14d657c1-afed-4016-ba10-192e4dfaeccb	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-18 10:23:46.094
f27c3b7c-3b2e-4718-b307-808ad54990a7	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-18 10:25:24.41
0bf349f4-e1ad-461d-8b53-93330ffe4018	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	352.98	مكافأة مهمة: BTC_USDT	2026-10-18 10:35:35.928
5b6e7507-07fa-40c7-a493-a4d49081eb2b	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-19 10:00:25.546
f1d5ba91-8fe0-4807-99f1-090125886cd0	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	352.98	مكافأة مهمة: BTC_USDT	2026-10-19 10:03:43.354
19537bc2-d5c9-45a3-9250-0e9778a0a6b4	3b514599-3777-4cd7-9b34-aa00942a3be2	mission	6.66	مكافأة مهمة: BTC_USDT	2026-10-19 10:04:21.69
59b35686-b0c9-4097-aad0-4ceb79adf1a7	14d657c1-afed-4016-ba10-192e4dfaeccb	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-19 10:04:27.732
692b1a1f-8e1c-4284-be3f-380084d5dbfc	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-19 10:09:46.802
efc6fbdf-f467-4ac9-9078-d36b5096b8bc	4e351b76-af96-4067-afdc-600288f3605a	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-19 10:51:42.248
82adb3ad-4bbb-4597-b831-b19d5af1848d	d9aeedfe-2467-4f82-8444-66a684323c54	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-19 10:53:18.415
f60111dd-2953-4807-b812-91a56a5226fa	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	mission	352.98	مكافأة مهمة: BTC_USDT	2026-10-20 10:00:19.057
f6da6211-922d-4dc9-928f-b6e0af9a9e31	ecb90262-10ae-42a6-8cac-e8563bb30e60	mission	1.9980000000000002	مكافأة مهمة: BTC_USDT	2026-10-20 10:01:16.443
f9db803a-e194-46f4-ada0-03342fb8b6fc	1b2898e2-82d8-424c-bde3-c788d60a2694	mission	1.9980000000000002	مكافأة مهمة: BTC_USDT	2026-10-20 10:01:31.504
c82484a2-d879-4915-9135-7d6943bcc4e9	095ecc95-41a7-43b6-a263-1886b4c22c9f	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-20 10:02:32.432
02d6e37a-141f-4cbd-bd7b-ad71c33e6b18	d9aeedfe-2467-4f82-8444-66a684323c54	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-20 10:06:23.905
3ff9285e-4450-45a4-ad3f-6735567cc247	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-20 10:25:06.22
d8930e3c-8cd1-4b82-9d4d-fcd152575294	3b514599-3777-4cd7-9b34-aa00942a3be2	mission	6.66	مكافأة مهمة: BTC_USDT	2026-10-20 10:29:52.252
689faf4f-75d8-4c3f-9270-5e60cc3a1f17	58e6b8c8-c075-4558-99c2-4889448030d8	mission	3.33	مكافأة مهمة: BTC_USDT	2026-10-20 10:32:36.479
54642616-7b84-428b-a53a-ffd4420aec0d	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	mission	16.65	مكافأة مهمة: BTC_USDT	2026-10-20 10:40:01.78
\.


--
-- Data for Name: identity_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.identity_verifications (id, "userId", "idType", "frontImage", "backImage", "selfieImage", status, reason, "reviewedBy", "reviewedAt", "createdAt", "updatedAt") FROM stdin;
859f1208-9d59-4483-9e29-38194a5ccbc2	ea9b62f6-cba7-4a87-ba26-954fb933b6a2	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-25 11:51:15.527	2026-09-25 11:47:42.626	2026-09-25 11:51:15.528
9796c2da-7882-41e1-8e75-a232ab532dce	1108910e-6177-4d20-8f9d-a0cf7e3d5026	national_id		\N		rejected	لم يتم قبول الوثائق	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-27 06:48:34.374	2026-09-27 06:42:27.157	2026-09-27 06:48:34.376
e68d1f21-c103-4aea-a8fb-ad0c73d8bf72	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-27 10:27:37.108	2026-09-26 10:30:15.841	2026-09-27 10:27:37.109
cc7e5644-ff8e-4524-878a-479db30109f4	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-27 11:51:09.602	2026-09-26 19:52:46.67	2026-09-27 11:51:09.602
31e1a1ea-8e10-4c02-a24e-45f1e775d0c3	bb485f4c-fc9e-4900-ae36-0e89c8663b40	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-27 14:40:21.146	2026-09-27 14:38:39.251	2026-09-27 14:40:21.147
897a153a-758d-44a4-bcd1-769f64be7d41	606d790f-e7db-477d-977f-6ceeeaa0d0ec	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-29 13:51:52.745	2026-09-29 13:46:22.891	2026-09-29 13:51:52.747
9888365e-717c-490f-a853-678faa79630e	003cb43d-ce1e-43ff-ba6c-86ca6a7d2310	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-29 17:52:56.947	2026-09-29 12:53:34.943	2026-09-29 17:52:56.949
ab8e032f-6b64-4e73-aebd-5c4e9fd91ef2	c556a3ac-9185-490e-8a60-c69e3d832ebe	national_id		\N		rejected	لم يتم قبول الوثائق	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-29 22:48:02.719	2026-09-26 21:14:30.006	2026-09-29 22:48:02.724
696c83ac-f024-4d61-9d6c-11e77d725af4	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-29 22:48:25.564	2026-09-28 14:35:09.128	2026-09-29 22:48:25.565
2452a055-fa78-44b7-b276-2de8e8a3019f	7103cc14-77a0-494d-9fc4-570285f45c84	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-01 18:43:21.674	2026-10-01 17:45:40.999	2026-10-01 18:43:21.674
fd9db93a-cce6-4780-8e06-173bff4fd3d8	4e351b76-af96-4067-afdc-600288f3605a	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-02 19:21:00.386	2026-10-02 14:34:39.078	2026-10-02 19:21:00.386
1c165b5b-bb69-441a-b43e-e5bfbee0589f	016dddc4-d1ab-402e-90b1-536ccd90d807	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-04 07:04:51.171	2026-10-04 07:04:07.781	2026-10-04 07:04:51.172
a42a8f96-0275-432d-89d7-a1abc91f6b6e	d9aeedfe-2467-4f82-8444-66a684323c54	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-04 12:49:22.02	2026-10-04 07:19:59.155	2026-10-04 12:49:22.02
aa622a7b-19c3-4085-a0dd-56ad127483a5	9067689f-eacd-469f-9750-01dcf7b56639	passport		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-05 19:57:04.377	2026-10-05 19:35:50.832	2026-10-05 19:57:04.378
59b7ec53-9e7c-4082-955f-34816b13e386	095ecc95-41a7-43b6-a263-1886b4c22c9f	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-06 09:50:59.707	2026-10-06 09:22:14.18	2026-10-06 09:50:59.707
637db59e-7a85-4b21-9f4a-d6b5b9a70c6e	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-08 09:13:01.992	2026-10-08 09:10:20.897	2026-10-08 09:13:01.992
87f5de2f-05de-4941-9ed8-2541527795d4	df7d86f3-9359-4464-9b32-4d34a7b8a688	national_id		\N		rejected	لم يتم قبول الوثائق	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-15 08:55:17.034	2026-10-14 20:39:24.506	2026-10-15 08:55:17.035
7d6759cd-af50-4a2f-b060-a2bc308e6c4b	3b514599-3777-4cd7-9b34-aa00942a3be2	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-17 20:45:17.204	2026-10-17 20:44:04.963	2026-10-17 20:45:17.204
415e5fba-9bcb-4bab-8d13-8d803a5c02a8	31b656fc-de59-436b-becf-c7d894737e5c	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-17 20:46:00.889	2026-10-17 20:27:22.983	2026-10-17 20:46:00.889
ba216612-3c54-4b8f-bd5b-1292b8014697	14d657c1-afed-4016-ba10-192e4dfaeccb	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-18 02:09:05.599	2026-10-18 02:06:54.099	2026-10-18 02:09:05.599
73f68fd5-8985-4112-9f0a-9705d1a48bb7	c5cd8217-8a89-494f-9b96-f611c4f56a67	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-18 02:23:50.934	2026-10-18 02:23:20.297	2026-10-18 02:23:50.934
5eb6a323-74dd-4798-ade7-a7f1677d0a6c	1b2898e2-82d8-424c-bde3-c788d60a2694	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-18 16:50:35.27	2026-10-18 14:37:04.125	2026-10-18 16:50:35.27
6ad7ae53-734b-440c-aa20-e09355dc7f08	391de937-e58f-4f29-859b-b85533f2c744	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-18 18:01:38.527	2026-10-18 17:55:58.643	2026-10-18 18:01:38.527
d98d7684-c3bb-48c5-a3c0-22ab034591b6	592313e4-4fc0-4e1f-a8bf-eae574995ef2	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 07:59:51.224	2026-10-19 06:48:46.207	2026-10-19 07:59:51.224
b07a2bf2-d1e9-46a3-b686-3a04e7aa9884	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 11:10:11.243	2026-10-19 10:36:33.617	2026-10-19 11:10:11.243
13eb19d5-5f7d-4990-98d6-b641085bde57	13de3fce-19f3-450b-a5e2-c329e3d2c135	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 11:32:10.357	2026-10-19 11:29:05.752	2026-10-19 11:32:10.357
3d52b870-fcf4-4df0-93cd-93eea2862cc4	6cb9dd48-d72a-42f4-a672-d3e4827284d9	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 13:01:53.13	2026-10-19 12:59:29.844	2026-10-19 13:01:53.13
62a49a7a-8384-4eff-a9e8-2f2afafa2f01	162166a0-298d-49e5-974c-b90d1d2d1d16	passport		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 13:02:34.814	2026-10-19 12:51:50.674	2026-10-19 13:02:34.814
b74844c1-a5da-44d3-b887-62200acc6b9e	ecb90262-10ae-42a6-8cac-e8563bb30e60	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 16:43:58.841	2026-10-19 16:30:37.306	2026-10-19 16:43:58.842
2ee4902f-912a-4a59-9ca2-bfe519018d93	58e6b8c8-c075-4558-99c2-4889448030d8	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 17:37:40.072	2026-10-19 17:31:25.399	2026-10-19 17:37:40.072
8de381b2-ea88-46dd-a22b-caa30f60f88b	040b9796-2ddd-4e8e-b55a-f2e85bb2c172	national_id		\N		approved	\N	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-20 10:47:32.557	2026-10-20 10:46:18.198	2026-10-20 10:47:32.557
\.


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_attempts (id, identifier, type, success, "ipAddress", "userAgent", "createdAt") FROM stdin;
037b06d1-bc34-4bbb-936f-7b5cf0868c6d	darwinmark337@gmail.com	login	f	94.47.252.202	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-25 11:45:18.396
a130b041-008c-4335-ab02-3f514a166ded	darwinmark337@gmail.com	login	f	94.47.252.202	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-25 11:45:23.107
a3a58793-bb8b-426d-9af1-b7b6000fcde6	osamaforit@gmail.com	login	f	94.47.252.202	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-25 11:45:40.673
decfe128-5b19-46ff-9ed6-7f84e16e3095	osamaforit@gmail.com	register	t	94.47.252.202	\N	2026-09-25 11:46:34.169
c8b1006d-f0fc-4799-b3b6-c69ab6fb9bdf	aladimmajd@gmail.com	register	t	201.4.71.13	\N	2026-09-26 10:16:54.73
0bde579f-701c-40fa-bc8f-163d685ee73c	aladimmajd@gmail.com	register	t	201.4.71.13	\N	2026-09-26 10:21:01.755
8828f703-ebbf-40f1-bfa9-6e120b53e6ad	aladimmajd@gmail.com	register	t	201.4.71.13	\N	2026-09-26 10:22:10.88
79eddf60-74a4-479a-ab71-b6a3756c5572	aladimmajd@gmail.com	register	t	201.4.71.13	\N	2026-09-26 10:22:41.706
a68f8294-7961-4330-9816-d8b5b2ad1bcc	fcc320c13b@emailnox.live	register	t	201.4.71.13	\N	2026-09-26 10:27:02.458
56d8d688-ae8d-473b-b668-861ac1f52e8b	darwinmark337@gmail.com	login	f	94.47.252.62	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-26 11:27:07.279
4f4e2fad-1553-4eae-ac53-9bdab2365bee	alhlwsh6@gmail.com	register	t	201.4.71.13	\N	2026-09-26 12:12:36.856
1e5f95c7-e73b-4e37-a031-8e4bc19fd35b	admin@aura-trade.com	login	f	201.4.71.13	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-09-26 19:34:56.871
abf7c7b8-c2cb-4837-8893-e60d6d5c2eca	majid2005225@gmail.com	register	t	201.4.71.13	\N	2026-09-26 19:37:57.847
7aec1acb-69fd-47fa-850a-f3dcbdb75dda	mohandeeee64@gmail.com	register	t	129.224.207.240	\N	2026-09-26 19:49:52.423
8ccd61a9-e0fa-4e99-b224-7afd45485363	darwinmark337@gmail.com	login	f	188.247.25.89	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-26 21:10:28.672
a2e64460-c8a3-40d9-b1d7-6771853ee4cd	osamadsa130@gmail.com	register	t	188.247.25.89	\N	2026-09-26 21:11:26.53
f975c1fa-8c03-436f-af8b-7c05a7317d4e	darwinmark337@gmail.com	register	t	94.47.248.233	\N	2026-09-27 06:40:46.326
548dda0a-569d-45d1-86df-6417ed324cfd	hlalalstam880@gmail.com	register	t	191.44.127.2	\N	2026-09-27 09:59:33.211
1fa99da8-57f0-4f9c-874e-fe5690254e53	hlalalstam880@gmail.com	register	t	191.44.127.2	\N	2026-09-27 10:06:21.108
6b252be1-6a49-402f-b9de-7a70235ea1ac	hlalalstam880@gmail.com‬‏	login	f	191.44.127.2	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-09-27 10:10:55.847
3ebc1b0d-fd16-46e8-8543-ca15491fbe48	osamaforit@gmail.com	register	t	94.47.248.233	\N	2026-09-27 14:35:00.815
c765c139-ddf5-41c0-8339-7306a7f3fed7	zxzxzxzxzxcvbnm12345@gmail.com	login	f	191.44.127.7	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36	2026-09-28 06:35:17.732
87e1bcb7-c3d5-49b4-b58f-49e675fbb5ef	darwinmark337@gmail.com	login	f	94.47.248.233	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36	2026-09-28 14:16:44.732
0de12ccd-0a8c-4c5f-a2c7-f972e669e0d8	osamadsa130@gmail.com	register	t	94.47.248.233	\N	2026-09-28 14:17:08.637
0962ae4d-442c-4322-b6db-697dd84265c9	osamadsa130@gmail.com	register	t	94.47.248.233	\N	2026-09-28 14:20:29.301
b3ccb588-fc72-4b2b-ba97-1978370a88d4	osamadsa130@gmail.com	register	t	94.47.248.233	\N	2026-09-28 14:33:30.282
3419f442-75b0-436d-894f-5d0e4f7d9711	mlnjbhvgcfxdxx@gmail.com	register	t	201.4.71.28	\N	2026-09-29 12:44:47.06
191d5c35-ad77-4eaa-b3b6-c54390bc1401	darwinmark337@gmail.com	register	t	94.47.248.183	\N	2026-09-29 13:44:27.774
759e6619-aed3-4b5d-a3b1-ad5925b1d85d	reanhfoaz2016@gmail.com	register	t	149.34.213.101	\N	2026-09-30 00:21:21.52
487a23ae-226b-4a20-aab4-a449c12b27f5	aa12345678aafh	login	f	149.34.213.101	Mozilla/5.0 (Linux; Android 10; Redmi Note 7 Build/QKQ1.190910.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.7049.79 Mobile Safari/537.36 XiaoMi/MiuiBrowser/14.54.0-gn	2026-09-30 00:58:58.374
76d6467d-5ccf-4e25-a3ed-80491856ad7a	aboreanh2016@gmail.com	register	t	149.34.213.101	\N	2026-09-30 01:00:46.762
a82c0f3e-9b92-4125-91d8-f1f1bfd39512	ktacqfua@gmail.com	register	t	176.220.64.200	\N	2026-10-01 17:43:21.579
5583e0bf-3803-4525-b872-9ba3b504a478	mndkfjkenfosndonwkdn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-01 18:59:18.06
894bcf94-e3d1-4d6d-a49e-4c2d657d5f47	abwbdallhqhtany931@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-01 19:02:17.367
c7b34071-fa9f-4edb-b722-fe2c38197782	mndkfjkenfosndonwkdn@gmail.com	reset	f	201.4.71.186, 89.222.123.193	\N	2026-10-01 19:02:27.361
41ab118d-d66b-40ad-99db-2cc83f9ed062	mndkfjkenfosndonwkdn@gmail.com	reset	f	201.4.71.186, 89.222.123.193	\N	2026-10-01 19:05:55.438
48f64578-e74a-4ecd-8e20-e09af5ea1aea	mndkfjkenfosndonwkdn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-01 19:19:45.073
3dc647b4-4c3f-4f06-b7bd-254e001f232b	mndkfjkenfosndonwkdn@gmail.com	reset	f	201.4.71.186, 152.233.12.241	\N	2026-10-01 19:19:58.441
b41e040e-85fb-4a67-8e36-57d18184c0ff	mndkfjkenfosndonwkdn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-01 20:15:22.592
8c4e9b0c-980f-4254-b12b-c39ef95b32ae	abwbdallhqhtany931@gmail.com	reset	f	201.4.71.186, 152.233.13.165	\N	2026-10-01 20:15:47.547
d3d417c3-c8f1-46e4-804c-0cdcd318d45b	abwbdallhqhtany931@gmail.com	reset	f	201.4.71.186, 89.222.123.194	\N	2026-10-02 10:28:55.609
bdd91ac5-497b-424c-8a4c-b487ac210915	abwmsharyalqady8@gmail.com	register	t	201.4.71.28	\N	2026-10-02 14:29:03.646
a22386bb-cc53-4bf2-8f26-70454ba55ee2	alrslany26@gmail.com‬‏	login	f	201.4.71.8	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	2026-10-02 19:09:53.951
95a26d5a-bbb9-4dd2-bc9c-951edb1e4e03	alrslany26@gmail.com‬‏	login	f	201.4.71.8	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	2026-10-02 19:10:22.066
d87d44b2-c1e4-47b4-bc4c-074634213d54	alrslany26@gmail.com‬‏	login	f	201.4.71.8	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	2026-10-02 19:10:24.119
0dcc5d37-cab9-46ac-8a16-155cf689010e	alrslany26@gmail.com‬‏	login	f	201.4.71.8	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	2026-10-02 19:10:25.851
a266d18c-680b-42ba-9cf3-a48cdbb74163	alrslany26@gmail.com‬‏	login	f	201.4.71.8	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	2026-10-02 19:10:39.24
bd19059a-7f9d-4960-a66b-b8eec5a2998a	alrslany26@gmail.com	register	t	201.4.71.8	\N	2026-10-02 19:48:14.366
df75ea37-2446-412f-8075-590ce3dd9d2a	alrslany26@gmail.com‬‏	login	f	201.4.71.8	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36	2026-10-02 19:50:29.174
1c2e5356-fe94-4dab-a9a9-5c66590f7183	asmarem@gmail.com	register	t	94.252.198.233	\N	2026-10-02 22:07:44.631
71d9aded-6ddc-4c18-8cd6-5e1319afd64c	zxcasdwwe777@gmail.com	reset	f	46.213.110.162, 79.127.178.82	\N	2026-10-03 10:27:59.484
8d01ecf0-db23-43c1-91c0-104993b581a6	azsxffgt55@gmail.com	login	f	149.34.213.101	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-03 15:58:10.868
c9d4e8ba-087e-4b7f-9a00-497b3af4dfd9	alshhranyq5@gmail.com	login	f	149.34.213.101	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-03 16:02:04.381
468cd6db-7927-42bc-b811-67b12d2dc079	alshhranyq5@gmail.com	login	f	149.34.213.101	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-03 16:02:27.517
0b6041d5-af01-45a2-b601-bdff2313b064	alamaratabwzby762@gmail.com	login	f	149.34.213.101	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-03 16:05:07.827
7b74d1a3-78bb-41b0-a76e-939d6a86a14f	alamaratabwzby762@gmail.com	register	t	149.34.213.101	\N	2026-10-03 16:06:50.564
c109d873-9701-4818-969b-b2414dfc31f8	frhanabwfhd029@gmail.com	register	t	191.44.127.11	\N	2026-10-03 16:42:37.927
575fc012-6c98-41cd-b9ce-61f953d01589	frhanabwfhd029@gmail.com	register	t	191.44.127.11	\N	2026-10-03 16:53:36.941
9837ad3a-1af7-4b8f-a15e-9bc89801202b	frhanabwfhd029@gmail.com	register	t	191.44.127.11	\N	2026-10-03 16:55:16.725
5342e1c2-0dfc-4fa8-adf9-b917a96ac515	frhanabwfhd029@gmail.com	register	t	191.44.127.11	\N	2026-10-03 17:09:48.233
f666d479-26e7-4a39-a2cd-b085c30a1b2f	aburayan19898s@gmail.com	login	f	201.4.71.28	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Mobile/15E148 Safari/604.1	2026-10-03 20:21:21.38
804f9ae4-f5d4-4dd4-a18a-5e71b18cbd4b	aburayan19898s@gmail.com	register	t	201.4.71.28	\N	2026-10-03 20:22:21.105
53fca1c5-1457-438a-b12e-8cd496ee93e5	admin@aura-trade.com	login	f	191.44.127.2	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36	2026-10-03 22:48:30.818
40d43416-c4da-42df-b3c3-23a8dff6dd01	darwinmark337@gmail.com	login	f	169.150.196.85	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	2026-10-04 06:57:02.686
2a6f7095-7b2e-49b3-aab1-3677808ad69d	osamadsa130@gmail.com	register	t	94.47.251.172	\N	2026-10-04 06:59:37.95
e8791859-3ada-422d-8412-b9742bc4cd53	عمر  العنزي	login	f	45.149.24.18	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 14:05:50.186
b82d2487-5d6b-4a7b-8565-bc4280a334ba	abuhamdan77752@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 14:07:52.767
965cc07a-c435-4108-be98-235ae48ff6f1	abuhamdan77752@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 14:08:07.666
fa21b19e-2065-4232-aafc-fffc4ae74e48	alhlwsh6@gmail.com‬‏	login	f	191.44.127.7	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 18:25:29.936
df95b138-deef-4230-b8f0-9c552d2207b8	alhlwsh6@gmail.com‬‏	login	f	191.44.127.7	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 18:25:42.419
a8c4a023-e84c-41b3-be22-8b5b364a4f96	alhlwsh6@gmail.com‬‏	login	f	191.44.127.7	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 18:25:47.551
4160f742-2e41-4f12-9ccf-53bc4d317587	alhlwsh6@gmail.com‬‏	login	f	191.44.127.7	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 18:26:09.421
361f0099-8ab2-4ef1-9118-1cdae430c5a7	alhlwsh6@gmail.com	reset	t	191.44.127.7, 212.102.36.194	\N	2026-10-04 18:26:58.668
31d5d324-9a52-4d66-83c5-a56d049589bc	alhlwsh6@gmail.com‬‏	login	f	191.44.127.7	Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 Safari/537.36 HIBrowser/v3.01.02.1	2026-10-04 18:28:38.984
8587865b-bcac-440e-9f05-76e49eaa3349	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-05 16:00:58.832
8cb93896-2e35-4970-bede-a615de561dc4	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-05 16:01:00.625
265d5d67-59a8-4096-a509-65b7aa483ef7	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-05 16:01:02.245
6a1fef98-ada2-4383-b655-93f88f7fbded	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-05 16:01:03.257
5ca49cee-47f0-437e-b349-9609b4efc375	ahmdalali1238@gmail.com	login	f	201.4.71.27	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-05 19:18:19.572
eded206a-111f-4e76-9ddd-6acb065a8b8a	ahmdalali1238@gmail.com	register	t	201.4.71.27	\N	2026-10-05 19:25:30.963
de158925-fa38-47c5-ab4f-fe62f03633a7	wylanalnzy059@gmail.com	register	t	9.246.91.171	\N	2026-10-06 09:17:49.863
ae764bc2-16e6-4c1c-9b56-a6815351e2f5	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-06 09:40:54.701
02a47272-a0de-42e9-a72c-a4d035fad5fc	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-06 09:40:56.689
200b0e38-93e7-4940-87b6-423e6c7a1638	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-06 09:40:58.73
ad0fa182-68e4-4f4a-a4b9-f28292c89fee	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-06 09:42:52.606
0f48c538-ae05-4f3d-922a-9fc3e6cd3d44	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-06 09:42:54.844
bce4c533-2496-4506-975f-091f8ca56bf1	hlalalstam880@gmail.com‬‏	login	f	45.89.172.220	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-08 07:47:01.503
b5ca8b6a-2398-48d9-b077-23319cd98d56	hlalalstam880@gmail.com‬‏	login	f	45.89.172.220	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-08 07:47:04.2
4e794378-6a5c-45c0-ae14-2c9e3c6c30a6	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-08 07:56:50.795
6933b73a-1a08-4a90-b249-1bba9a9834b7	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-08 07:56:52.397
6c9c47e6-5655-4b0e-bae2-ff037fa57509	hlalalstam880@gmail.com‬‏	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2026-10-08 07:56:56.001
fbb5bbb5-a610-4d12-8bc3-e730b3e30f41	jasr08516@gmail.com	register	t	222.167.236.49	\N	2026-10-08 08:50:28.985
17875712-a173-4f9d-a599-89acc171882c	hlalalstam880@gmali.com	login	f	222.167.236.49	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-10-08 08:57:18.406
140b506c-d690-48c8-a611-d0666186b71d	hlalalstam880@gmali.com	reset	f	222.167.236.49, 212.102.36.194	\N	2026-10-08 08:57:27.108
95aafbe6-3bd6-4eb2-8fa3-8bbe5ab26c34	hlalalstam880@gmail.com	reset	t	222.167.236.49, 152.233.12.241	\N	2026-10-08 09:05:49.613
9751949c-a044-4bc2-a8f2-4cf1a68ea341	hlalalstam880@gmail.com‬‏	login	f	222.167.236.49	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-10-08 09:07:15.793
8b2aaa9d-61aa-4f8d-a57f-f44efbdbd85b	hlalalstam880@gmail.com‬‏	login	f	222.167.236.49	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-10-08 09:07:55.354
c4a513cf-7d1f-4f97-a8d9-0240af999969	hlalalstam880@gmail.com‬‏	login	f	222.167.236.49	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-10-08 09:09:16.76
e0cdf91d-04be-45be-9ca0-4766dcd70e75	fgdewrdf@gmail.com	login	f	46.213.180.150	Mozilla/5.0 (Linux; Android 15; en; TECNO CL6 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.39 HiBrowser/v3.00.05.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36	2026-10-08 10:17:24.994
4ca01706-9cd4-4caf-ace2-612309a1f8e9	fgdewrdf@gmail.com	login	f	46.213.180.150	Mozilla/5.0 (Linux; Android 15; en; TECNO CL6 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.39 HiBrowser/v3.00.05.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36	2026-10-08 10:17:38.023
58478c25-3f5a-4aef-be81-bb25c50aed4d	zxcasdwwe777@gmail.com	reset	f	46.213.180.150, 79.127.178.81	\N	2026-10-08 10:17:43.285
0c8acd08-d8ba-4c41-b912-ec8dab3e8cab	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; U; Android 15; ar-sa; 25028RN03A Build/AP3A.240905.015.A2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.7922.199 Mobile Safari/537.36 Lite Browser/4.16	2026-10-09 19:10:23.725
e5331df6-259e-479a-897e-4c442bdb1a4b	mhmabnoorahmabale711@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; U; Android 15; ar-sa; 25028RN03A Build/AP3A.240905.015.A2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.7922.199 Mobile Safari/537.36 Lite Browser/4.16	2026-10-09 19:12:18.074
8e12c591-3925-4a77-9095-6e606ffdce01	mhmabnoorahmabale711@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; U; Android 15; ar-sa; 25028RN03A Build/AP3A.240905.015.A2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.7922.199 Mobile Safari/537.36 Lite Browser/4.16	2026-10-09 19:12:52.441
c04c8dd6-9f9a-41a6-be6e-fee5e9b17f4f	salh123salh@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:14:28.569
bae306c1-9efc-4852-9a6b-bb339b9bc7f0	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:16:29.067
3386eb69-5773-456d-ba19-ee1bbe636af2	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:16:50.967
f04354da-1c7f-4e86-a602-09ba7a68737d	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:17:07.365
55e1dfd7-ff53-40ff-a903-66af30ea5fa6	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:17:10.883
71d69539-7cd0-4a4b-9590-99474266a611	sslwh3309@gmail.com	register	t	45.149.24.18	\N	2026-10-09 19:28:08.857
5883772a-43e6-4abd-be8d-7c66a9508fc5	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:31:25.403
5e1db69c-d381-459f-bcbf-55ab9339bb55	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:31:32.828
5c92cc7c-1db7-4b11-b85b-900eaf48e6e1	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:36:11.303
71427035-78cb-4803-a053-99e4d093cf3a	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:36:18.814
591bfbc0-f2b3-4159-9ebb-3c447420eaaa	sslwh3309@gmail.com	login	f	45.149.24.18	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-09 19:36:47.55
e6637ef4-71fa-4fbe-a3e2-e47903c91689	mndkfjkenfosndonwkdn@gmail.com	reset	f	201.4.71.186, 152.233.12.242	\N	2026-10-14 17:07:43.584
cb2b9400-2052-4fcf-8887-02a39c563d5a	mndkfjkenfosndonwkdn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-14 17:08:51.839
ab2eaee0-ffc6-4f3f-984c-eb3aa996e083	mndkfjkenfosndonwkdn@gmail.com	register	t	201.4.71.186	\N	2026-10-14 20:36:27.032
c7b028fc-f8fb-4253-9bda-0d8ec9cf06ed	aaaasd	login	f	191.44.127.11	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36	2026-10-15 09:24:42.744
7a74891b-f5f5-423c-9a3e-ea4790ecc020	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:22:50.895
f321736f-5f7e-4318-bed9-693540eab36e	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:26:06.151
6734f918-3b5b-4f88-be6e-71026372a276	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:26:19.844
07597536-eb2a-4a40-bbdc-7782f0b73ed2	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:31:09.228
e3e2b5aa-8bb9-41ca-bc40-83b6592e29a8	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:41:18.126
0c5255f4-95d8-4bbc-b83d-b79d002055d1	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:43:40
a69f8d7f-86a5-4125-b5f6-a4b16e8a7237	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:55:26.665
ea4915f6-87f4-416a-8b54-87949e5fbf24	اسماعيل عايد العيد	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:56:32.525
727069b3-bac6-4963-8d56-906ea9eccc0c	اسماعيل عايد العيد	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:56:46.113
6641f349-9416-40b1-9090-86f940db24d6	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:56:57.696
976b21dd-2a84-4b35-bddf-abeec90c3175	اسماعيل عايد العيد	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 13:57:32.493
8ed2836c-4156-49bc-9b17-222d62f70d11	abwwylsmyn@gmail.com	reset	f	201.4.71.186, 152.233.13.164	\N	2026-10-15 13:57:50.097
2bfb1dfa-4236-4e48-9688-f35b169305ff	wabw18924@gmailcom	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 14; en; Infinix X6731B Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.199 HiBrowser/v3.00.07.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36 channel/GooglePlay	2026-10-15 14:09:07.541
e02df38a-69b1-44f8-9723-a2f2e0df44d0	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-15 14:51:32.965
325756a0-bd0b-45d7-b43d-8d8995a16d2e	abwwylsmyn@gmail.com	reset	f	201.4.71.186, 212.102.36.193	\N	2026-10-15 14:51:59.447
1e688cc9-5a5d-4556-a779-fd3aea0648aa	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-15 14:57:35.662
25f25855-8a84-4792-b027-5ddb9eff8077	abwwylsmyn@gmail.com	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-15 16:52:52.203
f9e2d712-3297-4568-a2a3-e93dec57eb0e	abwwylsmyn@gmail.com	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-15 16:53:44.85
698e7797-8cd8-4515-ab49-8556083042f3	abwwylsmyn@gmail.com	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-15 16:53:49.24
2fc0657d-e33c-4ddc-877c-dca75716a74d	abwwylsmyn@gmail.com	login	f	201.4.71.28	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-15 16:54:13.564
39d948a8-987c-447b-b8aa-29b75eece278	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-16 09:36:42.837
4236ceb0-06d8-4a19-9e1e-d8249f0b52dc	wabw18924@gmail.com	reset	f	201.4.71.186, 89.222.123.193	\N	2026-10-16 09:37:09.856
b28356e5-b78c-4700-acd9-52a41985eb32	abuhamdan77752@gmail.com	login	f	45.149.24.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36	2026-10-16 22:31:16.731
9c8e313e-2693-4e9a-a4ab-dce5587f1e08	عمر  العنزي	login	f	45.149.24.194	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36	2026-10-16 22:31:32.705
19503d1f-a0aa-4335-bbc7-4382ec6aaa99	33245@gmail.com	login	f	154.183.223.83	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	2026-10-17 14:28:11.118
1d4a8b06-7eb3-4256-92b9-b0a3b1eb0161	33245@gmail.com	register	t	154.183.223.83	\N	2026-10-17 14:28:58.704
e76152a8-415d-4a26-8195-0b5c058cfd12	kahim73994@iconcubic.com	register	t	154.183.223.83	\N	2026-10-17 14:31:07.362
20eab16f-b113-44ff-8b89-5f8f87a5477f	ahmethelal2001@gmail.com	register	t	46.213.209.25	\N	2026-10-17 20:22:57.088
53f1e25e-663e-40fa-89a4-294977140fd2	ysyalnzyy130@gmail.com	register	t	201.4.71.13	\N	2026-10-17 20:42:42.597
09fdbd92-efc8-4632-b608-b056c151fd2d	lyanlamyrh1@gmail.com‬‏	login	f	149.34.213.101	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36	2026-10-17 21:26:54.926
6b04621b-4411-499a-945b-8a1c05a9edc6	aasdfghjklqwertyuiop2004@gmail.com	register	t	201.4.71.13	\N	2026-10-18 02:02:10.173
ef076b44-04db-4630-9ff7-028af455003a	ghanmalshmryy108@gmail.com	login	f	205.209.65.172	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36	2026-10-18 02:16:52.602
7fef5c20-fdf0-4483-88de-a1b0fcfc9ffa	ghanmalshmryy108@gmail.com	register	t	205.209.65.172	\N	2026-10-18 02:19:21.298
ac740e91-29f6-4ef7-ad12-fca2f4c97a86	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-18 11:51:42.662
eee7a7e0-399b-4c9d-9c40-9a30e3ac0a59	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-18 11:51:55.57
7d8791ac-81c5-4974-aa73-5b29aeb7e997	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-18 11:52:01.795
0bcccae3-5945-45ed-baa0-29e9e7f0cb5f	abwwylsmyn@gmail.com	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-18 11:52:10.151
7b7c2a45-ded1-4d71-8531-9b74374b9aee	اسماعيل عايد العيد	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-18 11:54:03.715
a82b78de-da37-4954-9dc7-077f5610b266	wabw18924@gmailcom	login	f	201.4.71.186	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36	2026-10-18 11:55:30.613
4bcfd519-0c01-4d64-8453-f0d0aaf13daf	kurdo.a.z.90762@gmail.com	login	f	217.18.211.171	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-18 14:19:27.854
2ddd3b07-cf4f-4a56-a09e-3ff6391c3aa0	kurdo.a.z.90762@gmail.com	login	f	217.18.211.171	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-18 14:19:40.052
8d2ebdf6-b6f9-446c-94ec-3e2254103ddf	kurdo.a.z.90762@gmail.com	login	f	217.18.211.171	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-18 14:20:33.22
5db00c56-652b-49d8-9894-907359ae5da8	kurdo.a.z.90762@gmail.com	login	f	217.18.211.171	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-18 14:20:35.396
4ce1b74b-2822-4483-8853-3bf95352d005	kurdo.a.z.90762@gmail.com	login	f	217.18.211.171	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-18 14:20:37.791
907ebf20-4281-45a9-83e4-3a463bc64eb4	kurdo.a.z.90762@gmail.com	register	t	217.18.211.171	\N	2026-10-18 14:26:20.004
bf520fd4-cefe-471c-b5aa-10aaa162154c	ahmadmmdoh1133@gmail.com	register	t	217.142.25.244	\N	2026-10-18 17:20:01.2
c302572b-cf8a-4cc8-aea6-2d4280c7d10d	fjr1988	login	f	217.142.25.244	Mozilla/5.0 (Linux; Android 16; Infinix X6873 Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.8037.106 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-18 17:22:02.763
55710627-201a-48c9-9627-6bfee72c51c3	fjr1988	login	f	217.142.25.244	Mozilla/5.0 (Linux; Android 16; Infinix X6873 Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.8037.106 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-18 17:22:12.396
dd5e279b-00e2-4223-acde-970f7b4241d1	ahmadmmdoh1133@gmail.com store/apps/details?	login	f	217.142.25.244	Mozilla/5.0 (Linux; Android 16; Infinix X6873 Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.8037.106 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-18 17:22:23.934
bb9f208c-c948-48a3-9f23-e18389541a06	ahmadmmdoh1133@gmail.com	register	t	217.142.25.244	\N	2026-10-18 17:23:47.236
772a9afe-cb3e-4c6e-a14a-ff996051a923	ahmadmmdoh1133@gmail.com	login	f	217.142.25.244	Mozilla/5.0 (Linux; Android 16; Infinix X6873 Build/BP2A.250605.031.A3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.8037.106 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-18 17:32:18.599
65d0c2c4-4a7d-4fc5-9e55-c22de307becd	ahmadmmdoh1133@gmail.com	register	t	217.142.25.244	\N	2026-10-18 17:33:32.957
4c031af0-aa0a-4743-9445-2367435502b9	ahmadmmdoh1133@gmail.com	register	t	217.142.25.244	\N	2026-10-18 17:37:15.938
9d7dc013-0617-4b26-84f0-dcb2fbc6b485	ahamad5557gj@gmail.com	register	t	217.142.25.244	\N	2026-10-18 17:41:19.496
f226672a-1aca-4ba5-8acb-bc067758da12	ahamad5557gj@gmail.com	register	t	217.142.25.244	\N	2026-10-18 17:42:46.555
1f54cd9b-9cc6-47ce-aba1-223d17e718fc	ahamad5557gj@gmail.com	register	t	205.209.93.71	\N	2026-10-18 17:48:12.763
564eff64-5f2c-4d54-b31b-cbd076dbd317	ahmadmmdoh1133@gmail.com	register	t	205.209.93.71	\N	2026-10-18 17:51:28.933
b6065179-79b1-4274-be9a-86968e3b04b2	ahamad5557gj@gmail.com	register	t	205.209.93.71	\N	2026-10-18 17:53:55.642
17fc7de1-78c0-48d2-bd4a-4c55d6638405	ahmad19881988	login	f	205.209.93.71	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36	2026-10-18 17:56:28.271
d3dd6e93-b59e-4cff-9a70-f9e20d15c94c	ahamad5557gj@gmail.com‬‏	login	f	205.209.93.71	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36	2026-10-18 17:56:38.501
5605640a-5747-4bdf-8281-827add74dea8	ahamad5557gj@gmail.com‬‏	login	f	205.209.93.71	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36	2026-10-18 17:57:01.41
4be97074-ddb8-4c3c-b04e-d916907fb6e6	shsjdgusbb@gmail.com	login	f	135.125.207.144	Mozilla/5.0 (Linux; Android 15; 25028RN03A Build/AP3A.240905.015.A2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.7922.199 Mobile Safari/537.36	2026-10-18 19:05:59.105
307faf62-b71a-48cd-8a71-3ce8bd872e23	shsjdgusbb@gmail.com	login	f	135.125.207.144	Mozilla/5.0 (Linux; Android 15; 25028RN03A Build/AP3A.240905.015.A2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.7922.199 Mobile Safari/537.36	2026-10-18 19:06:28.116
d4545166-19fb-4eb6-a69b-1cf223e9ecdd	abwshrydt451@gmail.com	login	f	191.44.127.113	Mozilla/5.0 (Linux; Android 16; MTN-NX1 Build/HONORMTN-N21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/153.0.8010.36 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/582.0.0.61.92;]	2026-10-18 20:43:00.205
e588f327-7d6b-4e63-8fdd-2c59324960f8	abwshrydt451@gmail.com	login	f	191.44.127.113	Mozilla/5.0 (Linux; Android 16; MTN-NX1 Build/HONORMTN-N21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/153.0.8010.36 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/582.0.0.61.92;]	2026-10-18 20:43:03.719
d5fe84f7-7745-44c2-887e-c679f8cd1aae	abwshrydt451@gmail.com	login	f	191.44.127.113	Mozilla/5.0 (Linux; Android 16; MTN-NX1 Build/HONORMTN-N21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/153.0.8010.36 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/582.0.0.61.92;]	2026-10-18 20:43:11.241
12487ba4-74e1-45e1-9b30-4fcfb3f01826	abwshrydt451@gmail.com	login	f	191.44.127.113	Mozilla/5.0 (Linux; Android 16; MTN-NX1 Build/HONORMTN-N21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/153.0.8010.36 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/582.0.0.61.92;]	2026-10-18 20:43:12.666
95dfd521-24e7-4df2-925d-9db5042b48f8	abwshrydt451@gmail.com	login	f	191.44.127.113	Mozilla/5.0 (Linux; Android 16; MTN-NX1 Build/HONORMTN-N21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/153.0.8010.36 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/582.0.0.61.92;]	2026-10-18 20:43:13.755
5bdf8c78-7c8c-4f28-862d-8bf258509d4d	abwshrydt451@gmail.com	reset	f	191.44.127.113, 152.233.39.33	\N	2026-10-18 20:43:18.971
7428e6b9-c265-4d8e-a3a6-1b1cc235ae5f	abwshrydt451@gmail.com	register	t	191.44.127.113	\N	2026-10-18 20:49:35.51
2c4b1803-0c85-4e76-bc6b-d5a753c2f43b	mohammadhelal2488@gmail.com	login	f	178.52.59.150	Mozilla/5.0 (Linux; Android 11; SM-A105F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.8037.57 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/582.0.0.61.92;]	2026-10-19 06:40:50.316
e5b61eed-aa52-447d-a003-074e8123b825	bdallhhjly760@gmail.com	register	t	201.4.71.30	\N	2026-10-19 06:40:59.086
cc82928e-b2bf-4995-b73e-445f910fa68d	mohammadhelal2488@gmail.com	register	t	178.52.59.150	\N	2026-10-19 06:42:16.766
867ea6f3-85af-4d14-9aa6-e8622135a0ae	alyasyny240@gmail.com	login	f	89.43.135.14	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 10:29:08.178
7bf3f204-08f9-4638-82b4-429b06d0b0fa	alyasyny240@gmail.com	login	f	89.43.135.14	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 10:29:20.929
5e22ceeb-492f-43bc-8bb1-32aa8176bb73	alyasyny240@gmail.com	login	f	89.43.135.14	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 10:29:33.072
d62afb18-8e94-480e-8c26-da9cb2a46b20	awfcxhu77@gmail.com‬‏	login	f	89.43.135.14	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 10:29:48.817
be4eb047-6585-4d4f-b6af-7039e17f92cc	awfcxhu77@gmail.com‬‏	login	f	89.43.135.14	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 10:29:52.538
d7725a19-a894-4b2c-b8d5-c5f9ad5ea4fa	fhedan411@gmail.com	register	t	201.4.71.162	\N	2026-10-19 10:34:03.61
d4ab085f-05c8-441f-8f2d-1f8032bf801b	alyasyny240@gmail.com	login	f	89.43.135.14	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 10:38:36.92
23eaf96c-7432-4952-a682-283ad85a5792	alyasyny240@gmail.com	register	t	89.43.135.14	\N	2026-10-19 10:40:25.345
d6c80d36-9b10-4c9d-b067-31aacc7454f2	alyasyny240@gmail.com	register	t	89.43.135.14	\N	2026-10-19 10:42:36.509
1c3b30a6-9122-4c90-85cc-1a257c5bbed3	alyasyny240@gmail.com	register	t	89.43.135.14	\N	2026-10-19 11:03:14.079
2002dee3-261c-40e8-a06a-106ec5204e17	alyasyny240@gmail.com	register	t	89.43.135.14	\N	2026-10-19 11:07:51.155
4de41acd-9c31-4589-bf08-8f450b210a6f	alyasyny240@gmail.com	login	f	178.52.214.147	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 11:17:03.816
b655ec2e-4f91-4d37-9ec1-c58aed7d2d11	alyasyny240@gmail.com	login	f	178.52.214.147	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 11:18:12.302
3c846e9b-a98e-4cdc-9c15-ca4f672c17b3	alyasyny240@gmail.com	login	f	178.52.214.147	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 11:18:15.796
89bd7ccd-64a6-41d2-8dfc-8197d74aa455	alyasyny240@gmail.com	login	f	178.52.214.147	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 11:18:17.711
a17c4e85-32a3-4446-8ca7-e4fbe0235016	alyasyny240@gmail.com	login	f	178.52.214.147	Mozilla/5.0 (Linux; Android 13; M2101K6P Build/TKQ1.221013.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/150.0.7871.181 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.29.95;]	2026-10-19 11:18:19.619
e3aa8fc7-35fd-4445-96a8-49ddc32b016f	fgdewrdf@gmail.com	login	f	46.213.7.130	Mozilla/5.0 (Linux; Android 15; en; TECNO CL6 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.39 HiBrowser/v3.00.05.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36	2026-10-19 11:24:17.188
50d4c3f3-6c0b-418b-a52d-dcb0e9f97bf2	alyasyny240@gmail.com	register	t	89.43.135.14	\N	2026-10-19 11:26:28.014
f946bac4-5226-4b2b-be04-83a02cf64480	fgdewrdf@gmail.com	login	f	46.213.7.130	Mozilla/5.0 (Linux; Android 15; en; TECNO CL6 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.39 HiBrowser/v3.00.05.02;lang=ar;nation=SA;locale=ar_EG UWS/ Mobile Safari/537.36	2026-10-19 11:36:23.514
ea54c7a6-21a6-47a2-b53d-a8ec8c9e3fc2	asamtalfdany23@gmail.com	register	t	201.4.71.13	\N	2026-10-19 11:52:48.662
69ff4b8a-2055-4e24-9569-d7b0e967ecbc	ayudalanzy7980@gmail.com	login	f	222.167.236.70	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 12:20:13.404
4ce91c72-f0db-43ca-81e5-945ddeee6e6b	ayudalanzy7980@gmail.com	login	f	222.167.236.70	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 12:20:22.98
4380cab4-70cb-4f4a-8ddb-0bc637706bc6	allisamr66@gmail.com	register	t	205.209.66.137	\N	2026-10-19 12:44:26.464
f3facf33-6390-4799-b113-10bfec77d4f4	alsyahahmd21@gmail.com	register	t	201.4.71.162	\N	2026-10-19 12:48:20.733
f9358d80-8720-4ee6-a263-d74f99b2f754	admin@aura-trade.com	login	f	222.167.236.49	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-19 15:25:47.865
e1320cb2-604a-4b2e-9434-68378f12c76c	ⓜⓗⓜⓑ.012ⓜⓟⓛ@ⓖⓜⓐⓘⓛ.ⓒⓞⓜ	login	f	205.209.88.236	Mozilla/5.0 (Linux; Android 14; Infinix X6532 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/155.0.8059.43 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/575.0.0.48.90;]	2026-10-19 16:03:10.594
bc27e3bd-976e-43ce-a97a-ad8036696b8d	mhmb.012mpl@gmail.com	login	f	205.209.88.236	Mozilla/5.0 (Linux; Android 14; Infinix X6532 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/155.0.8059.43 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/575.0.0.48.90;]	2026-10-19 16:03:44.041
66e7f6bf-9040-48e7-a519-4383e04d122e	mhmb.012mpl@gmail.com	login	f	205.209.88.236	Mozilla/5.0 (Linux; Android 14; Infinix X6532 Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/155.0.8059.43 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/575.0.0.48.90;]	2026-10-19 16:03:46.587
f90b2066-683d-4102-8ca3-36e971f9ca0a	rafta3195@gmail.com	register	t	205.209.88.236	\N	2026-10-19 16:21:08.881
97a27a8d-cec7-4e76-907b-1e1f3c57246b	ayudalanzy7980@gmail.com	login	f	222.167.236.70	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 16:26:44.565
91cba123-21ef-40ea-8590-93e140956f51	ayudalanzy7980@gmail.com	login	f	222.167.236.70	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	2026-10-19 16:27:02.237
4bc4faa9-dc6b-4447-b474-8ee0a763e210	rafta3195@gmail.com	register	t	205.209.88.236	\N	2026-10-19 16:27:39.2
af79cbb5-5577-48d3-a336-eab112170b97	اسامة النايف	login	f	222.167.236.49	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36	2026-10-19 17:28:03.41
5ac71321-ff19-48ba-bf95-5cadeeb88573	اسامة النايف	login	f	222.167.236.49	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36	2026-10-19 17:28:06.869
8d5316f7-02d1-4d85-ba4c-a18029710fbf	asamtalfdany23@gmail.com	register	t	222.167.236.49	\N	2026-10-19 17:29:54.445
63e8d410-2a23-4fa1-81a1-878f258eb015	mhamadsiqkyrn@gmail.com	register	t	201.4.71.221	\N	2026-10-19 18:53:31.29
b1e8a768-b466-45c9-8292-c4e56a72c46d	amwiwj	login	f	201.4.71.221	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-19 18:54:11.918
93e50e7c-ea89-45ac-ba99-4151bbe3767c	amwiwj	login	f	201.4.71.221	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-19 18:54:13.679
813098c3-4d60-4365-ab62-12a15b71f469	amwiwj	login	f	201.4.71.221	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-19 18:54:14.717
b60a0d18-cd04-4f64-81f6-0e73d39c681c	amwiwj	login	f	201.4.71.221	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36	2026-10-19 18:54:15.828
24973694-5aa5-46ae-ac5f-409c74b287d9	ahmad	login	f	89.43.135.99	Mozilla/5.0 (Linux; Android 12; TECNO BF7 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/151.0.7922.199 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.39.55;IABMV/1;]	2026-10-20 02:02:11.994
f6544bc7-8efe-452c-a152-b5f77149c740	fhda67260@gmail.com	login	f	201.4.71.13	Mozilla/5.0 (Linux; Android 15; Infinix X6725 Build/AP3A.240905.015.A2) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.260 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/583.0.0.39.55;IABMV/1;]	2026-10-20 08:54:35.864
8a455ffb-d668-4214-88ea-847f4b172b33	sedar2535@gmail.com	register	t	205.209.66.132	\N	2026-10-20 10:42:24.417
252a307f-cda5-4093-914c-f970c0b4975f	twnysrdyn@gmail.com	login	f	205.209.92.113	Mozilla/5.0 (iPhone; CPU iPhone OS 26_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23G71 Safari/604.1 [FBAN/FBIOS;FBAV/566.1.0.59.72;FBBV/998154334;FBDV/iPhone14,3;FBMD/iPhone;FBSN/iOS;FBSV/26.6;FBSS/3;FBID/phone;FBLC/ar_AR;FBOP/5;FBRV/1005026465;IABMV/1]	2026-10-20 10:44:03.031
ea4cf033-c245-4847-b81d-259571d4e4ef	twnysrdyn@gmail.com	login	f	205.209.92.113	Mozilla/5.0 (iPhone; CPU iPhone OS 26_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23G71 Safari/604.1 [FBAN/FBIOS;FBAV/566.1.0.59.72;FBBV/998154334;FBDV/iPhone14,3;FBMD/iPhone;FBSN/iOS;FBSV/26.6;FBSS/3;FBID/phone;FBLC/ar_AR;FBOP/5;FBRV/1005026465;IABMV/1]	2026-10-20 10:44:12.228
0557cd96-94dd-49b6-aceb-f22f98be347e	twnysrdyn@gmail.com	login	f	205.209.92.113	Mozilla/5.0 (iPhone; CPU iPhone OS 26_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23G71 Safari/604.1 [FBAN/FBIOS;FBAV/566.1.0.59.72;FBBV/998154334;FBDV/iPhone14,3;FBMD/iPhone;FBSN/iOS;FBSV/26.6;FBSS/3;FBID/phone;FBLC/ar_AR;FBOP/5;FBRV/1005026465;IABMV/1]	2026-10-20 10:44:39.649
\.


--
-- Data for Name: mission_completions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mission_completions (id, "userId", "missionId", reward, "depositBase", percent, "completedAt") FROM stdin;
1ec8ab22-2120-4322-b2ba-52e28d611418	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	82a5a5e1-1ac2-40c4-a65f-5b319810d9c2	2	100	2	2026-09-26 20:03:30.002
726b95f3-9a0b-48ea-a0ba-7ac6caafa9ed	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	215248fe-0927-4244-beda-f2a7fd1c4d37	2	100	2	2026-09-27 12:31:08.014
956c1262-20fd-40e7-a7a2-882bd1ae0ba3	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	a83aae85-2dcd-4d27-9912-0d639ca09f37	3.33	100	3.33	2026-09-27 20:44:08.113
66ec03ea-2269-4082-a4fe-a2db6af0901c	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	d56d70bb-d1ea-494b-87b1-7bb293723471	19.98	600	3.33	2026-09-28 22:52:09.922
b5480eca-3798-41b6-b1c0-61203cc1dcc8	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	27937bfe-f8cb-4b59-9110-eb04770fa2e7	19.98	600	3.33	2026-09-28 22:53:54.305
fce65042-5e3c-463b-b00c-6738cda14c6a	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	c26645eb-4928-40e8-a430-64d25ae803c8	19.98	600	3.33	2026-09-28 22:55:37.715
9315cb34-102b-45a2-b2bc-cb3da79dc46e	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	4900e249-21a1-4050-a88a-17ddcc726e95	33.3	1000	3.33	2026-09-29 12:45:50.463
6f66445b-09aa-48d2-87b6-2b74c6a77550	606d790f-e7db-477d-977f-6ceeeaa0d0ec	0635ff0d-6e42-4b68-98a5-98f150ce2a03	3.33	100	3.33	2026-09-29 13:48:27.608
9f46e539-2e76-4e18-bb75-0777721b095a	606d790f-e7db-477d-977f-6ceeeaa0d0ec	1e1bb8df-aeb4-438b-8dac-762db9af6757	36.63	1100	3.33	2026-09-29 13:53:25.085
ac023870-c990-4c80-bd2a-82e29d250383	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	f0c8a3ef-763c-4ac0-9e4d-62601b4df667	16.65	500	3.33	2026-10-04 18:33:43.355
cdbeed43-46af-4d83-a806-1765cd3a5d4b	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	94ec8984-f9b7-4bb9-a679-257baa1c07bd	19.98	600	3.33	2026-10-06 10:01:21.299
c1c95df4-06b8-47ec-92db-8eb473e00ece	016dddc4-d1ab-402e-90b1-536ccd90d807	825a51ce-ccb3-4a43-9d22-e66aba39900a	3.33	100	3.33	2026-10-06 11:40:59.651
88947095-f7fb-4438-affe-3e55747dda6d	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	e2522a97-d55f-436a-bc5b-669e19b6ebbe	19.98	600	3.33	2026-10-07 10:00:26.228
3f9973cb-ce59-462a-ae69-7dbbc579f057	095ecc95-41a7-43b6-a263-1886b4c22c9f	e2522a97-d55f-436a-bc5b-669e19b6ebbe	3.33	100	3.33	2026-10-07 10:06:41.132
c38ded80-0650-48b5-b2bc-fa6f333c5d22	4e351b76-af96-4067-afdc-600288f3605a	e2522a97-d55f-436a-bc5b-669e19b6ebbe	3.33	100	3.33	2026-10-07 10:08:12.641
eac2804e-8de0-40a6-a479-f8079e7bfbcc	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	e2522a97-d55f-436a-bc5b-669e19b6ebbe	16.65	500	3.33	2026-10-07 10:31:18.436
7881218a-f68b-41ed-9335-3a9acf5bb36a	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	b8c21a07-80a5-4da0-8813-3a48ba4383ba	19.98	600	3.33	2026-10-08 10:02:20.713
50662f83-4102-4081-b503-88800235a949	4e351b76-af96-4067-afdc-600288f3605a	b8c21a07-80a5-4da0-8813-3a48ba4383ba	3.33	100	3.33	2026-10-08 10:02:45.65
f54956e3-e1e8-4cc7-ac78-fe65fabef8ec	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	b8c21a07-80a5-4da0-8813-3a48ba4383ba	3.33	100	3.33	2026-10-08 10:07:00.607
16588891-2b9f-4717-9cc2-9b057ade5ee5	095ecc95-41a7-43b6-a263-1886b4c22c9f	b8c21a07-80a5-4da0-8813-3a48ba4383ba	3.33	100	3.33	2026-10-08 10:13:20.433
bc8e6a18-945c-4616-9789-15fc37d840c0	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	b8c21a07-80a5-4da0-8813-3a48ba4383ba	16.65	500	3.33	2026-10-08 10:40:11.496
9ab07ec2-f4ac-4676-acc4-950142c3fce9	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	5ec7fc06-8f18-4575-9b5f-3ffa6795665a	19.98	600	3.33	2026-10-09 11:00:36.495
107a52c1-def7-4df2-acea-49b14962c09e	095ecc95-41a7-43b6-a263-1886b4c22c9f	5ec7fc06-8f18-4575-9b5f-3ffa6795665a	3.33	100	3.33	2026-10-09 11:02:31.469
3b150d32-4b7e-4308-b830-941d2ee30467	4e351b76-af96-4067-afdc-600288f3605a	5ec7fc06-8f18-4575-9b5f-3ffa6795665a	3.33	100	3.33	2026-10-09 11:02:37.981
23ae1c37-9d47-4f48-b4e2-6d72e734c5ec	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	5ec7fc06-8f18-4575-9b5f-3ffa6795665a	3.33	100	3.33	2026-10-09 11:03:18.932
bc5803be-9b66-45f4-b0dc-99cb18ccfd11	095ecc95-41a7-43b6-a263-1886b4c22c9f	6ab9ff9d-3847-466a-8a70-bddf5a164303	3.33	100	3.33	2026-10-10 10:00:15.016
4acf2300-0930-4bd0-b4e9-51bb75713152	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	6ab9ff9d-3847-466a-8a70-bddf5a164303	19.98	600	3.33	2026-10-10 10:00:23.822
9caec134-1da6-4278-a20f-d8db96285a61	4e351b76-af96-4067-afdc-600288f3605a	6ab9ff9d-3847-466a-8a70-bddf5a164303	3.33	100	3.33	2026-10-10 10:12:22.951
9b7b5dc4-87e4-4e08-baa5-35c29c4425c8	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	6ab9ff9d-3847-466a-8a70-bddf5a164303	16.65	500	3.33	2026-10-10 10:21:30.132
84e1ff6f-73f6-480c-bea5-0fbba40019fd	095ecc95-41a7-43b6-a263-1886b4c22c9f	a370ba7d-b6c1-4529-a1be-fdd8e1da7fdd	3.33	100	3.33	2026-10-12 10:03:54.348
0ae17406-2ad6-4420-bbac-4437bbda8f10	4e351b76-af96-4067-afdc-600288f3605a	a370ba7d-b6c1-4529-a1be-fdd8e1da7fdd	3.33	100	3.33	2026-10-12 10:21:59.935
c75fdcaf-f2f7-4fd6-97e3-a1b9f9fe866f	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	a370ba7d-b6c1-4529-a1be-fdd8e1da7fdd	3.33	100	3.33	2026-10-12 10:36:44.3
db3c4540-92a5-44f8-8814-45c1be70cd01	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	15811c25-4a2d-4b2f-8c9a-a7174197f185	19.98	600	3.33	2026-10-13 10:02:41.971
8f499234-fe3e-473b-86f5-903deab52a6c	4e351b76-af96-4067-afdc-600288f3605a	15811c25-4a2d-4b2f-8c9a-a7174197f185	3.33	100	3.33	2026-10-13 10:02:59.308
e2db68f9-11d8-4f7e-bd0c-401ec1b0bc1e	095ecc95-41a7-43b6-a263-1886b4c22c9f	15811c25-4a2d-4b2f-8c9a-a7174197f185	3.33	100	3.33	2026-10-13 10:08:43.031
920a156b-c9e1-410c-b1bd-647bbb45113d	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	15811c25-4a2d-4b2f-8c9a-a7174197f185	3.33	100	3.33	2026-10-13 10:18:14.684
89417aa7-d377-4eee-a7f2-96988587cb35	095ecc95-41a7-43b6-a263-1886b4c22c9f	e7ac1796-e9e8-49f9-9a17-868a44154375	3.33	100	3.33	2026-10-14 10:08:12.178
0c938157-6331-4c8f-b37a-525e841350e7	4e351b76-af96-4067-afdc-600288f3605a	e7ac1796-e9e8-49f9-9a17-868a44154375	3.33	100	3.33	2026-10-14 10:09:09.86
72033f97-1179-4aff-984f-d5fc78a0f970	4e351b76-af96-4067-afdc-600288f3605a	b7538c43-73f4-4ab6-8bb3-af0ef8d65a49	3.33	100	3.33	2026-10-15 10:01:35.658
03f57f3e-eff0-4d6d-ab86-3c49101ad742	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	b7538c43-73f4-4ab6-8bb3-af0ef8d65a49	19.98	600	3.33	2026-10-15 10:02:56.868
0570d7bb-417f-4000-9c4d-e0b0df81f09c	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	b7538c43-73f4-4ab6-8bb3-af0ef8d65a49	3.33	100	3.33	2026-10-15 10:06:34.889
d2062f6a-7ce6-4abd-be48-e4a67dbc4176	095ecc95-41a7-43b6-a263-1886b4c22c9f	b7538c43-73f4-4ab6-8bb3-af0ef8d65a49	3.33	100	3.33	2026-10-15 10:06:48.422
de0b03c5-4ff4-4705-8574-2d22cfa97360	4e351b76-af96-4067-afdc-600288f3605a	c99ff41a-e05a-4b12-ac9e-27f3f79c499e	3.33	100	3.33	2026-10-16 10:05:26.486
231cc112-9d50-45d9-a930-7d7b536983ac	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	c99ff41a-e05a-4b12-ac9e-27f3f79c499e	3.33	100	3.33	2026-10-16 10:06:15.166
8fd4f711-46d2-4b32-a0f3-2e04b9555401	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	c99ff41a-e05a-4b12-ac9e-27f3f79c499e	352.98	10600	3.33	2026-10-16 10:09:09.239
cb28e177-2397-4df3-b086-a4312a8e1fcc	095ecc95-41a7-43b6-a263-1886b4c22c9f	c99ff41a-e05a-4b12-ac9e-27f3f79c499e	3.33	100	3.33	2026-10-16 10:10:46.697
daaba854-b733-4761-a7f1-cefa330e2598	4e351b76-af96-4067-afdc-600288f3605a	73b387f2-92c5-4cd3-af4c-6811ee83245c	3.33	100	3.33	2026-10-18 10:02:43.756
9b62d871-3f9f-41b3-a135-079931c15824	095ecc95-41a7-43b6-a263-1886b4c22c9f	73b387f2-92c5-4cd3-af4c-6811ee83245c	3.33	100	3.33	2026-10-18 10:07:51.375
cad4fd0e-4d59-4a3d-ba1a-2d5cdc13245d	3b514599-3777-4cd7-9b34-aa00942a3be2	73b387f2-92c5-4cd3-af4c-6811ee83245c	6.66	200	3.33	2026-10-18 10:08:30.682
5486741f-9db2-466f-9460-fa280ed204b8	14d657c1-afed-4016-ba10-192e4dfaeccb	73b387f2-92c5-4cd3-af4c-6811ee83245c	3.33	100	3.33	2026-10-18 10:23:46.091
c5348faa-e5fa-4ee8-97b9-825f96c8645d	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	73b387f2-92c5-4cd3-af4c-6811ee83245c	3.33	100	3.33	2026-10-18 10:25:24.408
b8ed5193-0bdf-43ab-8c2e-b692c850597f	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	73b387f2-92c5-4cd3-af4c-6811ee83245c	352.98	10600	3.33	2026-10-18 10:35:35.924
fc09a48c-ac46-499f-902a-9ac929570af1	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	2d20f1d9-f3e9-4853-9061-7a62f5e16674	3.33	100	3.33	2026-10-19 10:00:25.543
f0bd7591-258f-461e-b943-46fb88cc9c8d	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	2d20f1d9-f3e9-4853-9061-7a62f5e16674	352.98	10600	3.33	2026-10-19 10:03:43.352
f5d4de43-8126-4879-92ab-f2dd8c224878	3b514599-3777-4cd7-9b34-aa00942a3be2	2d20f1d9-f3e9-4853-9061-7a62f5e16674	6.66	200	3.33	2026-10-19 10:04:21.689
b8326367-ca3c-468c-b441-7d968a0e5549	14d657c1-afed-4016-ba10-192e4dfaeccb	2d20f1d9-f3e9-4853-9061-7a62f5e16674	3.33	100	3.33	2026-10-19 10:04:27.73
f15c1332-cd6a-4123-94f3-115ebfe69159	095ecc95-41a7-43b6-a263-1886b4c22c9f	2d20f1d9-f3e9-4853-9061-7a62f5e16674	3.33	100	3.33	2026-10-19 10:09:46.8
3d4bdf3d-a86d-4708-a3d9-452eda849644	4e351b76-af96-4067-afdc-600288f3605a	2d20f1d9-f3e9-4853-9061-7a62f5e16674	3.33	100	3.33	2026-10-19 10:51:42.247
96aadf1e-b95f-4bed-bbbc-09c8299b35b9	d9aeedfe-2467-4f82-8444-66a684323c54	2d20f1d9-f3e9-4853-9061-7a62f5e16674	3.33	100	3.33	2026-10-19 10:53:18.413
a9d9cf99-fc02-42fa-94dc-f03983803196	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	c665e2bf-377c-419b-9671-6f27236b7329	352.98	10600	3.33	2026-10-20 10:00:19.054
d213a3c9-caaf-40b5-9b9c-d77036e39bcc	ecb90262-10ae-42a6-8cac-e8563bb30e60	c665e2bf-377c-419b-9671-6f27236b7329	1.9980000000000002	60	3.33	2026-10-20 10:01:16.441
cacdbbeb-8d41-40a5-b8a1-9079ec0a14dc	1b2898e2-82d8-424c-bde3-c788d60a2694	c665e2bf-377c-419b-9671-6f27236b7329	1.9980000000000002	60	3.33	2026-10-20 10:01:31.501
89430b74-ee23-436b-817a-71111458b0c6	095ecc95-41a7-43b6-a263-1886b4c22c9f	c665e2bf-377c-419b-9671-6f27236b7329	3.33	100	3.33	2026-10-20 10:02:32.43
4dc79351-d412-4dbe-bc6a-3258584622a4	d9aeedfe-2467-4f82-8444-66a684323c54	c665e2bf-377c-419b-9671-6f27236b7329	3.33	100	3.33	2026-10-20 10:06:23.904
1fa9142e-07c7-4a94-95c6-19e18d3f2c83	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	c665e2bf-377c-419b-9671-6f27236b7329	3.33	100	3.33	2026-10-20 10:25:06.214
293b4a2a-7755-4954-8697-bc33b97736dc	3b514599-3777-4cd7-9b34-aa00942a3be2	c665e2bf-377c-419b-9671-6f27236b7329	6.66	200	3.33	2026-10-20 10:29:52.25
e44f3087-d0a4-4d84-bade-806617e70788	58e6b8c8-c075-4558-99c2-4889448030d8	c665e2bf-377c-419b-9671-6f27236b7329	3.33	100	3.33	2026-10-20 10:32:36.471
9bfc8283-6414-429a-9249-c70aeaa25b0d	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	c665e2bf-377c-419b-9671-6f27236b7329	16.65	500	3.33	2026-10-20 10:40:01.777
\.


--
-- Data for Name: missions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.missions (id, title, status, "startedAt", "endsAt", "endedAt", "endedBy", "createdBy", "createdAt", "updatedAt") FROM stdin;
538e7d3c-6dba-411c-8d1e-276b8b6b9dc6	شراء	ended	2026-09-25 11:51:35.844	2026-09-25 12:51:35.844	2026-09-25 13:21:02.646	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-25 11:51:35.845	2026-09-25 13:21:02.653
82a5a5e1-1ac2-40c4-a65f-5b319810d9c2	شراء سهم AlDlVN	ended	2026-09-26 20:02:42.909	2026-09-26 21:02:42.909	2026-09-26 21:10:16.742	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-26 20:02:42.909	2026-09-26 21:10:16.743
215248fe-0927-4244-beda-f2a7fd1c4d37	شراء سهم VGKB	ended	2026-09-27 12:30:48.997	2026-09-27 13:30:48.997	2026-09-27 12:42:12.735	2fe13236-701f-4faa-9315-d0a132362bb9	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-27 12:30:48.998	2026-09-27 12:42:12.736
a83aae85-2dcd-4d27-9912-0d639ca09f37	شراء سهم GKTD	ended	2026-09-27 20:43:19.229	2026-09-27 21:43:19.229	2026-09-27 20:44:18.426	2fe13236-701f-4faa-9315-d0a132362bb9	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-27 20:43:19.23	2026-09-27 20:44:18.426
d56d70bb-d1ea-494b-87b1-7bb293723471	شراء سهم FJBT	ended	2026-09-28 22:51:25.303	2026-09-28 23:51:25.303	2026-09-28 22:53:05.481	2fe13236-701f-4faa-9315-d0a132362bb9	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-28 22:51:25.304	2026-09-28 22:53:05.482
27937bfe-f8cb-4b59-9110-eb04770fa2e7	شراء سهم VSAJ	ended	2026-09-28 22:53:20.982	2026-09-28 23:53:20.982	2026-09-28 22:54:45.497	2fe13236-701f-4faa-9315-d0a132362bb9	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-28 22:53:20.982	2026-09-28 22:54:45.498
c26645eb-4928-40e8-a430-64d25ae803c8	fgnky	ended	2026-09-28 22:54:54.064	2026-09-28 23:54:54.064	2026-09-28 22:56:07.172	2fe13236-701f-4faa-9315-d0a132362bb9	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-28 22:54:54.064	2026-09-28 22:56:07.172
4900e249-21a1-4050-a88a-17ddcc726e95	mnmnmn	ended	2026-09-29 12:43:23.339	2026-09-29 13:43:23.339	2026-09-29 13:43:28.747	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-29 12:43:23.339	2026-09-29 13:43:28.747
0635ff0d-6e42-4b68-98a5-98f150ce2a03	Gg	ended	2026-09-29 13:48:12.017	2026-09-29 14:48:12.017	2026-09-29 13:49:51.203	2fe13236-701f-4faa-9315-d0a132362bb9	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-29 13:48:12.02	2026-09-29 13:49:51.204
1e1bb8df-aeb4-438b-8dac-762db9af6757	Gh	ended	2026-09-29 13:49:56.626	2026-09-29 14:49:56.626	2026-09-29 14:51:27.372	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-09-29 13:49:56.626	2026-09-29 14:51:27.372
f0c8a3ef-763c-4ac0-9e4d-62601b4df667	شراء سهم AKRM	ended	2026-10-04 18:33:27.067	2026-10-04 19:33:27.067	2026-10-04 18:33:52.097	2fe13236-701f-4faa-9315-d0a132362bb9	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-04 18:33:27.068	2026-10-04 18:33:52.098
94ec8984-f9b7-4bb9-a679-257baa1c07bd	BTC_USDT	ended	2026-10-06 10:00:46.793	2026-10-06 11:00:46.793	2026-10-06 11:14:17.517	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-06 10:00:46.793	2026-10-06 11:14:17.517
825a51ce-ccb3-4a43-9d22-e66aba39900a	osama	ended	2026-10-06 11:40:38.323	2026-10-06 12:40:38.323	2026-10-06 12:43:38.617	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-06 11:40:38.324	2026-10-06 12:43:38.617
e2522a97-d55f-436a-bc5b-669e19b6ebbe	BTC_USDT	ended	2026-10-07 10:00:01.6	2026-10-07 11:00:01.6	2026-10-07 11:11:27.271	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-07 10:00:01.6	2026-10-07 11:11:27.271
b8c21a07-80a5-4da0-8813-3a48ba4383ba	BTC_USDT	ended	2026-10-08 10:01:55.233	2026-10-08 11:01:55.233	2026-10-08 11:56:29.553	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-08 10:01:55.233	2026-10-08 11:56:29.553
5ec7fc06-8f18-4575-9b5f-3ffa6795665a	BTC_USDT	ended	2026-10-09 11:00:02.347	2026-10-09 12:00:02.347	2026-10-09 12:02:21.607	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-09 11:00:02.348	2026-10-09 12:02:21.607
6ab9ff9d-3847-466a-8a70-bddf5a164303	BTC_USDT	ended	2026-10-10 10:00:00.969	2026-10-10 11:00:00.969	2026-10-10 11:27:17.219	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-10 10:00:00.969	2026-10-10 11:27:17.219
a370ba7d-b6c1-4529-a1be-fdd8e1da7fdd	BTC_USDT	ended	2026-10-12 10:01:04.642	2026-10-12 11:01:04.642	2026-10-12 11:03:56.408	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-12 10:01:04.642	2026-10-12 11:03:56.408
15811c25-4a2d-4b2f-8c9a-a7174197f185	BTC_USDT	ended	2026-10-13 10:02:29.877	2026-10-13 11:02:29.877	2026-10-13 11:47:43.681	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-13 10:02:29.877	2026-10-13 11:47:43.682
e7ac1796-e9e8-49f9-9a17-868a44154375	BTC_USDT	ended	2026-10-14 10:07:09.64	2026-10-14 11:07:09.64	2026-10-14 12:32:04.172	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-14 10:07:09.641	2026-10-14 12:32:04.172
b7538c43-73f4-4ab6-8bb3-af0ef8d65a49	BTC_USDT	ended	2026-10-15 10:00:02.322	2026-10-15 11:00:02.322	2026-10-15 11:12:13.232	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-15 10:00:02.322	2026-10-15 11:12:13.232
c99ff41a-e05a-4b12-ac9e-27f3f79c499e	BTC_USDT	ended	2026-10-16 10:00:02.219	2026-10-16 11:00:02.219	2026-10-16 11:00:31.207	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-16 10:00:02.219	2026-10-16 11:00:31.207
73b387f2-92c5-4cd3-af4c-6811ee83245c	BTC_USDT	ended	2026-10-18 10:00:01.141	2026-10-18 11:00:01.141	2026-10-18 11:04:06.006	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-18 10:00:01.141	2026-10-18 11:04:06.006
2d20f1d9-f3e9-4853-9061-7a62f5e16674	BTC_USDT	ended	2026-10-19 10:00:07.066	2026-10-19 11:00:07.066	2026-10-19 11:00:27.389	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-19 10:00:07.066	2026-10-19 11:00:27.389
c665e2bf-377c-419b-9671-6f27236b7329	BTC_USDT	ended	2026-10-20 10:00:01.258	2026-10-20 11:00:01.258	2026-10-20 11:00:01.318	auto	2fe13236-701f-4faa-9315-d0a132362bb9	2026-10-20 10:00:01.258	2026-10-20 11:00:01.318
\.


--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_codes (id, email, code, type, used, attempts, "expiresAt", "createdAt") FROM stdin;
7616b3e7-0c1c-4537-8702-78e23b48b879	aladimmajd@gmail.com	663489	register	f	0	2026-09-26 10:32:41.559	2026-09-26 10:22:41.559
a8ffad67-4e2d-4ada-899d-878636145424	fcc320c13b@emailnox.live	541389	register	t	0	2026-09-26 10:37:02.29	2026-09-26 10:27:02.29
63ff7b20-def5-40d2-ae41-e19b4bc140e7	alhlwsh6@gmail.com	568143	register	t	0	2026-09-26 12:22:36.673	2026-09-26 12:12:36.673
264ce6a0-81c9-4034-af65-43ef4d036236	majid2005225@gmail.com	151900	register	t	0	2026-09-26 19:47:57.656	2026-09-26 19:37:57.657
6b4cd84a-2df5-43cb-acab-877553fd8a07	mohandeeee64@gmail.com	565145	register	t	0	2026-09-26 19:59:52.231	2026-09-26 19:49:52.232
261b9cb8-e7ba-4782-aa0d-21d81c750ada	wylanalnzy059@gmail.com	397609	register	t	0	2026-10-06 09:27:49.691	2026-10-06 09:17:49.692
a9e43191-d191-49d9-825e-cdfab34f3672	hlalalstam880@gmail.com	641750	register	t	0	2026-09-27 10:16:20.918	2026-09-27 10:06:20.918
916c225e-cad5-44ff-885a-251f3cd4bfbb	osamaforit@gmail.com	518649	register	t	0	2026-09-27 14:45:00.619	2026-09-27 14:35:00.622
34113cd4-6ce0-4489-9067-fb929f650d4c	jasr08516@gmail.com	642188	register	t	0	2026-10-08 09:00:28.748	2026-10-08 08:50:28.748
96c316c0-3f93-4f3c-a719-aad11f5372fa	ahamad5557gj@gmail.com	137284	register	t	0	2026-10-18 18:03:55.475	2026-10-18 17:53:55.475
7af6e75b-84b0-40af-8c53-eb890980372f	mlnjbhvgcfxdxx@gmail.com	250604	register	t	0	2026-09-29 12:54:46.873	2026-09-29 12:44:46.874
f541ad77-bbd4-4aef-8bfc-dff640f69d5c	darwinmark337@gmail.com	980502	register	t	0	2026-09-29 13:54:27.511	2026-09-29 13:44:27.515
09fe85aa-2a75-4a36-9229-0991f10b5099	reanhfoaz2016@gmail.com	987205	register	f	0	2026-09-30 00:31:21.293	2026-09-30 00:21:21.295
f6992921-47c2-4e07-91d8-3299c94d04c4	aboreanh2016@gmail.com	723624	register	t	0	2026-09-30 01:10:46.548	2026-09-30 01:00:46.549
86eccd78-c218-4e16-9e2c-9a14f9d1f0e3	ktacqfua@gmail.com	629041	register	t	0	2026-10-01 17:53:21.308	2026-10-01 17:43:21.308
490aa6bb-9d5a-44c0-8192-44b00605704c	abwmsharyalqady8@gmail.com	634183	register	t	0	2026-10-02 14:39:03.45	2026-10-02 14:29:03.451
b133733b-fc2d-4d21-8c46-3d3ea265b191	alrslany26@gmail.com	458800	register	t	0	2026-10-02 19:58:14.173	2026-10-02 19:48:14.174
300961c3-1d2c-49f0-ae59-64980df2f275	asmarem@gmail.com	333884	register	f	0	2026-10-02 22:17:44.482	2026-10-02 22:07:44.482
6716e64d-c8bd-457b-8eef-2ecb586da43e	alamaratabwzby762@gmail.com	742458	register	t	0	2026-10-03 16:16:50.397	2026-10-03 16:06:50.398
d78c59e0-9156-40d8-97e3-57c1835811c6	frhanabwfhd029@gmail.com	451482	register	t	0	2026-10-03 17:19:48.02	2026-10-03 17:09:48.021
78c34ed7-6487-4ae8-a49a-bae9a102ea03	aburayan19898s@gmail.com	692007	register	t	0	2026-10-03 20:32:20.854	2026-10-03 20:22:20.855
91f944df-7af8-4ffa-b180-1ebc4e066ebe	osamadsa130@gmail.com	824661	register	t	0	2026-10-04 07:09:37.761	2026-10-04 06:59:37.762
a15ce3af-2870-4621-9724-f3ba30394a23	sslwh3309@gmail.com	267274	register	f	0	2026-10-09 19:38:08.666	2026-10-09 19:28:08.667
262d09d1-8c8f-4b1a-b21e-def2765b08a4	ahmdalali1238@gmail.com	359979	register	t	0	2026-10-05 19:35:30.773	2026-10-05 19:25:30.773
66467e2f-bb6e-4f66-9f09-84421881f67f	mndkfjkenfosndonwkdn@gmail.com	728965	register	t	0	2026-10-14 20:46:26.82	2026-10-14 20:36:26.821
e8bed01b-c205-4bf7-8d71-77d67af67281	33245@gmail.com	595026	register	f	0	2026-10-17 14:38:58.497	2026-10-17 14:28:58.497
30e8d1d1-5c61-45de-94f3-53f5ab886d52	kahim73994@iconcubic.com	998789	register	t	0	2026-10-17 14:41:07.169	2026-10-17 14:31:07.169
a9ef20a2-5fb0-4449-a2b5-2458b80de909	ahmethelal2001@gmail.com	159170	register	t	0	2026-10-17 20:32:56.919	2026-10-17 20:22:56.92
93c1b72a-d753-4a4b-8bfb-9434f19a124f	ysyalnzyy130@gmail.com	503768	register	t	0	2026-10-17 20:52:42.43	2026-10-17 20:42:42.43
aefbb440-f4aa-4df9-9491-9a7124938bd7	aasdfghjklqwertyuiop2004@gmail.com	346514	register	t	0	2026-10-18 02:12:09.98	2026-10-18 02:02:09.98
6f878e98-0eaa-4ee5-ba3b-4c2f709ac649	ghanmalshmryy108@gmail.com	991982	register	t	0	2026-10-18 02:29:21.141	2026-10-18 02:19:21.141
4c7c58a5-52a3-4328-9eca-70534d6b67cb	kurdo.a.z.90762@gmail.com	609439	register	t	0	2026-10-18 14:36:19.823	2026-10-18 14:26:19.823
9bf6bb33-4807-470e-932f-7c24a4736013	abwshrydt451@gmail.com	862123	register	t	0	2026-10-18 20:59:35.331	2026-10-18 20:49:35.331
11519f5b-a4f5-443d-8b76-8d1c1ec0fa68	bdallhhjly760@gmail.com	884357	register	t	0	2026-10-19 06:50:58.928	2026-10-19 06:40:58.928
58baa596-3eaf-4e36-a453-cfff81ab6536	ahmadmmdoh1133@gmail.com	890742	register	t	0	2026-10-18 18:01:28.753	2026-10-18 17:51:28.753
0297442c-1896-46b2-81e7-5f7a07cc5cf1	mohammadhelal2488@gmail.com	886691	register	t	0	2026-10-19 06:52:16.596	2026-10-19 06:42:16.597
23b3a21e-4df5-45d6-a205-c38ffee7cc12	fhedan411@gmail.com	959279	register	t	0	2026-10-19 10:44:03.446	2026-10-19 10:34:03.446
a16dbeca-6bce-4b50-b475-b38cdcc47516	alyasyny240@gmail.com	104384	register	t	0	2026-10-19 11:36:27.85	2026-10-19 11:26:27.851
e5a8e892-ca1d-4e2a-9ca4-d0c686d5aed7	allisamr66@gmail.com	772714	register	t	0	2026-10-19 12:54:26.321	2026-10-19 12:44:26.321
f8a353bb-6a02-496f-9198-825903f624b5	alsyahahmd21@gmail.com	719357	register	t	0	2026-10-19 12:58:20.571	2026-10-19 12:48:20.571
a6310faa-7b7c-4d18-a456-a507f4ff03e0	rafta3195@gmail.com	574035	register	t	0	2026-10-19 16:37:39.018	2026-10-19 16:27:39.018
08d9d937-9310-4c2a-92e1-c3cc5e66f159	asamtalfdany23@gmail.com	746193	register	t	0	2026-10-19 17:39:54.277	2026-10-19 17:29:54.277
56049dcf-2802-40ea-b325-82660bd837c2	mhamadsiqkyrn@gmail.com	105378	register	f	0	2026-10-19 19:03:31.11	2026-10-19 18:53:31.11
63a42081-f4c2-4ca7-b0c4-9649116bcf11	sedar2535@gmail.com	261884	register	t	0	2026-10-20 10:52:24.244	2026-10-20 10:42:24.244
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, "userId", token, "expiresAt", used, "createdAt") FROM stdin;
\.


--
-- Data for Name: referral_bonuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.referral_bonuses (id, "userId", tier, amount, milestone, claimed, "claimedAt", "createdAt") FROM stdin;
c2e9e8ec-4807-4512-9328-affc42d51df8	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	LEVEL1	50	5	t	2026-10-08 09:14:20.101	2026-10-08 09:14:20.103
\.


--
-- Data for Name: referral_earnings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.referral_earnings (id, "referrerId", "referredId", amount, level, "sourceType", description, "createdAt") FROM stdin;
\.


--
-- Data for Name: referral_relations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.referral_relations (id, "referrerId", "referredId", level, "createdAt", "activatedAt") FROM stdin;
c8aafae0-87ca-4a6f-8805-d32e1712cee2	02de29c4-69e7-4a30-9119-dd38ffc662aa	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	1	2026-09-26 19:52:25.319	2026-09-26 19:57:49.411
5fcdf961-7c08-4006-91d8-50dfd38a3fe7	02de29c4-69e7-4a30-9119-dd38ffc662aa	003cb43d-ce1e-43ff-ba6c-86ca6a7d2310	1	2026-09-29 12:47:06.075	\N
3a982eed-bd0a-4c0d-a377-6b3c1bee85c9	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	7103cc14-77a0-494d-9fc4-570285f45c84	1	2026-10-01 17:45:37.088	\N
348e1477-d2c2-4be5-91f3-c4538c88b821	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	ce67b65b-644b-4949-8890-fe8a03e91568	1	2026-10-03 17:13:36.869	\N
718b9cd0-788c-41c7-9e60-17d360224e2a	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	ce67b65b-644b-4949-8890-fe8a03e91568	2	2026-10-03 17:13:36.891	\N
29d23579-6baf-40fa-8405-c3c650aa3ee2	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	1	2026-09-26 12:15:54.865	2026-10-04 18:32:47.587
03917a39-4a08-4255-ab98-8eceec0f8c29	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	095ecc95-41a7-43b6-a263-1886b4c22c9f	1	2026-10-06 09:22:01.026	2026-10-06 14:11:18.551
398ca4d0-0080-49a5-b2f2-e38ca5796344	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	4e351b76-af96-4067-afdc-600288f3605a	1	2026-10-02 14:30:58.129	2026-10-07 10:07:26.461
a9421211-24ac-47b0-9b1d-7f7c8e8626da	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	1	2026-09-27 10:09:22.64	2026-10-08 09:14:20.094
55f0d2a4-ba44-4903-ba44-420124ceda85	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	df7d86f3-9359-4464-9b32-4d34a7b8a688	1	2026-10-14 20:39:20.326	\N
e54deffe-45bb-4b2b-b2b0-c2b387602f34	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	3b514599-3777-4cd7-9b34-aa00942a3be2	1	2026-10-17 20:44:02.374	2026-10-17 20:46:22.159
c0487b3c-39db-4ea5-a4c4-001e8ef177d4	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	14d657c1-afed-4016-ba10-192e4dfaeccb	1	2026-10-18 02:06:52.765	2026-10-18 02:12:13.074
58e84896-cdd7-4f5e-bd6b-ee743a06df5c	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	1b2898e2-82d8-424c-bde3-c788d60a2694	2	2026-10-18 14:37:01.496	\N
cc5582a2-0418-46ee-81e0-58ca062116a5	095ecc95-41a7-43b6-a263-1886b4c22c9f	391de937-e58f-4f29-859b-b85533f2c744	1	2026-10-18 17:55:57.594	\N
46074bd5-d42a-4bc6-a816-245db9799cd3	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	391de937-e58f-4f29-859b-b85533f2c744	2	2026-10-18 17:55:57.601	\N
34c95873-13c1-48b2-bb13-8f37de07890c	3b514599-3777-4cd7-9b34-aa00942a3be2	592313e4-4fc0-4e1f-a8bf-eae574995ef2	1	2026-10-19 06:48:44.776	\N
36c09218-b6b5-4fdb-b344-e517f8367063	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	592313e4-4fc0-4e1f-a8bf-eae574995ef2	2	2026-10-19 06:48:44.785	\N
b9d7ed21-b47c-4576-87c1-4c493360eeb3	095ecc95-41a7-43b6-a263-1886b4c22c9f	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	1	2026-10-19 10:36:27.999	\N
4f5f9591-b9e5-4743-9468-465914fcd9b4	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	2	2026-10-19 10:36:28.005	\N
27d52fee-7b52-4d80-b189-96498c600fa4	095ecc95-41a7-43b6-a263-1886b4c22c9f	13de3fce-19f3-450b-a5e2-c329e3d2c135	1	2026-10-19 11:29:04.897	\N
6395fd15-4e33-45ee-a8b5-64c8e1de2c9d	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	13de3fce-19f3-450b-a5e2-c329e3d2c135	2	2026-10-19 11:29:04.906	\N
40d01eea-ecb3-48a5-9dcf-d0fd187f1d8d	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	162166a0-298d-49e5-974c-b90d1d2d1d16	1	2026-10-19 12:51:47.07	\N
3cf877fc-9e0e-4ae2-8822-093835faab6f	095ecc95-41a7-43b6-a263-1886b4c22c9f	162166a0-298d-49e5-974c-b90d1d2d1d16	2	2026-10-19 12:51:47.082	\N
8dc755d8-a29f-4301-8796-1cd0bd3c3762	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	162166a0-298d-49e5-974c-b90d1d2d1d16	3	2026-10-19 12:51:47.088	\N
336a05a6-0c3e-4491-a0b3-ad9b8f1272c1	095ecc95-41a7-43b6-a263-1886b4c22c9f	1b2898e2-82d8-424c-bde3-c788d60a2694	1	2026-10-18 14:37:01.483	2026-10-19 14:38:37.847
20510213-e089-4a48-a2a0-8ece2fe800ed	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	ecb90262-10ae-42a6-8cac-e8563bb30e60	2	2026-10-19 16:29:56.308	\N
e56985c9-10ff-4109-953e-3d953094199d	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	58e6b8c8-c075-4558-99c2-4889448030d8	2	2026-10-19 17:31:22.88	\N
b87c27bc-e2b1-4664-8c36-56b20917055e	3b514599-3777-4cd7-9b34-aa00942a3be2	58e6b8c8-c075-4558-99c2-4889448030d8	1	2026-10-19 17:31:22.868	2026-10-19 17:42:56.086
7e446407-4d20-44ed-9a1f-dc4ef3d33c65	095ecc95-41a7-43b6-a263-1886b4c22c9f	ecb90262-10ae-42a6-8cac-e8563bb30e60	1	2026-10-19 16:29:56.303	2026-10-20 08:10:41.253
8934485e-208e-4fbb-b14a-3f5ade0395b8	1b2898e2-82d8-424c-bde3-c788d60a2694	040b9796-2ddd-4e8e-b55a-f2e85bb2c172	1	2026-10-20 10:46:17.214	\N
21e80945-4e7e-45f8-adff-2f0239f7b9af	095ecc95-41a7-43b6-a263-1886b4c22c9f	040b9796-2ddd-4e8e-b55a-f2e85bb2c172	2	2026-10-20 10:46:17.231	\N
ae5140b4-eff2-44b5-a481-b8e85bc6439c	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	040b9796-2ddd-4e8e-b55a-f2e85bb2c172	3	2026-10-20 10:46:17.236	\N
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, "userId", type, amount, network, txid, address, status, reason, meta, "createdAt", "updatedAt") FROM stdin;
9cb9d2d9-dfd2-40e8-8c93-3c72462b19ef	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	deposit	100	BNB Smart Chain (BEP20)	sgugy8f5785764	\N	completed	\N	\N	2026-09-26 11:26:50.841	2026-09-26 11:27:43.01
05af3a8c-29cc-42bb-923d-e661d3c63860	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-09-26 19:56:36.186	2026-09-26 19:57:49.407
764acc2b-e4a1-4a42-ba8c-a9d57d641b88	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	deposit	500	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-09-28 22:50:31.398	2026-09-28 22:50:41.924
d37cc25e-922f-4854-863e-dedf79010438	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdraw	60	BNB Smart Chain (BEP20)	\N	vxjxbixxihxixbxixbjxxb	completed	\N	{"fee":1,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-09-28T22:58:27.834Z"}	2026-09-28 22:57:32.574	2026-09-28 22:58:27.835
eec62280-9eb6-405d-bfe3-bddd97f3351e	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdraw	50	BNB Smart Chain (BEP20)	\N	vdjdidjbdkdbddbdjhbdjdbdjdbfj	completed	\N	{"fee":1,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-09-29T10:28:59.696Z"}	2026-09-29 10:27:22.042	2026-09-29 10:28:59.696
1de0acc9-47c8-4707-ad36-b1a045473477	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdraw	61	BNB Smart Chain (BEP20)	\N	cghjknbghujnnbbhhgggg	completed	\N	{"fee":0,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-09-29T22:49:45.750Z"}	2026-09-29 22:49:19.978	2026-09-29 22:49:45.752
6a3acd5c-66a7-4d8f-ab84-8fa98b54d0f4	d9aeedfe-2467-4f82-8444-66a684323c54	deposit	60	BNB Smart Chain (BEP20)	\N	\N	rejected	لم يتم التحقق من التحويل	\N	2026-10-04 10:12:35.12	2026-10-04 13:11:17.151
46b31d93-cf20-4e3f-949d-4c03c581050b	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	deposit	500	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-04 18:32:15.257	2026-10-04 18:32:47.581
da5238b8-21ba-4ef8-9b0d-66d45feac87c	9067689f-eacd-469f-9750-01dcf7b56639	deposit	60	BNB Smart Chain (BEP20)	\N	\N	rejected	لم يتم التحقق من التحويل	\N	2026-10-05 20:13:49.33	2026-10-05 21:53:15.277
1874ddbe-0885-4216-bd9d-7adae5f742d8	016dddc4-d1ab-402e-90b1-536ccd90d807	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-06 11:37:15.422	2026-10-06 11:38:01.489
069bd3f7-b161-4f8a-aff0-5e37326df8ee	095ecc95-41a7-43b6-a263-1886b4c22c9f	deposit	100	BNB Smart Chain (BEP20)	\N	\N	rejected	لم يتم التحقق من التحويل	\N	2026-10-06 09:57:37.802	2026-10-06 13:42:20.855
fd9cbf58-a022-4516-8043-a4cf7a6a8ca8	095ecc95-41a7-43b6-a263-1886b4c22c9f	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-06 14:07:40.924	2026-10-06 14:11:18.542
1f4045d6-b8b4-419e-960d-5f550ab8806e	4e351b76-af96-4067-afdc-600288f3605a	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-07 10:04:39.061	2026-10-07 10:07:26.458
4a8cb759-1115-4f56-a09f-4513fda12b15	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-08 09:11:04.205	2026-10-08 09:14:20.091
a7044b8f-79df-4a5d-8661-1218ce0eb803	df7d86f3-9359-4464-9b32-4d34a7b8a688	deposit	60	BNB Smart Chain (BEP20)	\N	\N	rejected	لم يتم التحقق من التحويل	\N	2026-10-14 20:40:46.408	2026-10-15 09:57:35.983
bef59b09-59a0-4a3a-a7c4-acb245f11e37	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdraw	170	BNB Smart Chain (BEP20)	\N	0x44190cd8f99af31408eee14f33a5f6f58e68fdc6	completed	\N	{"fee":0,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-10-15T13:50:53.614Z"}	2026-10-15 08:16:02.547	2026-10-15 13:50:53.616
39482d13-9b34-4b8a-ade4-18f453675c06	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	deposit	10000	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-15 18:09:41.676	2026-10-15 18:09:59.568
5219262a-e6a2-4b89-bd23-23a1b9d6ddff	3b514599-3777-4cd7-9b34-aa00942a3be2	deposit	200	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-17 20:45:39.535	2026-10-17 20:46:22.155
de18627b-9684-4979-9f17-3147d35cbf56	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdraw	130	BNB Smart Chain (BEP20)	\N	AURA-79K5EMAURA-79K5EMAURA-79K5EMAURA-79K5EM	completed	\N	{"fee":0,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-10-17T20:47:46.519Z"}	2026-10-17 20:47:26.648	2026-10-17 20:47:46.519
61f5b1c1-ced3-4e56-b2c5-12efb0d20f06	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdraw	243	BNB Smart Chain (BEP20)	\N	hdidhfjfbhbcjfbfofhkfbfh	rejected	تم الرفض من الإدارة	{"fee":0}	2026-10-17 20:52:03.177	2026-10-17 20:52:40.414
724466d9-e061-421d-979b-fdec80405018	14d657c1-afed-4016-ba10-192e4dfaeccb	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-18 02:10:14.132	2026-10-18 02:12:13.068
5930523a-6006-405b-8c85-204ab26872c1	095ecc95-41a7-43b6-a263-1886b4c22c9f	withdraw	29	BNB Smart Chain (BEP20)	\N	0x44190cd8f99af31408eee14f33a5f6f58e68fdc6	completed	\N	{"fee":0,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-10-18T08:28:37.784Z"}	2026-10-17 15:28:58.024	2026-10-18 08:28:37.784
e113b178-19d4-496c-9b43-e0f2a4e53de3	d9aeedfe-2467-4f82-8444-66a684323c54	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-18 19:51:51.541	2026-10-18 20:13:49.961
38aa6fa0-b076-48c3-bb60-a1ad2a69aec9	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdraw	299	BNB Smart Chain (BEP20)	\N	0x44190cd8f99af31408eee14f33a5f6f58e68fdc6	completed	\N	{"fee":0,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-10-18T20:45:19.816Z"}	2026-10-18 19:16:15.872	2026-10-18 20:45:19.816
0d981e55-c713-424e-b86e-46969618e95b	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	withdraw	23	BNB Smart Chain (BEP20)	\N	0x58Ac17cFEE6A46E05aB79dEBDed9F1C43EED02b8	completed	\N	{"fee":0,"externalTxid":null,"approvedBy":"2fe13236-701f-4faa-9315-d0a132362bb9","approvedAt":"2026-10-18T20:47:09.793Z"}	2026-10-18 10:33:53.114	2026-10-18 20:47:09.793
99dfef66-bc2a-498f-ae04-60796a269a3d	1b2898e2-82d8-424c-bde3-c788d60a2694	deposit	60	BNB Smart Chain (BEP20)	\N	\N	pending	\N	\N	2026-10-19 14:34:42.601	2026-10-19 14:34:42.601
4f567206-c580-440c-805a-ca07033887e2	1b2898e2-82d8-424c-bde3-c788d60a2694	deposit	60	BNB Smart Chain (BEP20)	\N	\N	pending	\N	\N	2026-10-19 14:37:19.177	2026-10-19 14:37:19.177
3ba58e78-7249-421b-8de1-ffcc423cc770	1b2898e2-82d8-424c-bde3-c788d60a2694	deposit	60	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-19 14:33:40.069	2026-10-19 14:38:37.843
ec50e182-904f-4840-a3a5-18d3169f0a75	58e6b8c8-c075-4558-99c2-4889448030d8	deposit	100	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-19 17:40:39.616	2026-10-19 17:42:56.071
966adfa4-dfac-4143-874b-30344b127917	ecb90262-10ae-42a6-8cac-e8563bb30e60	deposit	60	BNB Smart Chain (BEP20)	\N	\N	completed	\N	\N	2026-10-20 08:06:10.986	2026-10-20 08:10:41.25
\.


--
-- Data for Name: user_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_notifications (id, "userId", type, title, message, icon, priority, "actionUrl", "isRead", "createdAt") FROM stdin;
39b4a21e-32a9-4134-8669-28b147647ad0	ea9b62f6-cba7-4a87-ba26-954fb933b6a2	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	f	2026-09-25 11:51:15.53
1b7457cf-f2c8-4a3b-af02-3eddfe07770d	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-09-26 19:57:49.418
72009bf0-f574-40e3-a95f-307354d69655	c556a3ac-9185-490e-8a60-c69e3d832ebe	deposit	تم رفض طلب الإيداع ❌	تم رفض طلب الإيداع بمبلغ $300.	x-circle	MEDIUM	/dashboard	t	2026-09-27 06:35:49.574
b58d715b-38de-4f2b-aaac-c39ac9375ef4	1108910e-6177-4d20-8f9d-a0cf7e3d5026	system	❌ تم رفض التحقق من هويتك	لم يتم قبول الوثائق المرفوعة. يمكنك المحاولة مرة أخرى.	info	high	/verify-identity	t	2026-09-27 06:48:34.382
ad2851f3-cdd4-4199-bd04-3c1a224e8b75	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-09-27 10:27:37.122
31602081-ea28-465b-a7a4-29b6518e2e87	1108910e-6177-4d20-8f9d-a0cf7e3d5026	deposit	تم رفض طلب الإيداع ❌	تم رفض طلب الإيداع بمبلغ $200.	x-circle	MEDIUM	/dashboard	t	2026-09-27 12:26:19.596
1b4d981b-c2ec-443c-8fba-05f336a91742	bb485f4c-fc9e-4900-ae36-0e89c8663b40	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-09-27 14:40:21.149
73ac9469-6ad4-4523-b2f4-bde1916ae795	555f4616-37a0-4d17-a4e6-d58d3a4c1d04	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-09-27 11:51:09.606
a554366f-96c9-412b-91f2-94d49c8fb096	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $500 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-09-28 22:50:41.933
d8c7c3e5-01a7-476d-b609-e5e575fe382f	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $60 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-09-28 22:58:27.84
2292a47a-105a-4e08-9fd6-83918e056df0	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $50 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-09-29 10:28:59.702
b1e45e6d-cfdd-42fb-8de5-e0ae1465014b	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $1000 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-09-29 12:43:52.612
cac88db1-6122-4afd-b913-2db2bc33f279	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $200 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-09-29 12:59:12.184
d1633a48-8f6c-44aa-92cc-e6e67cd6501a	606d790f-e7db-477d-977f-6ceeeaa0d0ec	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-09-29 13:47:18.023
a0fed911-ced6-42e8-aa59-fe38db4acd12	606d790f-e7db-477d-977f-6ceeeaa0d0ec	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-09-29 13:51:52.752
f52c37b2-b573-43d5-b3a5-7efdc18ccb42	606d790f-e7db-477d-977f-6ceeeaa0d0ec	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $1000 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-09-29 13:52:44.277
eb454b8b-d75f-4114-8b04-1e4aba70ed01	606d790f-e7db-477d-977f-6ceeeaa0d0ec	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $39 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-09-29 13:54:24.753
6b7bd016-116a-4c25-9780-b1ff4087d93d	003cb43d-ce1e-43ff-ba6c-86ca6a7d2310	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-09-29 17:52:56.954
bec9c73f-65ad-45ff-b6cd-cfd1a1039ad8	c556a3ac-9185-490e-8a60-c69e3d832ebe	system	❌ تم رفض التحقق من هويتك	لم يتم قبول الوثائق المرفوعة. يمكنك المحاولة مرة أخرى.	info	high	/verify-identity	f	2026-09-29 22:48:02.729
e4e48c45-3657-4c6d-8876-be4342a953d4	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $61 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-09-29 22:49:45.769
1b91c417-e546-4e31-b19b-e5773a91222b	3fe9376c-8a8b-4a4a-b197-9d1e70901b25	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-09-29 22:48:25.571
79d4fdc1-02e2-42b4-ad87-12a5e2d5abef	7103cc14-77a0-494d-9fc4-570285f45c84	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	f	2026-10-01 18:43:21.682
533a0972-0750-45cf-89f4-266a0c2077b6	4e351b76-af96-4067-afdc-600288f3605a	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-02 19:21:00.393
36bf0dc3-39c9-4d86-97be-eba8d0f01dbe	016dddc4-d1ab-402e-90b1-536ccd90d807	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-04 07:04:51.173
27bc4514-486b-46f9-82cb-94324050d179	36ccfffd-1e41-46c7-bf81-5a8d0451bd30	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $500 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-04 18:32:47.596
1c9be16c-a5d3-40ac-b68f-9bc5f6868c36	d9aeedfe-2467-4f82-8444-66a684323c54	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-04 12:49:22.022
7c1066d7-6fa1-435d-bc19-056cb8a8466a	d9aeedfe-2467-4f82-8444-66a684323c54	deposit	تم رفض طلب الإيداع ❌	تم رفض طلب الإيداع بمبلغ $60.	x-circle	MEDIUM	/dashboard	t	2026-10-04 13:11:17.155
2a7f6ebb-c6dd-458f-af3b-336f6614af49	9067689f-eacd-469f-9750-01dcf7b56639	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-05 19:57:04.379
9ec56a68-ed86-41e3-b92c-e0ff2e22519e	9067689f-eacd-469f-9750-01dcf7b56639	deposit	تم رفض طلب الإيداع ❌	تم رفض طلب الإيداع بمبلغ $60.	x-circle	MEDIUM	/dashboard	t	2026-10-05 21:53:15.282
5b0be0a4-1fbe-4929-9b90-ab08cf3e93f2	095ecc95-41a7-43b6-a263-1886b4c22c9f	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-06 09:50:59.709
e545ffa1-b1e2-431a-8ebc-485d7532cd3c	016dddc4-d1ab-402e-90b1-536ccd90d807	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-06 11:38:01.495
b682435b-a897-4d61-a6c9-eab4a5f9e6ad	095ecc95-41a7-43b6-a263-1886b4c22c9f	deposit	تم رفض طلب الإيداع ❌	تم رفض طلب الإيداع بمبلغ $100.	x-circle	MEDIUM	/dashboard	t	2026-10-06 13:42:20.857
c28ab651-8382-4387-a70b-327561904815	095ecc95-41a7-43b6-a263-1886b4c22c9f	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-06 14:11:18.567
844d0f3e-47e1-43fb-85a3-0215988895c6	4e351b76-af96-4067-afdc-600288f3605a	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-07 10:07:26.467
bfdcc6a3-a9e0-488c-87b8-acf5d8130e52	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	tier_upgrade	🎉 ترقية إلى المستوى الأول!	مبروك! لقد وصلت إلى المستوى الأول بعد 5 إحالة. تم إضافة مكافأة $50 إلى رصيدك مباشرة.	crown	high	/referrals	t	2026-10-08 09:14:20.138
0b7612bf-cd25-4bea-8fb6-706a538ca541	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	salary_info	📢 معلومة عن راتبك الأسبوعي	راتبك الأسبوعي هو $10 USDT. لتفعيل السحب، يجب أن تصل إلى 12 إحالة (باقي 7 إحالة).	info	normal	/referrals	t	2026-10-08 09:14:20.148
aab6b659-bf8a-40dd-b7aa-e974967615cc	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-08 09:13:01.994
281de7a5-5ebf-48b2-919c-4ebb69f71393	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-08 09:14:20.151
b21df05d-9526-4725-ada5-7dea9d531bb7	df7d86f3-9359-4464-9b32-4d34a7b8a688	system	❌ تم رفض التحقق من هويتك	لم يتم قبول الوثائق المرفوعة. يمكنك المحاولة مرة أخرى.	info	high	/verify-identity	f	2026-10-15 08:55:17.037
116b831b-0399-4bb8-bbdf-7637051fc8a5	df7d86f3-9359-4464-9b32-4d34a7b8a688	deposit	تم رفض طلب الإيداع ❌	تم رفض طلب الإيداع بمبلغ $60.	x-circle	MEDIUM	/dashboard	f	2026-10-15 09:57:35.987
77305969-d48c-4387-bf81-ce21c00d41a2	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $170 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-10-15 13:50:53.624
152c88d8-9e5a-4fb6-9c9e-2489f2be44db	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $10000 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-15 18:09:59.576
77782911-c152-420c-939b-0d5b6267ca0f	3b514599-3777-4cd7-9b34-aa00942a3be2	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-17 20:45:17.205
72406b94-14cd-487f-a648-6e569aac6767	31b656fc-de59-436b-becf-c7d894737e5c	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	f	2026-10-17 20:46:00.891
4faa54c0-a16a-4db2-94d0-782fb8aa8e20	3b514599-3777-4cd7-9b34-aa00942a3be2	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $200 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-17 20:46:22.165
2d68fec7-3803-4d87-8f6d-da5aabdf1bf3	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $130 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-10-17 20:47:46.524
114f9e5a-1406-445d-a3d3-21d9c47747dd	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdrawal	تم رفض طلب السحب ❌	تم رفض طلب السحب بمبلغ $243 وإعادة الرصيد لحسابك.	x-circle	HIGH	/dashboard	t	2026-10-17 20:52:40.425
e0f201e2-bfca-42b2-ae6b-f51d968f00ea	14d657c1-afed-4016-ba10-192e4dfaeccb	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-18 02:09:05.6
5681e25d-9c05-4ca3-8b55-e8dece1e6c0b	14d657c1-afed-4016-ba10-192e4dfaeccb	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-18 02:12:13.083
0f22356b-ca42-47fe-b9a4-0f98c571ea26	c5cd8217-8a89-494f-9b96-f611c4f56a67	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-18 02:23:50.935
a6f46367-c564-4f3e-8cc8-207b5b687498	095ecc95-41a7-43b6-a263-1886b4c22c9f	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $29 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-10-18 08:28:37.793
a3e740ed-d169-4924-99e7-6fa3ba00ead9	1b2898e2-82d8-424c-bde3-c788d60a2694	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-18 16:50:35.271
edf19600-5b47-4e26-9bc7-c2a65929ece0	391de937-e58f-4f29-859b-b85533f2c744	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-18 18:01:38.53
45f1eac6-e9c9-4926-83c3-241a42f193fb	d9aeedfe-2467-4f82-8444-66a684323c54	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-18 20:13:49.983
9c6c59ec-062e-4bc7-bb52-e82e792622ff	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $299 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-10-18 20:45:19.822
11dc8f6b-88c2-4b09-beff-6d8166b59c8f	592313e4-4fc0-4e1f-a8bf-eae574995ef2	system	❌ تم رفض التحقق من هويتك	لم يتم قبول الوثائق المرفوعة. يمكنك المحاولة مرة أخرى.	info	high	/verify-identity	t	2026-10-19 06:51:30.436
799a02f9-fa69-4c4d-b396-e4e3c8aa4de3	13de3fce-19f3-450b-a5e2-c329e3d2c135	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-19 11:32:10.36
c7310596-0b92-471c-8e1d-60707c4cd69e	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-19 11:10:11.245
3067a18c-4c31-41ac-beb6-3dd39436fbc0	6cb9dd48-d72a-42f4-a672-d3e4827284d9	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-19 13:01:53.131
5f299894-4680-4d96-96c9-57345aadedad	162166a0-298d-49e5-974c-b90d1d2d1d16	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-19 13:02:34.816
8fcddf02-cc51-43c6-a9a7-cc41bcd5df3e	1b2898e2-82d8-424c-bde3-c788d60a2694	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $60 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-19 14:38:37.855
aaa4a88b-3724-4148-8164-acc985512fdb	592313e4-4fc0-4e1f-a8bf-eae574995ef2	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-19 07:59:51.229
e6a662ce-1811-4a4c-8981-6c559bf40e47	ecb90262-10ae-42a6-8cac-e8563bb30e60	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-19 16:43:58.843
497fc341-aef3-4153-ba0e-61735f6555b6	58e6b8c8-c075-4558-99c2-4889448030d8	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-19 17:37:40.076
494d842b-1262-4c6c-8763-0ee9afe03cc9	58e6b8c8-c075-4558-99c2-4889448030d8	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $100 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-19 17:42:56.094
970b5222-5e5b-4632-bce1-7c489d651a28	ecb90262-10ae-42a6-8cac-e8563bb30e60	deposit	تم تأكيد الإيداع 💰	تمت إضافة مبلغ $60 بنجاح إلى حسابك.	arrow-down-left	MEDIUM	/dashboard	t	2026-10-20 08:10:41.261
eb3a4bd8-6f33-48a9-bb79-81c7b2a26b7c	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	withdrawal	تمت معالجة طلب السحب 📤	تم تحويل مبلغ $23 إلى محفظتك بنجاح.	arrow-up-right	HIGH	/dashboard	t	2026-10-18 20:47:09.797
31ec2843-02c3-4915-a02b-9b8801066ddf	040b9796-2ddd-4e8e-b55a-f2e85bb2c172	system	✅ تم توثيق حسابك!	مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.	shield	high	/dashboard	t	2026-10-20 10:47:32.559
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, username, password, "fullName", "accountLevel", "referralCount", "referralCode", "referredBy", "isVerified", "withdrawableBalance", "availableBalance", "lockedBalance", "totalValue", "totalDeposited", "totalWithdrawn", "totalProfit", "totalLoss", "referralEarnings", "level1Referrals", "level2Referrals", "level3Referrals", "referralTier", "totalReferrals", "weeklySalaryUnlockedAt", "lastSalaryPaidAt", "totalSalaryEarned", "totalBonusEarned", "createdAt", "updatedAt") FROM stdin;
016dddc4-d1ab-402e-90b1-536ccd90d807	osamadsa130@gmail.com	Mazen	$2b$10$gSfjvHeicH57cQcl3xQCjeo5DQEgWJtZdXcU5VGCNm0HEiMRqZmTG	Mazen	0	0	AURA-3L9EJG	\N	t	3.33	103.33	0	100	100	0	3.33	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-04 07:04:01.559	2026-10-06 11:40:59.652
555f4616-37a0-4d17-a4e6-d58d3a4c1d04	mohandeeee64@gmail.com	dgot	$2b$10$eca9N3WHx2Nx2LiBjAoJ5.4d00gLYeN3HttAtEkQAf8sTCwe9grVC	مهند عايد المحمد	0	0	AURA-QDTLSZ	02de29c4-69e7-4a30-9119-dd38ffc662aa	t	5.33	105.33	0	100	100	0	5.33	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-09-26 19:52:25.304	2026-09-27 20:44:08.115
d9aeedfe-2467-4f82-8444-66a684323c54	alamaratabwzby762@gmail.com	ekxjcjndmxk111	$2b$10$ga0aXiYOELs1V./O6EYOiOMPLNwvd4JO.Mu6/cVN9IqSgs6Fa7OA2	محمد احمد	0	0	AURA-9CJ89M	\N	t	6.66	106.66	0	100	100	0	6.66	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-03 16:10:50.335	2026-10-20 10:06:23.905
02de29c4-69e7-4a30-9119-dd38ffc662aa	majid2005225@gmail.com	vdivjbd	$2b$10$I2A1Ok01H0pUXjhwI9afl.ISAkQQgkjawJsqUlFTuRQ68qFlTFx02	انا	0	1	AURA-4PWNG8	\N	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	1	\N	\N	0	0	2026-09-26 19:38:54.224	2026-09-28 12:42:15.632
003cb43d-ce1e-43ff-ba6c-86ca6a7d2310	mlnjbhvgcfxdxx@gmail.com	djy47	$2b$10$hP/6oLB8YHmIOV90CGP7D.3aQyKLpVrX1m4P2TpIB/QfAFkBJAwCK	احمد العلي	0	0	AURA-EV6CR6	02de29c4-69e7-4a30-9119-dd38ffc662aa	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-09-29 12:47:06.056	2026-09-29 17:52:56.934
ce67b65b-644b-4949-8890-fe8a03e91568	frhanabwfhd029@gmail.com	AaaaSd	$2b$10$oP56HLHpi/ifzv0QNEiKIOiAjK.APGnTl7rAuG6o.QS/YB7D1BoMW	ابو فهد	0	0	AURA-GR3ZDV	0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	f	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-03 17:13:36.828	2026-10-03 17:13:36.848
36ccfffd-1e41-46c7-bf81-5a8d0451bd30	alhlwsh6@gmail.com	A5xzii	$2b$10$vCAmI8P0faYatgWowd6hc.FJQC/DqJOl7LpjBS72.ZKh6IjAXfEKS	عمر  العنزي	0	0	AURA-NXRWT8	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	t	83.25	583.2499999999999	0	500	500	0	83.25	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-09-26 12:15:54.848	2026-10-20 10:40:01.779
7103cc14-77a0-494d-9fc4-570285f45c84	ktacqfua@gmail.com	dbjdjjsuu	$2b$10$MaZxXw9IY6N3bQF/5DEZNOrZTremIYZS2xQyR/YXQ8XknvqUmajKy	حمود الوهبي	0	0	AURA-NEWZG2	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-01 17:45:37.035	2026-10-01 18:43:21.671
9067689f-eacd-469f-9750-01dcf7b56639	ahmdalali1238@gmail.com	ahmd123	$2b$10$0S/QKtOeBEjwpEsaYp7kNOtxebVG1cBrr5RDx8YXaOO/j4Eo.NX6e	احمد العلي	0	0	AURA-DHH6G4	\N	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-05 19:30:44.89	2026-10-05 19:57:04.376
df7d86f3-9359-4464-9b32-4d34a7b8a688	mndkfjkenfosndonwkdn@gmail.com	AIMBIT	$2b$10$4hjkBr/pW7ZcEdg2UvrYAuiwWIhf2Unw5B6PPpBn1ZztftPnqBcR.	ابو راكان	0	0	AURA-DUE6QW	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	f	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-14 20:39:20.311	2026-10-14 20:39:20.32
31b656fc-de59-436b-becf-c7d894737e5c	ahmethelal2001@gmail.com	Ahmed242	$2b$10$TAwcI1XgXrAeQ8FAYCSOMur7c5qnDVPPlOnDynPbPklJs26fVIRsW	حازم العلي	0	0	AURA-5XEJV2	\N	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-17 20:27:20.713	2026-10-17 20:46:00.885
14d657c1-afed-4016-ba10-192e4dfaeccb	aasdfghjklqwertyuiop2004@gmail.com	question	$2b$10$Zfm9glDHRsDfFaTvfeutvOBVb015slrqeTNY8DksX4fkAhgAzu5ry	سلطان عناد السويدان	0	0	AURA-FCPZQR	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	t	6.66	106.66	0	100	100	0	6.66	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-18 02:06:52.754	2026-10-19 10:04:27.731
c5cd8217-8a89-494f-9b96-f611c4f56a67	ghanmalshmryy108@gmail.com	ganm-2026	$2b$10$UFOPzl.PkW0AHQ58.vL6mOBF6wDX3n3yrlr5bnkDCSae.8ocFGEb6	غانم عبد الطيف المنصور	0	0	AURA-WE8K3V	\N	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-18 02:23:16.314	2026-10-18 02:23:50.933
4e351b76-af96-4067-afdc-600288f3605a	abwmsharyalqady8@gmail.com	vdkv6	$2b$10$Pn5F5jVPVBPqAuDFt9cRae6VttWq1IjGS3rXnORcoaJfjLou/ajsK	حسن ادلم الدخيل	0	0	AURA-UDC7M2	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	t	36.62999999999999	136.63000000000002	0	100	100	0	36.62999999999999	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-02 14:30:58.101	2026-10-19 10:51:42.248
1b2898e2-82d8-424c-bde3-c788d60a2694	kurdo.a.z.90762@gmail.com	hsnthmam9595	$2b$10$qmDXFmUzh0zOfNPxXWtNDOwugZFLCGhK/JFztrx/z4hmGxsdS.GXC	حسن عثمان درويش	0	0	AURA-CL3GNP	095ecc95-41a7-43b6-a263-1886b4c22c9f	t	1.9980000000000002	61.998	0	60	60	0	1.9980000000000002	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-18 14:37:01.464	2026-10-20 10:01:31.503
0bc66bc8-bee2-4d67-9d43-2aa88fa97cbc	hlalalstam880@gmail.com	hlal	$2b$10$tPUjo3ichR0K6Cs2aLgCfeZbYwrf3N70FOy.Y3JAqmwQkQMkNx0uK	هلال	0	0	AURA-4UWSKY	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	t	6.969999999999995	106.96999999999998	0	100.30999999999999	100	23	29.96999999999999	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-09-27 10:09:22.51	2026-10-20 10:25:06.215
4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	fcc320c13b@emailnox.live	majid	$2b$10$ZGRynKWgL6qeD9ODggpZO.FrckyQdEPwoHR9GqHxc9SuX2S9wmpLS	ماجد الدخيل	0	7	AURA-79K5EM	\N	t	1003.72	1129.94	5	428.98	10600	660	1661.0371804186866	0	0	0	0	0	LEVEL1	7	\N	\N	0	50	2026-09-26 10:29:57.26	2026-10-20 10:00:19.056
391de937-e58f-4f29-859b-b85533f2c744	ahamad5557gj@gmail.com	Ahmad19881988	$2b$10$if8dQ.ve/VtN/b5iwS1QZe.zVOUD74MJOH9qLfEquoEGLE/T3A92.	منى علي شيخ علي	0	0	AURA-JLPD6R	095ecc95-41a7-43b6-a263-1886b4c22c9f	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-18 17:55:57.574	2026-10-18 18:01:38.524
3b514599-3777-4cd7-9b34-aa00942a3be2	ysyalnzyy130@gmail.com	shb134	$2b$10$kiRzUnfoAjvTIkeExLKnjOCJZ5qi5f6dGzGiu8rVkiEY3Z47qYtUy	عيسى عناد السويدان	0	1	AURA-9DKETU	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	t	19.98	219.98	0	200	200	0	225.31	0	0	0	0	0	STARTER	1	\N	\N	0	0	2026-10-17 20:44:02.354	2026-10-20 10:29:52.251
592313e4-4fc0-4e1f-a8bf-eae574995ef2	bdallhhjly760@gmail.com	abdullah332	$2b$10$lqmZqAm5V6x.BJlu7tHmPOhZRDOiaKkdBz/yzp9hoytmmTrh5K4g2	عبدالله محمود حاج علي	0	0	AURA-SM2EZK	3b514599-3777-4cd7-9b34-aa00942a3be2	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-19 06:48:44.761	2026-10-19 07:59:51.221
3a6f5a36-ff15-47b2-9cbf-324dbceaef67	fhedan411@gmail.com	fhd_b52	$2b$10$uHKhLHS13rcrAToy7ACG.uRgLBX1T9.dsloPxmZYmylyToYXEgxTa	فهد معيض الصياح	0	0	AURA-SVCRNH	095ecc95-41a7-43b6-a263-1886b4c22c9f	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-19 10:36:27.981	2026-10-19 11:10:11.241
13de3fce-19f3-450b-a5e2-c329e3d2c135	alyasyny240@gmail.com	Yasyn	$2b$10$xWRIRaHcWOz1KfOEDMf9AOcLqFxIGV8DSEGz2iIlaKwzEOi3dIaRa	ياسين الياسين	0	0	AURA-5L6EBE	095ecc95-41a7-43b6-a263-1886b4c22c9f	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-19 11:29:04.888	2026-10-19 11:32:10.348
6cb9dd48-d72a-42f4-a672-d3e4827284d9	allisamr66@gmail.com	Mahmso23awx	$2b$10$B.5fWY5ihySnviy3lyo6xeDPCpt0E18QSp4yV6IcMUw04aUgjni2a	محمود ايوب	0	0	AURA-AT7X9K	\N	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-19 12:59:25.512	2026-10-19 13:01:53.129
162166a0-298d-49e5-974c-b90d1d2d1d16	alsyahahmd21@gmail.com	ahmdalsyah	$2b$10$5hThQ9jWZb/uKI4MGTUqP.ULmm3xV3Zk5/uGuD4Y1jadpUsXuupYG	أحمد الصياح	0	0	AURA-K6FJB8	3a6f5a36-ff15-47b2-9cbf-324dbceaef67	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-19 12:51:47.053	2026-10-19 13:02:34.81
ecb90262-10ae-42a6-8cac-e8563bb30e60	rafta3195@gmail.com	Mnbvcxy21	$2b$10$t9Me4yFZuLpD0KKnx7YzqOHmm9BZFZvBDE7t/7kfjurN44MM2pOc6	مطشر محمد الاحمد	0	0	AURA-XVFHAG	095ecc95-41a7-43b6-a263-1886b4c22c9f	t	1.9980000000000002	61.998	0	60	60	0	1.9980000000000002	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-19 16:29:56.292	2026-10-20 10:01:16.442
095ecc95-41a7-43b6-a263-1886b4c22c9f	wylanalnzy059@gmail.com	www1996	$2b$10$KH5y0hepI7DNDn.KhZp6YuUlAZFLmxWIEc3VPv4M2KQuge68lzI6i	وائل العويض	0	2	AURA-GJSRAG	4c59cc3e-8951-4553-b1c4-aeeaa7df8ea4	t	10.959999999999992	110.96	0	100.97	100	29	39.95999999999999	0	0	0	0	0	STARTER	2	\N	\N	0	0	2026-10-06 09:22:01.012	2026-10-20 10:02:32.431
58e6b8c8-c075-4558-99c2-4889448030d8	asamtalfdany23@gmail.com	ASAMA2003	$2b$10$KYvc5160g9jnjY9xZTD3Y.ua.gvrjO.CX66AwBFDj88fCSFNFvp3G	اسامة النايف	0	0	AURA-6XFWCX	3b514599-3777-4cd7-9b34-aa00942a3be2	t	3.33	103.33	0	100	100	0	3.33	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-19 17:31:22.853	2026-10-20 10:32:36.472
040b9796-2ddd-4e8e-b55a-f2e85bb2c172	sedar2535@gmail.com	serdar	$2b$10$i.lBHpEWNnid/ppixwNkuOTcgEDB3GwzVAf/K.VHH5nnJwVCExQQG	درويش	0	0	AURA-NC22LR	1b2898e2-82d8-424c-bde3-c788d60a2694	t	0	0	0	0	0	0	0	0	0	0	0	0	STARTER	0	\N	\N	0	0	2026-10-20 10:46:17.201	2026-10-20 10:47:32.556
\.


--
-- Data for Name: weekly_salaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weekly_salaries (id, "userId", tier, amount, "weekStart", "weekEnd", status, "paidAt", "createdAt") FROM stdin;
\.


--
-- Name: admin_actions admin_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_actions
    ADD CONSTRAINT admin_actions_pkey PRIMARY KEY (id);


--
-- Name: admin_notifications admin_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_pkey PRIMARY KEY (id);


--
-- Name: admin_sessions admin_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: earnings earnings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.earnings
    ADD CONSTRAINT earnings_pkey PRIMARY KEY (id);


--
-- Name: identity_verifications identity_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.identity_verifications
    ADD CONSTRAINT identity_verifications_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: mission_completions mission_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mission_completions
    ADD CONSTRAINT mission_completions_pkey PRIMARY KEY (id);


--
-- Name: missions missions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.missions
    ADD CONSTRAINT missions_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: referral_bonuses referral_bonuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_bonuses
    ADD CONSTRAINT referral_bonuses_pkey PRIMARY KEY (id);


--
-- Name: referral_earnings referral_earnings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_earnings
    ADD CONSTRAINT referral_earnings_pkey PRIMARY KEY (id);


--
-- Name: referral_relations referral_relations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_relations
    ADD CONSTRAINT referral_relations_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: user_notifications user_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weekly_salaries weekly_salaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_salaries
    ADD CONSTRAINT weekly_salaries_pkey PRIMARY KEY (id);


--
-- Name: admin_actions_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX admin_actions_action_idx ON public.admin_actions USING btree (action);


--
-- Name: admin_actions_adminId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "admin_actions_adminId_idx" ON public.admin_actions USING btree ("adminId");


--
-- Name: admin_notifications_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "admin_notifications_isRead_idx" ON public.admin_notifications USING btree ("isRead");


--
-- Name: admin_notifications_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX admin_notifications_type_idx ON public.admin_notifications USING btree (type);


--
-- Name: admin_sessions_adminId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "admin_sessions_adminId_idx" ON public.admin_sessions USING btree ("adminId");


--
-- Name: admin_sessions_adminSlug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "admin_sessions_adminSlug_idx" ON public.admin_sessions USING btree ("adminSlug");


--
-- Name: admin_sessions_adminSlug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "admin_sessions_adminSlug_key" ON public.admin_sessions USING btree ("adminSlug");


--
-- Name: admin_sessions_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX admin_sessions_token_idx ON public.admin_sessions USING btree (token);


--
-- Name: admin_sessions_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admin_sessions_token_key ON public.admin_sessions USING btree (token);


--
-- Name: admins_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);


--
-- Name: admins_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_username_key ON public.admins USING btree (username);


--
-- Name: earnings_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "earnings_userId_idx" ON public.earnings USING btree ("userId");


--
-- Name: identity_verifications_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX identity_verifications_status_idx ON public.identity_verifications USING btree (status);


--
-- Name: identity_verifications_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "identity_verifications_userId_idx" ON public.identity_verifications USING btree ("userId");


--
-- Name: identity_verifications_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "identity_verifications_userId_key" ON public.identity_verifications USING btree ("userId");


--
-- Name: login_attempts_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "login_attempts_createdAt_idx" ON public.login_attempts USING btree ("createdAt");


--
-- Name: login_attempts_identifier_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX login_attempts_identifier_idx ON public.login_attempts USING btree (identifier);


--
-- Name: login_attempts_identifier_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX login_attempts_identifier_type_idx ON public.login_attempts USING btree (identifier, type);


--
-- Name: mission_completions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "mission_completions_userId_idx" ON public.mission_completions USING btree ("userId");


--
-- Name: mission_completions_userId_missionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "mission_completions_userId_missionId_key" ON public.mission_completions USING btree ("userId", "missionId");


--
-- Name: missions_endsAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "missions_endsAt_idx" ON public.missions USING btree ("endsAt");


--
-- Name: missions_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX missions_status_idx ON public.missions USING btree (status);


--
-- Name: otp_codes_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX otp_codes_code_idx ON public.otp_codes USING btree (code);


--
-- Name: otp_codes_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX otp_codes_email_idx ON public.otp_codes USING btree (email);


--
-- Name: otp_codes_email_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX otp_codes_email_type_idx ON public.otp_codes USING btree (email, type);


--
-- Name: password_reset_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX password_reset_tokens_token_idx ON public.password_reset_tokens USING btree (token);


--
-- Name: password_reset_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_reset_tokens_token_key ON public.password_reset_tokens USING btree (token);


--
-- Name: password_reset_tokens_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "password_reset_tokens_userId_idx" ON public.password_reset_tokens USING btree ("userId");


--
-- Name: referral_bonuses_claimed_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX referral_bonuses_claimed_idx ON public.referral_bonuses USING btree (claimed);


--
-- Name: referral_bonuses_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "referral_bonuses_userId_idx" ON public.referral_bonuses USING btree ("userId");


--
-- Name: referral_bonuses_userId_tier_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "referral_bonuses_userId_tier_key" ON public.referral_bonuses USING btree ("userId", tier);


--
-- Name: referral_earnings_referrerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "referral_earnings_referrerId_idx" ON public.referral_earnings USING btree ("referrerId");


--
-- Name: referral_relations_activatedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "referral_relations_activatedAt_idx" ON public.referral_relations USING btree ("activatedAt");


--
-- Name: referral_relations_referredId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "referral_relations_referredId_idx" ON public.referral_relations USING btree ("referredId");


--
-- Name: referral_relations_referrerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "referral_relations_referrerId_idx" ON public.referral_relations USING btree ("referrerId");


--
-- Name: referral_relations_referrerId_referredId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "referral_relations_referrerId_referredId_key" ON public.referral_relations USING btree ("referrerId", "referredId");


--
-- Name: transactions_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_status_idx ON public.transactions USING btree (status);


--
-- Name: transactions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "transactions_userId_idx" ON public.transactions USING btree ("userId");


--
-- Name: user_notifications_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_notifications_isRead_idx" ON public.user_notifications USING btree ("isRead");


--
-- Name: user_notifications_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_notifications_userId_idx" ON public.user_notifications USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_referralCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "users_referralCode_idx" ON public.users USING btree ("referralCode");


--
-- Name: users_referralCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_referralCode_key" ON public.users USING btree ("referralCode");


--
-- Name: users_referralTier_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "users_referralTier_idx" ON public.users USING btree ("referralTier");


--
-- Name: users_referredBy_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "users_referredBy_idx" ON public.users USING btree ("referredBy");


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: weekly_salaries_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX weekly_salaries_status_idx ON public.weekly_salaries USING btree (status);


--
-- Name: weekly_salaries_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "weekly_salaries_userId_idx" ON public.weekly_salaries USING btree ("userId");


--
-- Name: admin_sessions admin_sessions_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT "admin_sessions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public.admins(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: earnings earnings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.earnings
    ADD CONSTRAINT "earnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: referral_bonuses referral_bonuses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_bonuses
    ADD CONSTRAINT "referral_bonuses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: referral_earnings referral_earnings_referrerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_earnings
    ADD CONSTRAINT "referral_earnings_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transactions transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_referredBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: weekly_salaries weekly_salaries_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_salaries
    ADD CONSTRAINT "weekly_salaries_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict EtSuwK6gT3bi1j7hqOcbJBK3DXh96w3odfGzC0otjqlsiNUwMWcymGlN4fEkMQy

