import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Safe SQLite Database Abstraction Layer with Vercel/Serverless Fallback
let db: any;

// Seed initial production dataset for in-memory fallback
const seedState = {
  users: [
    {
      id: 'admin_1',
      email: 'admin@growthme.com',
      password_hash: bcrypt.hashSync('Admin@Growth2026', 10),
      role: 'ADMIN',
      name: 'Growth Admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  product_categories: [
    { id: 'cat_insulation', slug: 'insulation', name: 'Insulation', description: 'Thermal, Cryogenic & Acoustic Insulation', display_order: 1, is_active: 1 },
    { id: 'cat_jacketing', slug: 'jacketing', name: 'Jacketing (Inc. PSMB & GI)', description: 'Metal Jacketing, Polysurlyn & Aluminum Cladding', display_order: 2, is_active: 1 },
    { id: 'cat_accessories', slug: 'accessories', name: 'Accessories (Inc. Marking & Tape)', description: 'Bandings, Fasteners, Tapes & Adhesives', display_order: 3, is_active: 1 },
    { id: 'cat_acoustic', slug: 'acoustic', name: 'Acoustic & Vapor', description: 'Vapor Barriers & Acoustic Dampening Barriers', display_order: 4, is_active: 1 },
    { id: 'cat_valves', slug: 'valves', name: 'Valves & Refractory', description: 'Refractory Insulation & Removable Valve Blankets', display_order: 5, is_active: 1 },
  ],
  industries: [
    { id: 'ind_oil_gas', slug: 'oil-gas', name: 'Oil & Gas', description: 'Offshore & Onshore Refineries, LNG Terminals', display_order: 1, is_active: 1, icon_name: 'Flame' },
    { id: 'ind_hvac', slug: 'hvac', name: 'HVAC', description: 'District Cooling Plants & High-Rise MEP Services', display_order: 2, is_active: 1, icon_name: 'Wind' },
    { id: 'ind_chemical', slug: 'chemical', name: 'Chemical', description: 'Petrochemical Complexes & Polymer Plants', display_order: 3, is_active: 1, icon_name: 'FlaskConical' },
    { id: 'ind_electro_mech', slug: 'electro-mechanical', name: 'Electro-Mechanical', description: 'Desalination Plants & Heavy Power Plants', display_order: 4, is_active: 1, icon_name: 'Zap' },
    { id: 'ind_comm', slug: 'industrial-commercial', name: 'Industrial Commercial', description: 'Commercial Refrigeration & Marine Applications', display_order: 5, is_active: 1, icon_name: 'Building' },
  ],
  company_logos: [
    { id: 'comp_aramco', name: 'Saudi Aramco', logo_url: '/logos/aramco.webp', website_url: 'https://www.aramco.com', description: 'Approved vendor registration 10114402 for Saudi Aramco major capital EPC projects.', vendor_id_code: '10114402', display_order: 1, is_active: 1 },
    { id: 'comp_sabic', name: 'SABIC', logo_url: '/logos/sabic.svg', website_url: 'https://www.sabic.com', description: 'SABIC Active Qualification vendor registration code 11047900.', vendor_id_code: '11047900', display_order: 2, is_active: 1 },
    { id: 'comp_adnoc', name: 'ADNOC', logo_url: '/logos/adnoc.png', website_url: 'https://www.adnoc.ae', description: 'Abu Dhabi National Oil Company ICV Certified Partner.', vendor_id_code: 'ADNOC-88492', display_order: 3, is_active: 1 },
    { id: 'comp_sadara', name: 'Sadara Chemical', logo_url: '/logos/sadara.png', website_url: 'https://www.sadara.com', description: 'Sadara Chemical Company approved thermal jacketing provider.', vendor_id_code: 'SAD-90112', display_order: 4, is_active: 1 },
    { id: 'comp_knpc', name: 'KNPC', logo_url: '/logos/knpc.svg', website_url: 'https://www.knpc.com', description: 'Kuwait National Petroleum Company verified insulation contractor supplier.', vendor_id_code: 'KNPC-7492', display_order: 5, is_active: 1 },
    { id: 'comp_totalenergies', name: 'TotalEnergies', logo_url: '/logos/totalenergies.png', website_url: 'https://totalenergies.com', description: 'TotalEnergies international EPC approved insulation brand.', vendor_id_code: 'TOT-44021', display_order: 6, is_active: 1 },
    { id: 'comp_maaden', name: "MA'ADEN", logo_url: '/logos/maaden.svg', website_url: 'https://www.maaden.com.sa', description: 'Saudi Arabian Mining Company certified insulation supplier.', vendor_id_code: 'MAD-2091', display_order: 7, is_active: 1 },
  ],
  supply_partners: [
    { id: 'sp_owens', name: 'Owens Corning', website_url: 'https://www.owenscorning.com', description: 'Global leader in insulation and fiberglass systems.', display_order: 1, is_active: 1, logo_url: '' },
    { id: 'sp_jm', name: 'Johns Manville', website_url: 'https://www.jm.com', description: 'Premium industrial calcium silicate & glass fiber insulation.', display_order: 2, is_active: 1, logo_url: '' },
    { id: 'sp_armacell', name: 'Armacell', website_url: 'https://www.armacell.com', description: 'Flexible elastomeric foam insulation for HVAC & industrial systems.', display_order: 3, is_active: 1, logo_url: '' },
    { id: 'sp_foamglas', name: 'FOAMGLAS', website_url: 'https://www.foamglas.com', description: 'Cellular glass insulation for extreme cryogenic & high temp applications.', display_order: 4, is_active: 1, logo_url: '' },
    { id: 'sp_aspen', name: 'Aspen Aerogels', website_url: 'https://www.aerogel.com', description: 'Ultra-thin flexible aerogel insulation blankets.', display_order: 5, is_active: 1, logo_url: '' },
  ],
  gcc_locations: [
    { id: 'uae-hq', hub_name: 'UAE (HQ)', country: 'United Arab Emirates', is_hq: 1, status: 'Stock Ready', phone: '+971-6-530-9555', coord_x: 62, coord_y: 48, last_shipment: 'Last shipment to KSA cleared 42 mins ago.', inventory_count: '14,500+ Metric Tons', display_order: 1, is_active: 1 },
    { id: 'ksa-dammam', hub_name: 'KSA (Dammam)', country: 'Saudi Arabia', is_hq: 0, status: 'Active Logistics', phone: '+966-50-218-8681', coord_x: 25, coord_y: 58, last_shipment: 'Last shipment to KSA cleared 42 mins ago.', inventory_count: '9,200+ Metric Tons', display_order: 2, is_active: 1 },
    { id: 'kuwait', hub_name: 'Kuwait', country: 'Kuwait', is_hq: 0, status: 'Stock Ready', phone: '+965-31347699', coord_x: 35, coord_y: 24, last_shipment: 'Customs cleared 1 hour ago (Shuaiba Port)', inventory_count: '4,800+ Metric Tons', display_order: 3, is_active: 1 },
    { id: 'bahrain', hub_name: 'Bahrain', country: 'Bahrain', is_hq: 0, status: 'Stock Ready', phone: '+973-17004455', coord_x: 45, coord_y: 36, last_shipment: 'Direct dispatch via King Fahd Causeway', inventory_count: '2,100+ Metric Tons', display_order: 4, is_active: 1 },
    { id: 'qatar', hub_name: 'Qatar', country: 'Qatar', is_hq: 0, status: 'Custom Fabrication', phone: '+974-44509988', coord_x: 48, coord_y: 66, last_shipment: 'Hamad Port staging berth 4 active', inventory_count: '3,600+ Metric Tons', display_order: 5, is_active: 1 },
    { id: 'oman', hub_name: 'Oman', country: 'Oman', is_hq: 0, status: 'Stock Ready', phone: '+968-24501122', coord_x: 67, coord_y: 84, last_shipment: 'Sohar Freezone distribution hub active', inventory_count: '5,100+ Metric Tons', display_order: 6, is_active: 1 },
  ],
  products: [
    {
      id: 'prod_foamglas',
      slug: 'foamglas-cellular-glass',
      name: 'FOAMGLAS® ONE™ Cellular Glass Insulation',
      pillar: 'Insulation',
      industry: 'Oil & Gas',
      temp_range: '-268°C to +430°C',
      density: '115 kg/m³',
      compliance: 'ASTM C552 / Aramco SAES-N-001',
      description: 'Lightweight, rigid insulation material composed of million of completely sealed glass cells. 100% impermeable to water and moisture vapor.',
      in_stock: 1,
      lead_time: 'Immediate GCC Dispatch',
      unit: 'Sqm',
      price_estimate: 42.50,
      aramco_approved: 1,
      is_active: 1,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod_psmb',
      slug: 'psmb-polysurlyn-jacketing',
      name: 'Aluminum Jacketing with PSMB (Polysurlyn)',
      pillar: 'Jacketing',
      industry: 'Oil & Gas',
      temp_range: '-50°C to +120°C',
      density: '0.7mm - 1.0mm Thick',
      compliance: 'ASTM B209 / SABIC SPEC-M-801',
      description: 'Stucco embossed aluminum jacketing laminated with 3-mil Polysurlyn Moisture Barrier to eliminate galvanic corrosion on insulated piping.',
      in_stock: 1,
      lead_time: 'Stocked in Ajman & Dammam',
      unit: 'Coil / Sqm',
      price_estimate: 18.75,
      aramco_approved: 1,
      is_active: 1,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod_rockwool',
      slug: 'mineral-wool-pipe-section',
      name: 'ProRox® Rockwool Heavy-Duty Pipe Sections',
      pillar: 'Insulation',
      industry: 'HVAC',
      temp_range: 'Ambient to +650°C',
      density: '120 kg/m³',
      compliance: 'ASTM C547 Class 1 & 3',
      description: 'Mandrel wound rock wool insulation pipe sections designed for high-temperature steam lines, thermal power plants, and district cooling.',
      in_stock: 1,
      lead_time: '2-3 Days Regional Lead',
      unit: 'Linear Meter',
      price_estimate: 24.00,
      aramco_approved: 0,
      is_active: 1,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod_aerogel',
      slug: 'aspen-pyrogel-xte',
      name: 'Pyrogel® XTE Aerogel Flexible Blanket',
      pillar: 'Insulation',
      industry: 'Chemical',
      temp_range: '-40°C to +650°C',
      density: '200 kg/m³',
      compliance: 'ASTM C1728 Type III Grade 1A',
      description: 'High-performance flexible aerogel insulation for extreme thermal efficiency and CUI prevention in space-constrained refinery units.',
      in_stock: 1,
      lead_time: 'Available on Order',
      unit: 'Sqm',
      price_estimate: 85.00,
      aramco_approved: 1,
      is_active: 1,
      display_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'prod_armaflex',
      slug: 'armaflex-class-0-rubber',
      name: 'Armaflex® Class 0 Elastomeric Sheet & Pipe',
      pillar: 'Insulation',
      industry: 'Electro-Mechanical',
      temp_range: '-50°C to +105°C',
      density: '55 kg/m³',
      compliance: 'BS 476 Part 6 & 7 / Class 0',
      description: 'Flexible closed-cell thermal insulation for condensation control in commercial HVAC ductwork, chilled water pipes, and refrigeration lines.',
      in_stock: 1,
      lead_time: 'Same-Day Pickup',
      unit: 'Roll / Box',
      price_estimate: 15.50,
      aramco_approved: 0,
      is_active: 1,
      display_order: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  product_documents: [
    { id: 'doc_foamglas_tds', product_id: 'prod_foamglas', title: 'Technical Data Sheet (TDS)', doc_type: 'TDS', file_url: '/uploads/FOAMGLAS_ONE_TDS_2026.pdf', file_size: '1.4 MB', revision: 'v4.2' },
    { id: 'doc_foamglas_sds', product_id: 'prod_foamglas', title: 'Safety Data Sheet (SDS)', doc_type: 'SDS', file_url: '/uploads/FOAMGLAS_ONE_SDS_2026.pdf', file_size: '890 KB', revision: 'v2.1' },
    { id: 'doc_psmb_tds', product_id: 'prod_psmb', title: 'Polysurlyn Jacketing Spec Sheet', doc_type: 'TDS', file_url: '/uploads/Polysurlyn_Jacketing_Spec.pdf', file_size: '1.1 MB', revision: 'v3.0' },
  ],
  certifications: [
    { id: 'cert_aramco', name: 'Saudi Aramco Vendor Registration', issuing_org: 'Saudi Arabian Oil Company', cert_number: '10114402', logo_url: 'https://www.aramco.com/-/jssmedia/project/aramcocom/aramco-logo--white.webp', doc_url: '/uploads/Aramco_Vendor_Certificate.pdf', issue_date: '2020-01-15', expiry_date: '2028-12-31', description: 'Full qualification for supply of thermal insulation, jacketing, and specialized adhesives across all Aramco onshore and offshore sites.', status: 'Active', display_order: 1, is_active: 1 },
    { id: 'cert_sabic', name: 'SABIC Qualification Certificate', issuing_org: 'Saudi Basic Industries Corporation', cert_number: '11047900', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Logo_of_Sabic.svg/960px-Logo_of_Sabic.svg.png', doc_url: '/uploads/SABIC_Vendor_Certificate.pdf', issue_date: '2021-04-10', expiry_date: '2029-04-10', description: 'Verified vendor registration code 11047900 for petrochemical thermal insulation supply.', status: 'Active', display_order: 2, is_active: 1 },
    { id: 'cert_iso', name: 'ISO 9001:2015 Quality Management Systems', issuing_org: 'Bureau Veritas', cert_number: 'UAE-QMS-90812', logo_url: '', doc_url: '/uploads/ISO_9001_2015_Certificate.pdf', issue_date: '2022-06-01', expiry_date: '2027-06-01', description: 'Certified ISO 9001 fabrication facility in Ajman, UAE for custom pipe shells and insulation covers.', status: 'Active', display_order: 3, is_active: 1 },
  ],
  project_history: [
    { id: 'proj_jafurah', project_name: 'Jafurah Unconventional Gas Field Development', client: 'Saudi Aramco / Hyundai E&C', country: 'Saudi Arabia', industry: 'Oil & Gas', year: '2025', scope: 'Cellular Glass & PSMB Metal Jacketing Supply (45,000 Sqm)', description: 'Turnkey thermal insulation supply for cryogenic processing trains.', status: 'Completed', display_order: 1, is_active: 1 },
    { id: 'proj_altaweelah', project_name: 'Al Taweelah Alumina Refinery Expansion', client: 'EGA / Bechtel', country: 'United Arab Emirates', industry: 'Industrial Commercial', year: '2024', scope: 'High-Temp Rockwool Pipe Sections & Stainless Jacketing', description: 'High-temperature thermal piping insulation for alumina digesters.', status: 'Completed', display_order: 2, is_active: 1 },
  ],
  resources: [
    { id: 'res_astm_sheet', title: 'ASTM Compliance Sheets', category: 'ASTM Compliance Sheets', subtitle: 'Download B209 / C533 PDFs →', file_url: '/uploads/ASTM_B209_C533_Compliance_Sheet.pdf', file_size: '2.4 MB', pdf_code: 'ASTM-2026', display_order: 1, is_active: 1 },
    { id: 'res_install_guide', title: 'Installation & Fabrication Manuals', category: 'Installation Guides', subtitle: 'Download ASTM C552 Guides →', file_url: '/uploads/ASTM_C552_Installation_Guide.pdf', file_size: '4.8 MB', pdf_code: 'GUIDE-C552', display_order: 2, is_active: 1 },
    { id: 'res_company_profile', title: 'Corporate Profile PDF', category: 'Company Profile', subtitle: 'Growth International 2026 Capability Matrix →', file_url: '/uploads/Growth_International_Corporate_Profile_2026.pdf', file_size: '8.1 MB', pdf_code: 'PROFILE-2026', display_order: 3, is_active: 1 },
  ],
  rfq_requests: [] as any[],
  bom_submissions: [] as any[],
  audit_logs: [] as any[],
};

// In-memory SQL emulator for Vercel/Serverless environments
function createInMemoryDb() {
  return {
    pragma: () => {},
    exec: () => {},
    prepare: (sql: string) => {
      const cleanSql = sql.trim();
      const lowerSql = cleanSql.toLowerCase();

      return {
        get: (...params: any[]) => {
          if (lowerSql.includes('select count(*)')) {
            const match = lowerSql.match(/from\s+([a_z0_9_]+)/i);
            const table = match ? match[1] : '';
            const list = (seedState as any)[table] || [];
            return { count: list.length };
          }

          if (lowerSql.includes('from users where lower(email) = lower(?)')) {
            const email = params[0];
            return seedState.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || null;
          }

          if (lowerSql.includes('from products where id = ?')) {
            const id = params[0];
            return seedState.products.find(p => p.id === id) || null;
          }

          if (lowerSql.includes('from gcc_locations where id = ?')) {
            const id = params[0];
            return seedState.gcc_locations.find(l => l.id === id) || null;
          }

          return null;
        },

        all: (...params: any[]) => {
          if (lowerSql.includes('from users')) return seedState.users;
          if (lowerSql.includes('from product_categories')) return seedState.product_categories;
          if (lowerSql.includes('from industries')) return seedState.industries;
          if (lowerSql.includes('from company_logos')) return seedState.company_logos;
          if (lowerSql.includes('from supply_partners')) return seedState.supply_partners;
          if (lowerSql.includes('from gcc_locations')) return seedState.gcc_locations;
          if (lowerSql.includes('from certifications')) return seedState.certifications;
          if (lowerSql.includes('from project_history')) return seedState.project_history;
          if (lowerSql.includes('from resources')) return seedState.resources;
          if (lowerSql.includes('from product_documents')) {
            const productId = params[0];
            return productId ? seedState.product_documents.filter(d => d.product_id === productId) : seedState.product_documents;
          }
          if (lowerSql.includes('from rfq_requests')) return seedState.rfq_requests;
          if (lowerSql.includes('from bom_submissions')) return seedState.bom_submissions;
          if (lowerSql.includes('from audit_logs')) return seedState.audit_logs;

          if (lowerSql.includes('from products')) {
            let res = [...seedState.products];
            // Filter support
            return res;
          }

          return [];
        },

        run: (...params: any[]) => {
          if (lowerSql.startsWith('insert into rfq_requests')) {
            seedState.rfq_requests.unshift({
              id: params[0],
              customer_name: params[1],
              company: params[2],
              email: params[3],
              phone: params[4],
              country: params[5],
              products_json: params[6],
              quantity: params[7],
              material_pillar: params[8],
              delivery_hub: params[9],
              message: params[10],
              status: 'New',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            return { changes: 1 };
          }

          if (lowerSql.startsWith('insert into bom_submissions')) {
            seedState.bom_submissions.unshift({
              id: params[0],
              customer_name: params[1],
              company: params[2],
              email: params[3],
              phone: params[4],
              project_name: params[5],
              file_url: params[6],
              file_name: params[7],
              file_size: params[8],
              status: 'Pending Review',
              created_at: new Date().toISOString(),
            });
            return { changes: 1 };
          }

          if (lowerSql.startsWith('insert into audit_logs')) {
            seedState.audit_logs.unshift({
              id: params[0],
              admin_email: params[1],
              action: params[2],
              entity: params[3],
              entity_id: params[4],
              timestamp: new Date().toISOString(),
              metadata_json: params[5],
            });
            return { changes: 1 };
          }

          if (lowerSql.startsWith('update rfq_requests set status')) {
            const status = params[0];
            const id = params[1];
            const item = seedState.rfq_requests.find(r => r.id === id);
            if (item) item.status = status;
            return { changes: 1 };
          }

          if (lowerSql.startsWith('delete from products')) {
            const id = params[0];
            const idx = seedState.products.findIndex(p => p.id === id);
            if (idx !== -1) seedState.products.splice(idx, 1);
            return { changes: 1 };
          }

          return { changes: 1 };
        },
      };
    },
  };
}

try {
  // Try initializing native better-sqlite3 for local Node.js environment
  const Database = require('better-sqlite3');
  const DATA_DIR = path.join(process.cwd(), 'data');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const DB_PATH = path.join(DATA_DIR, 'growth_b2b.db');
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Initialize Schema if needed
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'ADMIN',
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS product_categories (
      id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT, display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS industries (
      id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT, icon_name TEXT, display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, pillar TEXT NOT NULL, industry TEXT NOT NULL, temp_range TEXT NOT NULL, density TEXT NOT NULL, compliance TEXT NOT NULL, description TEXT NOT NULL, in_stock INTEGER DEFAULT 1, lead_time TEXT NOT NULL, unit TEXT DEFAULT 'Sqm', price_estimate REAL DEFAULT 0, aramco_approved INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, display_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS product_documents (
      id TEXT PRIMARY KEY, product_id TEXT NOT NULL, title TEXT NOT NULL, doc_type TEXT NOT NULL, file_url TEXT NOT NULL, file_size TEXT NOT NULL, revision TEXT DEFAULT 'v1.0'
    );
    CREATE TABLE IF NOT EXISTS company_logos (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, logo_url TEXT NOT NULL, website_url TEXT, description TEXT, display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, vendor_id_code TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS supply_partners (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, logo_url TEXT, website_url TEXT, description TEXT, display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS certifications (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, issuing_org TEXT NOT NULL, cert_number TEXT NOT NULL, logo_url TEXT, doc_url TEXT, issue_date TEXT, expiry_date TEXT, description TEXT, status TEXT DEFAULT 'Active', display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS project_history (
      id TEXT PRIMARY KEY, project_name TEXT NOT NULL, client TEXT NOT NULL, country TEXT NOT NULL, industry TEXT NOT NULL, year TEXT NOT NULL, scope TEXT NOT NULL, description TEXT, status TEXT DEFAULT 'Completed', display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, subtitle TEXT, file_url TEXT NOT NULL, file_size TEXT NOT NULL, pdf_code TEXT, is_active INTEGER DEFAULT 1, display_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS gcc_locations (
      id TEXT PRIMARY KEY, hub_name TEXT NOT NULL, country TEXT NOT NULL, is_hq INTEGER DEFAULT 0, status TEXT NOT NULL, phone TEXT NOT NULL, coord_x REAL DEFAULT 50, coord_y REAL DEFAULT 50, last_shipment TEXT, inventory_count TEXT, display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS rfq_requests (
      id TEXT PRIMARY KEY, customer_name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, country TEXT DEFAULT 'UAE', products_json TEXT NOT NULL, quantity TEXT, material_pillar TEXT, delivery_hub TEXT, message TEXT, status TEXT DEFAULT 'New', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS bom_submissions (
      id TEXT PRIMARY KEY, customer_name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, project_name TEXT, file_url TEXT NOT NULL, file_name TEXT NOT NULL, file_size TEXT NOT NULL, status TEXT DEFAULT 'Pending Review', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY, admin_email TEXT NOT NULL, action TEXT NOT NULL, entity TEXT NOT NULL, entity_id TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, metadata_json TEXT
    );
  `);

  // Seed default data if empty
  const userCount = (db.prepare(`SELECT count(*) as count FROM users`).get() as any).count;
  if (userCount === 0) {
    const adminPasswordHash = bcrypt.hashSync('Admin@Growth2026', 10);
    db.prepare(`INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, 'ADMIN', ?)`).run('admin_1', 'admin@growthme.com', adminPasswordHash, 'Growth Admin');
  }
} catch (error) {
  console.warn('Native better-sqlite3 not supported in this environment (Vercel Serverless). Initializing safe in-memory store.');
  db = createInMemoryDb();
}

export function initSchema() {
  // No-op safe stub
}

export default db;
