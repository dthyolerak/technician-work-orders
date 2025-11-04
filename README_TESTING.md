# Testing Guide

This document describes the testing setup and how to run tests for the Technician Work Orders application.

## Test Structure

```
__tests__/
├── components/          # Component unit tests
│   ├── WorkOrdersList.test.tsx
│   └── WorkOrderForm.test.tsx
└── integration/         # Integration tests
    └── createToList.test.tsx

e2e/
└── work-orders.spec.ts  # Playwright E2E tests
```

## Running Tests

### Unit/Component Tests (Jest)

Run all tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with coverage:
```bash
pnpm test:coverage
```

### E2E Tests (Playwright)

**Note:** E2E tests require the dev server to be running. The Playwright config will automatically start it.

Run E2E tests:
```bash
pnpm test:e2e
```

Run E2E tests with UI mode:
```bash
pnpm test:e2e:ui
```

## Test Coverage

### Component Tests

1. **WorkOrdersList.test.tsx**
   - Renders work orders list correctly
   - Displays empty state
   - Shows correct work order count
   - Navigates to create/edit pages
   - Opens delete confirmation modal
   - Deletes work orders
   - Filters by status
   - Searches by title

2. **WorkOrderForm.test.tsx**
   - Renders create form with required fields
   - Renders edit form with status field
   - Validates required fields
   - Validates field lengths (title, description)
   - Successfully creates work orders
   - Successfully updates work orders
   - Displays server validation errors
   - Clears errors on user input
   - Shows character counters

### Integration Tests

3. **createToList.test.tsx**
   - Complete flow: Create → List shows new item
   - Verifies work order creation
   - Verifies list updates after creation
   - Tests navigation flow

### E2E Tests

4. **work-orders.spec.ts**
   - Complete happy path: Navigate → Create → View → Edit → Delete
   - Form validation
   - Search and filter functionality

## Test Setup

### Jest Configuration

- Uses `next/jest` for Next.js compatibility
- Configured for ESM modules
- Uses `jsdom` environment for React components
- Includes `@testing-library/jest-dom` matchers

### Mocking

- `next/navigation` is mocked for router functions
- `fetch` is mocked for API calls
- Components are tested in isolation

### Test Utilities

- `@testing-library/react` for component rendering
- `@testing-library/user-event` for user interactions
- `@testing-library/jest-dom` for DOM assertions

## Writing New Tests

### Component Test Example

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '@/components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('user flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: /add/i }).click();
  // ... test steps
});
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Test Names**: Use descriptive test names
3. **Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Mock API calls and navigation
5. **Test User Behavior**: Focus on what users see and do
6. **Accessibility**: Use accessible queries (getByRole, getByLabelText)

## Troubleshooting

### Tests failing with "Cannot find module"
- Ensure all dependencies are installed: `pnpm install`
- Check that module paths match your `tsconfig.json` aliases

### E2E tests timing out
- Ensure dev server is running on port 3000
- Check that Playwright browsers are installed: `npx playwright install`

### Mock not working
- Verify mocks are set up before component renders
- Check that mocks are cleared between tests in `beforeEach`

