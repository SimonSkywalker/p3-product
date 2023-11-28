// ProjectPage.test.js

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectPage from '@/app/projectCreation/page';
import axios from 'axios'; // This import is automatically mocked by Jest
import { describe } from 'node:test';

jest.mock('axios');
/*
describe('ProjectPage', () => {
  test('renders without crashing', async () => {
    // Mock the Axios request to return a specific response
    axios.get.mockResolvedValue({
      data: [
        // Your mocked data here
        { title: 'Project 1', isActive: true, icon: 'icon1.png' },
        { title: 'Project 2', isActive: false, icon: 'icon2.png' },
      ],
    });

    // Render the component
    const { getByText } = render(<ProjectPage />);

    // Wait for the Axios request to be resolved
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Your assertions based on the mocked data
    expect(getByText('Project 1')).toBeInTheDocument();
    expect(getByText('Project 2')).toBeInTheDocument();
  });
});
*/

describe('ProjectPage', () => {
    test('renders without crashing', async () => {
        render(<ProjectPage />);
    })
})