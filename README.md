# BuildSmart AI — AI-Based Building Construction Management Website

![BuildSmart AI Banner](https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=1200&auto=format&fit=crop&q=80)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat&logo=openai)](https://openai.com/)
[![Vitest](https://img.shields.io/badge/Tests-14%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)

**BuildSmart AI** is a production-ready, full-stack college mini-project and SaaS platform designed for civil engineers, quantity surveyors, building contractors, and developers. It unifies **deterministic civil engineering arithmetic** with **OpenAI intelligence** to deliver accurate preliminary cost estimates, critical path schedules, material recommendations, and task management.

---

## 🌟 Key Functional Features

1. **Deterministic Cost Estimator (`/estimator`)**
   - Implements multi-variable civil engineering formulas (Tier 1/2/3 city indices, vertical floor height penalties, and specification multipliers).
   - Generates itemised Bill of Quantities (BOQ): Sub-structure (13%), RCC Frame (24%), Masonry & Plaster (13%), Electrical (9%), Plumbing (8%), Finishing & Tiling (11%), Painting (7%), Joinery (8%), and Contingency (7%).
   - All rates and formulas are completely deterministic—never hallucinated by an LLM.
   - Print-friendly layout and one-click PDF export.

2. **AI Material Recommendations (`/materials`)**
   - Context-aware material selection based on project type, location, climate (coastal saline, hot-arid, heavy monsoon), and budget tier.
   - Technical comparisons for Cement (PPC IS 1489 vs OPC 53 IS 269), Steel Rebar (Fe 500D IS 1786 vs CRS), AAC blocks vs red clay bricks, vitrified tiles, PU liquid waterproofing, and XPS thermal insulation.
   - Direct integration with OpenAI (`/api/materials/recommend`) with a built-in verified Indian Standards (IS) database fallback.

3. **Construction Schedule Generator (`/schedule`)**
   - Automatically computes Critical Path Method (CPM) timelines and phases based on gross built-up area and floor counts.
   - Covers: Pre-construction & Approvals, Site Mobilisation & Earthwork, Structural Frame, Masonry & Envelope, MEP Services, Finishes, and Final Handover.
   - Synchronizes generated tasks directly into the project workspace.

4. **Progress Tracking & Kanban Board (`/progress`)**
   - Interactive Kanban board (Pending, In Progress, Completed) and list view.
   - Real-time project completion percentage calculated from verified site deliverables (not hardcoded).
   - Overdue badges, priority tags (Low, Medium, High, Urgent), and supervisor notes.

5. **BuildSmart Assistant Chatbot (`/assistant`)**
   - Civil engineering advisor trained on IS codes, concrete curing protocols, soil SBC guidelines, and tender analysis.
   - **Active Project Context Injection:** Select any of your projects from the dropdown so the assistant answers questions tailored to your exact budget, square footage, and site location.
   - Server-side Next.js route handler (`/api/chat`) using official OpenAI SDK with resilient civil engineering fallback.

6. **Executive Project Reports (`/reports`)**
   - Formatted client dossier containing project scope, BOQ cost analysis, verified materials, and risk mitigation notices.
   - Browser print trigger (`window.print()`) configured with print-specific stylesheets.

7. **Supabase PostgreSQL & Security (`/settings`)**
   - Complete schema in `supabase/schema.sql` covering tables: `profiles`, `projects`, `cost_estimates`, `material_recommendations`, `project_tasks`, `progress_updates`, and `chat_history`.
   - Row Level Security (RLS) policies guaranteeing user data isolation (`auth.uid() = user_id`).
   - Seamless offline preview mode for grading presentations without mandatory initial cloud setup.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS with Construction Palette (Navy & Orange) |
| **Icons** | Lucide React |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS) |
| **AI Integration** | OpenAI SDK (`gpt-4o-mini`) |
| **Visualizations** | Recharts (Responsive Pie, Area, and Bar charts) |
| **Validation** | Zod (Runtime validation for projects, estimates, tasks) |
| **Testing** | Vitest (14 unit and integration tests) |
| **Deployment** | Vercel Serverless Architecture |

---

## 📂 Project Directory Structure

```text
buildsmart-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.ts                # OpenAI assistant endpoint
│   │   ├── estimate/route.ts            # Cost calculator endpoint
│   │   └── materials/recommend/route.ts # AI material selector
│   ├── assistant/page.tsx               # BuildSmart AI Chatbot
│   ├── dashboard/page.tsx               # Executive KPI dashboard
│   ├── estimator/page.tsx               # Deterministic Cost Estimator
│   ├── login/page.tsx                   # Supabase login & demo quick-access
│   ├── materials/page.tsx               # Material recommendations
│   ├── progress/page.tsx                # Task tracker & Kanban board
│   ├── projects/
│   │   ├── [id]/page.tsx                # Detailed project workspace
│   │   ├── new/page.tsx                 # Project creation form
│   │   └── page.tsx                     # Project directory & search
│   ├── reports/page.tsx                 # Executive audit report & PDF
│   ├── settings/page.tsx                # Database & API configuration
│   ├── signup/page.tsx                  # User registration
│   ├── globals.css                      # Global Tailwind & print styles
│   ├── layout.tsx                       # Root layout & metadata
│   └── page.tsx                         # Public SaaS landing page
├── components/
│   ├── Charts.tsx                       # Recharts charts
│   ├── Footer.tsx                       # SaaS footer
│   ├── Navbar.tsx                       # Top navigation bar
│   ├── Sidebar.tsx                      # SaaS navigation drawer
│   └── StatusBanner.tsx                 # Database & Viva status bar
├── lib/
│   ├── data-store.ts                    # Supabase client repository & fallback store
│   ├── demo-data.ts                     # Reference projects for viva demonstrations
│   ├── estimator-engine.ts              # Deterministic BOQ arithmetic engine
│   ├── materials-data.ts                # Indian Standards material specifications
│   ├── schedule-engine.ts               # CPM construction timeline generator
│   ├── types.ts                         # Core TypeScript data contracts
│   ├── utils.ts                         # Currency formatting (INR) & badges
│   ├── validations.ts                   # Zod schemas
│   └── supabase/
│       ├── client.ts                    # Browser Supabase client
│       └── server.ts                    # Server Supabase client
├── supabase/
│   └── schema.sql                       # Complete PostgreSQL schema & RLS policies
├── tests/
│   ├── estimator.test.ts                # BOQ & math tests
│   ├── schedule.test.ts                 # CPM calculations tests
│   ├── security-ownership.test.ts       # RLS & ownership tests
│   └── validation.test.ts               # Zod validation tests
├── .env.example                         # Environment variable template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 🚀 Local Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd optimistic-pascal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example environment template:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Supabase Service Role Key (server-only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI API Key (For AI assistant & material recommendation)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note for Viva / Offline Demonstrations:** If you do not have Supabase credentials or an OpenAI API key configured, the application **automatically runs seamlessly** with built-in reference projects and Indian Standards heuristic engineering engines.

### 4. Run database migrations (Supabase)
1. Open your project at [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Open `supabase/schema.sql` from this codebase, paste the SQL commands, and click **Run**.
4. The tables, foreign keys, triggers, and Row Level Security policies will be created automatically.

### 5. Run the test suite
```bash
npm run test
```
*Executes all 14 tests across cost calculation, schedule calculations, form validation, and data security.*

### 6. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Results

All 14 tests execute and pass with zero errors:

```text
 ✓ tests/schedule.test.ts (2 tests)
 ✓ tests/estimator.test.ts (5 tests)
 ✓ tests/validation.test.ts (4 tests)
 ✓ tests/security-ownership.test.ts (3 tests)

 Test Files  4 passed (4)
      Tests  14 passed (14)
   Duration  1.04s
```

---

## 🚢 Vercel Deployment Instructions

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete BuildSmart AI platform implementation"
   git push origin master
   ```

2. **Deploy via Vercel Dashboard:**
   - Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
   - Import your GitHub repository.
   - Framework preset will automatically detect **Next.js**.
   - In **Environment Variables**, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `OPENAI_API_KEY`
   - Click **Deploy**.

3. **Verify Production Build:**
   - The production build executes `next build` which statically optimizes all routes and generates serverless API handlers for `/api/chat`, `/api/estimate`, and `/api/materials/recommend`.

---

## 📜 Academic Viva / Demonstration Walkthrough

When presenting this project to examiners:
1. **Landing Page (`/`):** Demonstrate the interactive hero cost calculator widget showing instant INR rate estimation.
2. **Dashboard (`/dashboard`):** Highlight the total portfolio budget in INR, active site metrics, Recharts civil budget pie chart, and the S-Curve progress chart.
3. **Project CRUD (`/projects` & `/projects/[id]`):** Demonstrate creating a new project with Zod validations, editing project status, and viewing the detailed multi-tab workspace.
4. **Deterministic Estimator (`/estimator`):** Explain how the 9-phase civil percentage engine calculates realistic foundation, frame, MEP, and finishes without relying on LLM guesses.
5. **AI Materials (`/materials`):** Show the Indian Standards (IS 456, IS 1786) comparisons for PPC vs OPC 53 cement and ductile rebar.
6. **Critical Path Schedule (`/schedule`):** Demonstrate automatic phase calculation from groundbreaking to handover and sync tasks into the database.
7. **Task Tracker & Kanban (`/progress`):** Move a task from Pending → In Progress → Completed and show the project completion percentage recalculate automatically.
8. **BuildSmart Assistant (`/assistant`):** Select an active project from the dropdown and ask: *"What is the recommended curing protocol for our structural columns?"*
9. **Executive Report (`/reports`):** Click "Print / Export PDF" to demonstrate clean, print-friendly client audit generation.

---

## 📄 License
Developed for academic mini-project submission and civil engineering construction management software demonstrations.
