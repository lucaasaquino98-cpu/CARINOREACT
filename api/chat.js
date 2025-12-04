// /api/chat.js — rota Serverless para Vercel
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt ausente" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // carregada da Vercel
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é Lucas enviando mensagens à sua noiva. Sempre chame ela de 'cariño'. Use tom romântico cristão, mencionando Deus, luz e amor.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const reply = completion.choices?.[0]?.message?.content || "cariño... ❤️";

    return res.status(200).json({ reply });
  } catch (err) {
    console.log("Erro no backend:", err);
    return res.status(500).json({
      error: "Erro interno",
      detail: err.message,
    });
  }
}
