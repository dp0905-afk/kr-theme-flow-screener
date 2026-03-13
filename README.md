# NatureForm 3D

NatureForm 3D is a modern MVP web app for designers, artists, architects, ceramic artists, and 3D creators to transform natural photo references into a **structured conceptual 3D workflow**.

> This MVP simulates professional reconstruction and mesh-preparation pipelines. It does **not** claim to do perfect automatic CAD/photogrammetry reconstruction.

## Stack

- **Frontend:** React + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express + Multer (local temp uploads)
- **Persistence:** lightweight JSON file (`server/data/projects.json`)

## Features

- Landing page with premium hero and workflow positioning
- Dashboard with card-based project management
- New Project Wizard with 6 pipeline steps
  1. Project info
  2. Image upload + quality score
  3. Capture assessment checklist
  4. Reconstruction simulation progress stages
  5. Mesh optimization setup
  6. Export summary guidance
- Demo workflow page (`Basalt Rock Study`)
- Project detail page with:
  - metadata
  - status badges
  - uploaded image gallery
  - pipeline confidence/readiness meters
  - optimization settings
  - editable notes
  - export summary download actions (JSON/TXT placeholders)
- Search/filter by project name and tags
- Toast notifications for common actions
- Seed demo project

## Run locally (or in Replit)

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Build

```bash
npm run build
npm start
```

## API overview

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/upload` (multipart images)

## Roadmap

- Integrate real photogrammetry engine APIs
- Add Rhino Compute or Blender automation hooks
- Add mesh metrics and cleanup previews
- Generate richer fabrication reports (PDF)
- Add collaboration and project versioning
