# 🎲 Sistema de Gestão de Rifas Eletrônicas

![Licença](https://img.shields.io/badge/license-MIT-blue.svg)
![Versão](https://img.shields.io/badge/version-1.0.0-green.svg)

## 📋 Sobre o Projeto

Sistema web responsivo para gerenciamento completo de rifas eletrônicas, desenvolvido com tecnologias modernas para proporcionar uma experiência segura e transparente na realização de sorteios online.

### 🌟 Principais Funcionalidades

- ✨ Cadastro e gestão de produtos para rifas
- 👥 Gerenciamento de clientes e quotas
- 💳 Sistema de pagamentos integrado com Stripe
- 📱 Interface responsiva e moderna
- 🔔 Sistema de notificações automáticas
- 🎥 Sala virtual de sorteio com transmissão ao vivo

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - Vue.js 3
  - CSS Variables para Design System
  - Componentes Responsivos
  - WebSocket para Real-time

- **Backend:**
  - Node.js com Express
  - SQLite para Database
  - Socket.IO
  - JWT Authentication

- **Pagamentos:**
  - Integração com Stripe

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js >= 16.x
- NPM ou Yarn
- SQLite

### Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gestao-rifas.git
cd gestao-rifas
```

2. Instale as dependências do Backend:
```bash
cd backend
npm install
```

3. Instale as dependências do Frontend:
```bash
cd ../frontend
npm install
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

5. Execute as migrações do banco de dados:
```bash
cd ../database
sqlite3 database.sqlite < schema.sql
```

### Executando o Projeto

1. Inicie o Backend:
```bash
cd backend
npm run dev
```

2. Inicie o Frontend:
```bash
cd frontend
npm run dev
```

## 📱 Design System

### Cores
- Principal: `#006d77` (Azul-petróleo)
- Secundária: `#ffd166` (Amarelo-ocre)
- Neutra: `#2c2c2c` (Cinza-chumbo)

### Tipografia
- Títulos: Playfair Display
- Corpo: Lato
- Elementos Interativos: Roboto

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Eduardo Pessoa - eduardo@phoenyx.com.br

Link do Projeto: [https://github.com/seu-usuario/gestao-rifas](https://github.com/seu-usuario/gestao-rifas)
