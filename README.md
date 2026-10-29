# Totally Accurate Guide to Me

DG8002 Activity 7 - TAG-Me Extreme Makeover - Stephan Kozak

A simple two-page website using HTML and one shared external CSS file.
The Week 6 biography, lists, links, and two illustrations are retained.
Week 7 adds colours, typography, spacing, borders, Flexbox, and a mobile layout.

- Website: https://kozanimator.github.io/guide-to-me/
- Classified page: https://kozanimator.github.io/guide-to-me/Classified.html
- Repository: https://github.com/Kozanimator/guide-to-me

## Files

- `index.html`: introduction, origin story, skills, and Unreal Engine link.
- `Classified.html`: fun facts, survival guide, weaknesses, and ambitions.
- `style.css`: shared appearance and responsive layout for both pages.
- `images/space-monkey.jpg`: homepage illustration.
- `images/foreverstar-comic.jpg`: Classified illustration.

## Week 7 requirements

| Requirement | Where to find it |
| --- | --- |
| External stylesheet | Both pages link to `style.css` inside `<head>`. |
| Visual identity | Navy, cream, gold, and rust colours; Georgia headings and Arial body text; consistent navigation and link states. |
| Element, class, and ID selectors | `body` and `h2`; `#main-title`; reusable `.container` and `.info-card` classes each style multiple elements. |
| Box model | `box-sizing: border-box`; margins, padding, borders, rounded corners, width, and max-width. |
| Flexbox | `.header-layout`, `nav`, `.intro-layout`, `.content-row`, and `.footer-layout`. |
| Responsive design | Flexible container/image widths and `@media (max-width: 700px)` stack content for small screens. |
| GitHub deployment | Updated in the existing `Kozanimator/guide-to-me` repository and published at the existing GitHub Pages URL. |

## Editing the website

1. Change the text in `index.html` or `Classified.html`.
2. Change colours, fonts, and spacing in `style.css`. Its comments explain the sections.
3. To replace an image, put it in `images/` and update its `src` and descriptive `alt` text in the HTML. Keep the filename's exact capitalization.
4. Keep `style.css` next to both HTML files. Open `index.html` in a browser to preview locally.
5. Upload changed files to the repository's `main` branch to update GitHub Pages.

Check both pages at viewport widths of 1200px, 768px, and 375px. Test both navigation links, image loading, keyboard focus, and the external Unreal Engine link.

## Submission

Submit these two links through D2L before the next class:

- Public repository: https://github.com/Kozanimator/guide-to-me
- Published website: https://kozanimator.github.io/guide-to-me/

This version covers all seven requirements in the Activity 7 guide. Both pages were checked at 1200px, 768px, and 375px, with working images and navigation and no horizontal content overflow.
