// Velora AI - V12 - API Test + Hindi Fix
export default {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return new Response("Velora AI V12 Live - Key=" + (env.GEMINI_API_KEY ? "YES" : "NO"), { headers: cors });
    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      if (!userMsg) return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } });

      // GEMINI - Agar chalega to [AI] likha aayega
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
          if (reply) return new Response(JSON.stringify({ reply: "[AI] " + reply }), { headers: { ...cors, "Content-Type": "application/json" } });
        } catch (e) {}
      }

      // BACKUP - Agar API fail hogi to [Backup] likha aayega
      const msg = userMsg.toLowerCase();
      const isHindiScript = /[ँ-ःऀ-ॿ]/.test(userMsg);
      const isHinglish = msg.includes("mujhe") || msg.includes("muje") || msg.includes("chahiye") || msg.includes("banana") || msg.includes("banwana") || msg.includes("banvani") || msg.includes("kitna") || msg.includes("कितना") || msg.includes("पैसा");

      const addTag = (t) => "[Backup] " + t;

      // COMMERCE
      if (msg.includes("commerce") || msg.includes("ecommerce") || msg.includes("e-commerce") || msg.includes("social") || msg.includes("सोशल") || msg.includes("shop") || msg.includes("store")) {
        if (msg.includes("price") || msg.includes("kitna") || msg.includes("कितना") || msg.includes("paisa") || msg.includes("पैसा") || msg.includes("lagega") || msg.includes("लगेगा") || msg.includes("cost")) {
          if (isHindiScript) return new Response(JSON.stringify({ reply: addTag("Full Feature Commerce Website Custom me banegi - ₹49,999+ se start. Login, Payment, Admin sab hoga. Confirm kar du?") }), { headers: { ...cors, "Content-Type": "application/json" } });
          if (isHinglish) return new Response(JSON.stringify({ reply: addTag("Full Feature Commerce Website Custom me banegi - ₹49,999+ se start. Login, Payment, Admin sab hoga. Confirm kar du?") }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: addTag("Full Feature Commerce Website Custom - Starts at ₹49,999+. Login, Payment, Admin included. Shall I confirm?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: addTag("Bilkul! Commerce / Social Website ban jayegi. Custom me - ₹49,999+ se start. Login, Payment, Admin sab hoga. Shopping wali ya Social wali?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag("Sure! Commerce / Social Website Custom - Starts at ₹49,999+. Login, Payment, Admin included. Shopping or Social?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // PRICE - Hindi + English dono
      if (msg.includes("price") || msg.includes("kitna") || msg.includes("कितना") || msg.includes("कीमत") || msg.includes("paisa") || msg.includes("पैसा") || msg.includes("lagega") || msg.includes("लगेगा") || msg.includes("loge") || msg.includes("लोगे") || msg.includes("cost") || msg.includes("rate")) {
        if (msg.includes("tool") || msg.includes("calculator") || msg.includes("कैलकुलेटर")) {
          if (isHindiScript) return new Response(JSON.stringify({ reply: addTag("Calculator Tools Website me aayega - Tools Website sirf ₹14,999 me. Isme Calculator + 15 aur Tools, AdSense, SEO sab hoga. Confirm kar du?") }), { headers: { ...cors, "Content-Type": "application/json" } });
          if (isHinglish) return new Response(JSON.stringify({ reply: addTag("Calculator Tools Website me aayega - ₹14,999 me. Calculator + 15 aur Tools, AdSense, SEO sab hoga. Confirm kar du?") }), { headers: { ...cors, "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ reply: addTag("Calculator comes in Tools Website - Just ₹14,999. Calculator + 15 more Tools, AdSense, SEO. Shall I confirm?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        }
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: addTag("Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Kaunsa chahiye?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag("Landing ₹4,999, Tools ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Which one?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // CALCULATOR - Akela bhi
      if (msg.includes("calculator") || msg.includes("कैलकुलेटर") || msg.includes("calc")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: addTag("Bilkul! Calculator Website ban jayegi - Tools Website me - ₹14,999. EMI, Age, BMI, QR jaise 15+ Tools bhi honge. Confirm kar du?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: addTag("Bilkul! Calculator Website ban jayegi - Tools Website me - ₹14,999. EMI, Age, BMI, QR jaise 15+ Tools bhi honge. Confirm kar du?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag("Sure! Calculator Website - Tools Website - ₹14,999. EMI, Age, BMI, QR + 15 more Tools. Shall I confirm?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // FULL + TOPIC - Sport / Sports dono
      const topicList = ["sport", "sports", "news", "न्यूज", "gym", "health", "हेल्थ", "school", "college", "hospital", "political", "cricket", "football", "travel", "food", "fashion", "job", "business"];
      let found = "";
      for (const t of topicList) { if (msg.includes(t)) { found = t; break; } }
      if ((msg.includes("full") || msg.includes("puri") || msg.includes("poori")) && found) {
        let topicName = found === "sport" ? "Sports" : found.charAt(0).toUpperCase() + found.slice(1);
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: addTag(`Bilkul! Full ${topicName} Website ban jayegi - Tools Website me - ₹14,999. Home, ${topicName} Articles, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?`) }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag(`Perfect! Full ${topicName} Website - Tools Website - ₹14,999. Home, ${topicName} Articles, 15+ Tools, Blog, SEO. Shall I confirm?`) }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // COMPLETE
      if (msg.includes("complete") || msg.includes("complet") || msg.includes("कम्प्लीट") || msg.includes("कंप्लीट") || msg.includes("full")) {
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: addTag("Bilkul! Complete Website matlab Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO sab hoga. Confirm kar du?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag("Perfect! Complete Website = Tools Website - ₹14,999. Home, 15+ Tools, Blog, SEO. Shall I confirm?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // SAAS
      if (msg.includes("saas")) {
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: addTag("Bilkul! SaaS ₹29,999 se start. Login, Dashboard, Payment, Admin sab hoga. Kis type ka SaaS chahiye?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag("Sure! SaaS starts at ₹29,999. Login, Dashboard, Payment, Admin included. What type of SaaS?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // LANDING
      if (msg.includes("landing")) {
        if (isHindiScript) return new Response(JSON.stringify({ reply: addTag("बिल्कुल! लैंडिंग पेज सिर्फ ₹4,999 में, 3 दिन में। किस चीज़ के लिए?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: addTag("Bilkul! Landing Page ₹4,999 me, 3 din me. Kis cheez ke liye?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag("Sure! Landing Page ₹4,999, 3 days delivery. What is it for?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // TOOLS
      if (msg.includes("tool")) {
        if (isHinglish || isHindiScript) return new Response(JSON.stringify({ reply: addTag("Tools Website me Calculator, EMI, BMI, QR aur 15+ tools hote hai. ₹14,999 me ban jayegi. Kis topic pe chahiye?") }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag("Tools Website has Calculator, EMI, BMI, QR + 15 more. ₹14,999. What topic?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      // BAAKI TOPIC
      if (found) {
        let topicName = found === "sport" ? "Sports" : found.charAt(0).toUpperCase() + found.slice(1);
        if (isHindiScript) return new Response(JSON.stringify({ reply: addTag(`बिल्कुल! ${topicName} वेबसाइट बन जाएगी। ${topicName} Articles, Tools, Blog, WhatsApp बटन होगा। Landing (₹4,999) या Tools (₹14,999)?`) }), { headers: { ...cors, "Content-Type": "application/json" } });
        if (isHinglish) return new Response(JSON.stringify({ reply: addTag(`Bilkul! ${topicName} Website ban jayegi. ${topicName} Articles, Tools, Blog, WhatsApp Button hoga. Landing (₹4,999) ya Tools (₹14,999)?`) }), { headers: { ...cors, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ reply: addTag(`Sure! ${topicName} Website is possible. ${topicName} Articles, Tools, Blog, WhatsApp Button. Landing (₹4,999) or Tools (₹14,999)?`) }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      if (isHindiScript) return new Response(JSON.stringify({ reply: addTag("समझ गया! थोड़ा डिटेल बताओ, किस चीज़ के लिए बनवानी है?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      if (isHinglish) return new Response(JSON.stringify({ reply: addTag("Samajh gaya! Thoda detail batao, kis cheez ke liye banwani hai?") }), { headers: { ...cors, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ reply: addTag("Tell me a little more - what should it do? I will suggest the right plan.") }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) { return new Response(JSON.stringify({ reply: "Hello! What do you want to build?" }), { headers: { ...cors, "Content-Type": "application/json" } }); }
  }
};
