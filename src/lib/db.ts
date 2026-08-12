import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'growth_b2b.db');
const db = new Database(DB_PATH);

// Enable WAL mode and foreign keys for high performance & reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema tables
export function initSchema() {
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
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS industries (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      icon_name TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      pillar TEXT NOT NULL,
      industry TEXT NOT NULL,
      temp_range TEXT NOT NULL,
      density TEXT NOT NULL,
      compliance TEXT NOT NULL,
      description TEXT NOT NULL,
      in_stock INTEGER DEFAULT 1,
      lead_time TEXT NOT NULL,
      unit TEXT DEFAULT 'Sqm',
      price_estimate REAL DEFAULT 0,
      aramco_approved INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_documents (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      title TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size TEXT NOT NULL,
      revision TEXT DEFAULT 'v1.0',
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS company_logos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT NOT NULL,
      website_url TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      vendor_id_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS supply_partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT,
      website_url TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      issuing_org TEXT NOT NULL,
      cert_number TEXT NOT NULL,
      logo_url TEXT,
      doc_url TEXT,
      issue_date TEXT,
      expiry_date TEXT,
      description TEXT,
      status TEXT DEFAULT 'Active',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS project_history (
      id TEXT PRIMARY KEY,
      project_name TEXT NOT NULL,
      client TEXT NOT NULL,
      country TEXT NOT NULL,
      industry TEXT NOT NULL,
      year TEXT NOT NULL,
      scope TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Completed',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subtitle TEXT,
      file_url TEXT NOT NULL,
      file_size TEXT NOT NULL,
      pdf_code TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gcc_locations (
      id TEXT PRIMARY KEY,
      hub_name TEXT NOT NULL,
      country TEXT NOT NULL,
      is_hq INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      phone TEXT NOT NULL,
      coord_x REAL DEFAULT 50,
      coord_y REAL DEFAULT 50,
      last_shipment TEXT,
      inventory_count TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rfq_requests (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      country TEXT DEFAULT 'UAE',
      products_json TEXT NOT NULL,
      quantity TEXT,
      material_pillar TEXT,
      delivery_hub TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bom_submissions (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      project_name TEXT,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size TEXT NOT NULL,
      status TEXT DEFAULT 'Pending Review',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_email TEXT NOT NULL,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata_json TEXT
    );
  `);

  seedDefaultData();
}

// Seed initial production data into database if empty
function seedDefaultData() {
  // 1. Seed ADMIN user
  const userCount = (db.prepare(`SELECT count(*) as count FROM users`).get() as any).count;
  if (userCount === 0) {
    const adminPasswordHash = bcrypt.hashSync('Admin@Growth2026', 10);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, name)
      VALUES (?, ?, ?, 'ADMIN', ?)
    `).run('admin_1', 'admin@growthme.com', adminPasswordHash, 'Growth Admin');
  }

  // 2. Seed Categories
  const catCount = (db.prepare(`SELECT count(*) as count FROM product_categories`).get() as any).count;
  if (catCount === 0) {
    const categories = [
      { id: 'cat_insulation', slug: 'insulation', name: 'Insulation', description: 'Thermal, Cryogenic & Acoustic Insulation', display_order: 1 },
      { id: 'cat_jacketing', slug: 'jacketing', name: 'Jacketing (Inc. PSMB & GI)', description: 'Metal Jacketing, Polysurlyn & Aluminum Cladding', display_order: 2 },
      { id: 'cat_accessories', slug: 'accessories', name: 'Accessories (Inc. Marking & Tape)', description: 'Bandings, Fasteners, Tapes & Adhesives', display_order: 3 },
      { id: 'cat_acoustic', slug: 'acoustic', name: 'Acoustic & Vapor', description: 'Vapor Barriers & Acoustic Dampening Barriers', display_order: 4 },
      { id: 'cat_valves', slug: 'valves', name: 'Valves & Refractory', description: 'Refractory Insulation & Removable Valve Blankets', display_order: 5 },
    ];
    const stmt = db.prepare(`INSERT INTO product_categories (id, slug, name, description, display_order) VALUES (?, ?, ?, ?, ?)`);
    for (const c of categories) stmt.run(c.id, c.slug, c.name, c.description, c.display_order);
  }

  // 3. Seed Industries
  const indCount = (db.prepare(`SELECT count(*) as count FROM industries`).get() as any).count;
  if (indCount === 0) {
    const industriesList = [
      { id: 'ind_oil_gas', slug: 'oil-gas', name: 'Oil & Gas', description: 'Offshore & Onshore Refineries, LNG Terminals', display_order: 1 },
      { id: 'ind_hvac', slug: 'hvac', name: 'HVAC', description: 'District Cooling Plants & High-Rise MEP Services', display_order: 2 },
      { id: 'ind_chemical', slug: 'chemical', name: 'Chemical', description: 'Petrochemical Complexes & Polymer Plants', display_order: 3 },
      { id: 'ind_electro_mech', slug: 'electro-mechanical', name: 'Electro-Mechanical', description: 'Desalination Plants & Heavy Power Plants', display_order: 4 },
      { id: 'ind_comm', slug: 'industrial-commercial', name: 'Industrial Commercial', description: 'Commercial Refrigeration & Marine Applications', display_order: 5 },
    ];
    const stmt = db.prepare(`INSERT INTO industries (id, slug, name, description, display_order) VALUES (?, ?, ?, ?, ?)`);
    for (const item of industriesList) stmt.run(item.id, item.slug, item.name, item.description, item.display_order);
  }

  // 4. Seed Company Logos (Saudi Aramco, SABIC, ADNOC, Sadara, KNPC, TotalEnergies, MA'ADEN)
  try {
    db.exec(`
      UPDATE company_logos SET name = 'MA''ADEN', logo_url = '' WHERE id = 'comp_maaden' OR name LIKE 'MA''ADEN%';
      UPDATE company_logos SET name = 'KNPC', logo_url = '' WHERE id = 'comp_knpc' OR name LIKE 'KNPC%';
      UPDATE company_logos SET logo_url = '' WHERE id = 'comp_adnoc';
    `);
  } catch (e) {}

  const logoCount = (db.prepare(`SELECT count(*) as count FROM company_logos`).get() as any).count;
  if (logoCount === 0) {
    const companies = [
      {
        id: 'comp_aramco',
        name: 'Saudi Aramco',
        logo_url: '/logos/aramco.svg',
        website_url: 'https://www.aramco.com',
        description: 'Approved vendor registration 10114402 for Saudi Aramco major capital EPC projects.',
        vendor_id_code: '10114402',
        display_order: 1,
      },
      {
        id: 'comp_sabic',
        name: 'SABIC',
        logo_url: '/logos/sabic.svg',
        website_url: 'https://www.sabic.com',
        description: 'SABIC Active Qualification vendor registration code 11047900.',
        vendor_id_code: '11047900',
        display_order: 2,
      },
      {
        id: 'comp_adnoc',
        name: 'ADNOC',
        logo_url: '/logos/adnoc.svg',
        website_url: 'https://www.adnoc.ae',
        description: 'Abu Dhabi National Oil Company ICV Certified Partner.',
        vendor_id_code: 'ADNOC-88492',
        display_order: 3,
      },
      {
        id: 'comp_sadara',
        name: 'Sadara Chemical',
        logo_url: '/logos/sadara.svg',
        website_url: 'https://www.sadara.com',
        description: 'Sadara Chemical Company approved thermal jacketing provider.',
        vendor_id_code: 'SAD-90112',
        display_order: 4,
      },
      {
        id: 'comp_knpc',
        name: 'KNPC',
        logo_url: '/logos/knpc.svg',
        website_url: 'https://www.knpc.com',
        description: 'Kuwait National Petroleum Company verified insulation contractor supplier.',
        vendor_id_code: 'KNPC-7492',
        display_order: 5,
      },
      {
        id: 'comp_totalenergies',
        name: 'TotalEnergies',
        logo_url: '/logos/totalenergies.svg',
        website_url: 'https://totalenergies.com',
        description: 'TotalEnergies international EPC approved insulation brand.',
        vendor_id_code: 'TOT-44021',
        display_order: 6,
      },
      {
        id: 'comp_maaden',
        name: "MA'ADEN",
        logo_url: '/logos/maaden.svg',
        website_url: 'https://www.maaden.com.sa',
        description: 'Saudi Arabian Mining Company certified insulation supplier.',
        vendor_id_code: 'MAD-2091',
        display_order: 7,
      },
    ];
    const stmt = db.prepare(`
      INSERT INTO company_logos (id, name, logo_url, website_url, description, vendor_id_code, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of companies) stmt.run(c.id, c.name, c.logo_url, c.website_url, c.description, c.vendor_id_code, c.display_order);
  }

  // 5. Seed Supply Partners
  const partnerCount = (db.prepare(`SELECT count(*) as count FROM supply_partners`).get() as any).count;
  if (partnerCount === 0) {
    const partners = [
      { id: 'sp_owens', name: 'Owens Corning', website_url: 'https://www.owenscorning.com', description: 'Global leader in insulation and fiberglass systems.', display_order: 1 },
      { id: 'sp_jm', name: 'Johns Manville', website_url: 'https://www.jm.com', description: 'Premium industrial calcium silicate & glass fiber insulation.', display_order: 2 },
      { id: 'sp_armacell', name: 'Armacell', website_url: 'https://www.armacell.com', description: 'Flexible elastomeric foam insulation for HVAC & industrial systems.', display_order: 3 },
      { id: 'sp_foamglas', name: 'FOAMGLAS', website_url: 'https://www.foamglas.com', description: 'Cellular glass insulation for extreme cryogenic & high temp applications.', display_order: 4 },
      { id: 'sp_aspen', name: 'Aspen Aerogels', website_url: 'https://www.aerogel.com', description: 'Ultra-thin flexible aerogel insulation blankets.', display_order: 5 },
    ];
    const stmt = db.prepare(`INSERT INTO supply_partners (id, name, website_url, description, display_order) VALUES (?, ?, ?, ?, ?)`);
    for (const p of partners) stmt.run(p.id, p.name, p.website_url, p.description, p.display_order);
  }

  // 6. Seed GCC Locations
  const locCount = (db.prepare(`SELECT count(*) as count FROM gcc_locations`).get() as any).count;
  if (locCount === 0) {
    const locations = [
      {
        id: 'uae-hq',
        hub_name: 'UAE (HQ)',
        country: 'United Arab Emirates',
        is_hq: 1,
        status: 'Stock Ready',
        phone: '+971-6-530-9555',
        coord_x: 62,
        coord_y: 48,
        last_shipment: 'Last shipment to KSA cleared 42 mins ago.',
        inventory_count: '14,500+ Metric Tons',
        display_order: 1,
      },
      {
        id: 'ksa-dammam',
        hub_name: 'KSA (Dammam)',
        country: 'Saudi Arabia',
        is_hq: 0,
        status: 'Active Logistics',
        phone: '+966-50-218-8681',
        coord_x: 25,
        coord_y: 58,
        last_shipment: 'Last shipment to KSA cleared 42 mins ago.',
        inventory_count: '9,200+ Metric Tons',
        display_order: 2,
      },
      {
        id: 'kuwait',
        hub_name: 'Kuwait',
        country: 'Kuwait',
        is_hq: 0,
        status: 'Stock Ready',
        phone: '+965-31347699',
        coord_x: 35,
        coord_y: 24,
        last_shipment: 'Customs cleared 1 hour ago (Shuaiba Port)',
        inventory_count: '4,800+ Metric Tons',
        display_order: 3,
      },
      {
        id: 'bahrain',
        hub_name: 'Bahrain',
        country: 'Bahrain',
        is_hq: 0,
        status: 'Stock Ready',
        phone: '+973-17004455',
        coord_x: 45,
        coord_y: 36,
        last_shipment: 'Direct dispatch via King Fahd Causeway',
        inventory_count: '2,100+ Metric Tons',
        display_order: 4,
      },
      {
        id: 'qatar',
        hub_name: 'Qatar',
        country: 'Qatar',
        is_hq: 0,
        status: 'Custom Fabrication',
        phone: '+974-44509988',
        coord_x: 48,
        coord_y: 66,
        last_shipment: 'Hamad Port staging berth 4 active',
        inventory_count: '3,600+ Metric Tons',
        display_order: 5,
      },
      {
        id: 'oman',
        hub_name: 'Oman',
        country: 'Oman',
        is_hq: 0,
        status: 'Stock Ready',
        phone: '+968-24501122',
        coord_x: 67,
        coord_y: 84,
        last_shipment: 'Sohar Freezone distribution hub active',
        inventory_count: '5,100+ Metric Tons',
        display_order: 6,
      },
    ];
    const stmt = db.prepare(`
      INSERT INTO gcc_locations (id, hub_name, country, is_hq, status, phone, coord_x, coord_y, last_shipment, inventory_count, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const l of locations) stmt.run(l.id, l.hub_name, l.country, l.is_hq, l.status, l.phone, l.coord_x, l.coord_y, l.last_shipment, l.inventory_count, l.display_order);
  }

  // 7. Seed Products
  const prodCount = (db.prepare(`SELECT count(*) as count FROM products`).get() as any).count;
  if (prodCount === 0) {
    const products = [
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
        display_order: 1,
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
        display_order: 2,
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
        display_order: 3,
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
        display_order: 4,
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
        display_order: 5,
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO products (id, slug, name, pillar, industry, temp_range, density, compliance, description, in_stock, lead_time, unit, price_estimate, aramco_approved, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of products) stmt.run(p.id, p.slug, p.name, p.pillar, p.industry, p.temp_range, p.density, p.compliance, p.description, p.in_stock, p.lead_time, p.unit, p.price_estimate, p.aramco_approved, p.display_order);

    // Seed product documents
    const docStmt = db.prepare(`
      INSERT INTO product_documents (id, product_id, title, doc_type, file_url, file_size, revision)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    docStmt.run('doc_foamglas_tds', 'prod_foamglas', 'Technical Data Sheet (TDS)', 'TDS', '/uploads/FOAMGLAS_ONE_TDS_2026.pdf', '1.4 MB', 'v4.2');
    docStmt.run('doc_foamglas_sds', 'prod_foamglas', 'Safety Data Sheet (SDS)', 'SDS', '/uploads/FOAMGLAS_ONE_SDS_2026.pdf', '890 KB', 'v2.1');
    docStmt.run('doc_psmb_tds', 'prod_psmb', 'Polysurlyn Jacketing Spec Sheet', 'TDS', '/uploads/Polysurlyn_Jacketing_Spec.pdf', '1.1 MB', 'v3.0');
  }

  // 8. Seed Certifications
  const certCount = (db.prepare(`SELECT count(*) as count FROM certifications`).get() as any).count;
  if (certCount === 0) {
    const certs = [
      {
        id: 'cert_aramco',
        name: 'Saudi Aramco Vendor Registration',
        issuing_org: 'Saudi Arabian Oil Company',
        cert_number: '10114402',
        logo_url: 'https://www.aramco.com/-/jssmedia/project/aramcocom/aramco-logo--white.webp',
        doc_url: '/uploads/Aramco_Vendor_Certificate.pdf',
        issue_date: '2020-01-15',
        expiry_date: '2028-12-31',
        description: 'Full qualification for supply of thermal insulation, jacketing, and specialized adhesives across all Aramco onshore and offshore sites.',
        status: 'Active',
        display_order: 1,
      },
      {
        id: 'cert_sabic',
        name: 'SABIC Qualification Certificate',
        issuing_org: 'Saudi Basic Industries Corporation',
        cert_number: '11047900',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Logo_of_Sabic.svg/960px-Logo_of_Sabic.svg.png',
        doc_url: '/uploads/SABIC_Vendor_Certificate.pdf',
        issue_date: '2021-04-10',
        expiry_date: '2029-04-10',
        description: 'Verified vendor registration code 11047900 for petrochemical thermal insulation supply.',
        status: 'Active',
        display_order: 2,
      },
      {
        id: 'cert_iso',
        name: 'ISO 9001:2015 Quality Management Systems',
        issuing_org: 'Bureau Veritas',
        cert_number: 'UAE-QMS-90812',
        logo_url: '',
        doc_url: '/uploads/ISO_9001_2015_Certificate.pdf',
        issue_date: '2022-06-01',
        expiry_date: '2027-06-01',
        description: 'Certified ISO 9001 fabrication facility in Ajman, UAE for custom pipe shells and insulation covers.',
        status: 'Active',
        display_order: 3,
      },
    ];
    const stmt = db.prepare(`
      INSERT INTO certifications (id, name, issuing_org, cert_number, logo_url, doc_url, issue_date, expiry_date, description, status, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of certs) stmt.run(c.id, c.name, c.issuing_org, c.cert_number, c.logo_url, c.doc_url, c.issue_date, c.expiry_date, c.description, c.status, c.display_order);
  }

  // 9. Seed Project History
  const projCount = (db.prepare(`SELECT count(*) as count FROM project_history`).get() as any).count;
  if (projCount === 0) {
    const projects = [
      {
        id: 'proj_jafurah',
        project_name: 'Jafurah Unconventional Gas Field Development',
        client: 'Saudi Aramco / Hyundai E&C',
        country: 'Saudi Arabia',
        industry: 'Oil & Gas',
        year: '2025',
        scope: 'Cellular Glass & PSMB Metal Jacketing Supply (45,000 Sqm)',
        description: 'Turnkey thermal insulation supply for cryogenic processing trains.',
        status: 'Completed',
        display_order: 1,
      },
      {
        id: 'proj_altaweelah',
        project_name: 'Al Taweelah Alumina Refinery Expansion',
        client: 'EGA / Bechtel',
        country: 'United Arab Emirates',
        industry: 'Industrial Commercial',
        year: '2024',
        scope: 'High-Temp Rockwool Pipe Sections & Stainless Jacketing',
        description: 'High-temperature thermal piping insulation for alumina digesters.',
        status: 'Completed',
        display_order: 2,
      },
    ];
    const stmt = db.prepare(`
      INSERT INTO project_history (id, project_name, client, country, industry, year, scope, description, status, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of projects) stmt.run(p.id, p.project_name, p.client, p.country, p.industry, p.year, p.scope, p.description, p.status, p.display_order);
  }

  // 10. Seed Resources
  const resCount = (db.prepare(`SELECT count(*) as count FROM resources`).get() as any).count;
  if (resCount === 0) {
    const resources = [
      {
        id: 'res_astm_sheet',
        title: 'ASTM Compliance Sheets',
        category: 'ASTM Compliance Sheets',
        subtitle: 'Download B209 / C533 PDFs →',
        file_url: '/uploads/ASTM_B209_C533_Compliance_Sheet.pdf',
        file_size: '2.4 MB',
        pdf_code: 'ASTM-2026',
        display_order: 1,
      },
      {
        id: 'res_install_guide',
        title: 'Installation & Fabrication Manuals',
        category: 'Installation Guides',
        subtitle: 'Download ASTM C552 Guides →',
        file_url: '/uploads/ASTM_C552_Installation_Guide.pdf',
        file_size: '4.8 MB',
        pdf_code: 'GUIDE-C552',
        display_order: 2,
      },
      {
        id: 'res_company_profile',
        title: 'Corporate Profile PDF',
        category: 'Company Profile',
        subtitle: 'Growth International 2026 Capability Matrix →',
        file_url: '/uploads/Growth_International_Corporate_Profile_2026.pdf',
        file_size: '8.1 MB',
        pdf_code: 'PROFILE-2026',
        display_order: 3,
      },
    ];
    const stmt = db.prepare(`
      INSERT INTO resources (id, title, category, subtitle, file_url, file_size, pdf_code, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of resources) stmt.run(r.id, r.title, r.category, r.subtitle, r.file_url, r.file_size, r.pdf_code, r.display_order);
  }
}

// Automatically initialize schema when db module is imported
initSchema();

export default db;
