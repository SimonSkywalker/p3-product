import '@testing-library/jest-dom/'
import 'whatwg-fetch'
import {server} from './mocks/server'


beforeAll(()=> server.listen());
afterEach(()=> server.resetHandlers());
afterAll(()=> server.close());

jest.mock('next/navigation');

jest.mock('./src/app/(admin)/context/Auth', () => ({
    ...jest.requireActual('./src/app/(admin)/context/Auth'),
    useAuth: jest.fn(() => ({ login: jest.fn() }))
  }));

  jest.mock('./src/app/(admin)/classes/handlerClass', () => ({
    ...jest.requireActual('./src/app/(admin)/classes/handlerClass'),
    APIHandle: {
      APIRequestLogin: jest.fn(),
    },
  }));