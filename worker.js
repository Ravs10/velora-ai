// Velora AI - V11 FINAL
export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V11 Live", { headers: cors });
    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

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
      const isHinglish = msg.includes("mujhe") || msg.includes("muje") || msg.includes("chahiye") || msg.includes("banana") || msg.includes("banwana") || msg.includes("banvani") || msg.includes("kitna") || msg.includes("lagega") || msg.includes("paisa");

      // === 1. COMMERCE / ECOMMERCE / SOCIAL - Sabse Pehle, kyunki ye Custom hai ===
      if (msg.includes("commerce") || msg.includes("ecommerce") || msg.includes("e-commerce") || msg.includes("social") || msg.includes("सोशल") || msg.includes("shop") || msg.includes("store") || msg.includes("marketplace")) {
        // Agar Price bhi pucha hai to seedha Custom price
        if (msg.includes("price") || msg.includes("kitna") || msg.includes("paisa") || msg.includes("lagega") || msg.includes("cost") || msg.includes("rate")) {
          if (isHindiScript) return new Response(JSON.stringify({ reply: "Full Feature Commerce / Social Website Custom me banegi - ₹49,999+ se start hai. Isme Login, Payment, Product / Post, Admin Panel sab hoga. 50% Advance pe kaam start ho jayega. Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
          if (isHinglish) return new Response(JSON.stringify({ reply: "Full Feature Commerce / Social Website Custom me banegi - ₹49,999+ se start hai. Login, Payment, Product / Post, Admin Panel sab hoga. 50% Advance pe kaam start ho jayega. Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: "Full Feature Commerce / Social Website comes under Custom - Starts at ₹49,999+. Login, Payment, Product / Post, Admin Panel included. Work starts with 50% advance. Shall I confirm?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (isHindiScript) return new Response(JSON.stringify({ reply: "Bilkul! Commerce / Social Website ban jayegi. Ye Custom me banegi - ₹49,999+ se start. Login, Payment, Admin Panel sab hoga. Kis type ki chahiye - Shopping wali ya Social wali?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Commerce / Social Website ban jayegi. Ye Custom me banegi - ₹49,999+ se start. Login, Payment, Admin Panel sab hoga. Kis type ki chahiye - Shopping wali ya Social wali?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! Commerce / Social Website will be Custom - Starts at ₹49,999+. Login, Payment, Admin Panel included. Which type - Shopping or Social?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // === 2. PRICE ===
      if (msg.includes("price") || msg.includes("kitna") || msg.includes("cost") || msg.includes("rate") || msg.includes("paisa") || msg.includes("lagega")) {
        if (msg.includes("tool")) {
          if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: "Tools Website sirf ₹14,999 me. 15+ Tools, AdSense, SEO, 7 din me. Kis topic pe chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: "Tools Website is just ₹14,999. 15+ Tools, AdSense, SEO, 7 days. What topic?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Kaunsa chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Which one?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // === 3. FULL + TOPIC - Jaise Full Sports ===
      // Agar Full ke saath koi topic bhi hai, to topic wala jawab do, Complete wala nahi
      const topicList = ["sports", "news", "न्यूज", "gym", "health", "हेल्थ", "school", "college", "hospital", "political", "cricket", "football", "travel", "food", "fashion", "job", "business"];
      let foundTopicEarly = "";
      for (const t of topicList) { if (msg.includes(t)) { foundTopicEarly = t; break; } }
      if ((msg.includes("full") || msg.includes("puri") || msg.includes("poori")) && foundTopicEarly) {
        const topicName = foundTopicEarly.charAt(0).toUpperCase() + foundTopicEarly.slice(1);
        if (isHindiScript) return new Response(JSON.stringify({ reply: `Bilkul! Full ${topicName} Website ban jayegi - Tools Website me - ₹14,999. Isme Home, ${topicName} Articles, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?` }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: `Bilkul! Full ${topicName} Website ban jayegi - Tools Website me - ₹14,999. Home, ${topicName} Articles, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?` }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: `Perfect! Full ${topicName} Website - Tools Website - ₹14,999. Home, ${topicName} Articles, 15+ Tools, Blog, SEO, everything. Shall I confirm?` }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // === 4. COMPLETE - Ab Health wala word hata diya ===
      if (msg.includes("complete") || msg.includes("complet") || msg.includes("कम्प्लीट") || msg.includes("कंप्लीट") || msg.includes("full")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: "Bilkul! Complete Website matlab Tools Website - ₹14,999. Isme Home Page, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! Complete Website matlab Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Perfect! Complete Website = Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO, everything. Shall I confirm?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // SaaS
      if (msg.includes("saas")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start hai. Login, Dashboard, Payment, Admin Panel sab hota hai. Kis type ka SaaS chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: "Bilkul! SaaS ₹29,999 se start hai. Login, Dashboard, Payment, Admin Panel sab hota hai. Kis type ka SaaS chahiye?" }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: "Sure! SaaS starts at ₹29,999. Login, Dashboard, Payment, Admin Panel included. What type of SaaS?" }), { headers: { ...cors, "Content-Type": "application/json" } });
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

      // === 5. BAAKI TOPIC ===
      if (foundTopicEarly) {
        const topicName = foundTopicEarly.charAt(0).toUpperCase() + foundTopicEarly.slice(1);
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
