# AssignIt – Assignment Submission & Evaluation Portal
> **School of Computing Pilot Edition**  
> A high-fidelity, front-end demo prototype showcasing the submission governance, automated boundary penalty calculation, and rubric evaluation system for university computing faculties.

---

## 🚀 Quick Start Instructions

This project runs with zero external backend dependencies using an in-memory reactive state architecture:

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (verifies all 18 boundary & penalty conditions)
npm test

# 3. Start local development server
npm run dev
```

Open your browser to: **`http://localhost:5173`**

To test a production bundle:
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack
- **Framework & Language**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Academic Navy Palette (`#1F3864`, `#FFFFFF`, soft slate grays)
- **Routing**: React Router v7
- **Icons & Visuals**: `lucide-react`, `canvas-confetti`
- **Charts & Telemetry**: `recharts` (Bar charts, ResponsiveContainer)
- **Automated Testing**: `vitest` (18 boundary tests)

---

## 📐 Business Rules & Decision Table

| Condition | Status | Penalty | Action | Description |
| :--- | :--- | :---: | :---: | :--- |
| **`ts <= D`** | **On Time** | **0%** | Accepted | Submitted on or before the deadline. Zero mark deduction. |
| **`D < ts <= D + 24h`** | **Late Band 1** | **10%** | Accepted | Up to 24 hours past deadline. Deducts 10% from awarded score. |
| **`D + 24h < ts <= D + 48h`** | **Late Band 2** | **25%** | Accepted | Between 24h and 48h past deadline. Deducts 25% from awarded score. |
| **`ts > D + 48h`** | **Closed** | **100%** | **Blocked** | Portal strictly locked unless official faculty extension is granted. |
| **`Extension == true`** | **Extended D** | **0%** | Accepted | Effective deadline adjusted to extended date; penalty waived. |

### Grading & Assessment Policy
- **Maximum Marks**: Whole number from `1` to `100`.
- **Awarded Marks**: `0` to `maxMarks` in strict steps of `0.5` (e.g., `36.0`, `36.5`, `37.0`).
- **Final Marks Formula**: $\text{Final Marks} = \text{Awarded} \times (1 - \text{Penalty})$, rounded to **1 decimal place**.
- **Accepted Files**: `.pdf`, `.docx`, `.zip` only (Maximum **10.0 MB**).
- **Version Ceiling**: Keeps up to **5 versions** per student; the latest version is evaluated.
- **Feedback SLA Target**: Institutional turnaround $< 7.0$ days; automated alert to faculty on **Day 5**.

---

## ⏱️ 5-Minute Walkthrough Demo Script (Role by Role)

### 1. Login & Persona Selection (0:00 – 0:30)
1. Start at **`http://localhost:5173/login`**.
2. Notice the university crest, **"Sign in with University Credentials"** SSO button (simulates SAML 2.0 / Shibboleth).
3. Under **"Demo: Continue as…"**, click **Student (Aarav Sharma)**.
4. Point out the live **Server Time Clock** in the top bar (running on Indian Standard Time `IST`). Note that the system strictly evaluates against this clock.

---

### 2. Student Role – Boundary Testing & Submissions (0:30 – 1:45)
1. **Dashboard**: Observe enrolled pilot courses, upcoming countdown timers, and recent grades.
2. Click **"Submit Work"** in the sidebar.
3. Observe the green **"On Time (0% Penalty)"** banner.
4. Click the floating **"Demo Controls"** button (bottom right) or in the header:
   - Click **`D + 1 second`**: Notice the banner instantly turns amber **"Late Band 1 (10% Penalty)"**.
   - Click **`D + 24 hours + 1s`**: Notice the banner turns orange **"Late Band 2 (25% Penalty)"**.
   - Click **`D + 48 hours + 1s`**: Notice the dropzone locks with a red banner **"Portal Closed (>48h)"**.
   - Click **`Extension Granted`**: Notice the lock lifts, extending the deadline by +72h with 0% penalty.
5. Drag and drop any valid file (or click to select `sample.pdf` under 10MB) and click **"Confirm & Submit"**.
6. View the generated **Confirmation Card** with the digital receipt number (e.g. `ASN-2026-CS303-XXXX-V3`) and note **"Receipt emailed to student"**.
7. Scroll down to inspect the **Version History Table (up to 5 versions)**.
8. Navigate to **"Grades & Feedback"** to see marks math breakdown: Raw Rubric Awarded $\to$ Late Penalty applied $\to$ Final Grade.

---

### 3. Faculty Role – Rubrics, Split Grading & Day 5 Alerts (1:45 – 3:00)
1. Use the **Role Switcher** in the top navbar to switch to **Faculty (Dr. Vikram Malhotra)**.
2. **Dashboard**: Notice the **"Day 5 Reminder: Feedback Due Soon!"** amber warning badge on active queues.
3. Navigate to **"Create Assignment"**:
   - Show the **Rubric Builder**.
   - Try changing criteria marks so the total does not equal 50: notice the real-time red banner **"Rubric Sum Mismatch: Δ..."** and the publish button disables. Balance them to 50 to see it turn green.
4. Navigate to **"Grading Queue"**:
   - Filter by **Late Submissions** or search by name.
   - Click **"Grade File"** on any submission:
     - On the **left**: interactive document preview placeholder (simulated C4 architecture report).
     - On the **right**: rubric criteria sliders (validates in `0.5` steps), live final marks calculation.
     - Try modifying an already finalized grade: notice the mandatory **"Formal Audit Reason for Grade Modification"** input.
5. Click **"Extension"** on a student row to open the **Extension Dialog** and authorize an extension with a medical reference note.
6. Navigate to **"Release Feedback"**: show bulk release button with computed turnaround time ($5.1$ days vs $< 7.0$d target).

---

### 4. Dean Role – Governance, KPIs & Scale-Up Readiness (3:00 – 3:50)
1. Switch role to **Dean (Prof. K. R. Ramaswamy)**.
2. **KPI Cards**:
   - Portal Adoption: **96.4%** (exceeds $95\%$ target).
   - Average Feedback: **5.8 days** (exceeds $< 7.0$d target).
   - Late Submissions: **7.9% (38)**.
   - Pending Grading: **14 works**.
3. **Course Comparison Chart**: Recharts bar graph comparing adoption share and turnaround days across all 6 courses.
4. **Scale-Up Readiness Checklist**:
   - Show the 6 conditions (all 6 PASS with verified audit notes).
   - Click **"Approve Scale-Up"** to trigger celebratory authorization and log into the audit ledger.
5. Navigate to **"Risk Matrix & Heatmap"**:
   - Inspect the 4 pilot threats:
     - Faculty non-adoption: $0.5 \times 8 = 4.0$
     - Deadline-time server overload: $0.4 \times 7 = 2.8$
     - Grading-sheet mismatch: $0.3 \times 7 = 2.1$
     - Storage cost overrun: $0.3 \times 4 = 1.2$
     - **Total Exposure**: **10.1** (Moderate).
   - Show the probability $\times$ impact heatmap.

---

### 5. Assessment Cell Role – Export & ERP Reconciliation (3:50 – 4:30)
1. Switch role to **Assessment Cell (Mr. Pradeep Sen)**.
2. **Marks Export**: Preview the official **Internal Assessment Sheet Layout** (COE-IA-04 standard), click **"Export Finalised Marks (.CSV)"**, and inspect the export log with repeat/revised flags.
3. Navigate to **"Reconciliation Audit"**:
   - By default shows **0 mismatches** (100% verified against ERP).
   - Click the **"Demo Test Mode: Inject Mismatch"** toggle switch!
   - Instantly see student **Rhea Chakraborty (2024BCS0089)** highlighted with a red banner (**Portal: 38.0 vs ERP: 35.0, Δ -3.0 pts**).
   - Click **"Resync with ERP Ledger"** to restore clean zero-mismatch state.

---

### 6. Administrator Role – Ingestion & System Telemetry (4:30 – 5:00)
1. Switch role to **Administrator (Ms. Geeta Bhatt)**.
2. **Enrolment Import**: Click **"Simulate CSV Upload (Pilot_Cohorts_480.csv)"**:
   - Review validation report: **480 rows parsed, 475 successfully mapped, 5 rejected**.
   - Show the table listing the 5 rejected rows with explicit reasons (blank roll number, duplicate email, invalid course code, malformed regex, department mismatch).
3. Navigate to **"System Health & SLA"**:
   - Cluster Uptime: **99.94%**.
   - Storage Used: **68 GB / 100 GB (68%)** with alert trigger set at **80%**.
   - Database Backups: Snapshot verified today at 04:00 AM IST.
4. **Deadline-Time Surge Simulator**:
   - Open Demo Controls and toggle **"Deadline-Time Load Surge"**.
   - Watch the live telemetry meter update in real-time: **Active Users: ~475 / 480**, **RPS: ~155**, **p95 Latency: ~1.9s (< 3.0s SLA)**, **Error Rate: 0.2% (< 1.0% SLA)**.
5. Navigate to **"Audit Logs"**: inspect the immutable tamper-evident event log recording all user actions with IST timestamps.

---

## 🧪 Unit Testing Suite

The boundary rules and calculations are verified in `src/lib/submissionRules.test.ts`. Run them with:

```bash
npm test
```

Tests include:
- Boundary timestamps: $D - 1\text{s}$, $D$, $D + 1\text{s}$, $D + 24\text{h}$, $D + 24\text{h} + 1\text{s}$, $D + 48\text{h}$, $D + 48\text{h} + 1\text{s}$, and Extension Granted.
- Awarded marks validation in steps of $0.5$ between $0$ and $maxMarks$.
- Max marks validation whole number between $1$ and $100$.
- File upload validation (PDF, DOCX, ZIP only; hard cap at $10.0$ MB).
- Turnaround time rounding and Day 5 reminder trigger.

---

## 🏛️ Architecture & Project Directory Structure

```
AssignIT/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Top bar with IST clock, alerts & role picker
│   │   ├── Sidebar.tsx             # Role-tailored desktop & mobile navigation
│   │   ├── Footer.tsx              # University academic footer
│   │   ├── DemoControlsDrawer.tsx  # Floating time warp & surge simulator
│   │   ├── Layout.tsx              # Application shell wrapper
│   │   └── ToastContainer.tsx      # System notification popups
│   ├── context/
│   │   └── AppContext.tsx          # Global reactive state & domain actions
│   ├── data/
│   │   └── mockData.ts             # 6 pilot courses, 480 students context, rubrics
│   ├── lib/
│   │   ├── submissionRules.ts      # Core boundary logic, penalties & IST formatting
│   │   └── submissionRules.test.ts # Vitest unit test suite (18 tests)
│   ├── pages/
│   │   ├── Login.tsx               # SSO & 5-role demo launcher
│   │   ├── student/                # Dashboard, details, dropzone submit, results
│   │   ├── faculty/                # Dashboard, create+rubric builder, grading, release
│   │   ├── dean/                   # Pilot KPIs, readiness audit, risk panel & heatmap
│   │   ├── assessment_cell/        # Internal assessment marks export & reconciliation
│   │   └── admin/                  # Enrolment CSV import report, system health, audit logs
│   ├── types/
│   │   └── index.ts                # TypeScript domain models
│   ├── App.tsx                     # Router definitions
│   ├── index.css                   # Tailwind v4 & Academic Navy theme styling
│   └── main.tsx                    # React root entry
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---
*AssignIt – Academic Assessment & Evaluation Portal • School of Computing • Pilot Demonstration*
