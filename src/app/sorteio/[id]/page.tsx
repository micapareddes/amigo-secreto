'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface SorteioData {
  id: string;
  participantes: string[];
  sorteados: { [nome: string]: string };
  criadoEm: number;
}

export default function SorteioPage() {
  const params = useParams();
  const id = params.id as string;
  const [sorteio, setSorteio] = useState<SorteioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [sortando, setSortando] = useState(false);
  const [resultado, setResultado] = useState<{ sorteado: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarSorteio();
  }, [id]);

  const carregarSorteio = async () => {
    try {
      const response = await fetch(`/api/sorteios?id=${id}`);
      if (!response.ok) {
        setErro('Sorteio não encontrado');
        return;
      }
      const data = await response.json();
      setSorteio(data);
    } catch (error) {
      setErro('Erro ao carregar sorteio');
    } finally {
      setLoading(false);
    }
  };

  const realizarSorteio = async () => {
    if (!nome.trim()) {
      setErro('Digite seu nome');
      return;
    }

    setSortando(true);
    setErro(null);

    try {
      const response = await fetch('/api/sorteios/sortear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nome: nome.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.sorteado) {
          setResultado({ sorteado: data.sorteado });
        } else {
          setErro(data.error || 'Erro ao realizar sorteio');
        }
        return;
      }

      setResultado({ sorteado: data.sorteado });
      carregarSorteio();
    } catch (error) {
      setErro('Erro ao realizar sorteio. Tente novamente.');
    } finally {
      setSortando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FCE4EC] border-t-[#E3F2FD] mx-auto mb-4"></div>
          <p className="text-[#8D6E63] text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (erro && !sorteio) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#F5F1E8] rounded-3xl shadow-lg p-8 max-w-md w-full text-center border-2 border-[#FFCDD2]">
          <h1 className="text-3xl font-bold text-[#D32F2F] mb-4" style={{ fontFamily: 'var(--font-caveat)' }}>
            Ops!
          </h1>
          <p className="text-[#8D6E63] mb-6 text-lg">{erro}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#FCE4EC] hover:bg-[#F8BBD0] text-[#5D4037] rounded-xl transition-colors border-2 border-[#F48FB1] font-medium"
          >
            Voltar ao Início
          </a>
        </div>
      </div>
    );
  }

  if (resultado) {
    const totalSorteados = sorteio ? Object.keys(sorteio.sorteados).length : 0;
    const totalParticipantes = sorteio ? sorteio.participantes.length : 0;
    const completo = totalSorteados === totalParticipantes;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#F5F1E8] rounded-3xl shadow-lg p-8 max-w-md w-full text-center border-2 border-[#FFF9C4]">
          <div className="mb-6">
            <div className="text-7xl mb-4">🎁</div>
            <h1 className="text-3xl font-bold text-[#5D4037] mb-4" style={{ fontFamily: 'var(--font-caveat)' }}>
              Seu Amigo Secreto é:
            </h1>
            <div className="bg-gradient-to-r from-[#FCE4EC] to-[#E3F2FD] text-[#5D4037] text-5xl font-bold py-8 px-8 rounded-2xl my-6 shadow-lg border-2 border-[#F48FB1]" style={{ fontFamily: 'var(--font-kalam)' }}>
              {resultado.sorteado}
            </div>
          </div>

          <div className="bg-[#FFF9C4] rounded-xl p-4 mb-6 border border-[#FFE082]">
            <p className="text-sm text-[#5D4037] mb-1 font-medium">
              Status do Sorteio
            </p>
            <p className="text-xl font-semibold text-[#5D4037]">
              {totalSorteados} de {totalParticipantes} participantes
            </p>
            {completo && (
              <p className="text-[#388E3C] font-semibold mt-2 text-lg">
                ✨ Todos os sorteios foram realizados!
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setResultado(null);
              setNome('');
            }}
            className="w-full px-4 py-3 bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#5D4037] rounded-xl transition-colors border border-[#90CAF9] font-medium"
          >
            Ver Status Novamente
          </button>
        </div>
      </div>
    );
  }

  const totalSorteados = sorteio ? Object.keys(sorteio.sorteados).length : 0;
  const totalParticipantes = sorteio ? sorteio.participantes.length : 0;
  const completo = totalSorteados === totalParticipantes;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#F5F1E8] rounded-3xl shadow-lg p-8 max-w-md w-full border-2 border-[#FFF9C4]">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#5D4037] mb-2" style={{ fontFamily: 'var(--font-caveat)' }}>
            Amigo Secreto
          </h1>
          <p className="text-[#8D6E63] text-lg">
            Digite seu nome para descobrir seu amigo secreto
          </p>
        </div>

        {sorteio && (
          <div className="bg-[#FFF9C4] rounded-xl p-4 mb-6 border border-[#FFE082]">
            <p className="text-sm text-[#5D4037] mb-1 font-medium">
              Participantes: {sorteio.participantes.join(', ')}
            </p>
            <p className="text-sm text-[#5D4037]">
              Status: {totalSorteados} de {totalParticipantes} sorteados
            </p>
            {completo && (
              <p className="text-[#388E3C] font-semibold mt-2">
                ✨ Todos os sorteios foram realizados!
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-2">
              Seu Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErro(null);
              }}
              placeholder="Digite seu nome"
              className="w-full px-4 py-3 border-2 border-[#FFE082] rounded-xl focus:ring-2 focus:ring-[#FCE4EC] focus:border-[#F48FB1] bg-white text-[#5D4037] placeholder-[#8D6E63]"
            />
          </div>

          {erro && (
            <div className="bg-[#FFCDD2] border-2 border-[#E57373] rounded-xl p-3">
              <p className="text-sm text-[#D32F2F]">{erro}</p>
            </div>
          )}

          <button
            onClick={realizarSorteio}
            disabled={sortando || completo}
            className="w-full px-4 py-3 bg-[#FCE4EC] hover:bg-[#F8BBD0] text-[#5D4037] font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#F48FB1]"
            style={{ fontFamily: 'var(--font-kalam)' }}
          >
            {sortando ? 'Sortendo...' : completo ? 'Sorteio Completo' : 'Descobrir Amigo Secreto'}
          </button>
        </div>
      </div>
    </div>
  );
}
