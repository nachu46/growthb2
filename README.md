# Growth International L.L.C. — GCC B2B Industrial Supply Platform

Website and admin panel for **Growth International L.L.C.**, a supplier of industrial thermal insulation, metal jacketing, acoustic and refractory materials across the GCC (UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman).

It runs as a single Node.js app with a local SQLite database: no external services or environment variables are required.

---

## Features

### Public website

| Page | What it does |
| :--- | :--- |
| **Home** (`/`) | Hero, live GCC hub map, category filters, bulk quote widget, moving vendor-logo and supply-partner carousels, resource hub. |
| **Products** (`/products`) | Category cards and a filterable **Master Industrial Catalog** (category, industry, EPC approval, manufacturer, search). Filters collapse into dropdowns on phones. |
| **Product detail** (`/products/[slug]`) | Specs, fabrication forms, thicknesses, stock level and hub, test properties, linked documents, add to RFQ. |
| **Industries** (`/industries`) | Pre-vetted material assemblies per industry. |
| **Services** (`/services`) | In-house fabrication capabilities. |
| **Tech Resources** (`/resources`) | Document library with folders, search, multi-select download and paging. |
| **Certifications** (`/certifications`) | Vendor registrations, ISO / ICV and project history. |

- **RFQ basket**: shared across pages and kept after refresh. Requests go to WhatsApp and are also saved for the admin.
- **BOM upload**: customers upload `.xlsx/.xls/.csv/.pdf/.dwg` files with email and delivery quarter. The files are private to admins.
- **SEO**: location-focused titles and descriptions, schema.org Organization + LocalBusiness for each GCC hub, Product data on product pages, `sitemap.xml` and `robots.txt`.
- **Responsive** from 375px phones to wide desktops.

### Admin panel (`/admin`)

| Section | Purpose |
| :--- | :--- |
| **Dashboard** | Website traffic (visitors, page views, daily chart, top pages, sources, devices; 7/30/90 days), enquiries and content counts. |
| **Company Logos / Supply Partners** | Logos and partner chips shown in the home carousels. |
| **Products Catalog** | Products with manufacturer, stock level and hub, badges, forms, thicknesses, test properties, image. |
| **Categories** | Material categories with items and card image. They drive the website's category cards, filters and Products menu. |
| **Certifications / Project History** | Content of the Certifications page. |
| **Technical Resources** | Upload documents into library folders. Link a document to a product to show it on that product's page. |
| **GCC Locations** | Hub status, phone, stock and dispatch text on the map. |
| **Customer RFQs / BOM Submissions** | Incoming enquiries and uploaded BOM files. |
| **Audit Logs** | Every admin change. |

Visitor analytics run on your own server. They use no cookies and store no IP addresses (visitors are an anonymous daily hash), and they ignore bots and admin pages.

---

## Technology

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | CSS variables + inline styles / styled-jsx (`src/app/globals.css`), Inter font (self-hosted) |
| Database | SQLite via `better-sqlite3` (WAL mode), file `data/growth_b2b.db` |
| Uploads | `data/uploads/`, served by `src/app/uploads/[...path]/route.ts` |
| Auth | `bcryptjs` password hash + signed HTTP-only session cookie |
| Icons | Lucide React |

---

## Project structure

```
growth-international-b2b/
├── data/                      # Created on first start (not in Git)
│   ├── growth_b2b.db          # SQLite database
│   ├── uploads/               # Uploaded logos, documents, category images, BOM files
│   ├── admin-credentials.txt  # Generated admin login (first start only)
│   └── .session-secret        # Generated session signing key
├── public/                    # Static assets (logos, emblem, favicon)
├── src/
│   ├── app/
│   │   ├── admin/             # Admin pages (dashboard, products, categories, resources, ...)
│   │   ├── api/               # REST API (public routes + /api/admin/* protected routes)
│   │   ├── products/ industries/ certifications/ services/ resources/
│   │   ├── uploads/[...path]/ # Serves uploaded files (BOM files admin-only)
│   │   ├── sitemap.ts robots.ts
│   │   └── layout.tsx         # Root layout, SEO metadata, analytics tracker
│   ├── components/            # UI components (Navbar, catalog, carousels, modals, ...)
│   ├── data/                  # Default content and shared types
│   ├── hooks/                 # useCatalogProducts, useCategories, useRfqQueue
│   └── lib/                   # db, auth, storage, rate limiting, products, seo
├── DEPLOY.md                  # Server deployment guide (Contabo / Ubuntu)
├── ecosystem.config.js        # PM2 process file
└── package.json
```

---

## Local setup

Requires **Node.js 20+**.

```bash
git clone https://github.com/nachu46/growthb2.git
cd growthb2
npm install
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin

On first start the database is created and filled with starter content. An admin account is created with a **random password**, saved in:

```bash
cat data/admin-credentials.txt
```

Production build:

```bash
npm run build
npm start
```

---

## Deployment

Use a VPS (e.g. Contabo) with a persistent disk. Full steps are in **[DEPLOY.md](DEPLOY.md)**: Node + PM2, Nginx + HTTPS, updates, backups and Google setup.

Updating a live server:

```bash
git pull
npm ci
npm run build
pm2 restart growth-b2b
```

Serverless hosts such as Vercel are **not** suitable: the SQLite database and uploads need a disk that persists.

### Optional environment variables

None are required.

| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Live domain used for SEO links and the sitemap (default `https://www.growthme.com`). Set before building. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin account (only used when the database is created). |
| `ADMIN_JWT_SECRET` | Session signing key (default: generated in `data/.session-secret`). |

---

## Backups

Everything that changes lives in `data/`: back up that folder (see DEPLOY.md for a nightly cron example).

---

## License

Copyright © 2026 Growth International L.L.C. All rights reserved.
