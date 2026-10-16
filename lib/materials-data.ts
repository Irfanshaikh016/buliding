import { MaterialRecommendation } from './types';

export const COMPREHENSIVE_MATERIALS_DATABASE: MaterialRecommendation[] = [
  // CEMENT
  {
    id: 'mat_cem_1',
    category: 'Cement',
    material_type: 'Portland Pozzolana Cement (PPC) — Fly Ash Based (IS 1489 Part 1)',
    reasons: 'Produces lower heat of hydration, forms secondary C-S-H gel for reduced micro-porosity, and delivers superior long-term compressive strength and sulfate resistance.',
    advantages: [
      'High resistance to chloride and sulfate chemical attacks in groundwater',
      'Significantly lower shrinkage cracks compared to rapid hardening cements',
      'Environmentally sustainable utilizing industrial fly-ash by-products',
      'More cost-effective (₹20-40 lower per 50kg bag than OPC 53)',
    ],
    disadvantages: [
      'Slower initial 7-day setting rate compared to OPC 53',
      'Requires extended wet curing period (minimum 10 to 14 days)',
    ],
    budget_suitability: 'Economy',
    important_considerations: 'Ideal for foundation, brick masonry, internal plastering, and general mass concrete slabs. Avoid where early formwork stripping (< 7 days) is mandatory.',
    standard_spec: 'IS 1489 (Part 1): 2015',
    supplier_notes: 'Available nationally across Tier 1, 2, and 3 distribution networks from Ultratech, Ambuja, ACC, and Dalmia.',
  },
  {
    id: 'mat_cem_2',
    category: 'Cement',
    material_type: 'Ordinary Portland Cement (OPC 53 Grade — IS 269)',
    reasons: 'High early strength gain enables fast cycle times for structural formwork stripping and multi-storey staging.',
    advantages: [
      'High 28-day characteristic strength exceeding 53 MPa',
      'Enables rapid shuttering removal (3 to 7 days for columns/beams)',
      'Optimal for ready-mix concrete (RMC) plants and precast components',
    ],
    disadvantages: [
      'High heat of hydration can lead to thermal stress micro-cracks in thick pours',
      'Less chemical resistance in high ground-water or coastal saline environments',
    ],
    budget_suitability: 'Moderate',
    important_considerations: 'Strict wet curing must begin immediately upon setting. Always specify 53 grade specifically for columns, high-rise shear walls, and heavy transfer girders.',
    standard_spec: 'IS 269: 2015',
    supplier_notes: 'Procure factory-sealed fresh bags (< 90 days from manufacture date to prevent lump formation).',
  },

  // STEEL
  {
    id: 'mat_stl_1',
    category: 'Steel Reinforcement',
    material_type: 'Fe 500D High-Ductility TMT Rebars (IS 1786)',
    reasons: 'The "D" indicates high elongation and uniform tensile ductility (minimum 16% elongation), providing vital seismic shock absorption.',
    advantages: [
      'Excellent energy absorption capacity during earthquake tremors',
      'Superior bendability and re-bendability without brittle fracture',
      'Enhanced weldability due to low carbon equivalent (< 0.42%)',
      'High yield strength allows 15-20% rebar savings vs older Fe 415 grade',
    ],
    disadvantages: [
      'Requires proper on-site rebar storage on raised wooden pallets to prevent atmospheric surface corrosion',
    ],
    budget_suitability: 'All Budgets',
    important_considerations: 'Mandatory for seismic zones III, IV, and V across India. Look for the embossed ISI mark and BIS certification tag on every bundle.',
    standard_spec: 'IS 1786: 2008 (Fe 500D)',
    supplier_notes: 'Standard primary steel producers include Tata Tiscon, JSW Neosteel, SAIL, and Jindal Panther.',
  },
  {
    id: 'mat_stl_2',
    category: 'Steel Reinforcement',
    material_type: 'CRS (Corrosion Resistant Steel) TMT Rebars (Fe 500D CRS)',
    reasons: 'Micro-alloyed with Copper, Chromium, and Phosphorus to form an inert protective patina layer that slows chloride ingress.',
    advantages: [
      '1.5x to 2x higher pitting resistance in saline / coastal air and acidic groundwater',
      'Substantially mitigates long-term spalling and concrete cover delamination',
    ],
    disadvantages: [
      'Command a 10% to 15% price premium over standard Fe 500D rebars',
    ],
    budget_suitability: 'Premium',
    important_considerations: 'Highly recommended for buildings located within 15 km of sea coasts or areas with high industrial smog or water-table salinity.',
    standard_spec: 'IS 1786: 2008 Corrosion Resistant Class',
    supplier_notes: 'Supplied directly from primary blast-furnace manufacturers upon project quantity booking.',
  },

  // BRICKS & BLOCKS
  {
    id: 'mat_brk_1',
    category: 'Bricks & Blocks',
    material_type: 'Autoclaved Aerated Concrete (AAC) Lightweight Blocks',
    reasons: 'Weighs 50% less than red clay bricks, slashing the structural dead load on columns and footings while providing superior thermal insulation.',
    advantages: [
      'High thermal resistance (R-value) cuts air-conditioning power consumption by 15-20%',
      'Large precision dimensional size speeds up masonry laying by 3x',
      'Eliminates thick sand cement mortar bed; uses 3mm polymer thin-bed adhesive',
      'Eco-friendly: consumes fly ash without topsoil destruction',
    ],
    disadvantages: [
      'Higher water absorption requires specialized polymer plaster and primer before painting',
      'Needs wire-mesh or fiberglass joint reinforcement at beam junctions to stop hairline joint cracks',
    ],
    budget_suitability: 'Moderate',
    important_considerations: 'Use 200mm thickness for exterior perimeter walls and 100mm/150mm for internal partition walls. Never wet AAC blocks with a garden hose; only moisten joint surfaces.',
    standard_spec: 'IS 2185 (Part 3): 1984',
    supplier_notes: 'Widely manufactured by Magicrete, Siporex, Ecolite, and regional certified autoclaving plants.',
  },
  {
    id: 'mat_brk_2',
    category: 'Bricks & Blocks',
    material_type: 'Fly Ash Bricks (Class 10 - IS 12894)',
    reasons: 'Machine-pressed uniform finish requires less plaster mortar thickness while repurposing thermal power station ash.',
    advantages: [
      'Very uniform sharp edges reduce internal plastering thickness by 30%',
      'High compressive strength (7.5 to 10 N/mm²)',
      'Low water absorption (10-12%) minimizing efflorescence (salt blooms)',
    ],
    disadvantages: [
      'Heavier than AAC blocks',
      'Requires standard cement-sand mortar',
    ],
    budget_suitability: 'Economy',
    important_considerations: 'Great value-for-money choice for boundary walls, ground floor partition walls, and budget residential developments.',
    standard_spec: 'IS 12894: 2002',
    supplier_notes: 'Procure from hydraulic compression plants with verified laboratory crushing strength test reports.',
  },

  // FLOORING
  {
    id: 'mat_flr_1',
    category: 'Flooring',
    material_type: 'Double-Charged Vitrified Tiles (1200mm x 600mm / 800mm x 800mm)',
    reasons: 'Manufactured by infusing a 3-4mm double layer of coloured porcelain slip, rendering the surface impervious to wear, scratches, and household stains.',
    advantages: [
      'Extremely low porosity (< 0.05% water absorption)',
      'Highly abrasion resistant suitable for high-traffic living rooms and hallways',
      'Uniform dimensions with rectified laser-cut edges for 2mm joint spacers',
      'Zero maintenance polish requirement unlike natural stones',
    ],
    disadvantages: [
      'Can be slippery when wet if gloss nano-finish is selected (use matte/satin in kitchens/seniors rooms)',
    ],
    budget_suitability: 'Moderate',
    important_considerations: 'Lay using polymer-modified tile adhesive (IS 15477 Type 2) rather than raw cement slurry to avoid hollow debonding sounds over time.',
    standard_spec: 'IS 15622: 2017 Group B1a',
    supplier_notes: 'Kajaria, Somany, Nitco, Simpolo, and Johnson offer nationwide dealer coverage.',
  },
  {
    id: 'mat_flr_2',
    category: 'Flooring',
    material_type: 'Natural Flamed / Polished Indian Granite (18mm-20mm)',
    reasons: 'Hardest igneous natural building stone offering indefinite lifespan, immense compressive resistance, and natural earth aesthetics.',
    advantages: [
      'Nearly indestructible against heat, chemical spills, and heavy point loads',
      'Stair treads, kitchen countertops, and door threshold sills last decades without chipping',
      'Flamed or leathered surface finish provides superior anti-slip grip for wet outdoor ramps and steps',
    ],
    disadvantages: [
      'Heavier dead load (requires skilled stone masons for dry or wet fixing)',
      'Higher material and edge chamfering / polishing labour cost',
    ],
    budget_suitability: 'Premium',
    important_considerations: 'Always inspect individual slabs under natural daylight for fissure cracks, epoxy fill, and natural shade variations before site delivery.',
    standard_spec: 'IS 3316: 1974',
    supplier_notes: 'Common varieties: Black Galaxy, Tan Brown, Jet Black, Kashmir White, Hassan Green.',
  },

  // PAINT & COATINGS
  {
    id: 'mat_pnt_1',
    category: 'Paint',
    material_type: 'Exterior 100% Acrylic Weather-Proof Emulsion with Silicone Additives',
    reasons: 'Advanced acrylic polymer formulation with elastomeric elongation properties to bridge hairline thermal plaster cracks and repel monsoon rain.',
    advantages: [
      'Resists fungal, algal, and mildew growth during heavy monsoons',
      'UV-resistant pigments protect against chalking and colour fading',
      'High dirt pickup resistance (DPUR) keeps facade clean',
    ],
    disadvantages: [
      'Requires strict surface preparation: 1 coat exterior sealer primer over dry plaster (< 12% moisture)',
    ],
    budget_suitability: 'Moderate',
    important_considerations: 'Never apply over damp or freshly plastered walls (allow minimum 28 days for plaster alkaline curing).',
    standard_spec: 'IS 15489: 2004',
    supplier_notes: 'Asian Paints (Apex Ultima / Protek), Berger (WeatherCoat Long Life), Dulux (Weathershield).',
  },

  // ROOFING & WATERPROOFING
  {
    id: 'mat_rof_1',
    category: 'Roofing & Waterproofing',
    material_type: 'Elastomeric Liquid Applied Polyurethane (PU) Waterproofing System',
    reasons: 'Forms a seamless, monolithic, rubber-like jointless membrane with > 300% elongation that expands and contracts with building temperature changes.',
    advantages: [
      'Zero lap joints or seams where water can penetrate',
      'Directly adheres to concrete, screed, and brickbat coba surfaces',
      'Resists ponding water and roots in landscaped terrace gardens',
    ],
    disadvantages: [
      'Requires UV-resistant topcoat or screed protection layer for exposed sunny terraces',
      'Surface must be dust-free, oil-free, and mechanically ground prior to primer application',
    ],
    budget_suitability: 'Moderate',
    important_considerations: 'Conduct a continuous 48-hour water ponding test with 50mm standing water before screed or tile placement.',
    standard_spec: 'ASTM C836 / IS 101 Part 5',
    supplier_notes: 'Dr. Fixit (Fastflex / PU Roofcare), Fosroc (Brushbond / Nitoproof), Sika (Sikalastic).',
  },

  // INSULATION
  {
    id: 'mat_ins_1',
    category: 'Insulation',
    material_type: 'Extruded Polystyrene (XPS) Rigid Foam Roof Boards (50mm)',
    reasons: 'Closed-cell structure provides high thermal resistance (k-value ~ 0.028 W/m·K) and zero moisture absorption for over-deck terrace insulation.',
    advantages: [
      'Cuts peak top-floor roof slab summer temperatures by 5°C to 8°C',
      'High compressive strength (250-400 kPa) supports terrace pedestrian traffic and tile laying',
      'Does not rot, sag, or degrade over 30+ year design life',
    ],
    disadvantages: [
      'Must be shielded from open flame and direct organic solvent contact',
    ],
    budget_suitability: 'Premium',
    important_considerations: 'Place directly over the terrace waterproofing layer with a separation geotextile sheet before pouring the slope screed.',
    standard_spec: 'IS 4671: 1984 / ASTM C578',
    supplier_notes: 'Supreme Industries (InsuBoard), Owens Corning, regional green building certified suppliers.',
  },
];
