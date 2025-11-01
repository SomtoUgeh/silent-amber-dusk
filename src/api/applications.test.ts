import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchApplications, type Application } from './applications';
import { createMockApplication } from '../__fixtures__/applications.fixture.utils';

global.fetch = vi.fn();

describe('fetchApplications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic functionality', () => {
    it('should fetch applications with pagination params', async () => {
      const mockApplications: Application[] = [
        createMockApplication(),
      ];

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockApplications),
        headers: new Headers({
          Link: '<http://localhost:3001/api/applications?_page=2&_limit=5>; rel="next"',
        }),
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await fetchApplications(1, 5);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/applications?_page=1&_limit=5'
      );
      expect(result.applications).toEqual(mockApplications);
      expect(result.pagination.hasNextPage).toBe(true);
    });

    it('should use default limit of 5 when not provided', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([]),
        headers: new Headers(),
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      await fetchApplications(1);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/applications?_page=1&_limit=5'
      );
    });
  });

  describe('pagination link header parsing', () => {
    it.each([
    {
      description: 'with double quotes',
      linkHeader: '<url>; rel="first", <url>; rel="next", <url>; rel="last"',
    },
    {
      description: 'with single quotes',
      linkHeader: "<url>; rel='next'",
    },
  ])('should parse Link header correctly when next page exists $description', async ({ linkHeader }) => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue([]),
      headers: new Headers({
        Link: linkHeader,
      }),
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await fetchApplications(1, 5);

    expect(result.pagination.hasNextPage).toBe(true);
    });

    it.each([
      {
        description: 'when no next page exists',
        linkHeader: '<url>; rel="first", <url>; rel="prev", <url>; rel="last"',
        page: 10,
      },
      {
        description: 'when Link header is missing',
        linkHeader: null,
        page: 1,
      },
    ])('should return hasNextPage as false $description', async ({ linkHeader, page }) => {
      const headers = new Headers();
      if (linkHeader) {
        headers.set('Link', linkHeader);
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([]),
        headers,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await fetchApplications(page, 5);

      expect(result.pagination.hasNextPage).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors', async () => {
      const mockError = new Error('Network error');
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(fetchApplications(1, 5)).rejects.toThrow('Network error');
    });

    it('should handle non-ok responses', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error',
        json: vi.fn(),
        headers: new Headers(),
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      await expect(fetchApplications(1, 5)).rejects.toThrow(
        'Failed to fetch applications: Internal Server Error'
      );
    });
  });

});

