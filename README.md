#### WR Distribuidora - App de E-commerce e Gestão
#### 🏍️ Visão Geral do Projeto
```plaintext
O WR Distribuidora é uma aplicação móvel multifuncional, desenvolvida em React Native (Expo), que serve como uma plataforma de e-commerce e gestão para uma distribuidora de peças para motociclos. A aplicação foi projetada para atender tanto os clientes finais, com uma experiência de compra fluida, como os administradores, com ferramentas robustas para a gestão de produtos e pedidos.

Este projeto foi construído com uma abordagem "vanilla", utilizando as ferramentas nativas do ecossistema React, como React Context e AsyncStorage, para uma gestão de estado leve e persistente, sem dependências externas de gestão de estado.
``` 
#### ✨ Funcionalidades Principais
A aplicação é dividida em dois grandes ambientes: a área do cliente e o painel administrativo.

#### 👤 Ambiente do Cliente
```plaintext
Autenticação e Cadastro: Sistema completo de login e cadastro de novos clientes. A sessão do utilizador é guardada de forma persistente.

Catálogo de Produtos Dinâmico: Visualização de produtos (peças de motociclos) que são geridos em tempo real pelo administrador.

Carrinho de Compras Persistente: Os utilizadores podem adicionar/remover produtos e ajustar quantidades. O carrinho é guardado no dispositivo, mesmo que a aplicação seja fechada.

Lista de Desejos: Funcionalidade para guardar produtos de interesse.

Checkout Inteligente:

Preenchimento automático do endereço usando a geolocalização do dispositivo.

Busca automática de endereço através da API OpenCEP ao digitar o CEP.

Área do Cliente Completa:

Meus Pedidos: Histórico de todos os pedidos feitos, com detalhes e status.

Rastreamento de Pedidos: Visualização do status do envio (Processando, Enviado, Entregue) quando aplicável.

Cancelamento de Pedidos: O cliente pode cancelar um pedido que ainda não foi processado.

Gestão de Perfil: Edição de dados pessoais (nome, email, telefone).

Gestão de Endereços e Cartões: CRUD completo para endereços e cartões de pagamento.

Notificações: Configuração de preferências para receber notificações.
```
#### 🛠️ Painel do Administrador
```plaintext
Acesso Restrito: Apenas utilizadores com o perfil "admin" podem aceder a este painel.

Gestão de Produtos (CRUD):

Listar todos os produtos da loja.

Adicionar novos produtos através de um formulário completo.

Editar informações de produtos existentes (preço, stock, nome, etc.).

Excluir produtos do catálogo.

Gestão de Pedidos:

Visualizar a lista de todos os pedidos feitos pelos clientes.

Aceder aos detalhes de cada pedido (itens, endereço de entrega).

Atualizar o Status do Pedido: Alterar o status (ex: de "Processando" para "Enviado"), o que pode acionar notificações para o cliente.

Adicionar e salvar o código de rastreio do envio.
```
#### 🚀 Tecnologias Utilizadas
```plaintext
Framework: React Native com Expo

Linguagem: TypeScript

Navegação: React Navigation (Stack, Drawer)

Gestão de Estado: React Context API (Abordagem "Vanilla")

Armazenamento Local: AsyncStorage

Recursos Nativos:

expo-location (Geolocalização)

expo-notifications (Notificações Push)

APIs Externas:

OpenCEP (Busca de endereço por CEP)

Estilização: StyleSheet do React Native
```
#### 📂 Estrutura do Projeto
O projeto segue uma arquitetura limpa e organizada para facilitar a manutenção e escalabilidade.
```plaintext
src/
├── componentes/  # Componentes reutilizáveis (botões, cabeçalhos, etc.)
├── constantes/   # Ficheiros de constantes (cores, dados de exemplo)
├── contextos/    # Lógica de negócio e gestão de estado (Autenticação, Carrinho, Pedidos, etc.)
├── navegacao/    # Configuração de toda a navegação da aplicação
├── servicos/     # Lógica para interagir com APIs e recursos nativos
├── telas/        # Ecrãs da aplicação, divididos em 'cliente' e 'admin'
└── tipos/        # Definições de tipos do TypeScript para todo o projeto
```
🏁 Como Começar
Siga os passos abaixo para executar o projeto localmente.

Pré-requisitos
Node.js (versão LTS)

Git

Expo CLI

Um dispositivo físico com a aplicação Expo Go ou um emulador Android/iOS configurado.

Instalação
Clone o repositório:
```bash
git clone https://github.com/seu-usuario/wr-distribuidora.git
```
Entre na pasta do projeto:
```bash
cd wr-distribuidora
```
Instale as dependências:
```bash
npm install
```
Executando a Aplicação
Inicie o servidor de desenvolvimento do Expo:
```bash
npx expo start
```
Abra a aplicação:

No seu telemóvel: Leia o QR code que aparece no terminal com a aplicação Expo Go.

No emulador: Pressione a para o emulador Android ou i para o simulador iOS.

No navegador: Pressione w para abrir uma versão web.

Credenciais de Teste
Administrador:

Email: admin@email.com

Senha: admin

Cliente:

Pode criar um novo cliente através da tela de cadastro.

#### 🔮 Futuras Melhorias
Integração com um backend real (Node.js, Firebase, etc.) para persistência de dados online.

Implementação de um sistema de pagamento.

Utilização do expo-barcode-scanner para agilizar o cadastro de produtos.

Ativação do login com biometria (expo-local-authentication).

Feito com ❤️ por Ludhill