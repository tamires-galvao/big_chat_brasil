# Big Chat Brasil - Desafio Fullstack

**Big Chat Brasil** é uma aplicação web fullstack desenvolvida como parte do desafio técnico da BCB. A aplicação permite que empresas se comuniquem com seus clientes por meio de um sistema de chat com autenticação, histórico de mensagens, controle financeiro por plano e envio com priorização.

O projeto é composto por:
-  **Backend** em Java com Spring Boot
-  **Frontend** em React + Vite + Tailwind
-  **Banco de dados** PostgreSQL
-  Orquestração com Docker e Docker Compose

---

##  Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

--- 

### 🛠️ Configuração de Variáveis de Ambiente

O projeto React utiliza variáveis de ambiente definidas no arquivo `.env.local`.

Você encontrará um arquivo chamado:

```
.env.local.exemple
```

#### O que fazer:

1. **Renomeie** o arquivo:

   ```bash
   mv .env.local.example .env.local
   ```
2. **Ajuste os valores**, se necessário:

   * `VITE_API_URL=http://localhost:8080` → define a URL base da API

>  **Importante:** O arquivo `.env.local` nunca deve ser versionado no Git, pois pode conter configurações específicas do ambiente local.
---

## 🚀 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/tamires-galvao/big-chat-brasil.git
cd big-chat-brasil
```

### 2. Suba os serviços com Docker Compose

```bash
docker-compose up -d --build
```
### 3. Verifique se os containers estão em execução

```bash
docker ps
```
## 🌐 Acessos
| Serviço                | URL                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Frontend**           | [http://localhost:3000](http://localhost:3000/auth/sign-in)                                |
## Cliente (CPF) 
- 12345678901
## Cliente (CNPJ) 
- 12345678901234

---

## ✅ Funcionalidades Implementadas

- Autenticação via token (login com CPF/CNPJ)
- Criação e listagem de conversas
- WebSocket integrado para atualização em tempo real
- Interface responsiva e intuitiva

---

## 📦 Tecnologias Utilizadas

- Java 17 + Spring Boot
- PostgreSQL + Spring Data JPA
- JWT para autenticação
- WebSockets (STOMP + SockJS)
- React + Vite + TailwindCSS
- React Query, React Hook Form, Shadcn UI
- Docker + Docker Compose

**Desenvolvido como parte do desafio técnico Fullstack da Big Chat Brasil**
