import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { COMPREHENSIVE_MATERIALS_DATABASE } from '@/lib/materials-data';
import { MaterialRecommendation } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, projectType, location, budgetTier, durabilityPriority, climate } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    // If no OpenAI key or placeholder, return curated engineering specs from database
    if (!apiKey || apiKey.includes('your-openai-api-key') || apiKey.trim() === '') {
      let filtered = COMPREHENSIVE_MATERIALS_DATABASE;
      if (category && category !== 'All') {
        filtered = filtered.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
      }
      return NextResponse.json({
        recommendations: filtered,
        isAiGenerated: false,
        source: 'BuildSmart Verified Engineering Standards Database (IS Codes & CPWD Benchmarks)',
      });
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `
Generate a structured engineering recommendation for building materials based on these project criteria:
- Material Category: ${category || 'All major construction materials (Cement, Steel, Bricks, Flooring, Paint, Waterproofing)'}
- Project Type: ${projectType || 'Residential Building'}
- Geographic Location / Climate: ${location || 'India Urban'}, Climate: ${climate || 'Moderate'}
- Budget Level: ${budgetTier || 'Standard'}
- Durability Priority: ${durabilityPriority || 'High Durability'}

Return a JSON array of recommendation objects adhering strictly to this JSON format (no markdown, pure JSON):
[
  {
    "id": "ai_mat_1",
    "category": "Cement",
    "material_type": "Portland Pozzolana Cement (PPC)",
    "reasons": "Detailed explanation of why this material suits the specified location and budget",
    "advantages": ["Advantage 1", "Advantage 2", "Advantage 3"],
    "disadvantages": ["Limitation 1", "Limitation 2"],
    "budget_suitability": "Moderate",
    "important_considerations": "Practical installation and curing considerations",
    "standard_spec": "IS 1489 Part 1",
    "supplier_notes": "Reliable procurement guidelines without fabricating specific dealer prices"
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a civil engineering materials specialist. Output valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content;
    let parsedData: { recommendations?: MaterialRecommendation[]; materials?: MaterialRecommendation[] } = {};
    if (raw) {
      const parsed = JSON.parse(raw);
      parsedData = Array.isArray(parsed) ? { recommendations: parsed } : parsed;
    }

    const recommendations = parsedData.recommendations || parsedData.materials || COMPREHENSIVE_MATERIALS_DATABASE;

    return NextResponse.json({
      recommendations,
      isAiGenerated: true,
      source: 'OpenAI GPT-4o-mini Analysis conditioned on Indian Construction Benchmarks',
    });
  } catch (err: unknown) {
    console.error('Material AI error:', err);
    // Graceful fallback to verified database
    return NextResponse.json({
      recommendations: COMPREHENSIVE_MATERIALS_DATABASE,
      isAiGenerated: false,
      source: 'Fallback: BuildSmart Verified Engineering Standards Database',
    });
  }
}
