const API_BASE_URL = 'http://localhost:3001/api';

export type LoanType =
  | 'Flexi-Loan'
  | 'Business Loan'
  | 'Cash Advance'
  | 'RLS'
  | 'CBILS';

export type LoanHistory = {
  loan_started: string;
  loan_ended: string;
  principle: number;
  interest_rate: number;
  interest: number;
};

export type Application = {
  id: number;
  first_name: string;
  last_name: string;
  loan_amount: number;
  loan_type: LoanType;
  email: string;
  company: string;
  date_created: string;
  expiry_date: string;
  avatar: string;
  loan_history: LoanHistory[];
};

export type PaginationMetadata = {
  hasNextPage: boolean;
};

export type ApplicationsResponse = {
  applications: Application[];
  pagination: PaginationMetadata;
};

/**
 * Parses RFC 8288 Link header to extract pagination information
 */
function parseLinkHeader(linkHeader: string | null): PaginationMetadata {
  if (!linkHeader) {
    return { hasNextPage: false };
  }

  // Link header format: <url>; rel="next", <url>; rel="last", etc.
  const links = linkHeader.split(',');
  const hasNextPage = links.some((link) => {
    const trimmedLink = link.trim().toLowerCase();
    return trimmedLink.includes('rel="next"') || trimmedLink.includes("rel='next'");
  });

  return { hasNextPage };
}

/**
 * Fetches applications from the API with pagination
 */
export async function fetchApplications(
  page: number,
  limit: number = 5
): Promise<ApplicationsResponse> {
  try {
    const url = `${API_BASE_URL}/applications?_page=${page}&_limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch applications: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response: expected an array of applications');
    }

    const applications: Application[] = data;
    const linkHeader = response.headers.get('Link');
    const pagination = parseLinkHeader(linkHeader);

    return { applications, pagination };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error occurred while fetching applications');
  }
}

