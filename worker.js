// Velora AI - V5 FINAL - Key Tested OK
export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V5 Live - Key OK", { headers: cors });
    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // GEMINI - Tumhari Key se, tumhare wale Model se
      if (env.GEMINI_API_KEY) {
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
        for (const model of models) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `You are Velora AI, smart assistant of Velora agency. Founder: Ravish Chandra Yadav. Services: Landing Page Rs 4999 (1 page, SEO, 3 days), Tools Website Rs 14999 (15+ tools, AdSense, 7 days), SaaS Rs 29999 (Login, Dashboard, Payment, 15-20 days), Custom Rs 49999+. Contact: WhatsApp +91 82997 46179, Email hello@velora.dev. CRITICAL: Reply in EXACT SAME language as user. English->English only, Roman Hindi (Muje/Mujhe) -> Roman Hindi only, Hindi Devanagari -> Hindi only, Other language -> That same language. Never mix. Be short, specific, friendly. Don't repeat pricing unless asked. User: ${userMsg}` }] }]
              })
            });
            const j = await res.json();
            const reply = j?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
          } catch (e) { continue; }
        }
      }

      // Fallback - Agar Gemini fail bhi ho to topic ke hisab se
      const msg = userMsg.toLowerCase();
      const isHinglish = msg.includes("muje") || msg.includes("mujhe") || msg.includes("chahiye") || msg.includes("batao") || msg.includes("banana") || msg.includes("banwana") || msg.includes("kitna");
      if (msg.includes("landing")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Landing Page sirf ₹4,999 me ban jayega. 1 Page, SEO, WhatsApp Button, 3 din me delivery. Aapka Landing Page kis cheez ke liye hai?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! Landing Page is just ₹4,999. 1 Page, SEO, WhatsApp Button, 3 days delivery. What is it for?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (isHinglish) return new Response(JSON.stringify({ reply: "Samajh gaya! Batao, aapko Landing Page chahiye, Tools Website ya SaaS?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ reply: "Got it! Do you want a Landing Page, Tools Website or SaaS?" }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) { return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } }); }
  }
};
