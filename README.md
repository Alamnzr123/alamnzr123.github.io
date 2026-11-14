# alamnzr123.github.io

Personal site of **Rahmad Alamsyah Nazaruddin**, Odoo Developer (Odoo 19 Enterprise) and Full-Stack Developer.

Live: https://alamnzr123.github.io/

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step. Hosted on GitHub Pages.

- `index.html`: all page content
- `assets/css/style.css`: styles, light and dark theme
- `assets/js/main.js`: theme toggle, mobile menu, scroll reveal, pipeline drawing, timeline progress, copy email
- `assets/img/`: photo, screenshots, favicon, social preview image
- `assets/docs/`: CV (PDF)
- `anti-slop/`: design audit notes (not linked from the site)

The site follows the visitor's light or dark setting, with a toggle in the navigation.
Motion stops on its own and is turned off for visitors who prefer reduced motion.
All content stays visible if JavaScript does not load.

## Updating

- Edit text directly in `index.html`.
- Replace `assets/docs/CV_Rahmad_Alamsyah_Nazaruddin.pdf` with a new version (keep the same file name).
- Preview locally: `python3 -m http.server` and open http://localhost:8000
