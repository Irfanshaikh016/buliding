import { describe, it, expect } from 'vitest';
import { calculateConstructionEstimate, getLocationMultiplier, getFloorFactor } from '@/lib/estimator-engine';

describe('Deterministic Construction Cost Estimator Engine', () => {
  it('should compute exact total for residential standard build in Bengaluru', () => {
    const area = 2000;
    const est = calculateConstructionEstimate({
      project_type: 'residential',
      location: 'Bengaluru',
      built_up_area: area,
      floors: 2,
      finish_level: 'Standard',
    });

    expect(est.estimated_total).toBeGreaterThan(0);
    expect(est.base_rate).toBeGreaterThan(1500);
    expect(est.breakdown.length).toBe(9);

    // Sum of itemised amounts must equal total
    const sumOfItems = est.breakdown.reduce((sum, item) => sum + item.amount, 0);
    // Allow slight rounding delta within 0.1%
    expect(Math.abs(sumOfItems - est.estimated_total)).toBeLessThanOrEqual(50);
  });

  it('should correctly prioritize user-provided custom rate', () => {
    const customRate = 2250;
    const area = 3000;
    const est = calculateConstructionEstimate({
      project_type: 'commercial',
      location: 'Mumbai',
      built_up_area: area,
      floors: 3,
      finish_level: 'Luxury',
      custom_rate_per_sqft: customRate,
    });

    expect(est.base_rate).toBe(customRate);
    expect(est.estimated_total).toBe(area * customRate);
    expect(est.assumptions.rateSource).toBe('user_provided');
  });

  it('should apply higher location factor for Tier 1 metros vs Tier 3 regions', () => {
    const tier1 = getLocationMultiplier('Mumbai');
    const tier3 = getLocationMultiplier('Rural / Regional Village');

    expect(tier1.factor).toBeGreaterThan(tier3.factor);
    expect(tier1.tier).toContain('Tier 1');
  });

  it('should increase structural difficulty factor as floor count grows', () => {
    const lowRise = getFloorFactor(1);
    const midRise = getFloorFactor(5);
    const highRise = getFloorFactor(12);

    expect(midRise).toBeGreaterThan(lowRise);
    expect(highRise).toBeGreaterThan(midRise);
  });

  it('should allocate sub-structure, frame, and contingency within civil percentages', () => {
    const est = calculateConstructionEstimate({
      project_type: 'residential',
      location: 'Pune',
      built_up_area: 2500,
      floors: 2,
      finish_level: 'Premium',
    });

    const structure = est.breakdown.find(b => b.name.includes('RCC Frame'));
    const foundation = est.breakdown.find(b => b.name.includes('Foundation'));
    const contingency = est.breakdown.find(b => b.name.includes('Contingency'));

    expect(structure).toBeDefined();
    expect(structure?.percentage).toBe(24);
    expect(foundation?.percentage).toBe(13);
    expect(contingency?.percentage).toBe(7);
  });
});
