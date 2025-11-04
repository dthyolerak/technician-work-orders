# Technician Work Orders

A production-ready Next.js application for managing technician work orders with full CRUD operations, built with TypeScript, Tailwind CSS, and the App Router.

## Features

- ✅ Complete CRUD operations for work orders
- ✅ RESTful API endpoints with Zod validation
- ✅ Search and filter functionality
- ✅ Responsive design with Tailwind CSS
- ✅ Keyboard accessibility
- ✅ TypeScript throughout
- ✅ Server and Client Components architecture

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Seed the database with sample data:
```bash
pnpm seed
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Documentation

### Search and Filter

The application includes a **combined search and filter** feature:

- **Search**: Search by work order title (case-insensitive, partial matching)
- **Filter**: Filter by status (All, Open, In Progress, Done)

Both features work together - you can search for specific titles while also filtering by status. The search is performed on the title field only, and the filter is applied to the status field.

**Why this approach?**
- Title search is the most common use case for finding specific work orders
- Status filtering provides quick access to work orders by their current state
- The combination allows for powerful filtering (e.g., "Find all 'HVAC' work orders that are 'In Progress'")

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API route handlers
│   └── page.tsx           # Home page (work orders list)
├── components/             # React components
│   └── work-orders/       # Work order specific components
├── data/                  # Data store and JSON file
├── services/              # Business logic and RPC functions
└── lib/                   # Utility functions
```

## API Endpoints

See `API_EXAMPLES.md` for complete API documentation and examples.

- `GET /api/work-orders` - List all work orders
- `POST /api/work-orders` - Create a new work order
- `GET /api/work-orders/[id]` - Get a work order by ID
- `PUT /api/work-orders/[id]` - Update a work order
- `DELETE /api/work-orders/[id]` - Delete a work order

## Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## Build

Build for production:
```bash
pnpm build
```

Start production server:
```bash
pnpm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
