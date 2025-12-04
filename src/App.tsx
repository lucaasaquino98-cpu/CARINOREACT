/*
Mi cariño — Single-file React component (Tailwind CSS)

Instruções rápidas:
1) Coloque este arquivo como `MiCarino.jsx` em um projeto React (Vite/Next/Create React App).
2) Configure Tailwind CSS no projeto (padrão). O componente usa classes Tailwind.
3) Para o chat com IA *real*, crie um endpoint servidor (ex: /api/chat) que chame a OpenAI API com o prompt fornecido. Enquanto não tiver backend, o chat funciona em modo demo (respostas simuladas).
4) Substitua as URLs das fotos em `photos` pela URLs das suas fotos ou coloque-as em `public/images/`.

Descrição do que está incluído:
- Tema estrela/galáxia (gradientes, partículas animadas)
- Cabeçalho com nome "Mi cariño"
- Declaração de amor pronta para editar
- Galeria de fotos (modal lightbox)
- Chat romântico com personalidade cristã (baseado em prompt, é necessário backend para respostas reais)
- Área para você escrever na interface (o chat tentará responder escrevendo como você com tom cristão)

*/

import React, { useState, useEffect, useRef } from "react";

export default function MiCarino() {
  const [declaration] = useState(
    `Minha querida,\n\nDesde o primeiro olhar, senti que Deus nos uniu. Cada dia ao seu lado é presente do Senhor — sua alegria ilumina meu caminho e sua fé me inspira a ser melhor. Prometo cuidar de você, rezar por você e construir memórias cheias de amor e gratidão. Te amo hoje, amanhã e sempre.\n\nCom todo o meu amor,\nLucas`
  );

  // Replace these sample images with your real photo URLs or put images in public/images/
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
      text: "Oi, amor. Sou seu assistente para lembrar e expressar carinho — posso escrever uma mensagem como você, com um tom cristão e cheio de amor. Diga o que quer que eu escreva!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Build the prompt to send to the server which will call OpenAI.
  function buildPrompt(userText) {
    return `You are a loving Christian man named Lucas writing to his fiancée, always calling her 'cariño' in your replies. You respond with tenderness, gratitude to God, and humility. Maintain a warm, romantic tone without exagero. Use imagery of stars, galaxy, and God's promises. Reply only in Portuguese. Limit to 300 words. User message: \"${userText}\".`;
  }

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    // Attempt to call a serverless endpoint at /api/chat (not included).
    // If not available, fallback to a simulated response generator (demo mode).
    try {
      const payload = { prompt: buildPrompt(userMsg), history: messages };
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("no server");

      const data = await res.json();
      // Expecting { reply: "..." }
      const reply = data.reply ?? "";
      setMessages((m) => [...m, { from: "ai", text: reply }]);
    } catch (err) {
      // Demo fallback: simple templated response that imitates the persona.
      const reply = demoResponder(userMsg);
      // small delay to simulate thinking
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 700));
      setMessages((m) => [...m, { from: "ai", text: reply }]);
    } finally {
      setLoading(false);
    }
  }

  function demoResponder(userText) {
    // Very simple templated responses for offline demo use only.
    const base = `Meu amor, ao ler isso fui lembrado das bênçãos de Deus por nós. `;
    if (userText.toLowerCase().includes("sinto falta"))
      return (
        base +
        `Sinto também. Oro para que logo estejamos juntos, e até lá mantenho você em minhas preces.`
      );
    if (userText.toLowerCase().includes("desculpa"))
      return (
        base +
        `Seus passos são guiados pela graça — perdoar faz parte do caminho que Deus nos chama a seguir.`
      );
    if (userText.toLowerCase().includes("surpresa"))
      return (
        base +
        `Já imagino um momento simples: velas, música suave e a companhia do Senhor iluminando nosso encontro.`
      );
    return (
      base +
      `Que alegria compartilhar isso com você. Oro para que nossa história reflita o amor de Cristo em tudo.`
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-black text-white flex flex-col">
      {/* Starfield background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="w-full h-full animate-pulse opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.0) 40%)",
          }}
        />
        {/* Decorative twinkling stars */}
        <div className="pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <span
              key={i}
              className="block absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random(),
                transform: `translate(-50%, -50%)`,
                filter: `drop-shadow(0 0 ${
                  Math.random() * 3
                }px rgba(255,255,255,0.6))`,
              }}
            />
          ))}
        </div>
      </div>

      <header className="py-8 px-6 md:px-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Mi cariño
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Um lugar de memórias, amor e gratidão a Deus
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Feito com ❤️ e fé</p>
        </div>
      </header>

      <main className="flex-1 px-6 md:px-12 pb-12">
        <section className="max-w-4xl mx-auto bg-gradient-to-tr from-black/40 to-white/3 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-sm border border-white/5">
          <div className="md:flex md:gap-8">
            <div className="md:flex-1">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Minha declaração
              </h2>
              <p className="mt-4 whitespace-pre-line text-slate-200">
                {declaration}
              </p>

              <div className="mt-6">
                <h3 className="text-sm text-slate-300">Galeria</h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {photos.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="rounded-lg overflow-hidden h-20 w-full bg-slate-700/30 flex items-center justify-center"
                    >
                      <img
                        src={src}
                        alt={`Foto ${i + 1}`}
                        className="object-cover h-20 w-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="md:w-96 mt-6 md:mt-0">
              <div className="bg-gradient-to-b from-white/5 to-transparent p-4 rounded-xl border border-white/6">
                <h4 className="font-semibold">Chat romântico</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Escreva o que você quer dizer — a IA responde como você, com
                  um tom cristão e acolhedor.
                </p>

                <div className="mt-4 h-64 overflow-y-auto rounded-lg p-3 bg-black/30 border border-white/4">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`mb-3 ${
                        m.from === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block max-w-full break-words px-3 py-2 rounded-xl ${
                          m.from === "user" ? "bg-indigo-600/60" : "bg-white/6"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 rounded-lg px-3 py-2 bg-black/40 border border-white/6 focus:outline-none"
                    placeholder="Escreva algo pra ela..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage();
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 transition disabled:opacity-60"
                  >
                    {loading ? "Enviando..." : "Enviar"}
                  </button>
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  Modo demo ativado se /api/chat não estiver disponível.
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-300 bg-black/20 p-3 rounded-lg border border-white/5">
                <strong>Exemplo de uso:</strong>
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    "Escreve uma mensagem para nosso aniversário de namoro"
                  </li>
                  <li>"Diga que estou orando por ela e que a amo"</li>
                  <li>"Sugira uma surpresa simples e bonita"</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <footer className="max-w-4xl mx-auto mt-8 text-sm text-slate-400">
          Feito com carinho e fé • Lucas
        </footer>
      </main>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-w-3xl w-full relative">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 bg-black/40 rounded-full px-3 py-2"
            >
              Fechar
            </button>
            <img
              src={photos[lightboxIndex]}
              alt="Foto ampliada"
              className="w-full object-contain rounded-lg"
            />
            <div className="mt-2 flex justify-between text-sm text-slate-300">
              <button
                onClick={() =>
                  setLightboxIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
                }
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setLightboxIndex((i) => (i === photos.length - 1 ? 0 : i + 1))
                }
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small decorative footer stars */}
      <div className="h-10" />
    </div>
  );
}
