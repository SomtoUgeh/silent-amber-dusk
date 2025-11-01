import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SingleApplication from './SingleApplication';
import { createMockApplication } from './__fixtures__/applications.fixture.utils';

describe('SingleApplication', () => {
  describe('rendering application data', () => {
    it('should display all application information', () => {
      const application = createMockApplication();
      render(<SingleApplication application={application} />);

      expect(screen.getByText('Qnekt')).toBeInTheDocument();
      expect(screen.getByText('Miles Espinoza')).toBeInTheDocument();
      expect(screen.getByText('milesespinoza@qnekt.com')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Loan amount')).toBeInTheDocument();
      expect(screen.getByText('Application date')).toBeInTheDocument();
      expect(screen.getByText('Expiry date')).toBeInTheDocument();
    });

    it('should handle long company names', () => {
      const application = createMockApplication({
        company: 'Expeditors International of Washington Inc.',
      });
      render(<SingleApplication application={application} />);

      expect(screen.getByText('Expeditors International of Washington Inc.')).toBeInTheDocument();
    });
  });

  describe('currency formatting', () => {
    it.each([
      { amount: 10300, expected: '£10,300', description: 'small amounts' },
      { amount: 100500, expected: '£100,500', description: 'large amounts with commas' },
    ])('should format $description correctly', ({ amount, expected }) => {
      const application = createMockApplication({ loan_amount: amount });
      render(<SingleApplication application={application} />);

      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  describe('date formatting', () => {
    it.each([
      {
        description: 'standard dates',
        date_created: '2021-08-10T00:00:00.000Z',
        expiry_date: '2021-12-10T00:00:00.000Z',
        expectedCreated: '10-08-2021',
        expectedExpiry: '10-12-2021',
      },
      {
        description: 'different months',
        date_created: '2021-03-05T00:00:00.000Z',
        expiry_date: '2021-11-25T00:00:00.000Z',
        expectedCreated: '05-03-2021',
        expectedExpiry: '25-11-2021',
      },
    ])('should format dates as DD-MM-YYYY for $description', ({ date_created, expiry_date, expectedCreated, expectedExpiry }) => {
      const application = createMockApplication({
        date_created,
        expiry_date,
      });
      render(<SingleApplication application={application} />);

      expect(screen.getByText(expectedCreated)).toBeInTheDocument();
      expect(screen.getByText(expectedExpiry)).toBeInTheDocument();
    });
  });

  describe('email interaction', () => {
    it('should make email address clickable', () => {
      const application = createMockApplication({
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      });

      render(<SingleApplication application={application} />);

      const emailLink = screen.getByRole('link', { name: /Email John Doe at test@example\.com/i });

      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
      expect(emailLink).toHaveTextContent('test@example.com');
    });
  });
});

