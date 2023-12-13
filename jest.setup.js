import '@testing-library/jest-dom/'
//import * as NextNavigation from
jest.mock('next/navigation', () => ({
   // ...jest.requireActual('next/navigation'), // Preserve the actual implementation
    useRouter: jest.fn(),
  }));