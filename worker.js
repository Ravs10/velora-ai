// Velora AI - V8 - Fast for Weak Internet - 1 Model Only
export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V8 Live", { headers: cors });
    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // GEMINI - Sirf 1 baar, Fast wala
      if (env.GEMINI_API_KEY) {
        try {
          // 8 second me jawab nahi aaya to rukna nahi, backup de dena
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({ contents: [{ parts: [{ text: `You are Velora AI. Services: Landing 4999, Tools 14999, SaaS 29999, Custom 49999. WhatsApp +91 82997 46179. Reply in SAME language as user. Short, specific. User: ${userMsg}` }] }] })
          });
          clearTimeout(timeout);
          const j = await res.json();
          const reply = j?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
        } catch (e) { /* Gemini slow hai, backup pe jao */ }
      }

      // SMART BACKUP - V7 wala hi, fast
      const msg = userMsg.toLowerCase();
      const isHindiScript = /[ँ-ःऀ-ॿ]/.test(userMsg);
      const isHinglish = msg.includes("mujhe") || msg.includes("muje") || msg.includes("chahiye") || msg.includes("banana") || msg.includes("banwana") || msg.includes("kitna");

      if (msg.includes("price") || msg.includes("kitna") || msg.includes("cost") || msg.includes("rate")) {
        if (msg.includes("tool")) {
          if (isHinglish) return new Response(JSON.stringify({ reply: "Tools Website sirf ₹14,999 me. 15+ Tools, AdSense, SEO, 7 din me. Kis topic pe chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: "Tools Website is just ₹14,999. 15+ Tools, AdSense, SEO, 7 days. What topic?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (isHinglish) return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Kaunsa chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Which one?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (msg.includes("tool")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Tools Website me Calculator, EMI, BMI, QR, Password Generator aur 15+ tools hote hai. ₹14,999 me ban jayegi. Kis topic pe chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Tools Website has Calculator, EMI, BMI, QR, Password Generator + 15 more. ₹14,999. What topic?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (msg.includes("complete") || msg.includes("full")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Complete Website matlab Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Perfect! Complete Website = Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO, everything. Shall I confirm?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (msg.includes("health") || msg.includes("हेल्थ")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Health Website ban jayegi. Doctor List, Appointment, Blog hoga. Landing (₹4,999) ya Tools (₹14,999)?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! Health Website with Doctor List, Appointment, Blog. Landing (₹4,999) or Tools (₹14,999)?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (msg.includes("saas")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start. Login, Dashboard, Payment sab hoga. Kis type ka?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! SaaS starts ₹29,999. Login, Dashboard, Payment included. What type?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (msg.includes("landing")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Landing Page ₹4,999 me, 3 din me. Kis cheez ke liye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! Landing Page ₹4,999, 3 days. What is it for?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      if (isHindiScript) return new Response(JSON.stringify({ reply: "समझ गया! थोड़ा डिटेल बताओ, किस चीज़ के लिए बनवानी है?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      if (isHinglish) return new Response(JSON.stringify({ reply: "Samajh gaya! Thoda detail batao, kis cheez ke liye banwani hai?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ reply: "Tell me a little more - what should it do? I will suggest the right plan." }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) { return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } }); }
  }
};
