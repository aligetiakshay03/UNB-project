# UNB Web Application — Reference Audit

## Date: 2026-08-16
## Phase: 0 — Discovery & Reference Audit

---

## 1. References Inspected

### 1.1 Client-Supplied PDF Blueprint
- **Type**: Primary visual direction
- **Pages covered**: Home, About Us, Brands/Products
- **Status**: Reviewed in full
- **Key findings**:
  - UNB (United National Breweries) branding with yellow triangle emblem logo
  - Pretoria Head Office, South Africa (+27 11 990 6300)
  - Deep navy blue + warm golden amber color scheme
  - Image-heavy corporate sections with full-width hero banners
  - Top utility bar (navy) + white main navigation bar
  - Footer in full navy blue with logo, tagline, quick links, brands, contact info
  - Age-appropriate content (traditional African beers, sorghum beverages)

### 1.2 Delta Corporation Website (delta.co.zw)
- **Type**: Structural reference (sister/parent company)
- **Status**: Inspected — Home, About, Brands, Contact, Sustainability pages
- **Key findings**:
  - WordPress-based site with age gate (alcohol industry)
  - Navigation: Home, About Us, Brands, Sustainability, Investors, News, Contact
  - Uses Barlow + Roboto fonts
  - Brand cards use popup modals for detail views
  - Contact page has Contact Form 7 with name, email, phone, message
  - Sustainability page exists with environmental commitment content
  - Careers page returns 404 (not currently active on Delta site)

### 1.3 21st.dev MCP
- **Type**: UI component library reference
- **Status**: Inspected
- **Usage**: Development aid for React component patterns (cards, forms, layout)
- **Note**: Do NOT copy components blindly. Use for pattern inspiration only.

### 1.4 UI/UX Pro Max Skill (GitHub)
- **Type**: Design intelligence reference
- **Description**: "An AI skill that provides design intelligence for building professional UI/UX across multiple platforms"
- **Usage**: UX/design guidance for professional patterns
- **Note**: Subordinate to client PDF in all visual decisions.

---

## 2. Page Map

| Route | Page | Source | Dynamic Content |
|-------|------|--------|-----------------|
| `/` | Home | PDF Page 1 | Featured brands, latest news, careers teaser |
| `/about` | About Us | PDF Page 2 | Static (company overview, vision, mission, values, heritage, partnerships, policies) |
| `/sustainability` | Sustainability | System Design | Static with placeholders — `[CLIENT TO PROVIDE]` |
| `/brands` | Brands / Products | PDF Page 3 | Product listing from database |
| `/brands/:slug` | Brand/Product Detail | System Design | Product detail + variants from database |
| `/careers` | Careers | System Design | Job listing from database |
| `/careers/:slug` | Job Detail | System Design | Job detail from database |
| `/news` | News & Media | System Design | News listing from database |
| `/news/:slug` | News Detail | System Design | News article from database |
| `/contact` | Contact Us | System Design | Enquiry form |
| `/admin` | Admin Dashboard | System Design | Protected CMS |
| `/admin/login` | Admin Login | System Design | Authentication |
| `/admin/products` | Product Management | System Design | CRUD |
| `/admin/news` | News Management | System Design | CRUD |
| `/admin/careers` | Career Management | System Design | CRUD |
| `/admin/applications` | Application Viewer | System Design | Read-only with CV download |
| `/admin/enquiries` | Enquiry Viewer | System Design | Read-only |

---

## 3. Component Map

### Shared / Layout
| Component | Description | Used On |
|-----------|-------------|---------|
| `UtilityBar` | Navy top bar with email, phone, social links | All public pages |
| `Navbar` | White main nav with UNB logo + page links | All public pages |
| `Footer` | Navy footer with logo, tagline, quick links, brands, contact, legal | All public pages |
| `PageHero` | Full-width hero section with background image, heading, subtext, CTAs | Home, About, Brands, Sustainability, Careers, News, Contact |
| `SectionHeader` | Section title + optional subtitle | Multiple pages |
| `CTABanner` | Full-width golden/amber banner with text + button | Home (Get In Touch), Brands (Looking for a product?) |
| `Layout` | Public page shell (UtilityBar + Navbar + content + Footer) | All public pages |
| `AdminLayout` | Admin sidebar + content area | All admin pages |

### Content Components
| Component | Description | Used On |
|-----------|-------------|---------|
| `ProductCard` | Product image + name + short description | Home, Brands |
| `ProductVariantCard` | Variant image + name + description | Brand Detail |
| `NewsCard` | Featured image + date + title + summary | Home, News |
| `JobCard` | Title + location + type + closing date | Careers |
| `ValueCard` | Icon + title + description | About (Values grid) |
| `FeatureBlock` | Image + heading + text (alternating layout) | About (Heritage, Partnerships, Policies) |

### Form Components
| Component | Description | Used On |
|-----------|-------------|---------|
| `FormInput` | Text/email/phone input with label + validation | Contact, Application |
| `FormTextarea` | Multi-line text input | Contact, Application |
| `FormSelect` | Dropdown select | Contact (enquiry type) |
| `FileUpload` | CV/document upload with type/size validation | Application |
| `FormButton` | Submit button with loading state | Contact, Application |

### State Components
| Component | Description |
|-----------|-------------|
| `LoadingSpinner` | Loading indicator for async data |
| `EmptyState` | No results / no content message |
| `ErrorState` | Error message with retry action |
| `SuccessMessage` | Form submission confirmation |

---

## 4. Content Inventory from PDF

### Home Page (PDF Page 1)
- Hero: "Celebrating African Brewing Heritage" + subtext + 2 CTAs
- About teaser: "Rooted in Tradition" + company story + lifestyle photo
- Featured brands: 4 cards (Chibuku, Ijuba, Leopard, Ukhozi Mageu)
- Sustainability banner: "Brewing a Better Tomorrow" + CTA
- Careers teaser: "Grow With Us" + brewery worker portrait + CTA
- News section: "Latest News" + 2 article previews
- CTA strip: Golden "Get In Touch" banner
- Footer: Full layout

### About Us Page (PDF Page 2)
- Hero: "Rooted in Heritage. Focused on the Future."
- Our Story: Executive overview + brewery photo
- Brand statement banner: Dark wood grain background
- Vision & Mission: Dual cards with circular icons
- Values: 6-card grid with custom icons
- Heritage: "Celebrating Generations of African Brewing Tradition"
- Partnerships: "Stronger Together"
- Policies & Principles: "Guided by Responsibility"

### Brands Page (PDF Page 3)
- Hero: "A Portfolio of Traditional African Beverages"
- Sorghum Beverages section: 4 product cards
  - 1L Cartons (value format)
  - 2L Sharing Packs (smooth, rich)
  - Extra Range (lightly carbonated)
  - Chibuku Super (flagship carbonated sorghum beer)
- Non-Alcoholic section: Ukhozi Mageu showcase
  - 3 flavors: Banana, Cream, Mabele
  - Benefits checklist: Refreshing, Nourishing, Traditionally Loved
- Search CTA: "Looking for a specific brand or product?" + button

---

## 5. Visual Design Tokens Extracted

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-navy` | `#132B5B` | Headers, nav, footer, dark sections |
| `--color-navy-dark` | `#1B365D` | Alternate navy for depth |
| `--color-amber` | `#D99B26` | CTAs, accents, badges |
| `--color-amber-light` | `#E5A323` | Hover states, highlights |
| `--color-sand` | `#F7F6F2` | Section backgrounds |
| `--color-white` | `#FFFFFF` | Card backgrounds, text on dark |
| `--color-charcoal` | `#1E2229` | Body text, heavy headings |
| `--color-muted` | `#6B7280` | Secondary text |

### Typography (observed from PDF)
- Headings: Sans-serif, bold/semibold, likely similar to Barlow or similar geometric sans
- Body: Clean sans-serif, regular weight
- Specific fonts to be confirmed — using Barlow + Roboto as fallback (matching Delta reference)

### Spacing
- Section padding: ~80px–100px vertical on desktop
- Card grid gap: ~24px–32px
- Container max-width: ~1200px

### Breakpoints
| Name | Width |
|------|-------|
| Mobile | ≤ 480px |
| Tablet | ≤ 768px |
| Laptop | ≤ 1024px |
| Desktop | > 1024px |

---

## 6. Technical Patterns from References

### From Delta (delta.co.zw)
- Age gate for alcohol content (UNB may need this — client to confirm)
- Popup-based brand detail (UNB PDF suggests full pages instead)
- Contact Form 7 pattern: name, email, phone, message
- Google Analytics / GTM integration

### From 21st.dev
- Clean component architecture with sidebar navigation
- Loading skeleton patterns (shimmer placeholders)
- Consistent spacing and border-radius tokens
- Dark/light theme infrastructure (not required for UNB v1)

### From UI/UX Pro Max
- Professional design intelligence patterns
- Platform-appropriate UI conventions
- Accessible interaction patterns

---

## 7. Gaps & Missing Information

| Item | Status | Action |
|------|--------|--------|
| UNB logo assets (SVG/PNG) | Not provided | Use placeholder, mark `[CLIENT TO PROVIDE]` |
| Product images | Not provided | Use placeholder images |
| News article content | Not provided | Use placeholder content |
| Job listing data | Not provided | Use placeholder data |
| Sustainability content | Not provided | Use placeholders only — NO invented stats |
| Company statistics | Not provided | Do NOT invent |
| Age gate requirement | Unknown | Listed in open questions |
| Font license / exact fonts | Not confirmed | Use Barlow + Roboto (Google Fonts) |
| Social media URLs | Visible in PDF utility bar | Extract from PDF |
