# AGENTS.md

## Project Overview

**Supersimple Holter Grading** — a medical web tool for generating standardized Holter monitoring reports. Built for medical professionals using CARDION. Hosted at supersimplegrading.com.

## Tech Stack

- Vanilla HTML, CSS, JavaScript — no frameworks, no build tools, no dependencies
- Open `index.html` directly in a browser to run

## File Map

| File | Purpose |
|---|---|
| `index.html` | Main page: layout, Google Analytics (G-8JHYCFNS90), guidelines section |
| `disclaimer.html` | Medical disclaimer page |
| `style.css` | Flexbox layout, category color classes, responsive styling |
| `script_new.js` | Core logic: data model, DOM rendering, trigger system, copy/reset |
| `teksten.md` | Reference list of text snippets (also hardcoded in `script_new.js`) |
| `onderschrift.md` | Grading guidelines ("Beoordelingswijzer") |
| `versie_2.md` | Version 2 feature specifications |
| `progress_versie_2.md` | Progress log for v2 implementation |
| `disclaimer.md` | Disclaimer text (source for `disclaimer.html`) |
| `google_tag.md` | Google Analytics tag reference |
| `CARDION_logo.png` | Logo image (displayed in header) |

## Architecture

### Data Model (`script_new.js`)

The app is data-driven via a `data` array. Each category has:
- `category`: display name
- `cssClass`: background color class (`bg-light-green`, `bg-light-yellow`, `bg-light-blue`)
- `items[]`: each item has:
  - `text` — the clinical finding text
  - `id` (optional) — logical identifier so other items can trigger it (e.g., `"choice_1"`)
  - `triggers` (optional) — array of `id`s to auto-check when this item is selected
  - `untriggers` (optional) — array of `id`s to auto-uncheck when this item is selected (used for grade exclusivity)

### Trigger System

Selecting a checkbox with `triggers` recursively auto-checks all referenced items. Selecting a checkbox with `untriggers` auto-unchecks conflicting items (e.g., selecting Grade 3 unchecks Grade 2 and Grade 1). Untriggers are processed before triggers to ensure consistency.

### UI Layout

- **Left pane (70%)**: Checkbox categories with colored backgrounds
- **Right pane (30%)**: Textarea (auto-populated) + Copy/Reset buttons

### Grading Logic

| Grade | Meaning |
|---|---|
| 1 | Benign — no referral needed |
| 2 | Digital consult with cardiologist recommended |
| 3 | Referral indication |

## Development Notes

- No build step — edit files directly and refresh browser
- Texts are duplicated between `teksten.md` and `script_new.js`; changes must be made in `script_new.js` to take effect
- The `data` array in `script_new.js` is the single source of truth for the app
- `onderschrift.md` and the `.guidelines` section in `index.html` should stay in sync
- Google Analytics tag must be present on all HTML pages (`index.html`, `disclaimer.html`)

## Conventions

- Language: Dutch (Nederlands) for all UI text and clinical content
- CSS classes: descriptive names (e.g., `bg-light-green`, `category-section`, `checkbox-container`)
- JavaScript: vanilla, no modules, DOM manipulation via `document.createElement`
- IDs on data items use `choice_N` pattern; DOM IDs use `cb-{section}-{item}` pattern
