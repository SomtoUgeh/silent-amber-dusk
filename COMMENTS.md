# Implementation Notes

This implementation transforms the hardcoded single-application display into a fully functional paginated application portal that fetches data from the API, displays applications in cards matching the Figma design, and provides a seamless "Load More" experience.

## Requirements Summary

The task required:
- Replace hardcoded fixture with API-based pagination
- Fetch applications from `http://localhost:3001/api/applications` with pagination query params (`?_page=X&_limit=5`)
- Parse Link header (RFC 8288 format) to determine pagination state
- Display applications in cards matching the provided Figma design
- Format dates as DD-MM-YYYY and currency as £X,XXX format
- Include comprehensive test coverage
- Maintain attention to detail in design implementation

## Solution Overview

**1. React Query for State Management**
- Selected `@tanstack/react-query` for handling server state, caching, and pagination
- Provides built-in support for infinite queries, which perfectly matches the "Load More" pattern

**2. API Service Layer**
- Created a dedicated API service (`src/api/applications.ts`) that encapsulates all API interactions
- Parses Link headers according to RFC 8288 specification

**4. Semantic HTML & Accessibility**
- Used semantic HTML elements (`<article>`, `<dl>`, `<dt>`, `<dd>`, `<time>`, `<a>`)
- Added ARIA labels and screen reader support

## Packages Added

**`@tanstack/react-query`**
- Purpose: Server state management, caching, and infinite query support for pagination
- Rationale: Provides robust data fetching patterns with automatic caching, refetching, and error handling. The `useInfiniteQuery` hook perfectly matches the "Load More" pattern without requiring manual state management

**`date-fns`**
- Purpose: Date parsing and formatting utility
- Rationale: More robust than native Date methods for parsing ISO strings and formatting. Handles edge cases and invalid dates gracefully
