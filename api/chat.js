// File: api/chat.js (Vercel Serverless Function)
// Coloque em /api/chat.js ou /api/chat.ts dependendo do seu setup.
// Certifique-se de definir a variável de ambiente OPENAI_API_KEY na Vercel.

import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { prompt, history } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt ausente" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Construção da mensagem final para o modelo
    const messages = [
      {
        role: "system",
        content:
          "Você é Lucas, um homem cristão, amoroso, humilde e profundamente grato a Deus. Sempre que responder, chame sua noiva de 'cariño'. Suas respostas devem ser românticas, suaves, cheias de fé e com referências a estrelas, galáxias e promessas de Deus. Responda sempre em português.",
      },
      ...(history || []).map((msg) => ({
        role: msg.from === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      {
        role: "user",
        content: prompt,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // pode trocar para outro modelo
      messages,
      temperature: 0.8,
      max_tokens: 400,
    });

    const reply = completion.choices?.[0]?.message?.content || "";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
