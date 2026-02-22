import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  // Use vi.stubGlobal for a cleaner, Vitest-native way to mock globals
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve(''),
        statusText: 'OK',
        headers: new Headers(),
      } as Response)
    )
  );
});

afterEach(() => {
  // Vitest has a built-in way to undo stubGlobal
  vi.unstubAllGlobals();
});
