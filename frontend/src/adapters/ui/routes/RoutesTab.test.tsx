import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { RoutesTab } from './RoutesTab';

// Mock axios instance used in the component
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            routeId: 'R001',
            vesselType: 'Container',
            fuelType: 'HFO',
            year: 2024,
            ghgIntensity: 91.0,
            fuelConsumption: 5000,
            distance: 12000,
            totalEmissions: 4500,
            isBaseline: true
          }
        ]
      }),
      post: jest.fn()
    }))
  };
});

describe('RoutesTab UI Component', () => {
  it('should render the vessel table and mock data seamlessly', async () => {
    render(<RoutesTab />);

    // Check Headers
    expect(screen.getByText('🚢 Vessel Routes')).toBeInTheDocument();
    
    // Wait for the mock API data to populate
    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('Container')).toBeInTheDocument();
      expect(screen.getByText('✅ Baseline')).toBeInTheDocument();
    });
  });

  it('should render the categorical filters correctly', () => {
    render(<RoutesTab />);
    // Select dropdowns are now used instead of placeholder inputs
    expect(screen.getByText('All Vessel Types')).toBeInTheDocument();
    expect(screen.getByText('All Years')).toBeInTheDocument();
  });
});
