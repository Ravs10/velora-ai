// Velora AI - V2 - Gemini First - No Ratta
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V2 Live", { headers: cors });

    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Namaste! Kya banwana hai?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // 1. PEHLE GEMINI KO TRY KARO - Agar Key hai to
      if (env.GEMINI_API_KEY) {
        try {
          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `You are Velora AI, assistant of Velora. Founder: Ravish Chandra Yadav. Velora builds: Landing Page Rs 4999 (1 page, SEO, 3 days), Tools Website Rs 14999 (15+ tools, AdSense ready, 7 days), SaaS Rs 29999 (Login, Dashboard, Payment, 15-20 days), Custom Rs 49999+. Contact: WhatsApp +91 82997 46179, Email hello@velora.dev. Rules: Reply in SAME language as user. If user speaks Hindi (Roman Hindi), reply in Roman Hindi. If English, reply in English. Be short, friendly, helpful. Do NOT repeat same pricing again and again unless user asks for price. Answer user's actual question. User: ${userMsg}` }] }]
            })
          });
          const geminiData = await geminiRes.json();
          const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
          }
        } catch (e) { console.log("Gemini fail", e); }
      }

      // 2. Agar Gemini fail hua tabhi ye backup jawab
      const msg = userMsg.toLowerCase();
      let reply = "Samajh gaya! Batao, aapko Landing Page chahiye, Tools Website ya SaaS? Thoda detail batao to main sahi price bata du.";
      if (msg.includes("price") || msg.includes("kitna") || msg.includes("rate")) reply = "Landing Page ₹4,999, Tools Website ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Kaunsa chahiye?";
      if (msg.includes("hi") || msg.includes("hello") || msg.includes("namaste")) reply = "Namaste! Main Velora AI hu. Aapko kya banwana hai?";

      return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ reply: "Namaste! Kya banwana hai aapko?" }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
  }
};
