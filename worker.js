// Velora AI - Fixed Worker - No API Key Needed + Hindi/English
export default {
  async fetch(request, env) {
    // CORS - Isse website se connect hoga
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method === "GET") {
      return new Response("Velora AI is Live", { headers: cors });
    }

    try {
      const data = await request.json().catch(() => ({}));
      const userMsg = data.message || data.prompt || data.text || "";
      const msg = userMsg.toLowerCase();

      if (!userMsg) {
        return new Response(JSON.stringify({ reply: "Namaste! Kya banwana hai aapko? Landing Page, Tools Website ya SaaS?" }), { headers: { ...cors, "Content-Type": "application/json" } });
      }

      // Hindi detect karo
      const isHindi = /[ँ-ःऀ-ॿ]/.test(userMsg) || msg.includes("mujhe") || msg.includes("banwana") || msg.includes("kitna") || msg.includes("kya") || msg.includes("chahiye") || msg.includes("price");

      let reply = "";

      // --- Velora ka Gyaan ---
      if (msg.includes("landing") || msg.includes("landing page")) {
        reply = isHindi ? "Landing Page ₹4,999 se shuru hai. 1 Page, SEO Ready, 3 din me delivery. Aapko kis cheez ke liye Landing Page chahiye?" : "Landing Page starts at ₹4,999. 1 Page, SEO Ready, Delivery in 3 Days. What do you want your Landing Page for?";
      } else if (msg.includes("tool") || msg.includes("website") || msg.includes("blog")) {
        reply = isHindi ? "Tools Website ₹14,999 se shuru hai. Jaise Lorem Pro Tool - 15+ Tools, AdSense Ready, 7 din me delivery. Aapko kis type ke tools chahiye?" : "Tools Website starts at ₹14,999. Like Lorem Pro Tool - 15+ Tools, AdSense Ready, Delivery in 7 Days. What kind of tools do you want?";
      } else if (msg.includes("saas") || msg.includes("app") || msg.includes("web app")) {
        reply = isHindi ? "Full SaaS / Web App ₹29,999 se shuru hai. Login + Dashboard + Payment ke saath. 15-20 din me delivery. Aapka SaaS idea kya hai?" : "Full SaaS / Web App starts at ₹29,999. With Login + Dashboard + Payment. Delivery in 15-20 Days. What is your SaaS idea?";
      } else if (msg.includes("price") || msg.includes("cost") || msg.includes("kitna") || msg.includes("rate") || msg.includes("daam")) {
        reply = isHindi ? "Price ye hai bhai: Landing Page ₹4,999, Tools Website ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Kaunsa banwana hai?" : "Here is the pricing: Landing Page ₹4,999, Tools Website ₹14,999, SaaS ₹29,999, Custom ₹49,999+. Which one do you want?";
      } else if (msg.includes("ravish") || msg.includes("founder") || msg.includes("kaun") || msg.includes("who")) {
        reply = isHindi ? "Main Velora AI hu, Velora ke founder Ravish Chandra Yadav ne mujhe banaya hai. Wo 25+ tools bana chuke hain. Aapko kya banwana hai?" : "I am Velora AI, built by Velora's founder Ravish Chandra Yadav. He has built 25+ tools. What do you want to build?";
      } else if (msg.includes("hi") || msg.includes("hello") || msg.includes("namaste") || msg.includes("hey")) {
        reply = isHindi ? "Namaste! Main Velora AI hu. Aapko kya banwana hai? Landing Page, Tools Website ya SaaS?" : "Hello! I am Velora AI. What do you want to build? Landing Page, Tools Website or SaaS?";
      } else if (msg.includes("contact") || msg.includes("whatsapp") || msg.includes("number") || msg.includes("mail") || msg.includes("email")) {
        reply = isHindi ? "Aap WhatsApp pe baat kar sakte ho: +91 82997 46179 ya Email: hello@velora.dev. 2 ghante me reply milega." : "You can WhatsApp us at +91 82997 46179 or Email: hello@velora.dev. Reply within 2 hours.";
      } else {
        // Agar Gemini Key hai to use karo, nahi to smart reply
        if (env.GEMINI_API_KEY) {
          try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts: [{ text: `You are Velora AI, assistant of Velora (founded by Ravish Chandra Yadav). Velora builds Landing Page Rs 4999, Tools Website Rs 14999, SaaS Rs 29999, Custom Rs 49999+. Reply in same language as user (Hindi in Roman or English). User: ${userMsg}` }] }] })
            });
            const geminiData = await geminiRes.json();
            reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          } catch {}
        }
        if (!reply) {
          reply = isHindi ? `Samajh gaya! Aapne bola: "${userMsg}". Ye kaam Velora aasani se kar dega. Aapko Landing Page (₹4,999) chahiye ya Tools Website (₹14,999)? Thoda detail batao.` : `Got it! You said: "${userMsg}". Velora can build this easily. Do you want a Landing Page (₹4,999) or Tools Website (₹14,999)? Tell me a little more.`;
        }
      }

      return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });

    } catch (e) {
      return new Response(JSON.stringify({ reply: "Namaste! Main Velora AI hu. Aapko kya banwana hai? Landing Page, Tools Website ya SaaS?" }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
  }
};
