# Supersimple Holter Grading

A web tool for medical professionals to generate standardized Holter monitoring reports. Built for use with CARDION.

**Live site:** [supersimplegrading.com](https://supersimplegrading.com)

## Goal

This application helps medical professionals quickly assess and document Holter monitoring results using a standardized grading system. Instead of manually writing reports, users select relevant clinical findings from predefined options. The tool automatically:

- Concatenates selected findings into a structured report
- Applies grading logic (Grade 1, 2, or 3) based on the findings
- Flags when referral or specialist consultation is recommended

### Grading System

| Grade | Meaning |
|---|---|
| **1** | Benign — no referral needed |
| **2** | Digital consult with cardiologist recommended |
| **3** | Referral indication |

## Usage

1. Open `index.html` in a web browser (no server required)
2. Select relevant clinical findings from the three categories:
   - **Supraventriculair** (green) — SVES, atrial fibrillation, AV blocks, etc.
   - **Ventriculair** (yellow) — VES, doublets, triplets, VT, etc.
   - **Advies** (blue) — Grade selection and referral text
3. The right pane automatically populates with selected findings
4. Click **Copy to Clipboard** to copy the report
5. Paste into your patient record system

### Auto-Triggers

Certain selections automatically check related items for consistency:

- Selecting **atriumfibrilleren** → auto-selects Grade 3 + "send strips"
- Selecting **VT** → auto-selects Grade 3 + "send strips"
- Selecting **Geen ritmestoornissen** → auto-selects Grade 1

### Grade Exclusivity

- Selecting Grade 3 unchecks Grade 2 and Grade 1
- Selecting Grade 2 unchecks Grade 1
- Unchecking both Grade 2 and Grade 3 also unchecks "send strips"

## Tech Stack

- Vanilla HTML, CSS, JavaScript — no frameworks, no build tools, no dependencies
- No server required — runs entirely in the browser

## File Structure

| File | Purpose |
|---|---|
| `index.html` | Main page with layout and grading guidelines |
| `disclaimer.html` | Medical disclaimer page |
| `style.css` | Flexbox layout and category color styling |
| `script_new.js` | Core logic: data model, triggers, copy/reset |
| `teksten.md` | Reference list of text snippets |
| `onderschrift.md` | Grading guidelines ("Beoordelingswijzer") |

## Limitations

- **Not a medical device** — This tool is an aid for report generation, not a diagnostic instrument. Clinical judgment always takes precedence.
- **No data storage** — Nothing is saved. Refreshing the page clears all selections.
- **No user accounts** — Single-user tool with no authentication or multi-user support.
- **No server component** — All logic runs client-side. The generated report must be manually copied and pasted.
- **Predefined options only** — Custom findings cannot be added through the UI. Text options are hardcoded in `script_new.js`.
- **No offline PWA support** — Requires a browser but no internet connection (except for Google Analytics).
- **Dutch language only** — All interface text and clinical content is in Dutch.

## Disclaimer

This website is intended exclusively for use by medical professionals. See the full [disclaimer](disclaimer.html) for liability and usage terms.
