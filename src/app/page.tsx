'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [participantes, setParticipantes] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [linkGerado, setLinkGerado] = useState<string | null>(null);
  const router = useRouter();

  const adicionarParticipante = () => {
    setParticipantes([...participantes, '']);
  };

  const atualizarParticipante = (index: number, valor: string) => {
    const novos = [...participantes];
    novos[index] = valor;
    setParticipantes(novos);
  };

  const removerParticipante = (index: number) => {
    if (participantes.length > 1) {
      setParticipantes(participantes.filter((_, i) => i !== index));
    }
  };

  const criarSorteio = async () => {
    const participantesLimpos = participantes
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (participantesLimpos.length < 2) {
      alert('Adicione pelo menos 2 participantes!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sorteios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantes: participantesLimpos }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao criar sorteio');
        return;
      }

      const data = await response.json();
      const link = `${window.location.origin}/sorteio/${data.id}`;
      setLinkGerado(link);
    } catch (error) {
      alert('Erro ao criar sorteio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copiarLink = () => {
    if (linkGerado) {
      navigator.clipboard.writeText(linkGerado);
      alert('Link copiado para a área de transferência!');
    }
  };

  const novoSorteio = () => {
    setLinkGerado(null);
    setParticipantes(['']);
  };

  if (linkGerado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#F5F1E8] rounded-3xl shadow-lg p-8 max-w-md w-full border-2 border-[#FFF9C4]">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-[#5D4037] mb-2 font-handwritten" style={{ fontFamily: 'var(--font-caveat)' }}>
              Sorteio Criado!
            </h1>
            <p className="text-[#8D6E63] text-lg">
              Compartilhe este link com os participantes
            </p>
          </div>

          <div className="bg-[#FFF9C4] rounded-xl p-4 mb-6 border border-[#FFE082]">
            <p className="text-sm text-[#5D4037] mb-2 font-medium">Link compartilhável:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={linkGerado}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-[#FFE082] rounded-lg text-sm text-[#5D4037]"
              />
              <button
                onClick={copiarLink}
                className="px-4 py-2 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#5D4037] rounded-lg transition-colors font-medium border border-[#90CAF9]"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/sorteio/${linkGerado.split('/').pop()}`)}
              className="w-full px-4 py-3 bg-[#FCE4EC] hover:bg-[#F8BBD0] text-[#5D4037] font-semibold rounded-xl transition-all shadow-md hover:shadow-lg border-2 border-[#F48FB1]"
              style={{ fontFamily: 'var(--font-kalam)' }}
            >
              Ver Status do Sorteio
            </button>
            <button
              onClick={novoSorteio}
              className="w-full px-4 py-3 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#5D4037] rounded-xl transition-colors border border-[#90CAF9] font-medium"
            >
              Criar Novo Sorteio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#F5F1E8] rounded-3xl shadow-lg p-8 max-w-lg w-full border-2 border-[#FFF9C4]">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#5D4037] mb-3" style={{ fontFamily: 'var(--font-caveat)' }}>
            Amigo Secreto
          </h1>
          <p className="text-[#8D6E63] text-lg">
            Adicione os nomes dos participantes e gere um link compartilhável
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {participantes.map((participante, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={participante}
                onChange={(e) => atualizarParticipante(index, e.target.value)}
                placeholder={`Participante ${index + 1}`}
                className="flex-1 px-4 py-3 border-2 border-[#FFE082] rounded-xl focus:ring-2 focus:ring-[#FCE4EC] focus:border-[#F48FB1] bg-white text-[#5D4037] placeholder-[#8D6E63]"
              />
              {participantes.length > 1 && (
                <button
                  onClick={() => removerParticipante(index)}
                  className="px-4 py-3 bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#5D4037] rounded-xl transition-colors border border-[#E57373] font-medium"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={adicionarParticipante}
            className="w-full px-4 py-3 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#5D4037] rounded-xl transition-colors border border-[#90CAF9] font-medium"
          >
            + Adicionar Participante
          </button>
          <button
            onClick={criarSorteio}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#FCE4EC] hover:bg-[#F8BBD0] text-[#5D4037] font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#F48FB1]"
            style={{ fontFamily: 'var(--font-kalam)' }}
          >
            {loading ? 'Criando...' : 'Criar Sorteio e Gerar Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
