# Home Page — Visual Verification

## Reference Source
**PDF:** `1157_UNB Website Design_v1 (003)(2).pdf` — Page 1

## Image Extraction Method
Images extracted directly from the client PDF using PyMuPDF (`pymupdf`).
All 8 images from Page 1 were extracted at their native resolution.

## Image Mapping

| Section | Semantic Filename | Source | Resolution | Status |
|---|---|---|---|---|
| Hero | `home-hero.jpg` | PDF Page 1, Image 1 | 1679×647 | ✅ Mapped |
| About | `home-about.jpg` | PDF Page 1, Image 2 | 1533×787 | ✅ Mapped |
| Brand: Chibuku | `brand-chibuku.jpg` | PDF Page 1, Image 3 | 1366×967 | ✅ Mapped |
| Brand: Ijuba | `brand-ijuba.jpg` | PDF Page 1, Image 4 | 1335×962 | ✅ Mapped |
| Brand: Leopard | `brand-leopard.jpg` | PDF Page 1, Image 5 | 1326×947 | ✅ Mapped |
| Brand: Ukhozi Mageu | `brand-ukhozi-mageu.jpg` | PDF Page 1, Image 6 | 1181×841 | ✅ Mapped |
| Sustainability | `home-sustainability.jpg` | PDF Page 1, Image 7 | 1947×730 | ✅ Mapped |
| Careers | `home-careers.jpg` | PDF Page 1, Image 8 | 1034×1016 | ✅ Mapped |

## Asset Directory
```
frontend/public/images/unb-reference/
├── home-hero.jpg
├── home-about.jpg
├── brand-chibuku.jpg
├── brand-ijuba.jpg
├── brand-leopard.jpg
├── brand-ukhozi-mageu.jpg
├── home-sustainability.jpg
└── home-careers.jpg
```

## Files Modified
- `frontend/src/pages/Home.tsx` — All 8 image `src` attributes updated
- `frontend/src/components/cards/ProductCard.tsx` — Image display updated to `object-cover` for lifestyle product shots

## CSS Treatment Applied
- **Hero:** Dark gradient overlay (`from-unb-navy/90 via-unb-navy/70 to-transparent`)
- **About:** `object-cover` with `aspect-[4/3]`
- **Brands:** `object-cover` with `h-56` container
- **Sustainability:** `object-cover` in split layout (left half)
- **Careers:** `object-cover` with `object-top` to keep the worker's face visible

## Visual Differences Remaining
- No external/placeholder images remain on the Home page
- All images are exact PDF extractions
- Layout, spacing, typography match previous corrections

## Production Asset Status

> Reference assets supplied for visual reconstruction.
> Production licensing/approval status pending client confirmation.

## Build Result
```
✓ tsc -b passed (0 errors)
✓ vite build passed (721ms)
```
