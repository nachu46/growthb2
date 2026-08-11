export interface PhysicalProperty {
  property: string;
  testMethod: string;
  performanceValue: string;
  isRedHighlight?: boolean;
}

export interface TechnicalDoc {
  id: string;
  title: string;
  revision: string;
  fileSize: string;
  downloadUrl: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  pillar: string;
  industry: string;
  tempRange: string;
  density: string;
  compliance: string;
  description: string;
  inStock: boolean;
  leadTime: string;
  unit: string;
  pricePerUnitEstimate: number;
  aramcoApproved?: boolean;
  complianceBadges?: string[];
  fabricationForms?: string[];
  thicknesses?: string[];
  physicalProperties?: PhysicalProperty[];
  technicalDocs?: TechnicalDoc[];
}

export interface HubLocation {
  id: string;
  name: string;
  country: string;
  isHq: boolean;
  status: 'Stock Ready' | 'Active Logistics' | 'Custom Fabrication';
  phone: string;
  coordinates: { x: number; y: number };
  lastShipment: string;
  inventoryCount: string;
}

export interface ResourceDocument {
  id: string;
  title: string;
  category: 'ASTM Compliance Sheets' | 'Installation Guides' | 'Company Profile';
  subtitle: string;
  fileSize: string;
  downloadUrl: string;
  pdfCode: string;
}

export const GCC_HUBS: HubLocation[] = [
  {
    id: 'uae-hq',
    name: 'UAE (HQ)',
    country: 'United Arab Emirates',
    isHq: true,
    status: 'Stock Ready',
    phone: '+971-6-530-9555',
    coordinates: { x: 76, y: 44 },
    lastShipment: 'Last shipment to KSA cleared 42 mins ago.',
    inventoryCount: '14,500+ Metric Tons',
  },
  {
    id: 'ksa-dammam',
    name: 'KSA (Dammam)',
    country: 'Saudi Arabia',
    isHq: false,
    status: 'Active Logistics',
    phone: '+966-50-218-8681',
    coordinates: { x: 38, y: 58 },
    lastShipment: 'Last shipment to KSA cleared 42 mins ago.',
    inventoryCount: '9,200+ Metric Tons',
  },
  {
    id: 'kuwait',
    name: 'Kuwait',
    country: 'Kuwait',
    isHq: false,
    status: 'Stock Ready',
    phone: '+965-31347699',
    coordinates: { x: 48, y: 22 },
    lastShipment: 'Customs cleared 1 hour ago (Shuaiba Port)',
    inventoryCount: '4,800+ Metric Tons',
  },
  {
    id: 'bahrain',
    name: 'Bahrain',
    country: 'Bahrain',
    isHq: false,
    status: 'Stock Ready',
    phone: '+973-17004455',
    coordinates: { x: 58, y: 35 },
    lastShipment: 'Direct transfer to BAPCO Refinery active',
    inventoryCount: '2,100+ Metric Tons',
  },
  {
    id: 'qatar',
    name: 'Qatar',
    country: 'Qatar',
    isHq: false,
    status: 'Active Logistics',
    phone: '+974-31347699',
    coordinates: { x: 60, y: 70 },
    lastShipment: 'Ras Laffan LNG Expansion delivery dispatched',
    inventoryCount: '3,900+ Metric Tons',
  },
  {
    id: 'oman',
    name: 'Oman',
    country: 'Oman',
    isHq: false,
    status: 'Stock Ready',
    phone: '+968-24559988',
    coordinates: { x: 80, y: 84 },
    lastShipment: 'Duqm Refinery shipment arrived 2 hours ago',
    inventoryCount: '3,100+ Metric Tons',
  },
];

export const MATERIAL_PILLARS = [
  { id: 'Insulation', label: 'Insulation' },
  { id: 'Jacketing', label: 'Jacketing (Inc. PSMB & GI)' },
  { id: 'Accessories', label: 'Accessories (Inc. Marking & Tape)' },
  { id: 'Acoustic', label: 'Acoustic & Vapor' },
  { id: 'Valves', label: 'Valves & Refractory' },
];

export const INDUSTRY_APPROVALS = [
  { id: 'Oil & Gas', label: 'Oil & Gas' },
  { id: 'HVAC', label: 'HVAC' },
  { id: 'Chemical', label: 'Chemical' },
  { id: 'Electro-Mechanical', label: 'Electro-Mechanical' },
  { id: 'Industrial Commercial', label: 'Industrial Commercial' },
];

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'P-001',
    slug: 'foamglas-cellular-glass',
    name: 'FOAMGLAS® Cellular Glass Insulation Block',
    pillar: 'Insulation',
    industry: 'Oil & Gas',
    tempRange: '-268°C to +482°C (-450°F to +900°F)',
    density: '115 kg/m³ (7.18 lb/ft³)',
    compliance: 'ASTM C552, Aramco 09-SAMSS-002',
    description: '100% closed-cell glass structure providing absolute impermeability to moisture and hydrocarbon vapors. Ideal for extreme cryogenic and hot industrial applications.',
    inStock: true,
    leadTime: 'Ready for dispatch from UAE Hub (Ajman)',
    unit: 'Sq. Meters',
    pricePerUnitEstimate: 42.50,
    aramcoApproved: true,
    complianceBadges: ['ASTM C552', 'Non-Combustible (A1)', 'Zero Vapor Perm.'],
    fabricationForms: ['Rigid Block', 'Pipe Shell (Fit)', 'Curved Segments'],
    thicknesses: ['25 mm', '50 mm', '75 mm', '+ Custom (CNC)'],
    physicalProperties: [
      { property: 'Apparent Density', testMethod: 'ASTM C303', performanceValue: '115 kg/m³ (7.18 lb/ft³)' },
      { property: 'Compressive Strength (Capped)', testMethod: 'ASTM C165', performanceValue: '> 600 kPa (87 psi)' },
      { property: 'Thermal Conductivity (k-value at 25°C)', testMethod: 'ASTM C518', performanceValue: '0.041 W/m·K (0.28 BTU·in/hr·ft²·°F)' },
      { property: 'Water Vapor Permeability', testMethod: 'ASTM E96', performanceValue: '0.00 perm-inch (Absolute Zero)' },
      { property: 'Combustibility / Fire Rating', testMethod: 'EN 13501-1', performanceValue: 'Euroclass A1 (Non-Combustible)', isRedHighlight: true },
      { property: 'Operating Temperature Range', testMethod: 'ASTM C411', performanceValue: '-268°C to +482°C (-450°F to +900°F)' },
    ],
    technicalDocs: [
      { id: 'tds-001', title: 'Technical Data Sheet (TDS)', revision: 'Rev. Oct 2025', fileSize: '1.2 MB', downloadUrl: '/docs/TDS-FOAMGLAS-Cellular-Glass.pdf' },
      { id: 'sds-001', title: 'Safety Data Sheet (SDS)', revision: 'Rev. Mar 2026', fileSize: '850 KB', downloadUrl: '/docs/SDS-FOAMGLAS-Cellular-Glass.pdf' },
      { id: 'guide-001', title: 'Application & Install Guide', revision: 'Rev. Jan 2026', fileSize: '3.4 MB', downloadUrl: '/docs/Install-Guide-FOAMGLAS-Cellular-Glass.pdf' },
    ],
  },
  {
    id: 'P-002',
    slug: 'mineral-wool-pipe-section',
    name: 'Mineral Wool Pipe Section (Alu Foil Faced)',
    pillar: 'Insulation',
    industry: 'HVAC',
    tempRange: '-50°C to +650°C',
    density: '120 kg/m³',
    compliance: 'ASTM C547, BS EN 14303',
    description: 'Pre-formed rigid rock wool section with factory-applied poly-reinforced aluminum foil vapor barrier.',
    inStock: true,
    leadTime: '24 Hours',
    unit: 'Linear Meters',
    pricePerUnitEstimate: 18.20,
    aramcoApproved: true,
    complianceBadges: ['ASTM C547', 'Class 0 Fire', 'Foil Faced'],
    fabricationForms: ['Pre-formed Section', 'Slotted Mat'],
    thicknesses: ['25 mm', '50 mm', '100 mm'],
    physicalProperties: [
      { property: 'Apparent Density', testMethod: 'ASTM C303', performanceValue: '120 kg/m³' },
      { property: 'Thermal Conductivity', testMethod: 'ASTM C518', performanceValue: '0.034 W/m·K' },
      { property: 'Fire Rating', testMethod: 'EN 13501-1', performanceValue: 'Euroclass A1', isRedHighlight: true },
    ],
    technicalDocs: [
      { id: 'tds-002', title: 'Technical Data Sheet (TDS)', revision: 'Rev. Nov 2025', fileSize: '1.1 MB', downloadUrl: '/docs/TDS-Mineral-Wool.pdf' },
      { id: 'sds-002', title: 'Safety Data Sheet (SDS)', revision: 'Rev. Feb 2026', fileSize: '780 KB', downloadUrl: '/docs/SDS-Mineral-Wool.pdf' },
    ],
  },
  {
    id: 'P-003',
    slug: 'psmb-polysurlyn-jacketing',
    name: 'PSMB PolySurlyn Moisture Barrier Jacketing',
    pillar: 'Jacketing',
    industry: 'Oil & Gas',
    tempRange: 'Up to 120°C continuous',
    density: 'Aluminium 3003-H14',
    compliance: 'ASTM B209 / C533',
    description: '3-mil heat-laminated coextruded Surlyn and polyethylene film eliminating galvanic corrosion on insulated piping.',
    inStock: true,
    leadTime: 'Immediate',
    unit: 'Sq. Meters',
    pricePerUnitEstimate: 14.80,
    aramcoApproved: true,
    complianceBadges: ['ASTM B209', '3-Mil PSMB', 'Galvanic Shield'],
    fabricationForms: ['Smooth Roll', 'Stucco Embossed'],
    thicknesses: ['0.5 mm', '0.8 mm', '1.0 mm'],
    physicalProperties: [
      { property: 'Tensile Strength', testMethod: 'ASTM B209', performanceValue: '145 MPa' },
      { property: 'Moisture Barrier', testMethod: 'ASTM C533', performanceValue: '3-Mil PolySurlyn Co-extruded' },
      { property: 'Corrosion Resistance', testMethod: 'ASTM B117', performanceValue: 'Exceeds 3000 Hrs Salt Spray', isRedHighlight: true },
    ],
    technicalDocs: [
      { id: 'tds-003', title: 'Technical Data Sheet (TDS)', revision: 'Rev. Dec 2025', fileSize: '1.5 MB', downloadUrl: '/docs/TDS-PSMB-Jacketing.pdf' },
    ],
  },
];

export const VENDOR_REGISTRATIONS = [
  { name: 'Saudi Aramco', vendorId: '10114402', logoText: 'aramco', status: 'Pre-Qualified Vendor' },
  { name: 'SABIC', vendorId: '11047900', logoText: 'sabic', status: 'Approved Global Vendor' },
  { name: 'ADNOC', vendorId: 'ADNOC-88492', logoText: 'ADNOC', status: 'Registered Supplier' },
  { name: 'Sadara Chemical', vendorId: 'SAD-90112', logoText: 'Sadara', status: 'Approved Class-1' },
  { name: 'KNPC (Kuwait National Petroleum)', vendorId: 'KNPC-7492', logoText: 'KNPC', status: 'Cleared EPC Vendor' },
  { name: 'TotalEnergies', vendorId: 'TOT-44021', logoText: 'TotalEnergies', status: 'Middle East Approved' },
  { name: 'MA\'ADEN Saudi Mining', vendorId: 'MAD-2091', logoText: 'MA\'ADEN', status: 'Qualified Supply Partner' },
];

export const SUPPLY_PARTNERS = [
  { name: 'Owens Corning', desc: 'Cellular Glass & Mineral Wool Solutions' },
  { name: 'Johns Manville', desc: 'Industrial Fiber Glass & Micro-Lok' },
  { name: 'Armacell', desc: 'Armaflex Elastomeric Foam Insulation' },
  { name: 'Aspen Aerogels', desc: 'Pyrogel & Cryogel Flexible Aerogel' },
  { name: 'FOAMGLAS', desc: 'Cellular Glass Structural Thermal Insulation' },
];

export const RESOURCE_DOCUMENTS: ResourceDocument[] = [
  {
    id: 'astm-b209',
    title: 'ASTM Compliance Sheets',
    category: 'ASTM Compliance Sheets',
    subtitle: 'Download B209 / C533 PDFs →',
    fileSize: '2.4 MB PDF',
    downloadUrl: '/docs/ASTM-B209-C533-Growth-International.pdf',
    pdfCode: 'B209 / C533',
  },
  {
    id: 'install-metal-jacketing',
    title: 'Installation Guides',
    category: 'Installation Guides',
    subtitle: 'Metal Jacketing application specs →',
    fileSize: '4.8 MB PDF',
    downloadUrl: '/docs/Metal-Jacketing-Installation-Spec-Growth.pdf',
    pdfCode: 'PSMB-SPEC-2026',
  },
  {
    id: 'company-profile',
    title: 'Company Profile (About Us)',
    category: 'Company Profile',
    subtitle: 'Read our 18-Year History →',
    fileSize: '8.1 MB Corporate Dossier',
    downloadUrl: '/docs/Growth-International-Corporate-Profile-2026.pdf',
    pdfCode: 'GI-CORP-2026',
  },
];
