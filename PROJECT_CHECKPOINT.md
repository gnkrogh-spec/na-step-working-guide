# NA Step Working Guide — Project Checkpoint

Last updated: 2026-10-23

## Repository and live workbook
- GitHub repository: https://github.com/gnkrogh-spec/na-step-working-guide
- Live workbook: https://gnkrogh-spec.github.io/na-step-working-guide/
- Main wrapper: `index.html`
- Workbook content: `NA_Step_1_WORKING_COPY.html` and the other step HTML files
- Service worker: `sw.js`

## Current confirmed state
The user tested the latest change on an iPhone and confirmed that removing the duplicate Backup & Restore panel from the opening page worked.

Recent changes committed to the default branch:
- `index.html`: Added a separate `Restore Answers` button after the Step Twelve entry on the Table of Contents page. The button opens a file chooser for a saved NA Step Working Guide JSON backup and restores answers, notes, and saved step state across the workbook.
- `index.html`: Added a small wrapper script that removes any duplicate Backup & Restore panel from the opening/welcome screen.
- `NA_Step_1_WORKING_COPY.html`: Removed the earlier injected Backup & Restore panel that had been appearing on the opening page.
- `sw.js`: Cache version bumped to `na-step-guide-prototype-10` to refresh the published HTML.

Latest relevant commits:
- `efee8f582c9d1a5aafb85f92835dcdb64ec98d18` — hide duplicate Backup & Restore panel on opening page.
- `99885f4f031fc2542c2ac00ae4c715b8dda539aa` — refresh service worker cache.
- `c663e688a7f21f5c383e2f6fd339f479de337d56` — remove extra Backup & Restore panel from welcome/contents.
- `48914684eb2ff2717295b95bbca3ba0344f9982c` — add Restore Answers button after Table of Contents list.

## User-approved behavior to preserve
- The opening page should NOT display the large duplicate “Backup & Restore” panel with “Export My Answers” and “Restore My Answers.”
- The Table of Contents page should have a separate, simple “Restore Answers” button below the list of all 12 steps.
- Preserve the individual-step Tools button and its existing functions, including printing.
- The user wants to make additional fixes later; use this checkpoint and the current repository state as the starting point.

## Suggested next-session check
Open the live workbook on iPhone, confirm the opening page has no duplicate Backup & Restore panel, and confirm the Table of Contents has Restore Answers below Step Twelve. The user confirmed the opening-panel removal worked. Do not reintroduce the removed panel.
