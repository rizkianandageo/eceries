import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, expiringItems } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const itemsList = items.map((i: any) => i.name).join(', ');
    const expiringList = expiringItems.map((i: any) => i.name).join(', ');

    const prompt = `You are a master chef. The user wants to cook a meal using the ingredients they have in their fridge.
They have the following ingredients: ${itemsList || 'Nothing'}.
CRITICALLY IMPORTANT: The following ingredients are expiring very soon and MUST be prioritized in the recipe if possible: ${expiringList || 'None'}.

Create 2 delicious recipes that use as many of their available ingredients as possible. 
You do NOT need to strictly use only the ingredients they have. You can include common pantry staples (like salt, sugar, oil) or even a few missing ingredients if it makes the recipe much better, but prioritize the ingredients they do have.

Return the recipes strictly as a JSON array containing objects with the following structure (do not wrap in markdown tags like \`\`\`json, just return the raw JSON array):
[
  {
    "title": "Recipe Name",
    "description": "Short appetizing description",
    "emoji": "🍲",
    "prepTime": "XX min",
    "ingredients": ["Ingredient 1", "Ingredient 2"],
    "instructions": ["Step 1", "Step 2"]
  }
]`;

    // Models confirmed available via ListModels API
    const models = [
      'gemini-flash-lite-latest',   // Fastest, most likely to be free
      'gemini-2.5-flash-lite',
      'gemini-3.1-flash-lite',
    ];
    let lastError: any = null;

    for (const model of models) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        lastError = errData;
        console.warn(`Model ${model} failed:`, errData?.error?.message);
        continue; // try next model
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response from AI");

      const recipes = JSON.parse(text);
      return NextResponse.json({ recipes });
    }

    // All models failed
    throw new Error(lastError?.error?.message || 'All models failed');

  } catch (error: any) {
    console.error("AI Recipe Generation Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate recipe' }, { status: 500 });
  }
}
