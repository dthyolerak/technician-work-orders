# 🔧 Technician Work Orders

> A lightweight, production-ready CRUD application for managing technician work orders built with Next.js (App Router), TypeScript, and Tailwind CSS.

---

## 📋 Project Overview

**Technician Work Orders** is a modern web application designed to help technicians and managers efficiently track, create, update, and manage work orders. The application provides a clean, intuitive interface for handling work order lifecycle management with full CRUD operations.

### Key Highlights

- 🗂️ **File-based JSON persistence** - No database required, uses JSON file storage for simplicity
- ⚡ **Fast and lightweight** - Built with Next.js App Router for optimal performance
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🔒 **Type-safe** - Full TypeScript implementation with Zod validation
- ✅ **Tested** - Comprehensive test suite with Jest and Playwright

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm/yarn

### Installation & Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Seed sample data**
   ```bash
   pnpm seed
   ```
   This populates `src/data/work-orders.json` with 10 sample work orders for testing.

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Run tests** (optional)
   ```bash
   pnpm test              # Run unit/component tests
   pnpm test:watch        # Watch mode
   pnpm test:coverage     # Coverage report
   pnpm test:e2e          # E2E tests (requires dev server)
   ```

---

## ✨ Features

### Core Functionality

- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete work orders
- ✅ **RESTful API** - Clean API endpoints with proper HTTP methods
- ✅ **Zod Validation** - Server-side and client-side validation with detailed error messages
- ✅ **RPC-style Functions** - Modular service layer with snake_case naming convention
- ✅ **Search & Filter** - Real-time search by title and filter by status
- ✅ **Pagination** - Efficient table pagination (10 items per page)
- ✅ **Responsive Design** - Mobile-friendly layout with Tailwind CSS
- ✅ **Keyboard Accessibility** - Full keyboard navigation support
- ✅ **Dark Mode Support** - Automatic dark mode styling
- ✅ **Loading States** - Proper loading indicators and empty states
- ✅ **Error Handling** - Comprehensive error handling with user-friendly messages

### UI Features

- 📊 **Work Orders Table** - Sortable, paginated table with priority and status badges
- 🔍 **Search & Filter** - Combined search (title) and filter (status) functionality
- 📝 **Create/Edit Forms** - Intuitive forms with real-time validation
- 👁️ **Detail View** - Comprehensive work order detail page
- 🗑️ **Delete Confirmation** - Modal confirmation for destructive actions
- 📄 **Pagination Controls** - Easy navigation through work order lists

---

## 🔍 Filter/Search Approach

The application implements a **combined search and filter** system:

### Search by Title
- **Implementation**: Case-insensitive, partial matching on work order titles
- **User Experience**: Real-time filtering as you type
- **Performance**: Client-side filtering for instant results

### Filter by Status
- **Options**: All, Open, In Progress, Done
- **Implementation**: Dropdown filter that works in conjunction with search
- **User Experience**: Quick access to work orders by their current state

### Why This Approach?

1. **Title Search** is the most common use case - users typically search for work orders by their title/keywords
2. **Status Filtering** provides quick access to work orders by their current state
3. **Combined Power** - Users can search for specific titles while filtering by status (e.g., "Find all 'HVAC' work orders that are 'In Progress'")
4. **Performance** - Client-side filtering provides instant feedback without API calls
5. **Simplicity** - Easy to understand and use for technicians

**Example Use Cases:**
- Search: "HVAC" + Filter: "In Progress" → Shows all HVAC work orders currently in progress
- Search: "Electrical" + Filter: "Open" → Shows all open electrical work orders

---

## 💾 Cache Strategy

### Implementation

All API route handlers use **`cache: 'no-store'`** to ensure fresh data:

```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// OR
cache: 'no-store'
```

### Why `cache: 'no-store'`?

1. **Real-time Data** - Work orders change frequently, and users need to see the latest status
2. **No Stale Data** - Prevents showing outdated information that could lead to confusion
3. **File-based Storage** - Since we're using JSON file storage, we want to read the latest file state
4. **CRUD Operations** - Create/Update/Delete operations need immediate visibility
5. **Simplicity** - For a small application, ensuring fresh data is more important than caching performance

### Trade-offs

- **Performance**: Slightly slower than cached responses, but acceptable for this use case
- **Scalability**: For larger applications, consider implementing proper caching strategies
- **User Experience**: Users always see the most current data, which is critical for work order management

---

## 🛠️ Development Notes

### Time Investment

**Approximate Development Time**: ~6-8 hours

This includes:
- Project setup and configuration
- Data layer implementation (JSON file storage)
- API route handlers with validation
- Complete UI components (List, Create, Edit, Detail, Delete)
- Search and filter functionality
- Pagination implementation
- Comprehensive test suite
- Documentation

### Design Trade-offs & Simplifications

To deliver a working application within the timebox, several design decisions were made:

#### 1. **File-based JSON Storage** (No Database)
- ✅ **Pros**: Simple setup, no database configuration, easy to inspect/debug
- ⚠️ **Trade-off**: Not suitable for production scale, limited concurrent access
- 💡 **Future**: Could easily migrate to PostgreSQL, MongoDB, or other databases

#### 2. **Client-side Filtering/Search**
- ✅ **Pros**: Instant feedback, no API calls, better UX
- ⚠️ **Trade-off**: All data loaded into memory (fine for small datasets)
- 💡 **Future**: Could implement server-side search for larger datasets

#### 3. **Minimal Error Boundaries**
- ✅ **Pros**: Faster development, simpler codebase
- ⚠️ **Trade-off**: Less sophisticated error recovery
- 💡 **Future**: Could add React Error Boundaries for better error handling

#### 4. **No Authentication**
- ✅ **Pros**: Faster development, simpler deployment
- ⚠️ **Trade-off**: Not production-ready for multi-user scenarios
- 💡 **Future**: Could add NextAuth.js or similar authentication

#### 5. **Simple Validation**
- ✅ **Pros**: Zod validation covers all requirements
- ⚠️ **Trade-off**: Could add more sophisticated business rules
- 💡 **Future**: Could add custom validation rules, workflow states

### Architecture Decisions

1. **RPC-style Functions**: Using snake_case for service functions (e.g., `create_work_order`) for consistency
2. **Server Components**: Leveraging Next.js App Router's Server Components for data fetching
3. **Client Components**: Only using Client Components where interactivity is needed (forms, modals, filters)
4. **Modular Components**: Breaking down UI into reusable, testable components
5. **Type Safety**: Strict TypeScript throughout with proper type definitions

---

## 🧪 Testing

### Test Suite Overview

The application includes a comprehensive test suite covering unit, component, integration, and E2E tests.

### Unit/Component Tests (Jest + React Testing Library)

**Location**: `__tests__/components/`

- ✅ **WorkOrdersList.test.tsx** - List component rendering, filtering, search, pagination
- ✅ **WorkOrderForm.test.tsx** - Form validation, create/edit flows, error handling
- ✅ **createToList.test.tsx** - Integration test for create → list flow

**Test Coverage:**
- Component rendering
- User interactions (clicks, form submissions)
- Form validation (client-side and server-side)
- API mocking
- Navigation flows
- Error states

### E2E Tests (Playwright)

**Location**: `e2e/work-orders.spec.ts`

- ✅ **Happy Path**: Complete workflow (Navigate → Create → View → Edit → Delete)
- ✅ **Form Validation**: Testing validation messages
- ✅ **Search & Filter**: Testing search and filter functionality

### Running Tests

```bash
# Unit/Component tests
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report

# E2E tests (requires dev server running)
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Run with Playwright UI
```

### Test Statistics

- **Unit/Component Tests**: ~15+ test cases
- **Integration Tests**: 2 test suites
- **E2E Tests**: 3 test scenarios
- **Coverage**: Focus on critical paths and user flows

---

## 📸 Screenshots & Demo

### Work Orders List View
![Work Orders List](./docs/screenshots/list-view.png)

*Main dashboard showing all work orders with search, filter, and pagination*

### Create Work Order Form
![Create Form](./docs/screenshots/create-form.png)

*Clean form interface for creating new work orders with real-time validation*

### Work Order Detail Page
![Detail View](./docs/screenshots/detail-view.png)

*Comprehensive detail view showing all work order information*

### Edit Work Order
![Edit Form](./docs/screenshots/edit-form.png)

*Edit form with pre-filled data and status field*

---

## 🏗️ Tech Stack

### Core Framework
- **Next.js 16.0.1** (App Router) - React framework with server-side rendering
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Dark Mode** - Automatic dark mode support

### Validation & Schema
- **Zod 4.1.12** - TypeScript-first schema validation

### Testing
- **Jest 30.2.0** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **Playwright 1.48.2** - E2E testing framework

### Utilities
- **date-fns 3.6.0** - Date formatting and manipulation
- **uuid 13.0.0** - Unique ID generation

### Development Tools
- **tsx** - TypeScript execution
- **ESLint** - Code linting
- **TypeScript** - Type checking

---

## 📁 Project Structure

```
technician-work-orders/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   └── work-orders/          # API route handlers
│   │   │       ├── [id]/
│   │   │       │   └── route.ts      # GET, PUT, DELETE by ID
│   │   │       └── route.ts          # GET (list), POST (create)
│   │   ├── work-orders/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx      # Edit work order page
│   │   │   │   └── page.tsx          # Work order detail page
│   │   │   └── new/
│   │   │       └── page.tsx          # Create work order page
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Home page (list view)
│   ├── components/
│   │   └── work-orders/               # Work order components
│   │       ├── WorkOrdersList.tsx    # Main list component
│   │       ├── WorkOrderForm.tsx     # Create/Edit form
│   │       ├── WorkOrdersTable.tsx    # Table wrapper
│   │       ├── WorkOrderTableRow.tsx  # Table row component
│   │       ├── SearchFilter.tsx       # Search & filter component
│   │       ├── Pagination.tsx         # Pagination component
│   │       ├── DeleteConfirmationModal.tsx
│   │       ├── LoadingState.tsx
│   │       └── EmptyState.tsx
│   ├── data/
│   │   ├── work-orders.json          # JSON file storage
│   │   └── workOrderStore.ts          # CRUD operations
│   ├── services/
│   │   ├── workOrderRPC.ts           # RPC-style functions
│   │   └── workOrderService.ts        # Service layer
│   └── lib/                           # Utility functions
├── __tests__/
│   ├── components/                   # Component tests
│   └── integration/                  # Integration tests
├── e2e/
│   └── work-orders.spec.ts           # E2E tests
├── scripts/
│   └── seed.ts                       # Seed script
├── jest.config.ts                    # Jest configuration
├── playwright.config.ts              # Playwright configuration
└── package.json
```

---

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/work-orders` | List all work orders |
| `POST` | `/api/work-orders` | Create a new work order |
| `GET` | `/api/work-orders/[id]` | Get work order by ID |
| `PUT` | `/api/work-orders/[id]` | Update work order |
| `DELETE` | `/api/work-orders/[id]` | Delete work order |

### Request/Response Examples

See `API_EXAMPLES.md` for complete API documentation with request/response examples, Postman collection, and cURL commands.

---

## 🚢 Build & Deployment

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Environment Variables

Currently, no environment variables are required. The application uses file-based storage by default.

---

## 🤝 Contributing

This is a demonstration project. For production use, consider:

1. Adding a proper database (PostgreSQL, MongoDB, etc.)
2. Implementing authentication/authorization
3. Adding error boundaries and better error handling
4. Implementing proper caching strategies
5. Adding monitoring and logging
6. Setting up CI/CD pipelines

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Technician Work Orders

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📖 Additional Documentation

- [Testing Guide](./README_TESTING.md) - Comprehensive testing documentation
- [API Examples](./API_EXAMPLES.md) - API usage examples and Postman collection
- [Quick Test Examples](./QUICK_TEST_EXAMPLES.md) - Quick reference for testing

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Jest](https://jestjs.io/) - Delightful JavaScript Testing
- [Playwright](https://playwright.dev/) - End-to-end testing

---

<div align="center">

**Made with ❤️ using Next.js and TypeScript**

[Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues)

</div>
