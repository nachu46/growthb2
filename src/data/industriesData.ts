export interface IndustryAssembly {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'tower' | 'power' | 'hvac' | 'chemical' | 'marine' | 'mep' | 'cryo' | 'water' | 'food';
  iconBg: string;
  iconColor: string;
  description: string;
  epcApprovedMaterials: string[];
}

export const GCC_INDUSTRIES: IndustryAssembly[] = [
  {
    id: 'oil-gas',
    title: 'Oil & Gas (Downstream)',
    subtitle: 'Petrochemical & Refining',
    iconType: 'tower',
    iconBg: '#FFE4E6',
    iconColor: '#E11D48',
    description: 'High-temperature refining, petrochemical processing, and sulfur recovery. Materials must endure cyclic thermal shock and harsh chemical exposure.',
    epcApprovedMaterials: ['Cellular Glass', 'SS Jacketing 316', 'Aerogel (Pyrogel)'],
  },
  {
    id: 'power-desalination',
    title: 'Power & Desalination',
    subtitle: 'Thermal & Reverse Osmosis',
    iconType: 'power',
    iconBg: '#FFE4E6',
    iconColor: '#E11D48',
    description: 'Thermal loss in high-pressure steam/water, and sulfur recovery. Materials must endure cyclic thermal shock and harsh chemical exposure.',
    epcApprovedMaterials: ['Cellular Glass', 'SS Jacketing 316', 'Aerogel (Pyrogel)'],
  },
  {
    id: 'commercial-hvac',
    title: 'Commercial HVAC & Chiller',
    subtitle: 'CUI Prevention & Ducting',
    iconType: 'hvac',
    iconBg: '#E0F2FE',
    iconColor: '#0EA5E9',
    description: 'heavy commercial ducting. Absolute vapor barriers heavy commercial ducting. Absolute vapor barriers are required to prevent CUI (Corrosion Under Insulation).',
    epcApprovedMaterials: ['Elastomeric Nitrile', 'PIR Foam', 'Alu Jacketing'],
  },
  {
    id: 'chemical-pharma',
    title: 'Chemical & Pharmaceutical',
    subtitle: 'Non-Combustible Systems',
    iconType: 'chemical',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    description: 'Highly reactive environments requiring non-combustible, impermeable insulation to prevent wicking of volatile compounds and guarantee facility safety.',
    epcApprovedMaterials: ['FOAMGLAS Blocks', 'Teflon Coated FG', 'Sealant Mastics'],
  },
  {
    id: 'marine-offshore',
    title: 'Marine & Offshore',
    subtitle: 'FPSO Rigs & Coastal Refineries',
    iconType: 'marine',
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
    description: 'Drilling rigs, FPSO vessels, and coastal refineries. Materials are selected for high tensile strength, extreme salinity resistance, and robust weatherproofing.',
    epcApprovedMaterials: ['Galvanized Steel (GI)', 'Rock Wool (Hot)', 'PSMB Barrier'],
  },
  {
    id: 'electro-mechanical',
    title: 'Electro-Mechanical (MEP)',
    subtitle: 'Acoustic & Vibration Isolation',
    iconType: 'mep',
    iconBg: '#FEF3C7',
    iconColor: '#F59E0B',
    description: 'Power generation plants and heavy machinery rooms. Focuses heavily on acoustic mitigation, vibration isolation, and mass-loaded barriers for compressor noise.',
    epcApprovedMaterials: ['Mass Loaded Vinyl', 'Acoustic Cloth', 'Lead Sheet'],
  },
  {
    id: 'cryogenic-lng',
    title: 'Cryogenic & LNG Terminals',
    subtitle: 'Sub-Zero Down to -196°C',
    iconType: 'cryo',
    iconBg: '#E0F2FE',
    iconColor: '#0EA5E9',
    description: 'Extreme sub-zero environments down to -196°C. Requires rigid, load-bearing insulation and absolute impermeability to prevent ice-jacking and system failure.',
    epcApprovedMaterials: ['Aerogel (Cryogel)', 'Cryogenic Pipe Shoes', 'PUF / PIR'],
  },
  {
    id: 'power-water-gen',
    title: 'Power Gen. & Desalination',
    subtitle: 'Reverse Osmosis Networks',
    iconType: 'water',
    iconBg: '#E0F2FE',
    iconColor: '#0EA5E9',
    description: 'High-pressure steam turbines and massive reverse osmosis networks. Insulation must prevent energy loss while resisting aggressive saline atmospheres.',
    epcApprovedMaterials: ['Cellular Glass', 'Mineral Wool', 'Alu Jacketing'],
  },
  {
    id: 'cold-chain',
    title: 'Cold Chain & Food Processing',
    subtitle: 'Hygiene & FDA Compliance',
    iconType: 'food',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    description: 'Industrial refrigeration hubs and food manufacturing. Insulation assemblies prioritize absolute hygiene, FDA-compliant vapor barriers, and zero thermal bridging.',
    epcApprovedMaterials: ['High-Density PIR', 'Vapor Barrier Mastics', 'Rockwool'],
  },
];
