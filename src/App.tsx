// Mi cariño — React + Vite + Tailwind + Deploy-ready for Vercel
// ------------------------------------------------------------
// Este arquivo substitui completamente o anterior e já está 100% compatível
// com deploy na Vercel.
// IMPORTANTE:
// 1) Coloque este arquivo em: src/MiCarino.jsx
// 2) Seu projeto Vite precisa ter:
//    - vite.config.js com base configurada automaticamente pela Vercel (nenhuma alteração necessária)
//    - pasta /api para rotas serverless (criarei abaixo)
// 3) O backend real da IA ficará em /api/chat.js
// 4) Tailwind configurado no Vite:
//    - tailwind.config.js
//    - postcss.config.js
//    - index.css com @tailwind base/components/utilities
// 5) NÃO use import.meta.env.PUBLIC_OPENAI_KEY (chaves nunca ficam no front!)
//    A rota /api/chat usa process.env.OPENAI_API_KEY

import React, { useState, useEffect, useRef } from "react";

export default function MiCarino() {
  const [declaration] = useState(
    `Minha querida,

Desde o primeiro olhar, senti que Deus nos uniu. Cada dia ao seu lado é um presente do Senhor — sua alegria ilumina meu caminho e sua fé me inspira a ser melhor. Prometo cuidar de você, orar por você e construir memórias cheias de amor e gratidão. Te amo hoje, amanhã e sempre.

Com todo o meu amor,
Lucas`
  );

  const [photos] = useState([
    "/images/photo1.jpg",
    "/images/photo2.jpg",
    "/images/photo3.jpg",
  ]);

  const [lightboxIndex, setLightboxIndex] = useState(null);

  // CHAT STATE
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Oi, cariño. Sou seu assistente para expressar amor e fé — posso escrever mensagens como você faria, com carinho cristão. O que deseja dizer a ela hoje?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function buildPrompt(userText) {
    return `Você é Lucas, escrevendo para sua noiva e chamando-a sempre de 'cariño'. Use carinho cristão, amor sincero e referências a Deus, luz e galáxias. Responda em português.
Mensagem do usuário: "${userText}"`;
  }

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        prompt: buildPrompt(userMsg),
        history: messages,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Sem backend");

      const data = await res.json();
      setMessages((m) => [...m, { from: "ai", text: data.reply }]);
    } catch (err) {
      // fallback
      const reply = `cariño, mesmo sem conexão com o servidor, quero te lembrar que Deus cuida da nossa história. Cada palavra sua ilumina meu coração.`;
      await new Promise((r) => setTimeout(r, 800));
      setMessages((m) => [...m, { from: "ai", text: reply }]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-black text-white flex flex-col">
      {/* Background estrelas */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="w-full h-full animate-pulse opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 50%)",
          }}
        />
      </div>

      <header className="py-8 px-6 md:px-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold">Mi cariño</h1>
          <p className="text-sm text-slate-300">
            Um lugar de amor, fé e memórias
          </p>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-12 pb-20">
        <section className="max-w-4xl mx-auto bg-white/5 rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-md border border-white/10">
          <div className="md:flex md:gap-10">
            {/* DECLARAÇÃO */}
            <div className="md:flex-1">
              <h2 className="text-3xl font-semibold">Minha declaração</h2>
              <p className="mt-4 whitespace-pre-line text-slate-200">
                {declaration}
              </p>

              {/* GALERIA */}
              <div className="mt-6">
                <h3 className="text-sm text-slate-300 mb-2">Galeria</h3>
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((src, i) => (
                    <button key={i} onClick={() => setLightboxIndex(i)}>
                      <img
                        src={src}
                        alt={`Foto ${i + 1}`}
                        className="rounded-lg h-24 w-full object-cover border border-white/10"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CHAT */}
            <aside className="md:w-96 mt-10 md:mt-0">
              <h3 className="text-xl font-semibold">Chat Romântico</h3>
              <p className="text-xs text-slate-300">A IA responde como você.</p>

              {/* MENSAGENS */}
              <div className="mt-4 h-72 overflow-y-auto rounded-lg p-3 bg-black/30 border border-white/10">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`mb-3 ${
                      m.from === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block px-3 py-2 rounded-xl text-sm ${
                        m.from === "user" ? "bg-indigo-600/60" : "bg-white/10"
                      }`}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 rounded-lg px-3 py-2 bg-black/40 border border-white/10"
                  placeholder="Escreva algo para ela..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:opacity-50"
                >
                  {loading ? "..." : "Enviar"}
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="max-w-3xl w-full relative">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 bg-white/20 px-3 py-1 rounded-lg"
            >
              Fechar
            </button>
            <img
              src={photos[lightboxIndex]}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
