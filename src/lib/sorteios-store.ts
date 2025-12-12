// Armazenamento usando Vercel KV (Redis)
// Funciona tanto em desenvolvimento quanto em produção no Vercel

import { kv } from '@vercel/kv';

export interface SorteioData {
  id: string;
  participantes: string[];
  sorteados: { [nome: string]: string };
  criadoEm: number;
}

// Fallback para desenvolvimento local se KV não estiver configurado
const sorteiosLocal: Map<string, SorteioData> = new Map();

// Verifica se o KV está configurado
function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function criarSorteio(participantes: string[]): Promise<SorteioData> {
  const id = Math.random().toString(36).substring(2, 15);
  const sorteio: SorteioData = {
    id,
    participantes,
    sorteados: {},
    criadoEm: Date.now(),
  };
  
  if (isKvConfigured()) {
    try {
      // Usa Vercel KV
      await kv.set(`sorteio:${id}`, sorteio);
      // Define TTL de 30 dias para limpar sorteios antigos
      await kv.expire(`sorteio:${id}`, 60 * 60 * 24 * 30);
    } catch (error) {
      // Se falhar, usa fallback local
      console.warn('Erro ao usar Vercel KV, usando armazenamento local:', error);
      sorteiosLocal.set(id, sorteio);
    }
  } else {
    // Fallback para memória local (desenvolvimento)
    sorteiosLocal.set(id, sorteio);
  }
  
  return sorteio;
}

export async function buscarSorteio(id: string): Promise<SorteioData | undefined> {
  if (isKvConfigured()) {
    try {
      // Usa Vercel KV
      const sorteio = await kv.get<SorteioData>(`sorteio:${id}`);
      return sorteio || undefined;
    } catch (error) {
      // Se falhar, tenta buscar no fallback local
      console.warn('Erro ao usar Vercel KV, usando armazenamento local:', error);
      return sorteiosLocal.get(id);
    }
  } else {
    // Fallback para memória local (desenvolvimento)
    return sorteiosLocal.get(id);
  }
}

export async function atualizarSorteio(id: string, sorteio: SorteioData): Promise<void> {
  if (isKvConfigured()) {
    try {
      // Usa Vercel KV
      await kv.set(`sorteio:${id}`, sorteio);
      // Renova TTL
      await kv.expire(`sorteio:${id}`, 60 * 60 * 24 * 30);
    } catch (error) {
      // Se falhar, usa fallback local
      console.warn('Erro ao usar Vercel KV, usando armazenamento local:', error);
      sorteiosLocal.set(id, sorteio);
    }
  } else {
    // Fallback para memória local (desenvolvimento)
    sorteiosLocal.set(id, sorteio);
  }
}

