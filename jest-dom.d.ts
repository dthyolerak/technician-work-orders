/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

declare module '@jest/expect' {
  interface Matchers<R = void, T = unknown> {
    toBeInTheDocument(): R;
    toHaveValue(value: string | number | string[]): R;
    toHaveTextContent(text: string | RegExp): R;
    toBeVisible(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveAttribute(attr: string, value?: string): R;
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveValue(value: string | number | string[]): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

export {};
