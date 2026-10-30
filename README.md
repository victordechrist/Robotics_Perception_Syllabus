# ROB 201: Robotics Perception — Course Website

An open-access course portal and curriculum management platform for **ROB 201 / CS 289: Robotics Perception** (*"From pixels to pose"*). Built with Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, and MDX.

---

## 🚀 Tech Stack & Architecture

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, SSG static pre-rendering)
- **UI Primitives:** `@base-ui/react` + `shadcn/ui` components
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with dark mode support (`next-themes`)
- **Content Pipeline:** Next.js MDX (`@next/mdx`), `remark-frontmatter`, `remark-mdx-frontmatter`, and `shiki` syntax highlighting
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🛠️ Local Development & Build Commands

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/victordechrist/Robotics_Perception_Syllabus.git
cd Robotics_Perception_Syllabus

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Verification & Production Build

```bash
# Run ESLint check
npm run lint

# Run TypeScript type check
npx tsc --noEmit

# Build production static site
npm run build

# Start production server
npm run start
```

---

## 📝 How to Add or Extend Course Content

### 1. Adding a New Lab Assignment

1. Create a new MDX file in `src/content/labs/<slug>.mdx` (e.g., `src/content/labs/week-2-pinhole-camera.mdx`). Include frontmatter at the top:
   ```markdown
   ---
   title: "Lab 2: Pinhole Camera Model & Intrinsic Calibration"
   week: 2
   description: "Calibrate camera intrinsics, estimate focal length, and rectify distortion."
   ---

   # Lab 2: Pinhole Camera Model

   Your lab content, math derivations, and Python code snippets go here...
   ```
2. Update `src/data/labs.ts` to set `hasMdx: true` for the lab entry matching `<slug>`:
   ```typescript
   {
     slug: "week-2-pinhole-camera",
     title: "Lab 2: Pinhole Camera Model",
     week: 2,
     group: "Vision",
     description: "Calibrate camera intrinsics, estimate focal length, and rectify distortion.",
     hasMdx: true,
   }
   ```
3. Run `npm run build`. Next.js will automatically compile and statically pre-render `/labs/week-2-pinhole-camera`.

---

### 2. Adding a New Lecture Note

1. Create a new MDX file in `src/content/lectures/<slug>.mdx` (e.g., `src/content/lectures/week-2-epipolar-geometry.mdx`):
   ```markdown
   ---
   title: "Lecture 2: Epipolar Geometry & Fundamental Matrix"
   week: 2
   description: "Understanding 3D reconstruction, essential/fundamental matrices, and 8-point algorithm."
   date: "2025-09-09"
   ---

   # Epipolar Geometry & Stereopsis

   Lecture notes and derivations...
   ```
2. **Auto-Discovery:** No manual data file updates required! The lecture filesystem reader (`src/lib/lectures.ts`) automatically discovers all `.mdx` files under `src/content/lectures/` and builds static pages for `/lectures` and `/lectures/<slug>`.

---

## 🌐 Zero-Config Vercel Deployment

This project requires **zero environment variables** or database connections. It can be deployed directly to Vercel:

1. Push your changes to the GitHub repository.
2. Import the repository in your [Vercel Dashboard](https://vercel.com/new).
3. Select Next.js preset (defaults are automatically configured).
4. Click **Deploy**. Vercel will execute `npm run build` and publish the static edge application.

---

## 📄 License

Academic course material under MIT License.
