// Velora AI - V9 - Any Topic Works
export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V9 Live", { headers: cors });
    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // GEMINI - Fast 1 Model
      if (env.GEMINI_API_KEY) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
            method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
            body: JSON.stringify({ contents: [{ parts: [{ text: `You are Velora AI. Services: Landing 4999, Tools 14999, SaaS 29999, Custom 49999. WhatsApp +91 82997 46179. Reply in SAME language as user. Short, specific. User: ${userMsg}` }] }] })
          });
          clearTimeout(timeout);
          const j = await res.json();
          const reply = j?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
        } catch (e) {}
      }

      // SMART BACKUP - Any Topic
      const msg = userMsg.toLowerCase();
      const isHindiScript = /[ँ-ःऀ-ॿ]/.test(userMsg);
      const isHinglish = msg.includes("mujhe") || msg.includes("muje") || msg.includes("chahiye") || msg.includes("banana") || msg.includes("banwana") || msg.includes("kitna") || msg.includes("banvani");

      // Price
      if (msg.includes("price") || msg.includes("kitna") || msg.includes("cost") || msg.includes("rate")) {
        if (msg.includes("tool")) {
          if (isHinglish) return new Response(JSON.stringify({ reply: "Tools Website sirf ₹14,999 me. 15+ Tools, AdSense, SEO, 7 din me. Kis topic pe chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: "Tools Website is just ₹14,999. 15+ Tools, AdSense, SEO, 7 days. What topic?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (isHinglish) return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Kaunsa chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Which one?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // Topic nikal lo - User ne jo bola wahi topic hai
      // News, Sports, Gym, Health, School, etc sab isme aa jayega
      const topics = ["news", "न्यूज", "sports", "gym", "health", "हेल्थ", "school", "college", "hospital", "doctor", "clinic", "finance", "travel", "food", "fashion", "job", "business", "blog", "ecommerce", "shop", "real estate", "property", "music", "movie", "cricket", "football", "yoga", "fitness", "loan", "emi", "calculator"];
      let foundTopic = "";
      for (const t of topics) { if (msg.includes(t)) { foundTopic = t; break; } }
      // Agar koi topic list me nahi mila, to user ka pura message hi topic maan lo (jaise "Tools", "News" akela)
      if (!foundTopic && userMsg.trim().length < 30) foundTopic = userMsg.trim();

      if (foundTopic) {
        // Tools
        if (foundTopic === "tools" || msg.includes("tool")) {
          if (isHinglish) return new Response(JSON.stringify({ reply: "Tools Website me Calculator, EMI, BMI, QR, Password Generator aur 15+ tools hote hai. ₹14,999 me ban jayegi. Kis topic pe chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: "Tools Website has Calculator, EMI, BMI, QR, Password Generator + 15 more. ₹14,999. What topic?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        // Koi bhi aur Topic - Dynamic jawab
        const topicName = foundTopic.charAt(0).toUpperCase() + foundTopic.slice(1);
        if (isHindiScript) return new Response(JSON.stringify({ reply: `बिल्कुल! ${topicName} वेबसाइट बन जाएगी। इसमें ${topicName} से जुड़े Articles, Tools, Blog, WhatsApp बटन होगा। ये Landing Page (₹4,999) में चाहिए या Tools Website (₹14,999) में?` }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: `Bilkul! ${topicName} Website ban jayegi. Isme ${topicName} se judi News/Articles, Tools, Blog, WhatsApp Button hoga. Ye Landing Page (₹4,999) me chahiye ya Tools Website (₹14,999) me?` }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: `Sure! ${topicName} Website is possible. It will have ${topicName} Articles, Tools, Blog, WhatsApp Button. Do you want it as Landing Page (₹4,999) or Tools Website (₹14,999)?` }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // Specific - SaaS, Landing, Complete
      if (msg.includes("saas")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start. Login, Dashboard, Payment sab hoga. Kis type ka?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! SaaS starts ₹29,999. Login, Dashboard, Payment included. What type?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (msg.includes("landing")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Landing Page ₹4,999 me, 3 din me. Kis cheez ke liye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! Landing Page ₹4,999, 3 days. What is it for?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (msg.includes("complete") || msg.includes("full")) {
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Complete Website matlab Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Perfect! Complete Website = Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO, everything. Shall I confirm?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      if (isHindiScript) return new Response(JSON.stringify({ reply: "समझ गया! थोड़ा डिटेल बताओ, किस चीज़ के लिए बनवानी है?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      if (isHinglish) return new Response(JSON.stringify({ reply: "Samajh gaya! Thoda detail batao, kis cheez ke liye banwani hai?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ reply: "Tell me a little more - what should it do? I will suggest the right plan." }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) { return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } }); }
  }
};
