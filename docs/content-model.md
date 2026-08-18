# UNB Web Application — Content Model

## Date: 2026-08-16
## Phase: 0 — Discovery & Reference Audit

---

## 1. Analysis of Client Data

### What the PDF shows

The Brands page (PDF Page 3) presents products in two sections:

**Section 1: "Sorghum Beverages"**
- 1L Cartons — "Value-driven convenient format"
- 2L Sharing Packs — "Smooth, rich & full-bodied"
- Extra Range — "Lightly carbonated refresh"
- Chibuku Super — "UNB's flagship carbonated sorghum beer" (labeled "PREMIUM")

**Section 2: "Non-Alcoholic Beverages"**
- Ukhozi Mageu — "Traditional cultured maize drink"
  - Banana flavor
  - Cream flavor
  - Mabele flavor
  - Benefits: Refreshing, Nourishing, Traditionally Loved

**Home Page shows 4 featured brands:**
- Chibuku — "Original sorghum beer"
- Ijuba — "Premium maize beer"
- Leopard — "Crisp lager"
- Ukhozi Mageu — "Traditional cultured maize drink"

### Observations

1. The **Home page** presents items as **brands** (Chibuku, Ijuba, Leopard, Ukhozi Mageu).
2. The **Brands page** presents items by **category** (Sorghum Beverages, Non-Alcoholic) and shows what appear to be **product formats/variants** within those categories (1L, 2L, Extra, Super).
3. **Ukhozi Mageu** has **flavour variants** (Banana, Cream, Mabele).
4. The Brands page sections are grouped by **beverage category**, not by brand name.

---

## 2. Chosen Hierarchy

Based on the supplied PDF content, the hierarchy that best fits the client's actual data is:

```
Category
   ↓
Product (Brand)
   ↓
Variant (Format / Flavour)
```

### Rationale

| Structure | Fits Client Data? | Reason |
|-----------|-------------------|--------|
| `Products → Variants` (flat) | Partially | Loses the category grouping visible on the Brands page |
| `Brand → Product → Variant` | Partially | The PDF doesn't clearly separate "brand" from "product" — Chibuku is both a brand and a product |
| **`Category → Product → Variant`** | **Yes** | Matches the PDF layout: Sorghum Beverages (category) → Chibuku Super, 1L Cartons, etc. (products) → flavors/sizes (variants) |

### Why NOT Brand → Product → Variant?

The client's PDF does not establish a clear brand-level entity that contains multiple distinct products beneath it. For example:
- "Chibuku" appears as both a brand name (Home page) and as a product range (Brands page).
- "Chibuku Super" is presented alongside "1L Cartons" and "2L Sharing Packs" at the same level — they are product formats within the same category, not separate brands.

If the client later confirms that UNB operates a formal brand hierarchy (e.g., Chibuku brand → multiple product lines), the model can be adjusted. For now, we follow what the PDF actually shows.

---

## 3. Data Model

### Categories

Categories are the top-level groupings shown on the Brands page:

| Category | Description |
|----------|-------------|
| Sorghum Beverages | Traditional African sorghum-based beers |
| Non-Alcoholic Beverages | Cultured maize drinks and soft beverages |

> [!NOTE]
> Additional categories may exist (e.g., Lagers — Leopard is described as a "crisp lager" on the Home page but does not appear on the Brands page). Client confirmation required.

### Products

Products are the individual items within each category:

| Product | Category | Description |
|---------|----------|-------------|
| 1L Cartons | Sorghum Beverages | Value-driven convenient format |
| 2L Sharing Packs | Sorghum Beverages | Smooth, rich & full-bodied |
| Extra Range | Sorghum Beverages | Lightly carbonated refresh |
| Chibuku Super | Sorghum Beverages | UNB's flagship carbonated sorghum beer |
| Ukhozi Mageu | Non-Alcoholic Beverages | Traditional cultured maize drink |
| Chibuku | (Home page only) | Original sorghum beer |
| Ijuba | (Home page only) | Premium maize beer |
| Leopard | (Home page only) | Crisp lager |

### Variants

Variants are sub-items of a product (formats, sizes, or flavours):

| Variant | Product | Type |
|---------|---------|------|
| Banana | Ukhozi Mageu | Flavour |
| Cream | Ukhozi Mageu | Flavour |
| Mabele | Ukhozi Mageu | Flavour |

---

## 4. Database Tables for Content Model

```
categories
----------
id
name
slug
description
display_order
created_at
updated_at
```

```
products
--------
id
category_id       → categories.id
name
slug
short_description
description
image_url
is_featured       (for Home page showcase)
status            (DRAFT / PUBLISHED)
display_order
created_at
updated_at
```

```
product_variants
----------------
id
product_id        → products.id
name
description
image_url
display_order
created_at
updated_at
```

---

## 5. Relationship Diagram

```
CATEGORY (e.g., "Sorghum Beverages")
   │
   ├── PRODUCT (e.g., "Chibuku Super")
   │       │
   │       └── VARIANT (none for this product)
   │
   ├── PRODUCT (e.g., "1L Cartons")
   │
   └── PRODUCT (e.g., "2L Sharing Packs")

CATEGORY (e.g., "Non-Alcoholic Beverages")
   │
   └── PRODUCT (e.g., "Ukhozi Mageu")
           │
           ├── VARIANT ("Banana")
           ├── VARIANT ("Cream")
           └── VARIANT ("Mabele")
```

---

## 6. Open Questions for Client

1. Are Chibuku, Ijuba, Leopard, and Ukhozi Mageu considered **brands** or **products**? The Home page presents them differently from the Brands page.
2. Does Leopard (crisp lager) belong to a "Lagers" category, or should it be grouped under Sorghum Beverages?
3. Are there additional products or categories not shown in the PDF?
4. Should the "1L Cartons" and "2L Sharing Packs" be presented as variants of Chibuku, or as separate products?
5. Does UNB have a formal brand architecture document?
