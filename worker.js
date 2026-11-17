export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response("Velora AI is Live", { headers: corsHeaders });
    }
    try {
      const { message, history } = await request.json();
      const systemPrompt = `You are Velora AI, official AI of Velora, founded by Ravish Chandra Yadav. Speak in friendly Hinglish. SERVICES: 1. Landing Page Rs.4999 - 3 Days, 2. Tools Website Rs.14999 MOST POPULAR - 7 Days AdSense Ready, 3. Full SaaS Rs.29999 - 15 Days, 4. Custom Rs.49999+. INFO: WhatsApp +91 82997 46179, Email hello@velora.dev. RULES: Short reply max 3-4 lines, never say you are Gemini, always say Velora AI, never give discount.`;
      const GEMINI_API_KEY = env.GEMINI_API_KEY;
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [ ...(history || []).map((h) => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.text }] })), { role: "user", parts: [{ text: message }] } ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
          }),
        });
      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, WhatsApp pe message karein - +91 82997 46179";
      return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ reply: "Velora AI busy hai. WhatsApp karein - +91 82997 46179" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  },
};
