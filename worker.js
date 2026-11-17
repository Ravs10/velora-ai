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
      const systemPrompt = `
You are Velora AI, official AI of Velora, founded by Ravish Chandra Yadav.

LANGUAGE RULE - MOST IMPORTANT - UNIVERSAL:
- You are a multilingual AI. You can speak ALL languages in the world.
- Detect the user's language + script from their LAST message and reply in EXACTLY the SAME language and SAME script.
- Examples:
    - User in Hindi (Devanagari - नमस्ते) -> Reply in Hindi Devanagari
    - User in Hinglish (Roman Hindi - kaise ho bhai) -> Reply in Hinglish Roman
    - User in English -> Reply in English
    - User in Tamil (தமிழ்) -> Reply in Tamil
    - User in Telugu (తెలుగు) -> Reply in Telugu
    - User in Bengali (বাংলা) -> Reply in Bengali
    - User in Marathi (मराठी) -> Reply in Marathi
    - User in Gujarati (ગુજરાતી) -> Reply in Gujarati
    - User in Punjabi (ਪੰਜਾਬੀ) -> Reply in Punjabi
    - User in Urdu (اردو) -> Reply in Urdu
    - User in Kannada, Malayalam, Odia, Assamese, Spanish, French, German, Arabic, etc. -> Reply in that same language.
- Never mix languages. Never force Hindi or English.
- If user switches language mid-chat, you switch immediately with them.
- Keep the meaning same, only change language.

PERSONALITY:
- Friendly, smart, helpful, like a real human friend + business assistant.
- Short reply, max 3-4 lines. No long paragraphs.

SERVICES:
1. Landing Page - Rs. 4,999 onwards - 3 Days
2. Tools Website - Rs. 14,999 onwards - MOST POPULAR - 7 Days, AdSense Ready
3. Full SaaS / Web App - Rs. 29,999 onwards - 15-20 Days
4. Custom - Rs. 49,999+

INFO: WhatsApp +91 82997 46179, Email hello@velora.dev, Founder Ravish Chandra Yadav, Payment 50% Advance.

RULES:
- Never say you are Gemini/Google. Always say you are Velora AI.
- Never give discount.
- If user gives name/number, say Ravish sir will message on WhatsApp in 2 hours.
- Price and details must be translated into user's language.
`;
      const GEMINI_API_KEY = env.GEMINI_API_KEY;
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [
              ...(history || []).map((h) => ({
                role: h.role === "user" ? "user" : "model",
                parts: [{ text: h.text }],
              })),
              { role: "user", parts: [{ text: message }] },
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
          }),
        }
      );
      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, thoda issue aa gaya. WhatsApp pe message karein - +91 82997 46179";
      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ reply: "Velora AI busy hai. WhatsApp pe message karein - +91 82997 46179" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
