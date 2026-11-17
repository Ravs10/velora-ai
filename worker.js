// Velora AI - V3 FINAL - All Language + New Gemini Models
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V3 Live", { headers: cors });

    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // Language detect karo - Backup ke liye
      const isHindiRoman = /mujhe|chahiye|kitna|kya|batao|banwana|kaise|kaisa|hai\?/.test(userMsg.toLowerCase()) || /[ँ-ःऀ-ॿ]/.test(userMsg);
      const isHindiScript = /[ँ-ःऀ-ॿ]/.test(userMsg);

      // 1. GEMINI - 3 Model Try Karo
      if (env.GEMINI_API_KEY) {
        const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash-001"];
        for (const model of models) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `You are Velora AI, smart assistant of Velora agency. Founder: Ravish Chandra Yadav. Services: Landing Page Rs 4999 (1 page, SEO, 3 days), Tools Website Rs 14999 (15+ tools, AdSense, 7 days), SaaS Rs 29999 (Login, Dashboard, Payment, 15-20 days), Custom Rs 49999+. Contact: WhatsApp +91 82997 46179, Email hello@velora.dev.

CRITICAL RULE - LANGUAGE:
- If user writes in English, reply ONLY in English.
- If user writes in Roman Hindi (Hinglish like "mujhe banwana hai"), reply ONLY in Roman Hindi (Hinglish).
- If user writes in Hindi Devanagari (हिंदी), reply ONLY in Hindi Devanagari.
- If user writes in any other language (Tamil, Telugu, Bengali, Marathi, Spanish, French, etc), reply in THAT SAME language.
- NEVER mix. NEVER reply in Hinglish when user asked in English.

RULES: Be short, friendly, helpful, specific. Don't repeat pricing unless asked. Answer the actual question.

User: ${userMsg}` }] }]
              })
            });
            const j = await res.json();
            const reply = j?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
            }
          } catch (e) { continue; }
        }
      }

      // 2. Agar Gemini sab fail ho gaya, tab Language ke hisab se Backup
      let fallback = "";
      const msg = userMsg.toLowerCase();
      if (isHindiScript) {
        fallback = "समझ गया! बताओ, आपको लैंडिंग पेज चाहिए, टूल्स वेबसाइट या SaaS? थोड़ा डिटेल बताओ।";
      } else if (isHindiRoman) {
        fallback = "Samajh gaya! Batao, aapko Landing Page chahiye, Tools Website ya SaaS? Thoda detail batao.";
      } else {
        // English ya koi aur language - English me
        if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) fallback = "Pricing: Landing Page ₹4,999, Tools Website ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Which one do you want?";
        else if (msg.includes("sports") || msg.includes("gym") || msg.includes("website") || msg.includes("create") || msg.includes("can you")) fallback = "Yes! I can create a sports website for you. It will have live scores, player profiles, and match schedules. Do you want a Landing Page (₹4,999) or a full Tools + Blog Website (₹14,999)?";
        else fallback = "Got it! Tell me, do you want a Landing Page, Tools Website or SaaS? Give me a little detail.";
      }

      return new Response(JSON.stringify({ reply: fallback }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
  }
};
