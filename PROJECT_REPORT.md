# ACADEMIC MINI-PROJECT REPORT
## BuildSmart AI — AI-Based Building Construction Management Website

**Degree / Course:** Bachelor of Technology / Computer Science & Engineering / Information Technology  
**Academic Year:** 2026–2027  
**Project Repository:** [github.com/Irfanshaikh016/buliding](https://github.com/Irfanshaikh016/buliding)  
**Deployment Platform:** Vercel Cloud Serverless Platform  

---

### ABSTRACT

**BuildSmart AI** is a full-stack, production-ready AI-powered building construction management platform developed to streamline planning, estimating, scheduling, and progress tracking for civil engineers, quantity surveyors, building contractors, architects, and property developers. Construction projects frequently experience budget overruns, unpredictable delays, material wastage, and fragmented communication due to reliance on manual spreadsheets and disconnected paper records. 

BuildSmart AI addresses these industry challenges by centralizing core pre-construction and on-site workflows into an accessible, responsive web application. The platform introduces a **hybrid intelligence architecture**:
1. **Deterministic Civil Engineering Engine:** Computes itemised Bill of Quantities (BOQ) cost breakdowns and Critical Path Method (CPM) project schedules using mathematical civil algorithms compliant with Indian Standards (IS 456, IS 1786, IS 1489, and CPWD benchmarks), guaranteeing zero LLM calculation hallucination.
2. **Generative AI Integration:** Powered by the official **Google Gemini API (`gemini-1.5-flash`)** free tier (with OpenAI fallback) to provide contextual material recommendations, durability trade-off analyses, and an interactive **BuildSmart AI Assistant** chatbot that ingests active project parameters.

The system is developed using Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, Zod runtime validation, and Supabase PostgreSQL with Row Level Security (RLS) policies. Testing was executed via Vitest, achieving **100% pass rates across 14 test cases**, and successfully deployed on Vercel's serverless edge infrastructure.

---

### TABLE OF CONTENTS

1. [INTRODUCTION](#1-introduction)  
   1.1 Background of the Project  
   1.2 Problem Statement  
   1.3 Objectives of the Project  
   1.4 Scope and Significance  
2. [LITERATURE SURVEY](#2-literature-survey)  
   2.1 Review of Existing Systems  
   2.2 Related Work and Applications of LLMs in Construction  
   2.3 Limitations of Existing Solutions  
3. [REQUIREMENT ANALYSIS](#3-requirement-analysis)  
   3.1 Functional Requirement Specifications (FRS)  
   3.2 Business Requirement Specifications (BRS)  
   3.3 Technical Requirement Document (TRD)  
   3.4 Software and Hardware Configuration  
4. [SYSTEM DESIGN & ARCHITECTURE](#4-system-design--architecture)  
   4.1 Implemented Solution & System Architecture  
   4.2 LLM Selection & Justification (Google Gemini 1.5 Flash Free Tier)  
   4.3 Prompt Engineering & Context Injection Design  
   4.4 Database Schema & Row Level Security (RLS)  
   4.5 System Workflow & Data Flow Diagrams  
5. [IMPLEMENTATION DETAILS](#5-implementation-details)  
   5.1 Module Descriptions  
   5.2 Deterministic Cost Estimation & BOQ Calculation Logic  
   5.3 CPM Construction Schedule Generation Logic  
   5.4 AI Material Selector & Chatbot API Integration  
   5.5 User Interface Design & Screen Descriptions  
6. [TESTING AND RESULTS](#6-testing-and-results)  
   6.1 Test Strategy & Test Case Execution Table (14/14 Passed)  
   6.2 Sample Inputs & Verified Generated Outputs  
   6.3 Output Quality & Response Evaluation  
   6.4 Performance & Production Build Validation  
7. [CONCLUSION AND FUTURE SCOPE](#7-conclusion-and-future-scope)  
   7.1 Conclusion  
   7.2 Future Enhancements  
8. [REFERENCES](#8-references)  
9. [APPENDIX](#9-appendix)  

---

### 1. INTRODUCTION

#### 1.1 Background of the Project
The building construction industry is a primary driver of urban growth, residential housing, and physical infrastructure. Delivering a building project requires continuous synchronization among project managers, structural engineers, quantity surveyors, trade contractors, material vendors, municipal authorities, and property owners. 

Historically, small to mid-scale construction projects across developing economies—such as India—rely heavily on informal paper logs, unstructured messaging apps, and static spreadsheets. These legacy tools fail to track dynamic material price escalations, cannot automatically compute critical path phase dependencies, and do not provide immediate technical guidance on building code standards (such as the Bureau of Indian Standards BIS / IS codes).

**BuildSmart AI** is engineered as an intelligent, single-pane-of-glass software solution that combines deterministic civil engineering calculations with generative AI natural language reasoning.

#### 1.2 Problem Statement
Construction projects face systemic inefficiencies:
- **Cost Inaccuracies:** Traditional lump-sum contractor quotes often overlook sub-structure variations, vertical floor height crane penalties, and contingency buffers, causing 15% to 35% budget overruns.
- **Schedule Delays:** Failure to compute curing periods (such as the 14-day wet ponding requirement for RCC slabs) and trade dependencies (e.g. electrical conduit wall chasing before plastering) leads to severe cascading delays.
- **Material Selection Guesswork:** Homeowners and contractors frequently choose materials based on speculative vendor claims rather than verified civil properties (e.g., mistaking OPC 53 for a general plastering cement or ignoring corrosion-resistant CRS rebars in coastal zones).
- **Security & Multi-Tenant Data Leaks:** Sensitive financial estimates and architectural designs are frequently shared unencrypted across generic platforms without Row Level Security.

#### 1.3 Objectives of the Project
1. Build an accessible, production-ready construction management web platform using Next.js 14 and TypeScript.
2. Formulate and implement **deterministic, server-side algorithms** for construction cost estimation in Indian Rupees (₹ INR) based on built-up area, floor counts, city tier indices, and finish grades.
3. Integrate Google Gemini AI to analyze environmental conditions (coastal salinity, seismic zones, thermal swings) and provide verified material trade-offs.
4. Auto-generate sequential, multi-phase Critical Path Method (CPM) construction timelines from excavation to client handover.
5. Provide an interactive Kanban task board where overall project progress is dynamically aggregated from verified site deliverables.
6. Provide an interactive civil engineering AI assistant chatbot with **project context injection**.
7. Implement PostgreSQL Row Level Security (RLS) on Supabase ensuring complete tenant isolation.
8. Support print-friendly executive project audit dossiers and one-click PDF generation.

#### 1.4 Scope and Significance
- **Target Audience:** Civil contractors, site supervisors, independent builders, quantity surveyors, architectural consultants, and individual home builders.
- **Building Classifications Supported:** Residential (villas, duplexes, multi-storey apartments), Commercial (offices, tech parks, retail outlets), Industrial (pre-engineered PEB warehouses), and Infrastructure.
- **Geographic Adaptability:** Configured with Indian Tier 1 metros (Mumbai, Bengaluru, Delhi NCR), Tier 2 urban hubs (Pune, Ahmedabad, Lucknow), and Tier 3 regional indices.
- **Professional Governance:** Estimates and suggestions are strictly calibrated as preliminary planning tools that augment—rather than replace—licensed structural engineer certification.

---

### 2. LITERATURE SURVEY

#### 2.1 Review of Existing Systems

| Existing Paradigm | Primary Advantages | Limitations & Critical Gaps | How BuildSmart AI Resolves the Gap |
|---|---|---|---|
| **Manual Contractor Quotations** | Intuitive; based on local contractor trade intuition. | Extremely prone to arithmetic errors; lacks itemised BOQ; no audit trail. | Implements transparent 9-phase BOQ formulas with explicit assumptions. |
| **Microsoft Excel / Google Sheets** | Flexible grid; widely familiar across construction firms. | Broken formulas; no real-time validation; zero built-in civil engineering intelligence; static Gantt charts. | Zod runtime schema validation; automated CPM date computation; interactive Kanban tracker. |
| **Enterprise Construction ERPs (e.g. Procore, SAP)** | Comprehensive multi-departmental corporate tracking. | Prohibitively expensive (\$5,000+/yr); steep learning curves; unsuitable for mini-projects and SMEs. | Lightweight, free-tier cloud deployment (Vercel + Google Gemini Free + Supabase); immediate 1-click viva demo mode. |

#### 2.2 Applications of LLMs in Construction Management
Large Language Models process and synthesize civil engineering codes, technical specifications, and historical defect logs. In BuildSmart AI, **Google Gemini 1.5 Flash** acts as an intelligent reasoning co-pilot:
- Synthesizing complex Bureau of Indian Standards (IS 456:2000, IS 1786:2008, IS 1489:2015, IS 2185).
- Explaining the trade-offs between Ordinary Portland Cement (OPC) and Portland Pozzolana Cement (PPC).
- Converting raw project attributes (area, budget, location) into structured client-facing advisory narratives.

#### 2.3 Prevention of LLM Hallucination
A central tenet of BuildSmart AI's design is **deterministic math isolation**: LLMs are never permitted to perform budget arithmetic or determine critical path durations. Arithmetic is executed in pure TypeScript algorithms, while Gemini is leveraged strictly for qualitative synthesis, risk explanation, and material reasoning.

---

### 3. REQUIREMENT ANALYSIS

#### 3.1 Functional Requirement Specifications (FRS)

| Requirement ID | Module Name | Functional Specification | Priority |
|---|---|---|---|
| **FR-01** | User Authentication | Supabase email/password sign-up, sign-in, session persistence, and instant 1-click viva demo login. | High |
| **FR-02** | Project Management | Full CRUD operations: create, read, update status (Planning, In Progress, Completed, On Hold), and delete with modal confirmation. | High |
| **FR-03** | Cost Estimator | Deterministic BOQ calculator across 9 civil phases with unit rates (₹/sq.ft), city location multipliers, and PDF export. | High |
| **FR-04** | Material Recommender | Parameter-driven material selector comparing cement, rebar, AAC blocks, flooring, paint, and waterproofing with IS codes. | High |
| **FR-05** | Schedule Generator | Automatic generation of 7 civil phases with durations, dependencies, milestone dates, and database sync. | High |
| **FR-06** | Progress Tracker | Kanban board (Pending, In Progress, Completed) and list view; real-time recalculation of completion percentage. | High |
| **FR-07** | BuildSmart Assistant | Server-side chatbot route with active project context injection, presets, and safety disclaimers. | High |
| **FR-08** | Executive Reports | Client-ready project dossier integrating scope, BOQ costs, milestones, and print stylesheet (`@media print`). | High |
| **FR-09** | Database Security | Supabase PostgreSQL tables with Row Level Security (RLS) restricting access to `auth.uid() = user_id`. | High |
| **FR-10** | Offline Viva Fallback | Automatic fallback to local storage and heuristic civil knowledge base if cloud credentials are not supplied. | High |

#### 3.2 Technical Requirement Document (TRD)

- **Frontend & Routing:** Next.js 14.2 App Router (`/app`), React 18, TypeScript 5.6.
- **Styling Architecture:** Tailwind CSS 3.4 with custom construction theme (`#090D16` Navy, `#F97316` Orange).
- **Data Validation:** Zod 3.23 schemas enforcing positive areas, logical date sequences (`completion_date >= start_date`), and integer floor limits.
- **Data Persistence:** Supabase PostgreSQL with SQL migrations in `supabase/schema.sql`.
- **AI Engine:** `@google/generative-ai` SDK (`gemini-1.5-flash`) via server-side route handlers.
- **Data Visualization:** Recharts 2.13 (Responsive Pie, Area, and Bar charts).
- **Automated Testing:** Vitest 2.1 with comprehensive assertions across calculations, security, and schemas.
- **Deployment:** Vercel Cloud Serverless Platform with zero server management overhead.

---

### 4. SYSTEM DESIGN & ARCHITECTURE

#### 4.1 System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              PRESENTATION LAYER (Browser)                         |
|  - Next.js 14 Responsive UI (Tailwind CSS, Construction Palette, Lucide Icons)     |
|  - Recharts Visualizations (Budget Pie Chart, CPM S-Curve, Comparison Bars)       |
|  - Interactive Kanban Board, BOQ Cost Tables, Print/PDF Dossier Generator          |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON
+------------------------------------------v----------------------------------------+
|                                APPLICATION API LAYER                              |
|  - /api/estimate: Deterministic civil BOQ arithmetic engine                        |
|  - /api/materials/recommend: Contextual material trade-off analyzer               |
|  - /api/chat: BuildSmart Assistant with active project context injection          |
+---------------------+---------------------------------------+---------------------+
                      |                                       |
+---------------------v-------------------+   +---------------v---------------------+
|      DETERMINISTIC CIVIL ENGINES        |   |           AI SERVICE LAYER          |
|  - IS 456 & 1786 Civil Rate Benchmarks  |   |  - Google Gemini 1.5 Flash (Free)   |
|  - Multi-variable Floor & Tier Index    |   |  - OpenAI GPT-4o-mini Fallback      |
|  - Sequential CPM Schedule Duration     |   |  - Heuristic Engineering Fallback   |
+---------------------+-------------------+   +-------------------------------------+
                      |
+---------------------v-------------------------------------------------------------+
|                             PERSISTENCE & SECURITY LAYER                          |
|  - Supabase PostgreSQL Database (Managed Cloud Postgres)                          |
|  - Row Level Security (RLS) Policies (auth.uid() = user_id enforcement)           |
|  - Dual-mode sync: Remote Supabase <---> Local Browser Storage Fallback           |
+-----------------------------------------------------------------------------------+
```

#### 4.2 LLM Selection & Justification: Google Gemini 1.5 Flash (Free Tier)
While the initial project synopsis considered paid models, BuildSmart AI was upgraded to **Google Gemini 1.5 Flash** via Google AI Studio (`@google/generative-ai`) for the following academic and technical justifications:
1. **Zero Financial Cost:** Google AI Studio offers a free tier with high rate limits, making it ideal for student submissions, academic grading, and college evaluations without requiring credit card subscriptions.
2. **Speed & Latency:** Gemini 1.5 Flash delivers sub-second response times, enabling near-instant chatbot answers and material evaluations.
3. **Structured JSON Output:** The model natively supports `responseMimeType: "application/json"`, guaranteeing valid schema returns for material recommendations.
4. **Safety Protocols:** Gemini's built-in safety filters ensure advisory disclaimers are preserved.

#### 4.3 Database Schema & Row Level Security (RLS)
The database structure is specified in `supabase/schema.sql`:

- `profiles`: Stores user metadata (`full_name`, `email`, `company_name`, `role`).
- `projects`: Primary project record (`name`, `project_type`, `location`, `built_up_area`, `floors`, `budget`, `start_date`, `expected_completion_date`, `finish_level`, `status`).
- `cost_estimates`: Stores itemised BOQ snapshots, formulas, base rates, and assumptions.
- `material_recommendations`: Stores suggested materials, advantages, disadvantages, and IS codes.
- `project_tasks`: Stores CPM deliverables (`phase`, `duration_days`, `start_date`, `due_date`, `priority`, `status`, `progress_percentage`, `is_milestone`).
- `progress_updates`: Historical logs of on-site milestones and inspected percentages.

**Row Level Security (RLS) Policy Example:**
```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only view and manage their own projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

---

### 5. IMPLEMENTATION DETAILS

#### 5.1 Deterministic Cost Estimation Formulas
In `lib/estimator-engine.ts`, the effective rate per square foot ($R_{eff}$) is computed as:

$$R_{eff} = R_{base} \times F_{location} \times F_{floor} \times F_{finish}$$

Where:
- $R_{base}$ = Baseline rate by building type (Residential: ₹1,850/sq.ft, Commercial: ₹2,200/sq.ft, Industrial: ₹1,650/sq.ft).
- $F_{location}$ = Regional index (Tier 1 Metros = 1.15x, Tier 2 Urban = 1.05x, Tier 3 Regional = 0.95x).
- $F_{floor}$ = Multi-storey height factor ($1.00$ for single floor, $1.04$ for G+2, $1.09$ for G+5, $1.15$ for G+9).
- $F_{finish}$ = Specification grade multiplier (Economy = 0.85x, Standard = 1.00x, Premium = 1.35x, Luxury = 1.85x).

The total estimated cost is $C_{total} = \text{Built-up Area} \times R_{eff}$, subdivided into **9 standard civil engineering packages**:
1. Foundation & Excavation: 13%
2. RCC Frame (Columns, Beams, Slabs): 24%
3. Masonry & Plastering: 13%
4. Electrical Installations (FRLS): 9%
5. Plumbing & Sanitation: 8%
6. Flooring, Tiles & Dado: 11%
7. Painting & Surface Coating: 7%
8. Joinery, Doors & Windows: 8%
9. Contingency & Approvals Buffer: 7%

#### 5.2 CPM Construction Schedule Duration Logic
In `lib/schedule-engine.ts`, task durations ($D$) scale dynamically based on gross square footage and floor count:

$$\text{Area Scale Factor} = \max\left(0.6, \min\left(3.5, \sqrt{\frac{\text{Area}}{2000}}\right)\right)$$

The project progresses through **7 sequential civil phases**:
1. *Pre-Construction & Approvals* (Soil test borehole, structural drawings, municipal sanction).
2. *Site Mobilisation & Earthwork* (Barricading, bulk excavation, anti-termite treatment).
3. *Structural RCC Frame* (Columns, plinth beams, floor slabs up to $N$ floors with 21-day slab curing intervals).
4. *Masonry & Envelope* (AAC blocks with polymer adhesive, external sand-face waterproof plaster).
5. *Services (MEP) First-Fix* (Concealed conduit chasing, piping hydro-tests).
6. *Finishing & Joinery* (48-hour polyurethane pond testing, vitrified tiling, 3-coat painting).
7. *Testing & Handover* (Sanitary fittings, snag list rectification, completion certificate).

---

### 6. TESTING AND RESULTS

#### 6.1 Test Strategy & Test Case Execution Table
Automated testing was conducted using **Vitest**. All 14 tests executed and passed cleanly:

| Test ID | Test Scenario | Input / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-01** | Valid Project Creation | Valid 4,200 sq.ft G+2 villa in Bengaluru | Project record validated and saved | Validated against Zod schema | **PASS** |
| **TC-02** | Invalid Dates Validation | Completion date before Start date | Form rejected with clear error | "Expected completion date must be on or after start date" | **PASS** |
| **TC-03** | Negative Area Rejection | Built-up area = -50 sq.ft | Validation failure | Rejected: "Area must be greater than 0" | **PASS** |
| **TC-04** | Zero Floors Rejection | Floors = 0 | Validation failure | Rejected: "Minimum 1 floor" | **PASS** |
| **TC-05** | Deterministic BOQ Sum | 2,000 sq.ft Standard build | Sum of 9 packages equals total | Package sum equals ₹ total within ₹50 rounding | **PASS** |
| **TC-06** | Custom Rate Override | Custom rate = ₹2,250/sq.ft | Base rate uses ₹2,250 directly | `base_rate` set to 2250, tagged as `user_provided` | **PASS** |
| **TC-07** | Location Tier Multiplier | Mumbai vs Regional | Tier 1 factor > Tier 3 factor | Tier 1 (1.15x) > Tier 3 (0.95x) verified | **PASS** |
| **TC-08** | Height Floor Index | 1 Floor vs 5 Floors vs 12 Floors | Progressive vertical crane penalty | $1.00 < 1.09 < 1.22$ verified | **PASS** |
| **TC-09** | Schedule Phase Count | 4,000 sq.ft G+2 input | Generates 7 phases sequentially | 7 sequential phases generated with start < end | **PASS** |
| **TC-10** | Fast-Track Schedule Pace | Speed priority = `fast_track` | Shorter overall duration | Duration reduced by 20% compared to standard | **PASS** |
| **TC-11** | Real Progress Calculation | 3 tasks (100%, 50%, 0%) | Exactly 50% completion | Progress calculated at 50% without guesswork | **PASS** |
| **TC-12** | Empty Task Progress | 0 tasks in project | 0% completion | Returns 0% without inventing progress | **PASS** |
| **TC-13** | Tenant Data Isolation | Filter tasks by `project_id` | Only owner's tasks visible | Cross-project tasks successfully filtered | **PASS** |
| **TC-14** | Task Creation Schema | Valid task form parameters | Schema parses with success | Validated with proper priorities and dates | **PASS** |

#### 6.2 Sample Verified Calculation Output

- **Project Input:** Residential Villa, Location: Whitefield, Bengaluru (Tier 1 Metro), Built-up Area: 4,200 sq.ft, Floors: 3 (G+2), Finish Level: Premium.
- **Engine Rate Math:**
  - Base Rate: ₹1,850
  - Location Multiplier: 1.15x (Tier 1)
  - Height Index: 1.04x (3 Floors)
  - Finish Multiplier: 1.35x (Premium)
  - Composite Unit Rate: $\text{round}(1850 \times 1.15 \times 1.04 \times 1.35) = \mathbf{₹2,987\text{ / sq.ft}}$
  - **Total Estimated Outlay:** $4,200 \times ₹2,987 = \mathbf{₹1,25,45,400}$ (₹ 1.25 Crore).

**Itemised BOQ Breakdown:**
1. Sub-structure & Earthwork (13%): ₹16,30,902
2. RCC Frame & Structural Slabs (24%): ₹30,10,896
3. AAC Block Masonry & Plaster (13%): ₹16,30,902
4. Electrical Wiring & Panels (9%): ₹11,29,086
5. Plumbing & Water Supply (8%): ₹10,03,632
6. Vitrified Flooring & Dado (11%): ₹13,80,000
7. Painting & Surface Coating (7%): ₹8,78,178
8. Joinery & UPVC Windows (8%): ₹10,03,632
9. Statutory & Contingency Buffer (7%): ₹8,78,178

---

### 7. CONCLUSION AND FUTURE SCOPE

#### 7.1 Conclusion
BuildSmart AI successfully demonstrates a modern, full-stack software approach to civil construction management. By marrying **deterministic mathematical algorithms** for budgeting and CPM scheduling with **Google Gemini generative AI** for material synthesis and advisory assistance, the application eliminates both the manual errors of traditional spreadsheets and the calculation hallucinations typical of standalone LLMs. The application is completely functional, verified with 14 automated unit tests, and live on Vercel backed by Supabase PostgreSQL with Row Level Security.

#### 7.2 Future Enhancements
1. **IoT Sensor & Drone Ingestion:** Stream site temperature and humidity data for automated concrete curing time prediction.
2. **BIM (Building Information Modelling) Integration:** Ingest IFC / CAD 3D models for automated automated quantity take-offs.
3. **Multilingual Regional Voice Interface:** Support Hindi, Marathi, Kannada, Tamil, and Telugu for on-site field supervisors.
4. **Live Vendor Rate Scraping:** Synchronize localized steel (Tata Tiscon / JSW) and cement prices via authenticated supplier APIs.

---

### 8. REFERENCES

1. Bureau of Indian Standards (BIS). *IS 456: 2000 — Plain and Reinforced Concrete - Code of Practice*, New Delhi, India.
2. Bureau of Indian Standards (BIS). *IS 1786: 2008 — High Strength Deformed Steel Bars and Wires for Concrete Reinforcement*, New Delhi, India.
3. Bureau of Indian Standards (BIS). *IS 1489 (Part 1): 2015 — Portland Pozzolana Cement Specification*, New Delhi, India.
4. Bureau of Indian Standards (BIS). *IS 2185 (Part 3): 1984 — Specification for Concrete Masonry Units: Autoclaved Cellular Concrete Blocks*.
5. Central Public Works Department (CPWD). *Delhi Schedule of Rates (DSR) & Analysis of Rates for Civil Works*, Government of India.
6. Google DeepMind. *Gemini 1.5 Flash Technical Documentation & API Reference*, 2024. [https://ai.google.dev/docs](https://ai.google.dev/docs)
7. Next.js Team. *Next.js 14 App Router Architecture & Server Actions Reference*, Vercel Inc. [https://nextjs.org/docs](https://nextjs.org/docs)
8. Supabase Inc. *PostgreSQL Row Level Security (RLS) Guide and Multi-Tenant Isolation*, 2024. [https://supabase.com/docs](https://supabase.com/docs)
