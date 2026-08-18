# Visual Verification

## Home Page
**Reference:** PDF Page 1
**Differences (Initial state vs PDF):**
- Wrong primary colors (used generic `#132B5B` and `#D99B26` hexes scattered instead of global Tailwind tokens).
- Fake CSS logo instead of placeholder.
- Badges ("HERITAGE & QUALITY", "SORGHUM BEER", etc.) used arbitrarily, not in PDF.
- Background image for hero was a pub instead of agricultural/African heritage.
- About section used a tourist/stock image instead of African community image.
- About section had decorative background blur/shadow elements not in PDF.
- Brands section had category tags on cards, not in PDF.
- Brands section used colored gradients and shadows.
- Sustainability section was a full-width background banner instead of a split layout (Left image, Right deep navy block).
- Careers/News used heavy shadows and colored background boxes, whereas PDF used a cleaner look (News had a left blue border).
- Footer had a fake CSS logo, and was missing the Age Gate / Drink Responsibly banner.
- Button styles had rounded corners and drop shadows.

**Corrections:**
- Created global Tailwind v4 tokens (`unb-navy`, `unb-amber`, `unb-sand`).
- Replaced fake logo with a generic placeholder box marked "Logo Placeholder".
- Removed all arbitrary badges (Hero, Brands, News).
- Replaced Hero image with a sorghum/agricultural placeholder.
- Replaced About image with an African community placeholder, removed blur effects.
- Updated Brands cards to match the cleaner PDF style, removed tags, used neutral placeholders.
- Rebuilt Sustainability as a split layout matching the PDF.
- Rebuilt News list to use the left border style from the PDF, removed background boxes.
- Added Age Gate banner to the bottom of the Footer, replaced Footer logo.
- Flattened UI elements (removed rounded corners and drop shadows from CTA and buttons).

## About Us Page
**Reference:** PDF Page 2
- **Hero Banner**: `/images/unb-reference/about-hero.jpg` (Farmer in sorghum field at sunrise)
- **Our Story / Facility**: `/images/unb-reference/about-facility.jpg` (UNB Brewery plant and silos)
- **Our Heritage**: `/images/unb-reference/about-heritage.jpg` (Traditional calabash, sorghum grains, and dried sorghum)
- **Partnerships**: `/images/unb-reference/about-partnerships.jpg` (Handshake in sorghum field with delivery truck)
- **Policies & Principles**: `/images/unb-reference/about-governance.jpg` (Our Policies & Principles book and notebooks)
- **Status**: ✅ All 5 reference photos mapped from PDF Page 2.

## Brands Page
**Reference:** PDF Page 3
- **Brands Hero**: `/images/unb-reference/brands-hero.jpg` (Calabash beer with community gathering at sunset)
- **Sorghum Products Grid**:
  - 1L Cartons: `/images/unb-reference/brand-chibuku.jpg`
  - 2L Sharing Packs: `/images/unb-reference/brand-ijuba.jpg`
  - Extra Range: `/images/unb-reference/brand-leopard.jpg`
  - Chibuku Super: `/images/unb-reference/brand-chibuku.jpg`
- **Ukhozi Mageu Featured Showcase**: `/images/unb-reference/brands-ukhozi-feature.jpg` (Banana, Cream, and Mabele 1L packaging showcase)
- **Status**: ✅ All reference photos mapped from PDF Page 3.
