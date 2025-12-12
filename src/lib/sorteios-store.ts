// Armazenamento usando Upstash Redis
// Funciona tanto em desenvolvimento quanto em produção no Vercel

import { Redis } from '@upstash/redis';

export interface SorteioData {
  id: string;
  participantes: string[];
  sorteados: { [nome: string]: string };
  criadoEm: number;
}

// Fallback para desenvolvimento local se Redis não estiver configurado
const sorteiosLocal: Map<string, SorteioData> = new Map();

// Cria cliente Redis se as variáveis de ambiente estiverem configuradas
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (url && token) {
    try {
      redisClient = new Redis({
        url,
        token,
      });
      return redisClient;
    } catch (error) {
      console.warn('Erro ao inicializar Redis:', error);
      return null;
    }
  }
  
  return null;
}

export async function criarSorteio(participantes: string[]): Promise<SorteioData> {
  const id = Math.random().toString(36).substring(2, 15);
  const sorteio: SorteioData = {
    id,
    participantes,
    sorteados: {},
    criadoEm: Date.now(),
  };
  
  const redis = getRedisClient();
  if (redis) {
    try {
      // Usa Upstash Redis
      await redis.set(`sorteio:${id}`, sorteio, { ex: 60 * 60 * 24 * 30 }); // TTL de 30 dias
    } catch (error) {
      // Se falhar, usa fallback local
      console.warn('Erro ao usar Redis, usando armazenamento local:', error);
      sorteiosLocal.set(id, sorteio);
    }
  } else {
    // Fallback para memória local (desenvolvimento)
    sorteiosLocal.set(id, sorteio);
  }
  
  return sorteio;
}

export async function buscarSorteio(id: string): Promise<SorteioData | undefined> {
  const redis = getRedisClient();
  if (redis) {
    try {
      // Usa Upstash Redis
      const sorteio = await redis.get<SorteioData>(`sorteio:${id}`);
      return sorteio || undefined;
    } catch (error) {
      // Se falhar, tenta buscar no fallback local
      console.warn('Erro ao usar Redis, usando armazenamento local:', error);
      return sorteiosLocal.get(id);
    }
  } else {
    // Fallback para memória local (desenvolvimento)
    return sorteiosLocal.get(id);
  }
}

export async function atualizarSorteio(id: string, sorteio: SorteioData): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      // Usa Upstash Redis
      await redis.set(`sorteio:${id}`, sorteio, { ex: 60 * 60 * 24 * 30 }); // Renova TTL
    } catch (error) {
      // Se falhar, usa fallback local
      console.warn('Erro ao usar Redis, usando armazenamento local:', error);
      sorteiosLocal.set(id, sorteio);
    }
  } else {
    // Fallback para memória local (desenvolvimento)
    sorteiosLocal.set(id, sorteio);
  }
}

