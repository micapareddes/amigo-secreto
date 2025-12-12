import { NextRequest, NextResponse } from 'next/server';
import { criarSorteio, buscarSorteio } from '@/lib/sorteios-store';

// GET - Buscar sorteio por ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID do sorteio é obrigatório' }, { status: 400 });
  }

  const sorteio = buscarSorteio(id);
  if (!sorteio) {
    return NextResponse.json({ error: 'Sorteio não encontrado' }, { status: 404 });
  }

  return NextResponse.json(sorteio);
}

// POST - Criar novo sorteio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantes } = body;

    if (!participantes || !Array.isArray(participantes) || participantes.length < 2) {
      return NextResponse.json(
        { error: 'É necessário pelo menos 2 participantes' },
        { status: 400 }
      );
    }

    // Remove duplicatas e espaços vazios
    const participantesLimpos = [...new Set(participantes)]
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (participantesLimpos.length < 2) {
      return NextResponse.json(
        { error: 'É necessário pelo menos 2 participantes válidos' },
        { status: 400 }
      );
    }

    const sorteio = criarSorteio(participantesLimpos);

    return NextResponse.json(sorteio);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar sorteio' },
      { status: 500 }
    );
  }
}

