import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// next/font/google only runs inside the Next compiler; in unit tests it just needs to hand back a class name.
vi.mock('next/font/google', () => {
  const font = () => ({ className: '', variable: '', style: { fontFamily: 'sans-serif' } });
  return { Google_Sans_Flex: font, Inter: font, Nunito: font, Open_Sans: font };
});

vi.mock('next/font/local', () => ({ default: () => ({ className: '', variable: '', style: { fontFamily: 'sans-serif' } }) }));

afterEach(cleanup);
