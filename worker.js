// Velora AI - V6 - Smart Backup, No More Got It
export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V6 Live", { headers: cors });
    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // 1. GEMINI TRY - 2 baar try karo
      if (env.GEMINI_API_KEY) {
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
        for (const model of models) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts: [{ text: `You are Velora AI, assistant of Velora agency. Founder Ravish Chandra Yadav. Services: Landing Page Rs 4999, Tools Website Rs 14999, SaaS Rs 29999, Custom Rs 49999+. Contact WhatsApp +91 82997 46179. RULE: Reply in EXACT SAME language as user. English->English only, Roman Hindi (Mujhe/Muje) -> Roman Hindi only, Hindi Devanagari -> Hindi Devanagari only. Be short, specific, helpful. User said: ${userMsg}. If user says SaaS, explain SaaS features, not Landing Page. If user says Health website, explain Health website features.` }] }] })
            });
            const j = await res.json();
            const reply = j?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
          } catch (e) { continue; }
        }
      }

      // 2. SMART BACKUP - Topic + Language dono
      const msg = userMsg.toLowerCase();
      const isHindiScript = /[ँ-ःऀ-ॿ]/.test(userMsg);
      const isHinglish = msg.includes("mujhe") || msg.includes("muje") || msg.includes("chahiye") || msg.includes("batao") || msg.includes("banana") || msg.includes("banwana") || msg.includes("saas") || msg.includes("nahi") || msg.includes("nahin");

      // SaaS
      if (msg.includes("saas")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start hai. Isme Login, Dashboard, Payment, Admin Panel sab hota hai. Aapko kis type ka SaaS banwana hai? Jaise Health, Gym, School?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start hai. Isme Login, Dashboard, Payment, Admin Panel sab hota hai. Aapko kis type ka SaaS chahiye? Health, Gym, School?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! SaaS starts at ₹29,999. It includes Login, Dashboard, Payment, Admin Panel. What type of SaaS do you want? Like Health, Gym, School?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // Health Website
      if (msg.includes("health") || msg.includes("helth") || msg.includes("हेल्थ") || msg.includes("hospital") || msg.includes("doctor") || msg.includes("clinic")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: "Bilkul! Health Website ban jayegi. Isme Doctor List, Appointment Booking, Health Blog, WhatsApp Button hoga. Ye Landing Page (₹4,999) me banegi ya Tools Website (₹14,999) me? Dono me se kya chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Health Website ban jayegi. Isme Doctor List, Appointment Booking, Health Blog, WhatsApp Button hoga. Ye Landing Page (₹4,999) me chahiye ya Tools Website (₹14,999) me?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! I can build a Health Website. It will have Doctor List, Appointment Booking, Health Blog, WhatsApp Button. Do you want it as a Landing Page (₹4,999) or a full Tools Website (₹14,999)?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // Landing Page
      if (msg.includes("landing")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Landing Page sirf ₹4,999 me ban jayega. 1 Page, SEO, WhatsApp Button, 3 din me delivery. Kis cheez ke liye banwana hai?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHindiScript) return new Response(JSON.stringify({ reply: "बिल्कुल! लैंडिंग पेज सिर्फ ₹4,999 में बन जाएगा। 1 पेज, SEO, WhatsApp बटन, 3 दिन में डिलीवरी। किस चीज़ के लिए बनवाना है?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! Landing Page is just ₹4,999. 1 Page, SEO, WhatsApp Button, 3 days delivery. What is it for?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // Default - Last option
      if (isHindiScript) return new Response(JSON.stringify({ reply: "समझ गया! बताओ, आपको किस चीज़ के लिए वेबसाइट बनवानी है? थोड़ा डिटेल बताओ, मैं सही प्लान बता दूंगा।" }), { headers: { ...cors, "Content-Type": "application/json" } });
      if (isHinglish) return new Response(JSON.stringify({ reply: "Samajh gaya! Batao, aapko kis cheez ke liye website banwani hai? Thoda detail batao." }), { headers: { ...cors, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ reply: "Got it! What is the website for? Tell me a little detail, I will suggest the right plan." }), { headers: { ...cors, "Content-Type": "application/json" } });

    } catch (e) { return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } }); }
  }
};
