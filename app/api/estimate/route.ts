import { NextRequest, NextResponse } from 'next/server';
import { calculateConstructionEstimate } from '@/lib/estimator-engine';
import { costEstimateInputSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = costEstimateInputSchema.parse(json);

    const estimate = calculateConstructionEstimate({
      project_type: validated.project_type,
      location: validated.location,
      built_up_area: validated.built_up_area,
      floors: validated.floors,
      finish_level: validated.finish_level,
      budget: validated.budget,
      custom_rate_per_sqft: validated.custom_rate_per_sqft,
    });

    return NextResponse.json({
      success: true,
      estimate,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid estimate input';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 400 }
    );
  }
}
