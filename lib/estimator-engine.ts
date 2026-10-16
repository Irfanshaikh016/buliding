import { CostBreakdownItem, CostEstimate, FinishLevel, ProjectType } from './types';

export interface EstimatorParams {
  project_type: ProjectType;
  location: string;
  built_up_area: number;
  floors: number;
  finish_level: FinishLevel;
  budget?: number;
  custom_rate_per_sqft?: number;
}

// Benchmark baseline construction rates in INR / sq.ft (Civil + Basic Finishing)
// Rates reflect average Indian construction industry benchmarks (2024-2026 indicative indexes)
const BASE_RATES_BY_TYPE: Record<ProjectType, number> = {
  residential: 1850,
  commercial: 2200,
  industrial: 1650,
  infrastructure: 2500,
};

// Finish level multipliers (fixtures, flooring, woodwork, exterior elevation)
const FINISH_MULTIPLIERS: Record<FinishLevel, { factor: number; label: string; rateAdjustment: number }> = {
  Economy: { factor: 0.85, label: 'Economy (Red Brick/AAC, Vitrified 2x2, standard fittings, distemper/basic emulsion)', rateAdjustment: -250 },
  Standard: { factor: 1.0, label: 'Standard (Quality AAC/Bricks, Premium Vitrified, Asian Paints Apex, Hindware/Jaquar basic)', rateAdjustment: 0 },
  Premium: { factor: 1.35, label: 'Premium (Granite/Italian Marble touches, UPVC double-glazed, Kohler fittings, royal emulsion)', rateAdjustment: 650 },
  Luxury: { factor: 1.85, label: 'Luxury (Imported Italian Marble, Automation, Concealed HVAC, Custom Joinery, High-end Façade)', rateAdjustment: 1600 },
};

// Indian Tier-based City Location Index
export function getLocationMultiplier(cityOrLocation: string): { factor: number; tier: string } {
  const norm = cityOrLocation.toLowerCase().trim();
  
  // Tier 1 Metro cities (Higher land logistics, stricter municipal compliance, higher skilled labour wages)
  const tier1Metros = ['mumbai', 'delhi', 'new delhi', 'bengaluru', 'bangalore', 'chennai', 'hyderabad', 'kolkata', 'pune', 'gurugram', 'gurgaon', 'noida'];
  // Tier 2 Emerging Urban Centres
  const tier2Cities = ['ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'kochi', 'coimbatore', 'indore', 'nagpur', 'bhopal', 'visakhapatnam', 'patna', 'vadodara', 'bhubaneswar', 'surat', 'kanpur'];

  if (tier1Metros.some(m => norm.includes(m))) {
    return { factor: 1.15, tier: 'Tier 1 Metro (Higher material transit & skilled labour cost)' };
  }
  if (tier2Cities.some(c => norm.includes(c))) {
    return { factor: 1.05, tier: 'Tier 2 Urban (Standard urban regional index)' };
  }
  return { factor: 0.95, tier: 'Tier 3 / Regional (Standard sub-urban index)' };
}

// Floor height penalty factor: multi-storey vertical construction increases crane, pumping & shuttering costs
export function getFloorFactor(floors: number): number {
  if (floors <= 1) return 1.0;
  if (floors <= 3) return 1.04;
  if (floors <= 6) return 1.09;
  if (floors <= 10) return 1.15;
  return 1.22;
}

// Standard Indian Construction Itemised Percentage Allocation
const BREAKDOWN_PERCENTAGES: {
  category: string;
  name: string;
  percentage: number;
  description: string;
}[] = [
  {
    category: 'Sub-structure',
    name: 'Foundation & Earthwork',
    percentage: 13,
    description: 'Excavation, PCC 1:4:8, Anti-termite treatment, Footings & Plinth beam RCC',
  },
  {
    category: 'Super-structure',
    name: 'RCC Frame & Structural Work',
    percentage: 24,
    description: 'Columns, Beams, Slabs (M25 design mix concrete, Fe500D TMT reinforcement, formwork)',
  },
  {
    category: 'Envelope',
    name: 'Masonry & Plastering',
    percentage: 13,
    description: 'Exterior & internal block masonry (AAC/Red Clay) with cement sand plaster 1:6 and 1:4 neat coat',
  },
  {
    category: 'MEP Services',
    name: 'Electrical Installation',
    percentage: 9,
    description: 'Concealed FRLS copper wiring, distribution boards, modular switches, earthing & conduit rough-in',
  },
  {
    category: 'MEP Services',
    name: 'Plumbing & Sanitation',
    percentage: 8,
    description: 'CPVC/UPVC water supply pipes, SWR drainage lines, inspection chambers, water tank installation',
  },
  {
    category: 'Finishes',
    name: 'Flooring, Tiles & Dado',
    percentage: 11,
    description: 'Living/bedroom vitrified flooring, anti-skid bathroom tiling, kitchen granite slab & dado works',
  },
  {
    category: 'Finishes',
    name: 'Painting & Surface Treatment',
    percentage: 7,
    description: 'Internal wall putty, 2 coats primer, acrylic interior emulsion & exterior weather-proof coating',
  },
  {
    category: 'Carpentry',
    name: 'Doors, Windows & Joinery',
    percentage: 8,
    description: 'Engineered/Flush door frames & shutters, UPVC/Aluminium sliding windows with 5mm toughened glass',
  },
  {
    category: 'Buffer',
    name: 'Contingency & Approvals',
    percentage: 7,
    description: 'Statutory municipal charges, architectural supervision, unexpected site variation buffer',
  },
];

/**
 * Deterministic cost calculation algorithm
 */
export function calculateConstructionEstimate(params: EstimatorParams): CostEstimate {
  const { project_type, location, built_up_area, floors, finish_level, budget, custom_rate_per_sqft } = params;

  const locationData = getLocationMultiplier(location);
  const floorFactor = getFloorFactor(floors);
  const finishData = FINISH_MULTIPLIERS[finish_level];

  let effectiveRatePerSqFt: number;
  let rateSource: 'user_provided' | 'configured_benchmark' | 'market_indexed';

  if (custom_rate_per_sqft && custom_rate_per_sqft > 0) {
    effectiveRatePerSqFt = Math.round(custom_rate_per_sqft);
    rateSource = 'user_provided';
  } else {
    const baseTypeRate = BASE_RATES_BY_TYPE[project_type] || 1850;
    // Composite formula: BaseRate * LocationMultiplier * FloorFactor * FinishMultiplier
    const rawRate = baseTypeRate * locationData.factor * floorFactor * finishData.factor;
    effectiveRatePerSqFt = Math.round(rawRate);
    rateSource = 'configured_benchmark';
  }

  const estimated_total = Math.round(built_up_area * effectiveRatePerSqFt);

  // Generate itemised breakdown items
  const breakdown: CostBreakdownItem[] = BREAKDOWN_PERCENTAGES.map(item => {
    const itemAmount = Math.round((estimated_total * item.percentage) / 100);
    const itemRate = Math.round((effectiveRatePerSqFt * item.percentage) / 100);
    return {
      category: item.category,
      name: item.name,
      percentage: item.percentage,
      ratePerSqFt: itemRate,
      amount: itemAmount,
      description: item.description,
      units: 'INR / sq.ft',
    };
  });

  return {
    id: `est_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    project_type,
    location,
    built_up_area,
    floors,
    finish_level,
    base_rate: effectiveRatePerSqFt,
    estimated_total,
    breakdown,
    assumptions: {
      locationFactor: locationData.factor,
      floorFactor: floorFactor,
      finishMultiplier: finishData.factor,
      rateSource,
      contingencyPercent: 7,
      notes: [
        `Base calculation engine: ${built_up_area.toLocaleString('en-IN')} sq.ft @ ₹${effectiveRatePerSqFt.toLocaleString('en-IN')}/sq.ft.`,
        `Location Index: ${locationData.tier} (Multiplier: ${locationData.factor}x).`,
        `Height Index for ${floors} floor(s): Multiplier ${floorFactor}x.`,
        `Specification grade: ${finishData.label}.`,
        rateSource === 'user_provided'
          ? 'Rate was custom provided by user and applied directly.'
          : 'Rate calculated using deterministic engineering benchmarks for Indian construction (2024-2026 indices).',
        'Preliminary illustrative estimate for planning purposes. Structural engineer, soil test (SBC) and quantity surveyor verification required before tender award.',
      ],
    },
    created_at: new Date().toISOString(),
  };
}
