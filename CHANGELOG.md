# ExpiryGO Changelog

## v1.0.0-beta.2 (2026-07-04)

### Storage Intelligence
- Added an offline shelf-life knowledge database for common foods.
- Added automatic storage recommendations for Pantry, Refrigerator, Deep Freezer, and Room Temperature.
- Added editable storage location, estimated shelf-life, and storage tips fields to the product form.
- Saved and displayed storage intelligence details on product cards while preserving manual override behavior.
- Fixed product action labels so edit/delete controls render reliably.
- Added automated tests for food recommendation matching.

## v1.0.0-beta.1 (2026-07-04)

### Technical Cleanup & Date Bug Fixes
- **Fixed Timezone-Shifting Bug:** Resolved a critical bug in `dateHelpers.js` where standard `YYYY-MM-DD` inputs were parsed in UTC, causing dates to shift one day early in negative timezone offsets.
- **Fixed Locale-Swapping Risks:** Enforced strict, manual local-timezone integer parsing of calendar strings to prevent month/day swapping during browser transitions.
- **Boilerplate Cleanup:** Deleted unused legacy files (`src/App.js`, `src/style.css`, `src/counter.js`) to reduce codebase technical debt.
- **Added Automated Testing:** Installed Vitest as a developer dependency and wrote a deterministic test suite (`src/utils/__tests__/dateHelpers.test.js`) with fake timers, successfully passing all 15 test cases.

## Next Milestone
- Milestone 2: Professional Component Refactoring (extract state logic and modularize monolithic UI).
