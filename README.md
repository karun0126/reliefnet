# ReliefNet

ReliefNet is an intelligent disaster relief and crisis coordination platform designed to streamline emergency response, volunteer dispatch, and resource distribution during crises.

## Features

- **Live Crisis Map**: Real-time disaster mapping and geographical need tracking powered by Leaflet.
- **AI-Powered Need Triage & Classification**: Automatic urgency scoring and skill-matching with Gemini 1.5 Flash integration and local heuristic fallback.
- **Role-Based Portals**:
  - **Reporter Portal**: Quick incident reporting with media uploads and geolocation tagging.
  - **Volunteer Portal**: Skill-based mission matching, availability toggling, and assignment tracking.
  - **Coordinator Dashboard**: Overview of live operations, dispatch queues, and field resource allocation.
  - **Admin Portal**: System analytics, audit logs, and configuration controls.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS / Vanilla CSS
- **Icons**: Lucide React
- **Mapping**: Leaflet & React-Leaflet
- **Linter**: Oxlint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/karun0126/reliefnet.git

# Navigate to directory
cd reliefnet

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```
