# 🚀 Guia de Deploy no Vercel

Este guia mostra como publicar o Simulador Mega Sena no Vercel gratuitamente.

## 📋 Pré-requisitos

1. **Conta no GitHub** (gratuita) - [Criar conta](https://github.com/signup)
2. **Conta no Vercel** (gratuita) - [Criar conta](https://vercel.com/signup)
3. **Chave da API do Gemini** - [Obter chave](https://aistudio.google.com/app/apikey)

## 🔧 Passo 1: Criar Repositório no GitHub

### Opção A: Via Interface do GitHub (Recomendado)

1. Acesse [github.com/new](https://github.com/new)
2. Configure o repositório:
   - **Repository name**: `simulador-mega-sena`
   - **Visibility**: Public (necessário para plano gratuito do Vercel)
   - **NÃO** marque "Add a README file"
3. Clique em **Create repository**
4. **Copie a URL** do repositório (formato: `https://github.com/seu-usuario/simulador-mega-sena.git`)

### Opção B: Via Linha de Comando

```bash
# No diretório do projeto
cd /Users/guilhermeloureiro/Downloads/simulador-mega-sena

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Simulador Mega Sena"

# Adicionar repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/simulador-mega-sena.git

# Enviar código para GitHub
git branch -M main
git push -u origin main
```

## ☁️ Passo 2: Deploy no Vercel

### 2.1 Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New** → **Project**
3. Clique em **Import Git Repository**
4. Selecione o repositório `simulador-mega-sena`
5. Clique em **Import**

### 2.2 Configurar Projeto

Na tela de configuração:

1. **Framework Preset**: Vite (detectado automaticamente)
2. **Root Directory**: `./` (deixe como está)
3. **Build Command**: `npm run build` (já configurado)
4. **Output Directory**: `dist` (já configurado)

### 2.3 Adicionar Variáveis de Ambiente

**IMPORTANTE**: Antes de fazer o deploy, configure a chave da API:

1. Clique em **Environment Variables**
2. Adicione a variável:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `sua-chave-da-api-do-gemini`
   - **Environment**: Production, Preview, Development (marque todos)
3. Clique em **Add**

### 2.4 Fazer Deploy

1. Clique em **Deploy**
2. Aguarde o build (1-2 minutos)
3. 🎉 Seu site estará online!

## 🌐 Acessar Aplicação

Após o deploy, você receberá uma URL no formato:
```
https://simulador-mega-sena-xxx.vercel.app
```

## 🔄 Deploys Automáticos

Toda vez que você fizer push para o GitHub, o Vercel fará deploy automático:

```bash
# Fazer alterações no código
git add .
git commit -m "Descrição das mudanças"
git push
```

O Vercel detectará automaticamente e fará o deploy da nova versão!

## 🎨 Personalizar Domínio (Opcional)

1. No painel do Vercel, vá em **Settings** → **Domains**
2. Adicione um domínio personalizado (gratuito: `.vercel.app`)
3. Ou conecte seu próprio domínio

## 🐛 Solução de Problemas

### Build falhou?
- Verifique os logs no Vercel
- Confirme que `npm run build` funciona localmente
- Verifique se todas as dependências estão no `package.json`

### Aplicação não carrega?
- Verifique se a variável `GEMINI_API_KEY` está configurada
- Abra o console do navegador (F12) para ver erros
- Verifique os logs do Vercel

### API não funciona?
- Confirme que a chave do Gemini é válida
- Verifique se a chave tem permissões necessárias
- Teste a chave localmente primeiro

## 📞 Suporte

- [Documentação do Vercel](https://vercel.com/docs)
- [Comunidade do Vercel](https://github.com/vercel/vercel/discussions)
- [Status do Vercel](https://www.vercel-status.com/)

---

**Dica**: Marque o repositório como favorito no GitHub para fácil acesso! ⭐
