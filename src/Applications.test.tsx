import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Applications from './Applications';
import * as applicationsApi from './api/applications';
import type { ApplicationsResponse } from './api/applications';
import { createQueryClientWrapper } from './testUtils';
import { createMockApplication } from './__fixtures__/applications.fixture.utils';

vi.mock('./api/applications');

describe('Applications', () => {
  const mockFetchApplications = vi.mocked(applicationsApi.fetchApplications);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering and initial state', () => {
    it('should render loading state initially', async () => {
      mockFetchApplications.mockImplementation(
        (): Promise<ApplicationsResponse> =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ applications: [], pagination: { hasNextPage: false } }), 100);
          })
      );

      render(<Applications />, { wrapper: createQueryClientWrapper() });

      expect(screen.getByText('Loading applications...')).toBeInTheDocument();

      await waitFor(() => {
        expect(mockFetchApplications).toHaveBeenCalledWith(1, 5);
      });
    });

    it('should fetch and display applications on mount', async () => {
      const mockApplications = [
        createMockApplication({
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          company: 'Test Company',
          loan_amount: 10000,
          email: 'john@example.com',
        }),
      ];

      mockFetchApplications.mockResolvedValue({
        applications: mockApplications,
        pagination: { hasNextPage: false },
      });

      render(<Applications />, { wrapper: createQueryClientWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Test Company')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Load more button visibility', () => {
    it.each([
      {
        description: 'when hasNextPage is true',
        hasNextPage: true,
        shouldBeVisible: true,
      },
      {
        description: 'when hasNextPage is false',
        hasNextPage: false,
        shouldBeVisible: false,
      },
    ])('should $description', async ({ hasNextPage, shouldBeVisible }) => {
      mockFetchApplications.mockResolvedValue({
        applications: [],
        pagination: { hasNextPage },
      });

      render(<Applications />, { wrapper: createQueryClientWrapper() });

      await waitFor(() => {
        const button = screen.queryByRole('button', { name: /load more/i });

        if (shouldBeVisible) {
          expect(button).toBeInTheDocument();
        } else {
          expect(button).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('Load more functionality', () => {
    it('should fetch next page when Load more is clicked', async () => {
      const user = userEvent.setup();

      const firstPageApps = [
        createMockApplication({
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          company: 'Company 1',
          loan_amount: 10000,
          email: 'john@example.com',
        }),
      ];

      const secondPageApps = [
        createMockApplication({
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          company: 'Company 2',
          loan_amount: 20000,
          loan_type: 'Flexi-Loan',
          email: 'jane@example.com',
          date_created: '2021-09-10T00:00:00.000Z',
          expiry_date: '2022-01-10T00:00:00.000Z',
          avatar: 'https://example.com/avatar2.jpg',
        }),
      ];

      mockFetchApplications
        .mockResolvedValueOnce({
          applications: firstPageApps,
          pagination: { hasNextPage: true },
        })
        .mockResolvedValueOnce({
          applications: secondPageApps,
          pagination: { hasNextPage: false },
        });

      render(<Applications />, { wrapper: createQueryClientWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Company 1')).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByRole('button', { name: /load more/i });
      await user.click(loadMoreButton);

      await waitFor(() => {
        expect(mockFetchApplications).toHaveBeenCalledTimes(2);
        expect(mockFetchApplications).toHaveBeenLastCalledWith(2, 5);
        expect(screen.getByText('Company 1')).toBeInTheDocument();
        expect(screen.getByText('Company 2')).toBeInTheDocument();
      });
    });

    it('should disable Load more button while loading', async () => {
      const user = userEvent.setup();

      let resolveSecondCall: (value: ApplicationsResponse) => void;
      const secondCallPromise = new Promise<ApplicationsResponse>((resolve) => {
        resolveSecondCall = resolve;
      });

      mockFetchApplications
        .mockResolvedValueOnce({
          applications: [],
          pagination: { hasNextPage: true },
        })
        .mockReturnValueOnce(secondCallPromise);

      render(<Applications />, { wrapper: createQueryClientWrapper() });

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /load more/i });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
      });

      const button = screen.getByRole('button', { name: /load more/i });
      await user.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
        expect(button.textContent).toBe('Loading...');
      });

      resolveSecondCall!({
        applications: [],
        pagination: { hasNextPage: false },
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockFetchApplications.mockRejectedValue(new Error('Network error'));

      render(<Applications />, { wrapper: createQueryClientWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/Error loading applications:/)).toBeInTheDocument();
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });
  });
});

