# Local Nerfies template dependencies

Retrieved 2026-09-25. All assets in this directory are served locally; no Google Fonts request, analytics, JavaScript dependency, carousel, or icon library is required.

## Nerfies website styles

- Upstream: https://github.com/nerfies/nerfies.github.io
- Pinned revision: `657409a62d59a93163872c0e4921cf651b987810`
- `index.css`: exact, unmodified copy of `static/css/index.css` at that revision.
- `NERFIES-UPSTREAM-README.md`: exact upstream README, preserving its attribution and website license statement.
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), as stated in the upstream README. Full license: `CC-BY-SA-4.0.txt`. Canonical license URL: https://creativecommons.org/licenses/by-sa/4.0/
- Attribution: Nerfies website, by the Nerfies authors. The README credits Keunhong Park, Utkarsh Sinha, Jonathan T. Barron, Sofien Bouaziz, Dan B Goldman, Steven M. Seitz, and Ricardo Martin-Brualla for the associated work.
- The supplement adapts the Nerfies layout in its own HTML/CSS. Its source assets here remain unmodified. `fonts.css` supplies the local font face and replaces Google Sans references with Noto Sans.

Exact source URLs:

- https://raw.githubusercontent.com/nerfies/nerfies.github.io/657409a62d59a93163872c0e4921cf651b987810/static/css/index.css
- https://raw.githubusercontent.com/nerfies/nerfies.github.io/657409a62d59a93163872c0e4921cf651b987810/README.md
- License text from the official Creative Commons repository: https://raw.githubusercontent.com/creativecommons/cc-legal-tools-data/main/docs/licenses/by-sa/4.0/legalcode.txt

## Bulma

- `bulma.min.css`: exact, unmodified copy vendored by the Nerfies template at the pinned revision. Its banner identifies Bulma v0.9.1.
- Upstream: https://github.com/jgthms/bulma/tree/0.9.1
- License: MIT. The matching release's full license and copyright notice are in `LICENSE-BULMA.txt`.
- CSS source: https://raw.githubusercontent.com/nerfies/nerfies.github.io/657409a62d59a93163872c0e4921cf651b987810/static/css/bulma.min.css
- License source: https://raw.githubusercontent.com/jgthms/bulma/0.9.1/LICENSE

## Noto Sans

- Family: `Noto Sans`.
- `noto-sans-latin-variable.woff2`: unmodified Latin subset served by Google Fonts, versioned URL v42. A single variable font provides regular (400), semibold (600), and bold (700), as well as weights 100–900. Fontconfig inspection confirms Noto Sans with named Regular, SemiBold, and Bold instances and a variable weight range.
- License: SIL Open Font License 1.1. Full upstream notice and terms: `OFL-NOTO-SANS.txt`.
- Copyright 2022 The Noto Project Authors (https://github.com/notofonts/latin-greek-cyrillic).
- Google Fonts stylesheet used to locate the Latin font: https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap
- Exact binary source: https://fonts.gstatic.com/s/notosans/v42/o-0bIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjc5a7duw.woff2
- License source: https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/OFL.txt
- `fonts.css` is local integration CSS. It is loaded after the upstream styles so their Google Sans selectors use locally served Noto Sans. No Google Sans font is bundled.

## SHA-256 checksums

- `CC-BY-SA-4.0.txt`: `28a9529c7d0bb4dc51f4bf5c116a3d16ef247a052f7591466768ddf563fd1cf5`
- `LICENSE-BULMA.txt`: `b3dbcb1b5f4c70b4217713cf6ab0cb2971db63dd05116de92723b6810ed13ab2`
- `NERFIES-UPSTREAM-README.md`: `74ed1816a98989633658ec189efc63eb1af331ae14ab44ef5b2c2b3489fde1a9`
- `OFL-NOTO-SANS.txt`: `cee9892f9f0cc8fe882c9e9537ee6a89621d86ee7ceaf70b02e2b2b1c25c061a`
- `bulma.min.css`: `58b28659220961ead137cb5b346b5759562750ce703094d70fc786e0db467033`
- `fonts.css`: `7e9cd4670a7fb48a092f438e5b1d1bbd1b629c82b104719f8b6a18d24e3205f1`
- `index.css`: `747bae5899d9a93f21caa423e264b2b7ed7ec2b12e1f57be1a715f8103c5c744`
- `noto-sans-latin-variable.woff2`: `51ca196f49a33e79e7870ff88ebd2829a3f627a51e7d690986618f0e7ad2b52d`
