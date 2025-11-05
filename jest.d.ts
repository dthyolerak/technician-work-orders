/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

declare module '@jest/globals' {
  interface JestMatchers<T> {
    toBeInTheDocument(): T;
    toHaveTextContent(text: string | RegExp): T;
    toBeVisible(): T;
    toBeDisabled(): T;
    toHaveClass(...classNames: string[]): T;
    toHaveAttribute(attr: string, value?: string): T;
  }
}
