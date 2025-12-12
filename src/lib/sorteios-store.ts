// Armazenamento em memória compartilhado
// Em produção, substituir por banco de dados

export interface SorteioData {
  id: string;
  participantes: string[];
  sorteados: { [nome: string]: string };
  criadoEm: number;
}

const sorteios: Map<string, SorteioData> = new Map();

export function criarSorteio(participantes: string[]): SorteioData {
  const id = Math.random().toString(36).substring(2, 15);
  const sorteio: SorteioData = {
    id,
    participantes,
    sorteados: {},
    criadoEm: Date.now(),
  };
  sorteios.set(id, sorteio);
  return sorteio;
}

export function buscarSorteio(id: string): SorteioData | undefined {
  return sorteios.get(id);
}

export function atualizarSorteio(id: string, sorteio: SorteioData): void {
  sorteios.set(id, sorteio);
}

