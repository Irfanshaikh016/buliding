import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export const runtime = 'nodejs';

// System prompt instructing the model to act as a certified senior construction manager and civil engineering advisor
const BUILDSMART_SYSTEM_PROMPT = `
You are BuildSmart Assistant, an expert AI construction management advisor and civil engineering specialist.
Your mission is to assist project managers, civil engineers, architects, and property developers with:
1. Construction cost estimation breakdowns and Indian standard benchmark rates (e.g. ₹1,800 - ₹3,500/sq.ft depending on specifications).
2. Indian Standards & Building Codes (IS 456 for concrete, IS 1786 for TMT steel, IS 1489 for PPC cement, IS 2185 for AAC blocks, National Building Code of India NBC 2016).
3. Material comparisons (e.g., OPC 53 vs PPC cement, AAC blocks vs Red Clay bricks, Fe 500D vs CRS rebar).
4. Critical Path Method (CPM) scheduling, phase dependencies, and mitigating project delays.
5. Quality control, curing protocols, concrete cube testing, and site safety procedures.

IMPORTANT GUIDELINES:
- Deliver structured, actionable, and mathematically sound answers with clear bullet points.
- Quote amounts in Indian Rupees (₹ / Lakhs / Crores) when discussing Indian construction projects.
- ALWAYS maintain technical honesty: state clearly that AI estimates and advice are preliminary planning aids and do NOT replace formal certified civil/structural engineering drawings, soil bore-well SBC tests, or municipal plan approvals.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], projectContext } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    let contextualSystemPrompt = BUILDSMART_SYSTEM_PROMPT;
    if (projectContext) {
      contextualSystemPrompt += `\n\nCURRENT PROJECT CONTEXT:\nProject Name: ${projectContext.name}\nType: ${projectContext.project_type}\nLocation: ${projectContext.location}\nBuilt-up Area: ${projectContext.built_up_area} sq.ft\nFloors: ${projectContext.floors}\nBudget: ₹${projectContext.budget?.toLocaleString('en-IN')}\nStatus: ${projectContext.status}\nFinish Level: ${projectContext.finish_level}\nDescription: ${projectContext.description || 'N/A'}`;
    }

    // 1. Primary: Use Google Gemini (Free Tier)
    if (geminiKey && !geminiKey.includes('your-free-gemini') && geminiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: contextualSystemPrompt,
        });

        // Format conversation history for Gemini SDK
        const contents = [
          ...history.slice(-6).map((h: { role: string; content: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ];

        const result = await model.generateContent({ contents });
        const replyText = result.response.text();

        return NextResponse.json({
          role: 'assistant',
          content: replyText,
          isFallback: false,
          provider: 'Google Gemini (Free Tier)',
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, attempting fallback:', geminiError);
      }
    }

    // 2. Secondary fallback: OpenAI (if configured)
    if (openAiKey && !openAiKey.includes('your-openai-api-key') && openAiKey.trim() !== '') {
      try {
        const openai = new OpenAI({ apiKey: openAiKey });
        const messages = [
          { role: 'system' as const, content: contextualSystemPrompt },
          ...history.slice(-6).map((h: { role: string; content: string }) => ({
            role: (h.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: h.content,
          })),
          { role: 'user' as const, content: message },
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.6,
          max_tokens: 1200,
        });

        const replyContent = completion.choices[0]?.message?.content || 'Unable to generate response.';
        return NextResponse.json({
          role: 'assistant',
          content: replyContent,
          isFallback: false,
          provider: 'OpenAI GPT-4o-mini',
        });
      } catch (openAiError) {
        console.warn('OpenAI API call failed, using heuristic engine:', openAiError);
      }
    }

    // 3. Graceful offline fallback when API key is not configured or offline during presentation
    return NextResponse.json({
      role: 'assistant',
      content: generateIntelligentFallbackResponse(message, projectContext),
      isFallback: true,
      notice: 'Response generated via BuildSmart Heuristic Civil Engineering Engine. Add a free GEMINI_API_KEY from https://aistudio.google.com/ in .env.local to enable live generative AI responses.',
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown AI error';
    console.error('BuildSmart AI API Error:', errorMessage);

    return NextResponse.json({
      role: 'assistant',
      content: generateIntelligentFallbackResponse('general overview', null),
      isFallback: true,
      error: errorMessage,
    });
  }
}

// Rule-based heuristic responder for viva demonstrations when API key isn't provided
function generateIntelligentFallbackResponse(userPrompt: string, projectContext: Record<string, unknown> | null): string {
  const q = userPrompt.toLowerCase();

  if (q.includes('cost') || q.includes('budget') || q.includes('estimate') || q.includes('rate') || q.includes('price')) {
    return `### 📊 Construction Cost Analysis & Benchmarks (IS 456 / CPWD)

For modern residential and commercial builds in India (2024-2026 indicative benchmarks):

- **Civil Structural Shell (M25 RCC + AAC/Brick Masonry):** ₹1,100 – ₹1,350 / sq.ft (~50% of total)
- **Finishing & Flooring (Vitrified tiles, paint, doors, windows):** ₹550 – ₹900 / sq.ft (~26%)
- **MEP Installations (Concealed electrical FRLS + CPVC/UPVC plumbing):** ₹320 – ₹450 / sq.ft (~17%)
- **Statutory Approvals & Contingency:** ~7% of aggregate budget.

${projectContext ? `**Current Project:** For **${projectContext.name}** (${projectContext.built_up_area} sq.ft in ${projectContext.location}), an approved budget of **₹${Number(projectContext.budget).toLocaleString('en-IN')}** yields approximately **₹${Math.round(Number(projectContext.budget) / Number(projectContext.built_up_area)).toLocaleString('en-IN')}/sq.ft**, which is well-aligned for a **${projectContext.finish_level}** specification.` : ''}

*Deterministic calculations are available instantly in the BuildSmart Cost Estimator module.*`;
  }

  if (q.includes('cement') || q.includes('opc') || q.includes('ppc')) {
    return `### 🏗️ Cement Selection Comparison (IS 269 vs IS 1489)

1. **Portland Pozzolana Cement (PPC — IS 1489):**
   - **Best for:** Slabs, foundation footings, brick/block masonry, and external plastering.
   - **Key Advantage:** Lower heat of hydration prevents hairline micro-cracks; pozzolanic reaction increases density and prevents water seepage.
   - **Price:** Cost-effective (~₹360–₹410 per 50kg bag).

2. **Ordinary Portland Cement (OPC 53 Grade — IS 269):**
   - **Best for:** High-strength columns, pre-stressed girders, fast-cycle multi-storey commercial slabs.
   - **Key Advantage:** Rapid early compressive strength allows early formwork stripping (in 3 to 7 days).
   - **Price:** ~₹390–₹440 per 50kg bag.`;
  }

  if (q.includes('steel') || q.includes('tmt') || q.includes('rebar')) {
    return `### 🛡️ Reinforcement Steel Recommendations (IS 1786)

- **Standard Grade:** Always specify **Fe 500D** (the "D" designates enhanced elongation ductility of min 16%). This provides critical energy absorption during seismic vibrations.
- **Coastal / Humid Zones:** For coastal corridors (Mumbai, Chennai, Kochi, Visakhapatnam), specify **Fe 500D CRS (Corrosion Resistant Steel)** micro-alloyed with Copper and Chromium.
- **Verification Rule:** Check the manufacturer's test certificate (MTC) for yield stress (min 500 MPa), ultimate tensile stress (UTS/YS ratio ≥ 1.10), and verify the embossed ISI hallmark on every rebar meter.`;
  }

  if (q.includes('schedule') || q.includes('delay') || q.includes('time') || q.includes('gantt')) {
    return `### ⏱️ Construction Timeline & Critical Path (CPM) Strategy

A typical G+2 residential structure (3,000–5,000 sq.ft) requires approximately **8 to 11 months** from foundation ground-breaking to handover:

1. **Pre-Construction & Approvals:** 30–45 days (Soil testing SBC, architectural drawings, municipal sanction).
2. **Sub-Structure (Excavation to Plinth):** 25–35 days (PCC, Footings, Plinth beam, anti-termite treatment).
3. **Super-Structure Frame:** 60–90 days (~21 days per slab pour including curing cycle).
4. **Envelope (AAC Block Masonry):** 25–35 days (concurrent with lower slab curing).
5. **MEP Concealed Chasing & Rough-in:** 20–30 days.
6. **Finishing (Waterproofing, Tiling, Painting):** 45–60 days.
7. **Snagging, Testing & Handover:** 15 days.

*You can generate and customize this automated schedule in the BuildSmart Schedule tab.*`;
  }

  return `### 💡 BuildSmart Advisory Response

Thank you for your construction query regarding: **"${userPrompt}"**

Key Civil Engineering Guidelines:
- **Quality Verification:** Always conduct on-site slump cone tests for workability and cast standard 150mm concrete cubes for 7-day and 28-day compressive crushing tests (IS 516).
- **Waterproofing Rule:** Wet areas (toilets, balconies, terrace roofs) require minimum 48 hours continuous pond testing with 50mm standing water after liquid polyurethane/cementitious coating application.
- **Safe Bearing Capacity:** Never cast footings on uncompacted filled soil. Verify that borehole SBC meets or exceeds design structural calculations.

*All suggestions provided by BuildSmart AI are advisory planning guidelines. Official construction execution requires certified structural drawings by an empanelled structural engineer.*`;
}
