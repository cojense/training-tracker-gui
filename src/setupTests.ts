import '@testing-library/jest-dom';
import { vi } from 'vitest'; // Import vi from vitest

// Mock fetch globally
const originalFetch = global.fetch; // Store original fetch
beforeEach(() => {
  global.fetch = vi.fn((_url, _options) => {
    // Use vi.fn() instead of jest.fn()
    // Basic mock: you can expand this to return different responses based on url/options
    // For now, let's return a successful JSON response
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
      text: () => Promise.resolve(''), // For 204 No Content responses
      statusText: 'OK',
      headers: new Headers(),
    } as Response);
  }) as unknown as typeof global.fetch; // Cast to original fetch type
});

afterEach(() => {
  // Restore original fetch after each test to ensure no side effects
  global.fetch = originalFetch;
});
