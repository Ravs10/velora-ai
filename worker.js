// Velora AI - V10 FINAL - Clean Topic
export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V10 Live", { headers: cors });
    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // GEMINI - Fast
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

      const msg = userMsg.toLowerCase();
      const isHindiScript = /[ँ-ःऀ-ॿ]/.test(userMsg);
      const isHinglish = msg.includes("mujhe") || msg.includes("muje") || msg.includes("chahiye") || msg.includes("banana") || msg.includes("banwana") || msg.includes("banvani") || msg.includes("kitna");

      // === 1. PEHLE SPECIFIC CHEEZE - Sabse Important ===
      // Price
      if (msg.includes("price") || msg.includes("kitna") || msg.includes("cost") || msg.includes("rate") || msg.includes("charges")) {
        if (msg.includes("tool")) {
          if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: "Tools Website sirf ₹14,999 me. 15+ Tools, AdSense, SEO, 7 din me. Kis topic pe chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: "Tools Website is just ₹14,999. 15+ Tools, AdSense, SEO, 7 days. What topic?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Kaunsa chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Which one?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // Complete Website - Nahi, Ek Complete wale ke liye bhi yahi
      if (msg.includes("complete") || msg.includes("complet") || msg.includes("कम्प्लीट") || msg.includes("कंप्लीट") || msg.includes("puri") || msg.includes("poori") || msg.includes("full")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: "Bilkul! Complete Website matlab Tools Website - ₹14,999. Isme Home Page, 15+ Tools, Blog, SEO sab hoga. Health wali complete banani hai na? Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Complete Website matlab Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Perfect! Complete Website = Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO, everything. Shall I confirm?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // SaaS - Pehle, taaki Saas Website wala bakwas na aaye
      if (msg.includes("saas") || msg === "saas") {
        if (isHindiScript) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start hai. Isme Login, Dashboard, Payment, Admin Panel sab hota hai. Kis type ka SaaS chahiye? Health, Gym, School?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start hai. Login, Dashboard, Payment, Admin Panel sab hota hai. Kis type ka SaaS chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! SaaS starts at ₹29,999. It includes Login, Dashboard, Payment, Admin Panel. What type of SaaS do you want? Health, Gym, School?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // Landing
      if (msg.includes("landing")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: "बिल्कुल! लैंडिंग पेज सिर्फ ₹4,999 में, 3 दिन में। किस चीज़ के लिए?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Landing Page ₹4,999 me, 3 din me. Kis cheez ke liye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! Landing Page ₹4,999, 3 days delivery. What is it for?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // Tools
      if (msg.includes("tool")) {
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: "Tools Website me Calculator, EMI, BMI, QR, Password Generator aur 15+ tools hote hai. ₹14,999 me ban jayegi. Kis topic pe chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Tools Website has Calculator, EMI, BMI, QR, Password Generator + 15 more. ₹14,999. What topic?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // === 2. AB TOPIC - Sirf Asli Topic, Faltu Shabd Hata Ke ===
      // Faltu shabd hata do
      let clean = msg.replace(/नहीं|नही|एक|मुझे|मujhe|chahiye|banwani|banwana|banana|hai|he|kya|mujhe|muje|ek|please|plz|batao|website|वेबसाइट|वेबसाईट/g, " ").trim();
      // Ab clean me sirf topic bachega - jaise health, news, sports
      const topics = ["news", "न्यूज", "sports", "gym", "health", "हेल्थ", "school", "college", "hospital", "doctor", "clinic", "finance", "travel", "food", "fashion", "job", "business", "blog", "ecommerce", "shop", "property", "music", "movie", "cricket", "football", "yoga", "fitness"];
      let foundTopic = "";
      for (const t of topics) { if (msg.includes(t)) { foundTopic = t; break; } }
      // Agar list me nahi mila aur clean chhota hai, to clean ko hi topic mano, par pura sentence nahi
      if (!foundTopic && clean.length > 1 && clean.length < 20 && !clean.includes(" ")) foundTopic = clean;

      if (foundTopic) {
        const topicName = foundTopic.charAt(0).toUpperCase() + foundTopic.slice(1);
        if (isHindiScript) return new Response(JSON.stringify({ reply: `बिल्कुल! ${topicName} वेबसाइट बन जाएगी। इसमें ${topicName} से जुड़े Articles, Tools, Blog, WhatsApp बटन होगा। ये Landing Page (₹4,999) में चाहिए या Tools Website (₹14,999) में?` }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: `Bilkul! ${topicName} Website ban jayegi. Isme ${topicName} se judi Articles, Tools, Blog, WhatsApp Button hoga. Ye Landing Page (₹4,999) me chahiye ya Tools Website (₹14,999) me?` }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: `Sure! ${topicName} Website is possible. It will have ${topicName} Articles, Tools, Blog, WhatsApp Button. Do you want it as Landing Page (₹4,999) or Tools Website (₹14,999)?` }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      if (isHindiScript) return new Response(JSON.stringify({ reply: "समझ गया! थोड़ा डिटेल बताओ, किस चीज़ के लिए बनवानी है?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      if (isHinglish) return new Response(JSON.stringify({ reply: "Samajh gaya! Thoda detail batao, kis cheez ke liye banwani hai?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ reply: "Tell me a little more - what should it do? I will suggest the right plan." }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) { return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } }); }
  }
};
