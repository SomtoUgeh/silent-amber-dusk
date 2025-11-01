import { render, screen } from "@testing-library/react";
import App from "./App";
import { createQueryClientWrapper } from "./testUtils";
import { describe, it, expect } from "vitest";

describe("App", () => {
  it('should render the "Application Portal" title', () => {
    render(<App />, { wrapper: createQueryClientWrapper() });

    const linkElement = screen.getByText(/Application portal/i);

    expect(linkElement).toBeInTheDocument();
  });
});
