# 🎁 Amigo Secreto

App simples de amigo secreto desenvolvido com Next.js. Permite criar sorteios, gerar links compartilháveis e realizar sorteios individuais onde cada pessoa descobre seu amigo secreto.

## 🚀 Como Usar

### Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Funcionalidades

1. **Criar Sorteio**: Na página inicial, adicione os nomes dos participantes e clique em "Criar Sorteio e Gerar Link"
2. **Compartilhar Link**: Copie o link gerado e compartilhe com os participantes
3. **Realizar Sorteio**: Cada pessoa acessa o link, digita seu nome e descobre seu amigo secreto
4. **Regras Automáticas**:
   - Ninguém pode sortear a si mesmo
   - Cada pessoa só pode ser sorteada uma vez
   - Após ser sorteada, a pessoa é removida da lista de disponíveis
   - Todos recebem um nome único

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint

## 🛠️ Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## 📝 Nota

Este app usa armazenamento em memória para os sorteios. Os dados são perdidos quando o servidor é reiniciado. Para uso em produção, recomenda-se integrar com um banco de dados.
