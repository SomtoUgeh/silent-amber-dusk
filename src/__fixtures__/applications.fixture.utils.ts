import type { Application } from "../api/applications";
import { getSingleApplicationFixture } from "./applications.fixture";

export const createMockApplication = (
  overrides?: Partial<Application>,
): Application => {
  const fixture = getSingleApplicationFixture[0];

  return {
    id: 1,
    first_name: fixture.first_name,
    last_name: fixture.last_name,
    loan_amount: fixture.loan_amount,
    loan_type: "Business Loan",
    email: fixture.email,
    company: fixture.company,
    date_created: `${fixture.date_created}T00:00:00.000Z`,
    expiry_date: `${fixture.expiry_date}T00:00:00.000Z`,
    avatar: "https://example.com/avatar.jpg",
    loan_history: [],
    ...overrides,
  };
};
