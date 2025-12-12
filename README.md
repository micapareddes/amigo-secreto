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
- Upstash Redis (armazenamento persistente)

## 📦 Deploy no Vercel

Este app usa **Upstash Redis** para armazenamento persistente. Para publicar no Vercel:

1. **Crie o projeto no Vercel:**
   ```bash
   vercel
   ```

2. **Configure o Upstash Redis:**
   - Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
   - Vá em **Storage** > **Create Database**
   - Selecione **Marketplace Database Providers** > **Upstash** > **Serverless DB (Redis)**
   - Ou vá direto para [Upstash Console](https://console.upstash.com/) e crie um Redis database
   - Copie as credenciais: `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`
   - No Vercel Dashboard, vá em **Settings** > **Environment Variables** e adicione essas duas variáveis

3. **Pronto!** O app agora persiste os dados entre reinicializações.

**Nota:** Em desenvolvimento local, você pode criar um arquivo `.env.local` com as variáveis do Upstash ou deixar sem configurar para usar armazenamento em memória como fallback (dados são perdidos ao reiniciar).

**Para desenvolvimento local:**
```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://seu-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=seu-token-aqui
```
