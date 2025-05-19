# Projeto Integrador: Desenvolvimento de Sistemas Orientado a Dispositivos Móveis e Baseados na Web – 4º Semestre TADS/TSI

## ReadUP

O Readup O ReadUp representa uma inovação na forma como os jovens interagem com a leitura digital, ao integrar gamificação, personalização e uma interface social. Seu objetivo é incentivar o hábito da leitura, criando uma experiência envolvente e dinâmica que se adapta a diferentes perfis de usuários. A proposta de transformar a leitura em um desafio interativo com recompensas e objetivos claros visa atrair jovens leitores, muitas vezes afastados dos métodos tradicionais.

---

## Integrantes do Grupo

- ANA CAROLINE DE OLIVEIRA MELO 
- ARTHUR RODRIGUES CAVALCANTI
- LEONARDO DA ROCHA LUCENA
- PAULO RICARDO CONSOLINI DA SILVA
- PEDRO LOPES DE OLIVEIRA

---

## Descrição do Projeto

O objetivo deste projeto é incentivar pessoas de todas as idades a desenvolverem o hábito da leitura, tornando essa prática divertida e recompensadora. Utilizamos a gamificação como um dos recursos, mas valorizamos principalmente a qualidade que a leitura proporciona. Acreditamos que a verdadeira recompensa está no próprio processo: queremos que os leitores se sintam motivados e satisfeitos por ler.

## Prova de Conceito Desenvolvida

### Jornada 1 - João, 10 Anos:
![image](https://github.com/user-attachments/assets/f398f718-a184-49c3-973e-71f10ab33f53)

### Jornada 2 - Marina, 16 Anos:
![image](https://github.com/user-attachments/assets/84b81608-923f-46e6-9a10-acf868b656fb)

Nessa primeira etapa, decidimos por focar na Jornada 2, de Marina, desenvolvendo um site mais simples e apenas com funções fundamentais para um primeiro funcionamento e interação do usuário, comprovando a viabilidade técnica e experiência de uso.

## Funcionalidades da PoC:

1. Tela de Adição de Livros (com ISBN)
   - Entrada do código ISBN.
   - Integração com a Open Library API.
   - Preenchimento automático do título, autor, descrição e capa (com preview).
   - Botão para adicionar livro ao sistema (banco de dados).
   - Feedback de sucesso.

2. Tela de Biblioteca
   - Listagem dos livros adicionados (vindos do backend).
   - Exibição da capa, título, autor, descrição e classificação do livro.

3. Interação com Usuários
   - Visualização de reviews de outros usuários em cada livro.
   - Possibilidade de escrever trechos do livro junto com a nota.

4. Armazenamento Backend
   - Integração do Node.Js com SQLite, guardando todos os dados, livros e logins.

---

## Tecnologias Utilizadas

### Frontend

- [x] HTML
- [x] CSS
- [x] JavaScript
- [x] Vue

Optamos por essa configuração de tecnologias para o frontend de acordo com a experiência pessoal dos integrantes do grupo, além de facilitar o processo para o curto prazo que teríamos para entrega e as funcionalidades que gostaríamos de entregar na primeira entrega. A escolha pelo framework Vue.js se deu pelo fato de ser uma tecnologia de fácil aprendizado e sua componentização, permitindo com que pudéssemos reaproveitar parte do código.

### Backend

- [x] JavaScript
- [x] Node.js

Assim como no frontend, para o backend escolhemos ferramentas e tecnologias que conversassem melhor entre si. Portanto, optamos pelo Node.Js, para que dessa forma pudéssemos utilizar nosso conhecimento em JavaScript em todo o projeto.

### Banco de Dados

- [x] SQLite

Se tratando de um projeto experimental e pequeno nessa primeira fase, precisávamos de um banco de dados simples de gerir e que fosse rápido e eficiente, e além disso, usasse comandos SQL que já estávamos acostumados de outros semestres da faculdade. A solução foi utilizar SQLite, que é gratuíto e fácil de manejar, sendo uma das opções mais leves.

---

## Instruções para Executar o Projeto

### Requisitos

- [x] Navegador atualizado
- [x] Node.js instalado
- [x] Git instalado (opcional para clonar o projeto)

### Passo a passo

1. Clone este repositório:
   ```bash
   git clone https://github.com/arthurrcavalcanti/projeto_integrador_senac_2025.1.2.git

---
2.  Após clonar o repositório, e ja tendo instalado o Node.Js na sua máquina, abra o terminal do seu sistema operacional dentro das pastas /backend, e também dentro da pasta /frontend/ebooksreader, e então execute o comando:
   ```bash
   npm install
   ```
Esse comando é essencial para que todas as bibliotecas utilizadas no projeto sejam instaladas para o correto funcionamento do que foi desenvolvido.
---
3.  Após a correta instalação do comando anterior, ainda com ambos terminais abertos, vamos digitar o seguinte comando:
   ```bash
   npm run dev
   ```
Esse comando irá finalmente colocar a aplicação para rodar, sendo assim, iremos copiar o endereço que o terminal da pasta /frontend/ebooksreader irá gerar e colar em nosso navegador de preferência, podendo enfim usufruir da aplicação!
---

## Vídeo de Apresentação

-  [🎥 Clique aqui para assistir](/video-apresentacao/Apresentação%20e%20Tutorial%20ReadUp.mp4)
-  [🎥 Assista no Youtube!](https://youtu.be/NVzjItX-kz0)

---

##  Observações finais

Este projeto foi desenvolvido com o objetivo de simular uma plataforma de leitura de livros online. O Readup permite que usuários naveguem, leiam e gerenciem seus livros digitais de forma simples e intuitiva.

Este é um projeto em constante evolução. Novas funcionalidades como incluir livros e adicionar cometários 

Agradecemos a todos que acompanharam e apoiaram o desenvolvimento deste projeto. 

