--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth (
    userid character varying DEFAULT ''::character varying NOT NULL,
    userhash character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.auth OWNER TO postgres;

--
-- Name: id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_seq OWNER TO postgres;

--
-- Name: join_room_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.join_room_events (
    userid character varying,
    roomid character varying,
    joineddate integer
);


ALTER TABLE public.join_room_events OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    messageid character varying,
    roomid character varying,
    userid character varying,
    date integer,
    messagetext text
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: private_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.private_messages (
    messageid character varying NOT NULL,
    senderid character varying NOT NULL,
    receipientid character varying NOT NULL,
    date integer NOT NULL,
    message text NOT NULL
);


ALTER TABLE public.private_messages OWNER TO postgres;

--
-- Name: room_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_requests (
    id character varying DEFAULT nextval('public.id_seq'::regclass) NOT NULL,
    requesting_user character varying DEFAULT ''::character varying NOT NULL,
    requested_room character varying DEFAULT ''::character varying NOT NULL,
    request_for character varying NOT NULL,
    date integer NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.room_requests OWNER TO postgres;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    roomid character varying DEFAULT ''::character varying NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    created_by character varying DEFAULT ''::character varying NOT NULL,
    authorise boolean DEFAULT true NOT NULL
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid character varying DEFAULT ''::character varying NOT NULL,
    name text DEFAULT ''::text NOT NULL,
    connected character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: auth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth (userid, userhash) FROM stdin;
b4df02e4-aa1c-44a5-bd84-cae26a176f8f	$2b$10$Oz.arNpF.wc.qTxTIl4BT.4j9uJ0GrupwQGG63FwAP2cMCD/UpnZ2
b9851f3c-c496-4463-a356-0574f814c39f	$2b$10$vrICynOpd8Z/DkgxK8dege..kidEwCfxSQqZZnZOx8i4Bxq20NVTS
6c7ecc2c-7564-4247-8492-368b85e069cf	$2b$10$L0rkdNv2tyogP2TXWu9y6.jm16w4sFFGkumO0LluxfbYVX252uTPy
94e5114e-39a7-4042-8ebe-b9052d21f68b	$2b$10$KtTl/45wm4YOwofH9TS4KuIR9e2gtBlo4lfwhCHNY8ptEJZjKvTOy
26e43c5d-fb17-4157-80d2-b8eea991c111	$2b$10$PmLEyCufPss/uhGIz.ogMeYVclrZyrXiLGtWBt0.4KGBJ/LLKhjx.
e61d5b89-1279-47df-83ea-0ad80029a9ce	$2b$10$i0a71qQAjJXi5Ypd.yGFTuxZglcwfhCx7tPuoIVVrIhafodZ4Nl4m
339117ee-4436-4462-9fb1-99695af887d9	$2b$10$xAoPuI5HJXUHicx3zCDrNePymjFR94H3dYlHqAXHLeZLVIn0imSxO
36c05d96-fa75-4957-8a5d-f91b8e876ae2	$2b$10$RqQ9nD/T2W8cd.h/dGWaBO4sO9kCHTlMD0O19QkYOGdN8vnPssmPK
7463762a-7488-46e0-9094-b5b5a6d184ad	$2b$10$pnI8Y3q3gdP/cfYdh6MtLueLjBZkN/PjUO4kkhWlTFVZY6jQ8jp7C
c2b1ac25-461a-4ef3-91ad-ec565e0ed737	$2b$10$.bRN0tt/qavLVA7YpOFR.ezO3k5Srfd1fkvEZyozjHHxC3ql4HoU2
a8b1c37a-f55d-42e8-b91a-dc86668dd1b3	$2b$10$1RViixsRMie9ZLf/fD/fSOM1CHbRCg5.yUKAc4iDsNFCwIQTqR5QW
3aebffb5-d949-45c0-b5e7-8d7020489c8a	$2b$10$KYgQCtjOwkvBBZd1lrCGAej.Lf2MMgKG9kyTAzy5wqnz0ECKPJGcu
6582291a-ffc8-4fb6-8271-b67ac8e24ca3	$2b$10$Ryz9sPN3TS.Osp96rc7.aOLRAgGHEDrc05UwhNc5zhR5jlSiMOWOG
661e2c59-9546-459d-a906-b29d6ff5ea9c	$2b$10$nwBcw6sIlCb3.2CYNSjr6e24EYPzwBE00FP1mwB3cPcN/5jNYSJQG
cf2b89e9-8bce-472b-b4cb-155856ff4881	$2b$10$EMVEyyDxLOM44Gvd3NCjX..xOcjWS76Awp9t0MwTF8TVdMMv08./m
ef266d73-26e6-4794-bcd2-4b31ad201da8	$2b$10$4NHLTtra2YrRel3XesM2deHAXaL4eR/S86rdn6h4X6OWlv6nQ9g9G
{"1a894cda-b9bd-4938-bafb-9856f21c18c9"}	$2b$10$bVyDtacRANODLiq/qIwxM.lHjIW9/MdGTmCBE5EzJxFBWi2UZTgYq
{"b761b639-cd85-481f-a899-20159baca9fa"}	$2b$10$FWobtetzo.oVUr7HGcarGu3.ckFkCL37FKlEi3dgFUEonZsWilXgm
{"2c1cf6b3-9bc8-4403-952f-64854ff4cffb"}	$2b$10$W7vCX/f5385S0KW1lXtbauteSQ6QBXF1fKoSqzoJMAOeAM.kH0.uq
{"9677eaef-d04b-4b07-ae12-0d5ed8642ce7"}	$2b$10$dL9bAwkUSSpoxOqOEKQH1egJDxUnUfadKibzHs43HUfdIe/yUBMOi
{"1dacc206-171d-4e7b-9c81-e1655fd84927"}	$2b$10$cHyYBSf6N.boykShJ1C74..ShZwc6wSBXYAZVmJ1.s/CsgIYp3viC
{"c435a84b-e48f-4d29-aa89-cd858470d465"}	$2b$10$cGkEqBo3NqLO6kntUkkotuqKFQ3OWMOpnUDUYRMx9OeGKThV1EHdu
{"18da95b5-14be-449f-a971-4e836971b839"}	$2b$10$oQ2f3d3Er1F/z.QLCoY4QuTwSplhgphrsr9CzrtvAHlpSrhl8Xhta
{"2a3a7ce2-beb5-4edf-8251-8faf46d3ec3b"}	$2b$10$pK3XyX9JeJbjRxNm8WZfNuGA42.qhxJsKacOBt7qmXPsA7Ymlr2nu
{"98313db6-54a4-425a-8555-9ab046a15235"}	$2b$10$4zGCUk861XRu.xrkAFagDe0ZHNFV25tIGWUWhLSnxwJTOL.7IEnMO
d4fce1a3-50ce-4ea6-8bbc-48d87e7184f8	$2b$10$Kn/SoYhGbEoWGbjKgiHq8OM.kDE76YtPgWoczjxsCtIQESZVOX2Ma
06c7ff46-304f-472c-9f7b-e5f903c4325f	$2b$10$vY5DRMYVCQwd83NhtjwHROLAsSdiLju7UqPXHkwhkXciJJ6ULzgrW
6a98894f-4231-493e-a01d-dc4f93cfd5fa	$2b$10$mzznlwi5Lt7NB/Wrtlfg/.toI.eedBkY7lFrI7CEZVxSOM.H5yEyy
a1972064-93a5-4df8-a170-bf98d2a5933b	$2b$10$yNQXTQHOM6WJiSs..cDKaesc23ixG0u9MjGOruShhSE901zMv7d1S
63c23f91-5589-4a04-a7a3-2822642c88ea	$2b$10$dMc0VWBaWweB6vVeWL2q/OuPGyL16CcfsqmyZcDLR0EmISOt9KcgC
a8f01cf9-8d2f-459f-abdc-8370cb261416	$2b$10$gu5FPiDeoLaXUuPthFFBf.DvwHBIu2kCIvtA9YQlKUuhhmjq0KSRa
\.


--
-- Data for Name: join_room_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.join_room_events (userid, roomid, joineddate) FROM stdin;
339117ee-4436-4462-9fb1-99695af887d9	493dc9d5-1056-40e8-9030-3c7098d948f1	1336697344
b9851f3c-c496-4463-a356-0574f814c39f	28c12774-81be-4cc3-aa57-be7cc62e315b	1484633406
26e43c5d-fb17-4157-80d2-b8eea991c111	feb5ae5c-8128-4acc-af5a-103ed849a690	1328866733
b9851f3c-c496-4463-a356-0574f814c39f	feb5ae5c-8128-4acc-af5a-103ed849a690	1499212120
6c7ecc2c-7564-4247-8492-368b85e069cf	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	1390610589
c2b1ac25-461a-4ef3-91ad-ec565e0ed737	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	1370465257
b4df02e4-aa1c-44a5-bd84-cae26a176f8f	493dc9d5-1056-40e8-9030-3c7098d948f1	1416388848
7463762a-7488-46e0-9094-b5b5a6d184ad	fa59aa55-f2e4-414b-8090-83d72f5adcf9	1470500281
e61d5b89-1279-47df-83ea-0ad80029a9ce	71e05673-b6ce-463e-8697-3254aea330ef	1428906469
e61d5b89-1279-47df-83ea-0ad80029a9ce	28c12774-81be-4cc3-aa57-be7cc62e315b	1534476573
94e5114e-39a7-4042-8ebe-b9052d21f68b	493dc9d5-1056-40e8-9030-3c7098d948f1	1370465343
94e5114e-39a7-4042-8ebe-b9052d21f68b	feb5ae5c-8128-4acc-af5a-103ed849a690	1344465257
94e5114e-39a7-4042-8ebe-b9052d21f68b	fa59aa55-f2e4-414b-8090-83d72f5adcf9	1370165257
94e5114e-39a7-4042-8ebe-b9052d21f68b	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	1370553257
63c23f91-5589-4a04-a7a3-2822642c88ea	493dc9d5-1056-40e8-9030-3c7098d948f1	1600380590
a1972064-93a5-4df8-a170-bf98d2a5933b	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	1600380682
6a98894f-4231-493e-a01d-dc4f93cfd5fa	71e05673-b6ce-463e-8697-3254aea330ef	1600445533
6a98894f-4231-493e-a01d-dc4f93cfd5fa	493dc9d5-1056-40e8-9030-3c7098d948f1	1600445534
94e5114e-39a7-4042-8ebe-b9052d21f68b	28c12774-81be-4cc3-aa57-be7cc62e315b	1600607675
94e5114e-39a7-4042-8ebe-b9052d21f68b	71e05673-b6ce-463e-8697-3254aea330ef	1344553257
94e5114e-39a7-4042-8ebe-b9052d21f68b	nc4kv2c4-cccd-46bc-87ed-020ee7bc3y45	1600611884
c2b1ac25-461a-4ef3-91ad-ec565e0ed737	nc4kv2c4-cccd-46bc-87ed-020ee7bc3y45	1493312120
c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1115ae5c-8128-4acc-af5a-103ed849ah5a	1499342120
b9851f3c-c496-4463-a356-0574f814c39f	a9cb7cff-fe5b-452d-bc40-116772df969d	1601056949
b9851f3c-c496-4463-a356-0574f814c39f	32667168-60d6-4b46-b51d-a0ad85ab779a	1601057577
94e5114e-39a7-4042-8ebe-b9052d21f68b	43201957-4482-4202-a264-89c91fecaa87	1601144613
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (messageid, roomid, userid, date, messagetext) FROM stdin;
25bf2dd4-b2a5-4665-bbf8-2ead2a132334	fa59aa55-f2e4-414b-8090-83d72f5adcf9	339117ee-4436-4462-9fb1-99695af887d9	1521618849	some message
1611e81f-8ccd-4b7b-b01f-cceda6791c42	71e05673-b6ce-463e-8697-3254aea330ef	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1449620525	some message
102929d5-16a7-47a1-a8a9-e38c4a7655dc	71e05673-b6ce-463e-8697-3254aea330ef	339117ee-4436-4462-9fb1-99695af887d9	1336486271	some message
f13fe0fa-98c5-459b-8e66-235116a33136	493dc9d5-1056-40e8-9030-3c7098d948f1	7463762a-7488-46e0-9094-b5b5a6d184ad	1336755268	some message
304bdbda-d7ed-40f2-9d5f-f2faf516bf42	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	e61d5b89-1279-47df-83ea-0ad80029a9ce	1455196834	some message
5b3965ba-a9a9-492e-a11e-ce5ce328560d	71e05673-b6ce-463e-8697-3254aea330ef	339117ee-4436-4462-9fb1-99695af887d9	1430646491	some message
d1cd86b1-53e4-481e-a8c2-08b93ae09504	feb5ae5c-8128-4acc-af5a-103ed849a690	339117ee-4436-4462-9fb1-99695af887d9	1502711998	some message
b55e2869-6d4c-48eb-b101-20ffbdab3ea8	fa59aa55-f2e4-414b-8090-83d72f5adcf9	339117ee-4436-4462-9fb1-99695af887d9	1379357952	some message
72001642-3344-4841-ac8e-3c3dc7be5026	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	339117ee-4436-4462-9fb1-99695af887d9	1395474965	some message
34d916c0-7898-4287-a3f8-12d5d4890236	feb5ae5c-8128-4acc-af5a-103ed849a690	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1573646842	some message
4051abbd-8f1c-40ed-a901-c1c5bd1dab03	feb5ae5c-8128-4acc-af5a-103ed849a690	94e5114e-39a7-4042-8ebe-b9052d21f68b	1340932493	some message
2308cf41-bba9-4f1d-9d4d-6c8d2c451f19	71e05673-b6ce-463e-8697-3254aea330ef	b9851f3c-c496-4463-a356-0574f814c39f	1495033892	some message
aac9bc47-8ddd-4fb6-b3da-8856c7c9f1b2	493dc9d5-1056-40e8-9030-3c7098d948f1	339117ee-4436-4462-9fb1-99695af887d9	1589081907	some message
05c9ac7c-139c-4fd8-a916-c76a2290ca4e	fa59aa55-f2e4-414b-8090-83d72f5adcf9	7463762a-7488-46e0-9094-b5b5a6d184ad	1554137690	some message
9578a402-1815-4c21-b973-a63ba1b91e8e	493dc9d5-1056-40e8-9030-3c7098d948f1	94e5114e-39a7-4042-8ebe-b9052d21f68b	1510528516	some message
098288cd-9c9a-42c1-8fd2-3d32878f68fd	493dc9d5-1056-40e8-9030-3c7098d948f1	94e5114e-39a7-4042-8ebe-b9052d21f68b	1366516831	some message
9630c934-fe85-4aa4-99e6-b007e66ba16e	493dc9d5-1056-40e8-9030-3c7098d948f1	b9851f3c-c496-4463-a356-0574f814c39f	1373421380	some message
9332c93b-bf64-4604-871a-d8c73742a6b1	28c12774-81be-4cc3-aa57-be7cc62e315b	6c7ecc2c-7564-4247-8492-368b85e069cf	1414672181	some message
e89a74db-5914-48c8-bb53-b41457fa0022	71e05673-b6ce-463e-8697-3254aea330ef	b4df02e4-aa1c-44a5-bd84-cae26a176f8f	1465875950	some message
a2f80a66-4455-45b5-989a-404684c1ca79	493dc9d5-1056-40e8-9030-3c7098d948f1	e61d5b89-1279-47df-83ea-0ad80029a9ce	1478740988	some message
9f1006e2-1d4c-4738-bfcf-8677419299f0	fa59aa55-f2e4-414b-8090-83d72f5adcf9	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599223237	hello
1c60cd52-a822-4111-af18-eebde4544a42	fa59aa55-f2e4-414b-8090-83d72f5adcf9	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599315563	hi hi hi
5cbae4a8-e680-4e54-be3f-affd91abf498	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599315918	hi there!!!!!
a6cad67c-01d1-4e87-b783-ad43391788a3	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599319497	good to hear from you!
e5188855-5641-4a52-9964-c8bc9bb0c9e5	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599417431	hello user 5!
686a38a4-6b97-4321-a718-252658135f7e	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599417539	hey, can you see my msg?
302cf604-a880-4dad-8a99-9b48362428cb	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599418092	hello
3ee0a2a3-ae5c-4fd6-b791-a844f1f67587	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599418247	hello garden!
986555e4-0b8f-457c-8e1c-42e768d05891	fa59aa55-f2e4-414b-8090-83d72f5adcf9	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599475378	here's some music
87fa4f47-6c25-47fa-b7e9-eed35d94fd6a	fa59aa55-f2e4-414b-8090-83d72f5adcf9	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599475391	did you get it?
dde8a48f-842e-4c43-ad1b-d9cea9d5eb6b	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599477578	any news?
bac23422-88f6-400a-aa9a-3c68272ba87c	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599478106	not now
559fab25-c2b3-497f-9334-c56dee4b45a1	fa59aa55-f2e4-414b-8090-83d72f5adcf9	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599479788	hello again
1442b5b2-cdb9-4f24-a3ed-584378589a66	fa59aa55-f2e4-414b-8090-83d72f5adcf9	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599479857	hiiii
50983c19-afe4-4348-85ed-6c194f02f8bc	fa59aa55-f2e4-414b-8090-83d72f5adcf9	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599479887	good to hear from you
254bea4a-998b-4d58-b774-dbb25e088512	fa59aa55-f2e4-414b-8090-83d72f5adcf9	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599479961	yes
6f2cef30-2c2a-468b-95fd-7c9f96e5c608	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599480535	ok
d65627aa-cf8b-4931-8c68-7bd0b87f3e03	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599480842	wanna talk??
e130dfe0-26b9-4165-8a26-238f860a7643	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599480860	hey hey
f3d71110-1863-4098-9a8d-79bd30b02a22	28c12774-81be-4cc3-aa57-be7cc62e315b	b9851f3c-c496-4463-a356-0574f814c39f	1599481059	where are you?
993c75e3-97a2-44f1-b97a-485d6936ffbf	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599481600	oy
b3cc6778-eeca-44fd-b884-a900c7a7cd45	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599482086	oyoyoy
35fdda88-c64c-47b2-b0c5-51be0424d2c2	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599482262	hi there
ae303269-07b9-41b2-a605-c2b37019ec72	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599482915	hey hey hey
5ba59236-1a2f-43ec-9262-e5a5fa726870	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599484585	hey you
9c965c91-80fb-4238-a3e4-37bed8cb6a26	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599485902	can you see my msg??
cafdc80f-f6f5-4e8c-a74a-49412a2f7269	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599485911	heyyyy
3cb176df-89c9-4ce2-9782-4be9f1f1750a	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599488155	hey
09b7e6f0-c5ab-4d18-b7d0-c18c4e92e1f5	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599488463	hi hi
ba424a5a-0eed-46cb-8903-445a8e465c44	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599488734	helllloooo
f7c4f923-8e9e-4750-9b0e-49678c2da263	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599493971	where are you
25e18d9b-3c5f-4ac5-a634-dfe5fb589971	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599494023	I like your garden!
4136c57e-baf5-4e73-868d-fcbfdf8e5439	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599494172	thanks!
a41e5fdf-11ee-4b45-8f13-cbc6f1d2dd5e	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599496776	hi
5ba48098-b144-415d-9e64-8004d6a0202a	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599498096	hey
8539bd55-ec91-44e9-8773-3580a9505f12	fa59aa55-f2e4-414b-8090-83d72f5adcf9	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599498808	hey
a63aff7c-9501-41a9-8236-142d6076a617	feb5ae5c-8128-4acc-af5a-103ed849a690	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599499116	hey user2, here's user5!
3d8324c7-c008-426d-b3f5-578358d0d9d1	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1599499131	hi user5, here's user2
ddee1cbc-9a06-4224-b433-1cca77e20c49	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599507008	good to hear from you!!
2c0be357-d312-45ab-912a-93e513120113	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599564397	hey user1 can you see my msg??
734997cc-0336-49ae-b690-e1e1662c1b50	6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1599564483	hey user5, I got your message!
35d9a856-9fff-4969-9bd0-b586ca6f5eb0	493dc9d5-1056-40e8-9030-3c7098d948f1	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599741354	
727e05a5-53c4-4494-a675-5cfdfc1926fb	493dc9d5-1056-40e8-9030-3c7098d948f1	94e5114e-39a7-4042-8ebe-b9052d21f68b	1599819750	Hello everyone!!
8c6eda93-2ded-4249-bc4e-2d5736f93a82	28c12774-81be-4cc3-aa57-be7cc62e315b	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600708392	
83d61ebc-e62e-4fd8-947a-9810650ee227	493dc9d5-1056-40e8-9030-3c7098d948f1	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600805857	heyyaaa
8f13edf2-6c56-4c70-b021-8a6fe111dd3a	71e05673-b6ce-463e-8697-3254aea330ef	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600806265	hello sport here's user5
2de19d4c-f053-4fce-93b5-1f6cdcc4ac7a	fa59aa55-f2e4-414b-8090-83d72f5adcf9	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600806421	hello music!
70dcf023-a767-436b-8516-20661b0a7dc0	28c12774-81be-4cc3-aa57-be7cc62e315b	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600807161	hello!
a7d032b7-fd67-4a9a-a7eb-34d6a236feb9	71e05673-b6ce-463e-8697-3254aea330ef	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600861903	how is everyone today?
4e5ac66b-0f4e-405e-b01d-81214b39273f	nc4kv2c4-cccd-46bc-87ed-020ee7bc3y45	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600976011	hey everyone!
856e3d8c-a2e2-4129-8bd7-ad601d12b993	nc4kv2c4-cccd-46bc-87ed-020ee7bc3y45	94e5114e-39a7-4042-8ebe-b9052d21f68b	1601039089	hey hey hey
3079dc3a-f004-4a71-975b-0d3c7c8c98a2	feb5ae5c-8128-4acc-af5a-103ed849a690	b9851f3c-c496-4463-a356-0574f814c39f	1601144555	hello user5!!!!!!!!
735da092-ca70-4aa0-8f62-f91e41db43c3	feb5ae5c-8128-4acc-af5a-103ed849a690	94e5114e-39a7-4042-8ebe-b9052d21f68b	1616671235	hi, great to hear from you!
\.


--
-- Data for Name: private_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.private_messages (messageid, senderid, receipientid, date, message) FROM stdin;
1bde3336-4141-4bca-92ca-450f7fef82d2	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600620238	hello!
b15b8474-3033-47b3-afba-0b01f64f9eec	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600620411	hello!
04f27034-d7d0-437a-a261-d3998b9707ea	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600620546	hello!
5e7a1d67-c447-4e77-80eb-7625068498a5	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600620608	hello again!
87d1ea92-b790-422d-8d9b-a37a729918a2	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600620745	hello again! how about now??
90e826be-508e-4ce0-80d6-f30689384c54	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600620989	ok, well
8628a76a-6143-4a83-ae12-3a5f44f82be2	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600621157	are you still there?
bf103cb4-f664-4ed1-acb3-87da5439b502	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600622703	ok, I'll try again!
86be7b79-7bbd-4c1f-b054-d0ad81881ed6	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600797525	hey user3, here's user5!!!
327c15cc-1ebd-4cee-933b-d6b01cc31c02	94e5114e-39a7-4042-8ebe-b9052d21f68b	6c7ecc2c-7564-4247-8492-368b85e069cf	1600798507	hi user6, how are you?
808932c9-7f66-45b7-bcec-b5c796def76f	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600803744	hey user3, here's user5!
6d5b1aa7-80a8-4ac0-afe1-f62bdf49cb7b	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600803969	hello again!
d221fdde-cdb2-41a3-b288-2bf534166479	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600804059	hey hey hey
f1da76e7-2de2-46dc-b7ce-306cde9b3e26	94e5114e-39a7-4042-8ebe-b9052d21f68b	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1600804249	hey user1
7dcab318-847d-4ca6-9ab4-8ea55752a28f	94e5114e-39a7-4042-8ebe-b9052d21f68b	b9851f3c-c496-4463-a356-0574f814c39f	1600805010	hello user2!
36eebc31-eab2-4cb9-b182-2fc8d2d447bb	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600805368	heyaa
e91415b0-0bcc-4df2-89e9-3af5f6f4290a	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600807906	hello
7763af3b-2256-4840-8135-b1d081a03556	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600808305	hellllloooo
e53cbfef-1e72-4326-a8d5-4607333dfc4b	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600859626	hey user4!
8c2530e7-13d7-490b-b877-2bdcbd96a52f	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600861729	heyyy
172a147b-a7ee-429f-8cb8-9db332b23a19	94e5114e-39a7-4042-8ebe-b9052d21f68b	b9851f3c-c496-4463-a356-0574f814c39f	1600862011	hello
ab103450-72a0-4346-9b87-a269182d150d	94e5114e-39a7-4042-8ebe-b9052d21f68b	b9851f3c-c496-4463-a356-0574f814c39f	1600862114	hello user2!
8f15e4fd-e5a0-4581-9eb1-4465937dced1	94e5114e-39a7-4042-8ebe-b9052d21f68b	6c7ecc2c-7564-4247-8492-368b85e069cf	1600862759	hey user6!
30062d6a-ea64-47d9-b08e-3cfa86d9e2c0	94e5114e-39a7-4042-8ebe-b9052d21f68b	6c7ecc2c-7564-4247-8492-368b85e069cf	1600862772	hey user6!
d1869563-10c3-4fe8-841d-38f684017c82	94e5114e-39a7-4042-8ebe-b9052d21f68b	6c7ecc2c-7564-4247-8492-368b85e069cf	1600864135	hey user6!
80c1cdb0-1eb0-4256-90cc-de2f380d885e	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600864314	helllloooo
435dee26-a82d-480c-880c-8d16cc5006d9	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600864330	helllloooo
6b49e923-12f5-44bd-994c-3967dcd71abf	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600866358	hey3!
c2c8300e-1010-4063-a254-85f9dad39443	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600866518	hello again!
893ee763-7f84-41df-9e87-75edd7f28cc2	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600866994	heheye
c0aaf852-d5a4-439b-8b10-2c56445282e3	94e5114e-39a7-4042-8ebe-b9052d21f68b	6a98894f-4231-493e-a01d-dc4f93cfd5fa	1600867381	hello!
7855ed3a-68fd-4830-8445-078948bf6ffc	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600867499	flskfjsdf
066316e3-8bd8-489b-9b2e-3e36d11500dc	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600868032	helelele
5afea028-636f-4ebd-b7d4-cb2eb0dc50cf	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600868192	heheehh
8317c3a2-5e9e-48e8-ad35-f19d09261a1c	94e5114e-39a7-4042-8ebe-b9052d21f68b	6c7ecc2c-7564-4247-8492-368b85e069cf	1600868319	hey user6!
e74dff16-42ea-4e83-b6ff-883b27fff01c	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600870111	helelele
a669235f-d829-4f84-aa29-a5114914ee50	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600870286	helohelo
eaae676c-ffb9-4bd2-8fae-79328db6b0de	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600871011	hello
d8707a98-0989-4dc2-b853-df45836747d5	94e5114e-39a7-4042-8ebe-b9052d21f68b	6c7ecc2c-7564-4247-8492-368b85e069cf	1600874653	blablabla
8e164b5b-2991-4d28-9896-b6679172effc	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600874752	helloo
49311cde-2122-493e-86f4-9b6c35abfdac	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600875161	halala
d83119de-7625-40f7-9c0a-56f752a7124c	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600875242	user3 hellllooo
2c66cbf4-9ebb-4ee2-bcb9-825540b81a2e	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600876011	sfhkdfa;sf
5148ff83-2641-4d55-a345-72a7f78284b5	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600876079	hehe
9d4dcd68-c005-4ee3-8a11-633696f08880	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600876132	hehhe
4b6b86a9-d187-4848-af20-7da6d40f2109	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600876557	hello
749e7c42-fded-4887-8f29-784c7740187d	94e5114e-39a7-4042-8ebe-b9052d21f68b	36c05d96-fa75-4957-8a5d-f91b8e876ae2	1600876700	fsfd
b7c42be5-0340-43a9-8e8b-76e9f301f134	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600876951	heh
a8d0709f-ad95-4c71-b743-af1833ca4edd	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600876959	what's up??
47b6cb71-7d77-4bfe-ace9-16fb15084ca6	6a98894f-4231-493e-a01d-dc4f93cfd5fa	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600884907	hey user 5, great to hear from you!!!
a0f5f0e4-ab6a-4e02-817d-dad54959e00c	94e5114e-39a7-4042-8ebe-b9052d21f68b	7463762a-7488-46e0-9094-b5b5a6d184ad	1600887845	user4, can you hear me?
\.


--
-- Data for Name: room_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room_requests (id, requesting_user, requested_room, request_for, date, confirmed) FROM stdin;
a55f88a1-881a-4884-ad6b-e2b45aa9afd9	63c23f91-5589-4a04-a7a3-2822642c88ea	dance	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600360086	t
2f3bf550-6075-4729-909d-76f9d11cddac	a1972064-93a5-4df8-a170-bf98d2a5933b	work	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600379102	t
e22bc6fd-2ec5-4c6d-b0a1-50e8fb828bda	a1972064-93a5-4df8-a170-bf98d2a5933b	garden	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600379102	f
eb49d132-1aeb-4427-a524-70e8ade175bc	6a98894f-4231-493e-a01d-dc4f93cfd5fa	dance	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600445494	t
ca74d4ab-a884-413f-81d5-e79f2d496b04	6a98894f-4231-493e-a01d-dc4f93cfd5fa	sport	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600445494	t
43735492-a37c-42a2-be32-72b61af7f736	94e5114e-39a7-4042-8ebe-b9052d21f68b	games	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1600611852	t
ffd893a3-73eb-4822-afdc-3a7e07c82a9c	b9851f3c-c496-4463-a356-0574f814c39f	work	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600723426	f
d7bb3393-5662-41fb-b1e5-835f6f795795	94e5114e-39a7-4042-8ebe-b9052d21f68b	movies	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	1600723554	f
2ac82f73-55dc-44f4-b4e0-8d94eb770fa1	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	sport	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600723766	f
515535b5-26a3-467a-b9c9-fe4f7ec8c90e	b9851f3c-c496-4463-a356-0574f814c39f	music	94e5114e-39a7-4042-8ebe-b9052d21f68b	1601479589	f
abf8036d-ad0a-453b-b116-3e7243b8e50d	63c23f91-5589-4a04-a7a3-2822642c88ea	work	94e5114e-39a7-4042-8ebe-b9052d21f68b	1600360086	f
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (roomid, name, created_by, authorise) FROM stdin;
28c12774-81be-4cc3-aa57-be7cc62e315b	news	94e5114e-39a7-4042-8ebe-b9052d21f68b	t
feb5ae5c-8128-4acc-af5a-103ed849a690	garden	94e5114e-39a7-4042-8ebe-b9052d21f68b	t
493dc9d5-1056-40e8-9030-3c7098d948f1	dance	94e5114e-39a7-4042-8ebe-b9052d21f68b	t
6c36f2c4-cccd-46bc-87ed-020ee7bc3f19	work	94e5114e-39a7-4042-8ebe-b9052d21f68b	t
71e05673-b6ce-463e-8697-3254aea330ef	sport	94e5114e-39a7-4042-8ebe-b9052d21f68b	t
fa59aa55-f2e4-414b-8090-83d72f5adcf9	music	94e5114e-39a7-4042-8ebe-b9052d21f68b	t
nc4kv2c4-cccd-46bc-87ed-020ee7bc3y45	games	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	t
1115ae5c-8128-4acc-af5a-103ed849ah5a	movies	c2b1ac25-461a-4ef3-91ad-ec565e0ed737	t
32667168-60d6-4b46-b51d-a0ad85ab779a	fishing	b9851f3c-c496-4463-a356-0574f814c39f	f
43201957-4482-4202-a264-89c91fecaa87	knitting	94e5114e-39a7-4042-8ebe-b9052d21f68b	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, name, connected) FROM stdin;
7463762a-7488-46e0-9094-b5b5a6d184ad	user4	false
6c7ecc2c-7564-4247-8492-368b85e069cf	user6	false
b4df02e4-aa1c-44a5-bd84-cae26a176f8f	user7	false
26e43c5d-fb17-4157-80d2-b8eea991c111	user8	false
e61d5b89-1279-47df-83ea-0ad80029a9ce	user9	false
339117ee-4436-4462-9fb1-99695af887d9	user10	false
87b02b83-fa09-4552-9212-5129c4ae7074	user111	false
98313db6-54a4-425a-8555-9ab046a15235	user113	false
e7f8ee25-ec9f-4adb-8e60-227b5d149701	user114	false
09ba294a-6703-4589-bb15-ad681aa174eb	user115	false
5a838d84-1e09-4d6b-a439-7ef725cfa014	user116	false
90339726-0651-4cb6-b89d-1a68b4620ac4	user117	false
7417e8d5-9241-4c7c-b14d-6880d12e92a7	user118	false
d4fce1a3-50ce-4ea6-8bbc-48d87e7184f8	user119	false
06c7ff46-304f-472c-9f7b-e5f903c4325f	user112	false
a1972064-93a5-4df8-a170-bf98d2a5933b	peter	false
b9851f3c-c496-4463-a356-0574f814c39f	user2	4uStQ-1w7O-qTZWbAAA1
c2b1ac25-461a-4ef3-91ad-ec565e0ed737	user1	false
36c05d96-fa75-4957-8a5d-f91b8e876ae2	user3	false
a8f01cf9-8d2f-459f-abdc-8370cb261416	tim	EnOKJHD36A5risj4AAAB
94e5114e-39a7-4042-8ebe-b9052d21f68b	user5	cwMLc-3M8elUOEpFAAAF
63c23f91-5589-4a04-a7a3-2822642c88ea	adriana	false
6a98894f-4231-493e-a01d-dc4f93cfd5fa	user200	false
\.


--
-- Name: id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.id_seq', 1, false);


--
-- Name: private_messages private_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.private_messages
    ADD CONSTRAINT private_messages_pkey PRIMARY KEY (messageid);


--
-- PostgreSQL database dump complete
--

