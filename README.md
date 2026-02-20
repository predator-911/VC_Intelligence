# VC Intelligence

A production-grade venture capital intelligence SaaS platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Company Database**: Browse, search, and filter companies by sector and stage
- **Company Profiles**: Detailed company pages with enrichment capabilities
- **Lists**: Create custom lists to organize companies and export to CSV
- **Saved Searches**: Save and re-run search queries
- **Enrichment API**: Server-side company data enrichment with caching
- **Notes**: Add and persist notes for each company (localStorage)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React hooks + localStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vc-intelligence
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your enrichment API key:
```
ENRICHMENT_API_KEY=your_api_key_here
ENRICHMENT_API_URL=https://api.example.com/enrich
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ENRICHMENT_API_KEY` | API key for enrichment service | No (uses mock data if not set) |
| `ENRICHMENT_API_URL` | Base URL for enrichment API | No (defaults to example URL) |

## Project Structure

```
├── app/
│   ├── api/
│   │   └── enrich/
│   │       └── route.ts          # Enrichment API endpoint
│   ├── companies/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Company profile page
│   │   └── page.tsx              # Companies list page
│   ├── lists/
│   │   └── page.tsx              # Lists management page
│   ├── saved/
│   │   └── page.tsx              # Saved searches page
│   ├── layout.tsx                # Root layout with sidebar
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Home page (redirects to /companies)
├── components/
│   ├── Card.tsx                  # Card component
│   ├── GlobalSearch.tsx          # Global search bar
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── Table.tsx                 # Data table component
│   └── Tag.tsx                   # Tag/badge component
├── lib/
│   ├── cn.ts                     # Class name utility
│   ├── data.ts                   # Mock company data
│   ├── storage.ts                # localStorage utilities
│   └── utils.ts                  # Helper functions
├── types/
│   └── index.ts                  # TypeScript type definitions
└── package.json
```

## Deployment

### Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

The application will automatically deploy on every push to the main branch.

### Other Platforms

The application can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## Design Philosophy

This application follows a premium, minimal design aesthetic:

- **Dark Theme**: Neutral-900/800 color palette
- **Subtle Interactions**: Clean hover states and transitions
- **Data-First**: Dense, readable tables optimized for information consumption
- **Professional Typography**: Clear hierarchy with consistent spacing
- **No Gimmicks**: Clean, intentional UI without flashy effects

## Features in Detail

### Companies Page

- Real-time search filtering
- Sector and stage filters
- Sortable columns
- Pagination (10 items per page)
- Click row to view company profile

### Company Profile

- Two-column layout
- Overview section with company details
- Enrichment panel with structured data
- Signals timeline
- Notes section (persisted in localStorage)
- Enrich button to gather intelligence

### Lists

- Create custom lists
- Add/remove companies
- Export lists as CSV
- Persistent storage (localStorage)

### Saved Searches

- Save search queries with filters
- One-click re-run saved searches
- Persistent storage (localStorage)

## API Routes

### `/api/enrich`

Enriches company data from a given URL.

**Query Parameters:**
- `url` (required): Company website URL

**Response:**
```json
{
  "summary": "Company summary...",
  "bullets": ["Bullet 1", "Bullet 2"],
  "keywords": ["keyword1", "keyword2"],
  "signals": ["Signal 1", "Signal 2"],
  "sources": [
    {
      "url": "https://example.com",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "enrichedAt": "2024-01-01T00:00:00.000Z"
}
```

**Caching:** Enrichment results are cached for 1 hour per URL.

## Development

### Code Style

- TypeScript strict mode enabled
- No `any` types
- Consistent component structure
- Reusable utility functions

### Adding New Features

1. Add types to `types/index.ts`
2. Create components in `components/`
3. Add utilities to `lib/`
4. Create pages in `app/`

## License

MIT

