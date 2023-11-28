const mockAxios = jest.genMockFromModule('axios');

mockAxios.create = jest.fn(() => mockAxios);

// Mock other Axios methods as needed
mockAxios.get = jest.fn();
mockAxios.post = jest.fn();

export default mockAxios;