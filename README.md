# Health-Care-Chat-App
It's a healthcare document chat application.
## Overview
React frontend that allows uploading healthcare documents and chatting about them. Files supported: PDF, DOCX, TXT.

## Tech stack
- React 18+, functional components, hooks
- Tailwind CSS (or change to CSS Modules)
- Axios
- React Icons
- Axios Mock Adapter

## Setup (local)
1. Clone:
   git clone <repo-url>
2. Install:
   npm install
3. Start:
   npm start
4. Mock API:
   - Option A: included mock `src/services/api.js` (no server needed)
   

## Scripts
- `npm start` — start dev server
- `npm run build` — create production build
- `npm test` — run tests (add as needed)

## Features implemented
- Drag & drop file upload 
- Document list with metadata and delete
- Chat interface with message history persistence (session via mock)
- Document preview & basic search UI
- Medical disclaimer gating
- Mobile-first responsive layout

## Assumptions & limitations
- PDF text extraction is simulated.
- Document page numbers are mocked; real extraction needed for precise citations.
- All data in demo is mock/sample data only.

## Demo flow
1. Upload a file or use sample document in the list.
2. Accept the medical disclaimer.
3. This project simulates a healthcare chat system where users can type keywords such as medication, diagnosis, allerg, lab, or treatment, and receive simulated responses with corresponding source references.
