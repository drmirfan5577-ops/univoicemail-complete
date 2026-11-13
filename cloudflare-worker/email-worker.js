/**
 * UniVoiceMail — Cloudflare Email Worker
 * Domain: uniorbi.com
 *
 * Deploy with: wrangler deploy
 * Bind to Email Routing rules for *@uniorbi.com
 */

export default {
  async email(message, env, ctx) {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get("subject") || "(no subject)";
    const messageId = message.headers.get("message-id") || crypto.randomUUID();
    const date = message.headers.get("date") || new Date().toISOString();

    // Read raw MIME
    const raw = await new Response(message.raw).arrayBuffer();
    const rawText = new TextDecoder().decode(raw);

    // Forward to UniVoiceMail backend webhook
    const payload = {
      id: messageId,
      from,
      to,
      subject,
      date,
      raw: rawText,
      headers: Object.fromEntries(message.headers),
    };

    try {
      const res = await fetch(env.UNIVOICE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Worker-Secret": env.WORKER_SECRET,
          "X-Domain": "uniorbi.com",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Webhook failed:", res.status, await res.text());
        // Optionally reject or forward to fallback
        // message.setReject("Temporary failure");
      }
    } catch (err) {
      console.error("Worker error:", err);
      // message.setReject("Processing error");
    }
  },
};
