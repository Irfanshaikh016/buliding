import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { COMPREHENSIVE_MATERIALS_DATABASE } from '@/lib/materials-data';
import { MaterialRecommendation } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, projectType, location, budgetTier, durabilityPriority, climate } = body;

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    const promptText = `
Generate a structured engineering recommendation for building materials based on these project criteria:
- Material Category: ${category || 'All major construction materials (Cement, Steel, Bricks, Flooring, Paint, Waterproofing)'}
- Project Type: ${projectType || 'Residential Building'}
- Geographic Location / Climate: ${location || 'India Urban'}, Climate: ${climate || 'Moderate'}
- Budget Level: ${budgetTier || 'Standard'}
- Durability Priority: ${durabilityPriority || 'High Durability'}

Return a JSON array of recommendation objects adhering strictly to this JSON format (no markdown, pure JSON array or object with recommendations):
[
  {
    "id": "gemini_mat_1",
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

    // 1. Primary: Use Google Gemini Free Tier
    if (geminiKey && !geminiKey.includes('your-free-gemini') && geminiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        const result = await model.generateContent(promptText);
        const text = result.response.text();
        const parsed = JSON.parse(text);
        const recommendations = Array.isArray(parsed)
          ? parsed
          : parsed.recommendations || parsed.materials || COMPREHENSIVE_MATERIALS_DATABASE;

        return NextResponse.json({
          recommendations,
          isAiGenerated: true,
          source: 'Google Gemini 1.5 Flash (Free AI Tier conditioned on IS Benchmarks)',
        });
      } catch (geminiError) {
        console.warn('Gemini material generation failed, attempting fallback:', geminiError);
      }
    }

    // 2. Secondary: OpenAI (if configured)
    if (openAiKey && !openAiKey.includes('your-openai-api-key') && openAiKey.trim() !== '') {
      try {
        const openai = new OpenAI({ apiKey: openAiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a civil engineering materials specialist. Output valid JSON only.' },
            { role: 'user', content: promptText },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        });

        const raw = completion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          const recommendations = Array.isArray(parsed)
            ? parsed
            : parsed.recommendations || parsed.materials || COMPREHENSIVE_MATERIALS_DATABASE;

          return NextResponse.json({
            recommendations,
            isAiGenerated: true,
            source: 'OpenAI GPT-4o-mini Analysis',
          });
        }
      } catch (openAiError) {
        console.warn('OpenAI material generation failed:', openAiError);
      }
    }

    // 3. Fallback: Curated engineering database based on BIS / CPWD
    let filtered = COMPREHENSIVE_MATERIALS_DATABASE;
    if (category && category !== 'All') {
      filtered = filtered.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
    }

    return NextResponse.json({
      recommendations: filtered,
      isAiGenerated: false,
      source: 'BuildSmart Verified Engineering Standards Database (IS Codes & CPWD Benchmarks)',
    });
  } catch (err: unknown) {
    console.error('Material AI error:', err);
    return NextResponse.json({
      recommendations: COMPREHENSIVE_MATERIALS_DATABASE,
      isAiGenerated: false,
      source: 'Fallback: BuildSmart Verified Engineering Standards Database',
    });
  }
}
