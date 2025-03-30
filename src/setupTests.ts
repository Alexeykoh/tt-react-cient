import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Автоматическая очистка после каждого теста
afterEach(() => {
  cleanup();
});
