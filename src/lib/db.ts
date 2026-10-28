import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
    { id: "cat_insulation", slug: "insulation", name: "Industrial Insulation", description: "Thermal, cryogenic & acoustic insulation", items: "[\"FOAMGLAS Blocks\", \"Pyrogel Aerogel\", \"PIR / PUR Rigid Foam\", \"Elastomeric Nitrile\"]", image_url: '', display_order: 1, is_active: 1 },
    { id: "cat_jacketing", slug: "jacketing", name: "Metal Jacketing", description: "Metal jacketing, PolySurlyn & aluminium cladding", items: "[\"Aluminium (Stucco/Smooth)\", \"Stainless Steel 316L\", \"Galvanized Iron (GI)\", \"PolySurlyn™ Barrier\"]", image_url: '', display_order: 2, is_active: 1 },
    { id: "cat_acoustic", slug: "acoustic", name: "Acoustic & Vapor", description: "Vapor barriers & acoustic dampening barriers", items: "[\"Acoustic Lead Sheets\", \"Mass Loaded Vinyl (MLV)\", \"Bitumen Membranes\", \"Poly-Scrim Kraft (PSK)\"]", image_url: '', display_order: 3, is_active: 1 },
    { id: "cat_accessories", slug: "accessories", name: "Accessories & Tapes", description: "Bandings, fasteners, tapes & adhesives", items: "[\"Fiber Glass Mesh\", \"Pastes & Mastics\", \"Aluminium Foil Tapes\", \"Toggle Clips & Banding\"]", image_url: '', display_order: 4, is_active: 1 },
    { id: "cat_fits", slug: "fits", name: "Pre-Fabricated Fits", description: "Factory-made elbows, tees and fitting covers", items: "[\"Mitered 90° & 45° Elbows\", \"Tee & Valve Covers\", \"Pressed Barrel Heads\", \"Cryogenic Pipe Supports\"]", image_url: '', display_order: 5, is_active: 1 },
    { id: "cat_valves", slug: "valves", name: "Valves & Refractory", description: "Refractory insulation & removable valve blankets", items: "[\"Removable Insulation Blankets\", \"Ceramic Fiber Gaskets\", \"Calcium Silicate Boards\", \"High-Temp Refractory\"]", image_url: '', display_order: 6, is_active: 1 },
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
    { id: 'comp_adnoc', name: 'ADNOC', logo_url: '/logos/adnoc-logo.svg', website_url: 'https://www.adnoc.ae', description: 'Abu Dhabi National Oil Company ICV Certified Partner.', vendor_id_code: 'ADNOC-88492', display_order: 3, is_active: 1 },
    { id: 'comp_sadara', name: 'Sadara Chemical', logo_url: '/logos/sadara-logo.svg', website_url: 'https://www.sadara.com', description: 'Sadara Chemical Company approved thermal jacketing provider.', vendor_id_code: 'SAD-90112', display_order: 4, is_active: 1 },
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
      manufacturer: "FOAMGLAS",
      stock_level: "High",
      stock_hub: "UAE Hub (Ajman)",
      compliance_badges: "[\"ASTM C552\", \"Non-Combustible (A1)\", \"Zero Vapor Perm.\"]",
      fabrication_forms: "[\"Rigid Block\", \"Pipe Shell (Fit)\", \"Curved Segments\"]",
      thicknesses: "[\"25 mm\", \"50 mm\", \"75 mm\", \"+ Custom (CNC)\"]",
      physical_properties: "[{\"property\": \"Apparent Density\", \"testMethod\": \"ASTM C303\", \"performanceValue\": \"115 kg/m³ (7.18 lb/ft³)\"}, {\"property\": \"Compressive Strength (Capped)\", \"testMethod\": \"ASTM C165\", \"performanceValue\": \"> 600 kPa (87 psi)\"}, {\"property\": \"Thermal Conductivity (k-value at 25°C)\", \"testMethod\": \"ASTM C518\", \"performanceValue\": \"0.041 W/m·K (0.28 BTU·in/hr·ft²·°F)\"}, {\"property\": \"Water Vapor Permeability\", \"testMethod\": \"ASTM E96\", \"performanceValue\": \"0.00 perm-inch (Absolute Zero)\"}, {\"property\": \"Combustibility / Fire Rating\", \"testMethod\": \"EN 13501-1\", \"performanceValue\": \"Euroclass A1 (Non-Combustible)\", \"isRedHighlight\": true}, {\"property\": \"Operating Temperature Range\", \"testMethod\": \"ASTM C411\", \"performanceValue\": \"-268°C to +482°C (-450°F to +900°F)\"}]",
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
      manufacturer: "Growth Fabrication",
      stock_level: "High",
      stock_hub: "UAE Hub (Ajman)",
      compliance_badges: "[\"ASTM B209\", \"SABIC SPEC-M-801\", \"3-mil Polysurlyn\"]",
      fabrication_forms: "[\"Coil\", \"Flat Sheet\", \"Pre-Rolled Pipe Cladding\"]",
      thicknesses: "[\"0.7 mm\", \"0.8 mm\", \"1.0 mm\"]",
      physical_properties: "[{\"property\": \"Alloy / Temper\", \"testMethod\": \"ASTM B209\", \"performanceValue\": \"3003-H14 / 1100-H14\"}, {\"property\": \"Moisture Barrier\", \"testMethod\": \"Factory Laminated\", \"performanceValue\": \"3-mil Polysurlyn (PSMB)\"}, {\"property\": \"Operating Temperature\", \"testMethod\": \"Manufacturer Data\", \"performanceValue\": \"-50°C to +120°C\"}]",
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
      manufacturer: "Rockwool",
      stock_level: "High",
      stock_hub: "KSA Hub (Dammam)",
      compliance_badges: "[\"ASTM C547 Class 1 & 3\", \"Non-Combustible\"]",
      fabrication_forms: "[\"Pipe Section\", \"Slab\", \"Lamella Mat\"]",
      thicknesses: "[\"25 mm\", \"50 mm\", \"75 mm\", \"100 mm\"]",
      physical_properties: "[{\"property\": \"Apparent Density\", \"testMethod\": \"ASTM C303\", \"performanceValue\": \"120 kg/m³\"}, {\"property\": \"Maximum Service Temperature\", \"testMethod\": \"ASTM C411\", \"performanceValue\": \"Ambient to +650°C\"}, {\"property\": \"Reaction to Fire\", \"testMethod\": \"EN 13501-1\", \"performanceValue\": \"Euroclass A1 (Non-Combustible)\", \"isRedHighlight\": true}]",
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
      manufacturer: "Aspen Aerogels",
      stock_level: "Medium",
      stock_hub: "UAE Hub (Dubai)",
      compliance_badges: "[\"ASTM C1728 Type III Grade 1A\", \"CUI Resistant\"]",
      fabrication_forms: "[\"Blanket Roll\", \"Pre-Cut Segments\"]",
      thicknesses: "[\"5 mm\", \"10 mm\"]",
      physical_properties: "[{\"property\": \"Density\", \"testMethod\": \"ASTM C167\", \"performanceValue\": \"200 kg/m³\"}, {\"property\": \"Operating Temperature\", \"testMethod\": \"ASTM C411\", \"performanceValue\": \"-40°C to +650°C\"}]",
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
      manufacturer: "Armacell",
      stock_level: "High",
      stock_hub: "Kuwait Hub",
      compliance_badges: "[\"BS 476 Part 6 & 7\", \"Class 0\"]",
      fabrication_forms: "[\"Sheet\", \"Tube\"]",
      thicknesses: "[\"13 mm\", \"19 mm\", \"25 mm\", \"32 mm\"]",
      physical_properties: "[{\"property\": \"Density\", \"testMethod\": \"Manufacturer Data\", \"performanceValue\": \"55 kg/m³\"}, {\"property\": \"Fire Performance\", \"testMethod\": \"BS 476 Part 6 & 7\", \"performanceValue\": \"Class 0\", \"isRedHighlight\": true}, {\"property\": \"Operating Temperature\", \"testMethod\": \"Manufacturer Data\", \"performanceValue\": \"-50°C to +105°C\"}]",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  product_documents: [] as any[],
  certifications: [
    { id: 'cert_aramco', name: 'Saudi Aramco Vendor Registration', issuing_org: 'Saudi Arabian Oil Company', cert_number: '10114402', logo_url: 'https://www.aramco.com/-/jssmedia/project/aramcocom/aramco-logo--white.webp', doc_url: '/uploads/Aramco_Vendor_Certificate.pdf', issue_date: '2020-01-15', expiry_date: '2028-12-31', description: 'Full qualification for supply of thermal insulation, jacketing, and specialized adhesives across all Aramco onshore and offshore sites.', status: 'Active', display_order: 1, is_active: 1 },
    { id: 'cert_sabic', name: 'SABIC Qualification Certificate', issuing_org: 'Saudi Basic Industries Corporation', cert_number: '11047900', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Logo_of_Sabic.svg/960px-Logo_of_Sabic.svg.png', doc_url: '/uploads/SABIC_Vendor_Certificate.pdf', issue_date: '2021-04-10', expiry_date: '2029-04-10', description: 'Verified vendor registration code 11047900 for petrochemical thermal insulation supply.', status: 'Active', display_order: 2, is_active: 1 },
    { id: 'cert_iso', name: 'ISO 9001:2015 Quality Management Systems', issuing_org: 'Bureau Veritas', cert_number: 'UAE-QMS-90812', logo_url: '', doc_url: '/uploads/ISO_9001_2015_Certificate.pdf', issue_date: '2022-06-01', expiry_date: '2027-06-01', description: 'Global Quality Management Systems.', status: 'Active', display_order: 3, is_active: 1 },
    { id: 'cert_adnoc', name: 'ADNOC / TAKREER', issuing_org: 'Abu Dhabi National Oil Company', cert_number: 'Approved Supply Chain', logo_url: '', doc_url: '', issue_date: '', expiry_date: '', description: 'Approved supply chain partner for ADNOC and TAKREER refinery projects.', status: 'Active', display_order: 3, is_active: 1 },
    { id: 'cert_icv', name: 'UAE ICV Certified', issuing_org: 'UAE Ministry of Industry & Advanced Technology', cert_number: 'ICV', logo_url: '', doc_url: '', issue_date: '', expiry_date: '', description: 'In-Country Value certification for UAE government tenders.', status: 'Active', display_order: 5, is_active: 1 },
  ],
  project_history: [
    { id: 'proj_jafurah', project_name: 'Jafurah Unconventional Gas Field Development', client: 'Saudi Aramco / Hyundai E&C', country: 'Saudi Arabia', industry: 'Oil & Gas', year: '2025', scope: 'Cellular Glass & PSMB Metal Jacketing Supply (45,000 Sqm)', description: 'Turnkey thermal insulation supply for cryogenic processing trains.', status: 'Completed', display_order: 1, is_active: 1 },
    { id: 'proj_altaweelah', project_name: 'Al Taweelah Alumina Refinery Expansion', client: 'EGA / Bechtel', country: 'United Arab Emirates', industry: 'Industrial Commercial', year: '2024', scope: 'High-Temp Rockwool Pipe Sections & Stainless Jacketing', description: 'High-temperature thermal piping insulation for alumina digesters.', status: 'Completed', display_order: 2, is_active: 1 },
    { id: 'proj_cfp', project_name: 'Clean Fuels Project (CFP)', client: 'KNPC', country: 'Mina Abdullah, Kuwait', industry: 'Petrochemical Refinery', year: '2023', scope: 'Aerogel Blankets, Acoustic Cloth', description: 'Critical high-temperature segments for refinery upgrade units.', status: 'Completed', display_order: 3, is_active: 1 },
  ],
  resources: [
    { id: 'res_01', title: "FOAMGLAS_ONE_Cellular_Glass_TDS.pdf", category: "ASTM Compliance Sheets", subtitle: "Technical Data Sheet (TDS)", folder: "Material Specifications (TDS)", subfolder: "Industrial Insulation", file_type: "PDF", revision_date: "2025-10-12", file_url: '', file_size: "1.2 MB", pdf_code: "TDS-FG-01", product_id: "prod_foamglas", display_order: 1, is_active: 1 },
    { id: 'res_02', title: "PSMB_Polysurlyn_Jacketing_Spec.pdf", category: "ASTM Compliance Sheets", subtitle: "Polysurlyn Jacketing Spec Sheet", folder: "Material Specifications (TDS)", subfolder: "Metal Jacketing & PSMB", file_type: "PDF", revision_date: "2025-11-03", file_url: '', file_size: "1.1 MB", pdf_code: "TDS-PSMB-01", product_id: "prod_psmb", display_order: 2, is_active: 1 },
    { id: 'res_03', title: "FOAMGLAS_Cellular_Glass_SDS.pdf", category: "ASTM Compliance Sheets", subtitle: "Safety Data Sheet (SDS)", folder: "Safety Data Sheets (SDS)", subfolder: "FOAMGLAS® Products", file_type: "PDF", revision_date: "2026-03-18", file_url: '', file_size: "850 KB", pdf_code: "SDS-FG-01", product_id: "prod_foamglas", display_order: 3, is_active: 1 },
    { id: 'res_04', title: "Armaflex_Class0_SDS.pdf", category: "ASTM Compliance Sheets", subtitle: "Safety Data Sheet (SDS)", folder: "Safety Data Sheets (SDS)", subfolder: "Armacell Elastomeric", file_type: "PDF", revision_date: "2026-01-05", file_url: '', file_size: "640 KB", pdf_code: "SDS-ARM-01", product_id: "prod_armaflex", display_order: 4, is_active: 1 },
    { id: 'res_05', title: "Metal_Jacketing_Installation_Guide.pdf", category: "Installation Guides", subtitle: "Application & Install Guide", folder: "Installation Guides", subfolder: "Metal Jacketing & PSMB", file_type: "PDF", revision_date: "2026-01-20", file_url: '', file_size: "3.4 MB", pdf_code: "GUIDE-MJ-01", product_id: "prod_psmb", display_order: 5, is_active: 1 },
    { id: 'res_06', title: "Cellular_Glass_Install_Guide_C552.pdf", category: "Installation Guides", subtitle: "Application & Install Guide", folder: "Installation Guides", subfolder: "Industrial Insulation", file_type: "PDF", revision_date: "2026-01-20", file_url: '', file_size: "3.4 MB", pdf_code: "GUIDE-C552", product_id: "prod_foamglas", display_order: 6, is_active: 1 },
    { id: 'res_07', title: "ASTM_B209_C533_Compliance_Sheet.pdf", category: "ASTM Compliance Sheets", subtitle: "ASTM B209 / C533 Compliance", folder: "ASTM Compliance Audits", subfolder: "ASTM B209 / C533", file_type: "PDF", revision_date: "2026-02-20", file_url: '', file_size: "2.4 MB", pdf_code: "ASTM-2026", product_id: null, display_order: 7, is_active: 1 },
    { id: 'res_08', title: "Aramco_Vendor_Registration_10114402.pdf", category: "Company Profile", subtitle: "Vendor Registration Certificate", folder: "EPC Registration Certificates", subfolder: "Saudi Aramco", file_type: "PDF", revision_date: "2025-06-01", file_url: '', file_size: "640 KB", pdf_code: "EPC-AR-01", product_id: null, display_order: 8, is_active: 1 },
    { id: 'res_09', title: "Growth_International_Corporate_Profile_2026.pdf", category: "Company Profile", subtitle: "Corporate Capability Matrix", folder: "EPC Registration Certificates", subfolder: "Corporate", file_type: "PDF", revision_date: "2026-01-01", file_url: '', file_size: "8.1 MB", pdf_code: "PROFILE-2026", product_id: null, display_order: 9, is_active: 1 },
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
  const isNewDatabase = !fs.existsSync(DB_PATH);
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
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT, visitor_id TEXT NOT NULL, path TEXT NOT NULL, referrer TEXT, device TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views (created_at);
  `);

  // Add columns introduced after the first release (no-op when already present)
  const ensureColumns = (table: string, columns: Record<string, string>) => {
    const existing = new Set((db.prepare(`PRAGMA table_info(${table})`).all() as any[]).map((c) => c.name));
    for (const [col, type] of Object.entries(columns)) {
      if (!existing.has(col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
    }
  };
  ensureColumns('products', {
    manufacturer: 'TEXT',
    stock_level: "TEXT DEFAULT 'High'",
    stock_hub: 'TEXT',
    image_url: 'TEXT',
    compliance_badges: 'TEXT',
    fabrication_forms: 'TEXT',
    thicknesses: 'TEXT',
    physical_properties: 'TEXT',
  });
  ensureColumns('resources', {
    folder: 'TEXT',
    subfolder: 'TEXT',
    file_type: "TEXT DEFAULT 'PDF'",
    revision_date: 'TEXT',
    product_id: 'TEXT',
  });
  ensureColumns('bom_submissions', {
    target_quarter: 'TEXT',
  });
  ensureColumns('product_categories', {
    items: 'TEXT',
    image_url: 'TEXT',
  });

  // Databases created before the Categories admin existed: bring their categories in line once.
  // After this every category has items set, so later admin edits are never overwritten.
  const categoriesUpgraded = (db.prepare(`SELECT count(*) as count FROM product_categories WHERE items IS NOT NULL`).get() as any).count > 0;
  if (!isNewDatabase && !categoriesUpgraded) {
    const upsert = db.prepare(`
      INSERT INTO product_categories (id, slug, name, description, items, image_url, display_order, is_active)
      VALUES (@id, @slug, @name, @description, @items, @image_url, @display_order, @is_active)
      ON CONFLICT(id) DO UPDATE SET name = excluded.name, description = excluded.description, items = excluded.items, display_order = excluded.display_order
    `);
    db.transaction(() => seedState.product_categories.forEach((c: any) => upsert.run(c)))();
  }

  // Seed catalog content only on first creation, so admin deletions are not undone on restart
  if (isNewDatabase) {
    const seedTables = Object.keys(seedState).filter((t) => t !== 'users');
    db.transaction(() => {
      for (const table of seedTables) {
        for (const row of (seedState as any)[table] as Record<string, any>[]) {
          const cols = Object.keys(row);
          db.prepare(`INSERT OR IGNORE INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
            .run(...cols.map((c) => row[c]));
        }
      }
    })();
  }

  // Create the admin account if none exists. Password comes from ADMIN_PASSWORD, or is generated
  // and written to data/admin-credentials.txt so the default never ships in source.
  const userCount = (db.prepare(`SELECT count(*) as count FROM users`).get() as any).count;
  if (userCount === 0) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@growthme.com';
    const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
    const adminPasswordHash = bcrypt.hashSync(adminPassword, 10);
    db.prepare(`INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, 'ADMIN', ?)`).run('admin_1', adminEmail, adminPasswordHash, 'Growth Admin');
    if (!process.env.ADMIN_PASSWORD) {
      const credFile = path.join(DATA_DIR, 'admin-credentials.txt');
      fs.writeFileSync(credFile, `Admin login\nEmail: ${adminEmail}\nPassword: ${adminPassword}\n`, { mode: 0o600 });
      console.log(`[growth-b2b] Admin account created. Credentials saved to ${credFile}`);
    }
  }
} catch (error) {
  console.warn('Native better-sqlite3 not supported in this environment (Vercel Serverless). Initializing safe in-memory store.');
  db = createInMemoryDb();
}

export function initSchema() {
  // No-op safe stub
}

export default db;
