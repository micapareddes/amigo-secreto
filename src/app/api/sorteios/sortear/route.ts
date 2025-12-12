import { NextRequest, NextResponse } from 'next/server';
import { buscarSorteio, atualizarSorteio } from '@/lib/sorteios-store';

// POST - Realizar sorteio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nome } = body;

    if (!id || !nome) {
      return NextResponse.json(
        { error: 'ID do sorteio e nome são obrigatórios' },
        { status: 400 }
      );
    }

    const sorteio = buscarSorteio(id);
    if (!sorteio) {
      return NextResponse.json({ error: 'Sorteio não encontrado' }, { status: 404 });
    }

    const nomeLimpo = nome.trim();

    // Verifica se a pessoa já foi sorteada
    if (sorteio.sorteados[nomeLimpo]) {
      return NextResponse.json(
        { error: 'Você já foi sorteado!', sorteado: sorteio.sorteados[nomeLimpo] },
        { status: 400 }
      );
    }

    // Verifica se a pessoa está na lista
    if (!sorteio.participantes.includes(nomeLimpo)) {
      return NextResponse.json(
        { error: 'Seu nome não está na lista de participantes' },
        { status: 400 }
      );
    }

    // Pega pessoas disponíveis (não sorteadas e não é a própria pessoa)
    const disponiveis = sorteio.participantes.filter(
      p => !Object.values(sorteio.sorteados).includes(p) && p !== nomeLimpo
    );

    if (disponiveis.length === 0) {
      return NextResponse.json(
        { error: 'Não há mais pessoas disponíveis para sortear' },
        { status: 400 }
      );
    }

    // Sorteia uma pessoa aleatória
    const sorteado = disponiveis[Math.floor(Math.random() * disponiveis.length)];

    // Registra o sorteio
    sorteio.sorteados[nomeLimpo] = sorteado;

    // Atualiza no Map
    atualizarSorteio(id, sorteio);

    return NextResponse.json({
      sorteado,
      totalSorteados: Object.keys(sorteio.sorteados).length,
      totalParticipantes: sorteio.participantes.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao realizar sorteio' },
      { status: 500 }
    );
  }
}

