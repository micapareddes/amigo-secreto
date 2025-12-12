export interface Sorteio {
  id: string;
  participantes: string[];
  sorteados: { [nome: string]: string }; // quem sorteou quem
  criadoEm: number;
}

