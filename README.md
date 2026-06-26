<img width="1099" height="809" alt="image" src="https://github.com/user-attachments/assets/c011a77a-c0f1-4116-bf84-9e876b376707" />


# TudoOtavinhoEste código é a estrutura base (HTML) e a estilização visual (CSS) de uma aplicação web interativa em estilo de jogo chamada "O Olimpo de Otávio".

O projeto é inspirado na mitologia grega e no universo de Percy Jackson, servindo como uma espécie de portfólio digital ou página interativa sobre um estudante/semideus chamado Otávio Stelle.

Abaixo está o resumo estruturado de como a página funciona:

1. Estrutura de Páginas (Navegação em Abas)
A aplicação funciona como um aplicativo de página única (Single Page Application), onde o usuário avança por 5 seções (Templos) usando botões de navegação, com o suporte de uma barra de progresso (step-indicator).

Página 1 — O Oráculo: Um minijogo de organizar letras (Word Slots e Letters Pool) para revelar o nome do semideus. Possui um sistema de dicas (hint-box).

Página 2 — Mural do Herói: Exibe os dados pessoais de "Otávio Stelle" (nascido em 08/08/2008, de São Paulo, filho de Poseidon, signo de Leão). Inclui uma seção editável (contenteditable="true") para personalizar a história do personagem e uma lista de habilidades (Culinária, Desenho, Piano e Pizza).

Página 3 — Matemática & Engenharia: Cartões informativos sobre Geometria, Binômio de Newton, Cálculo e a profissão de Engenharia Mecatrônica. Contém também um Quiz (Enigma do Oráculo de Delfos) sobre o Binômio de Newton.

Página 4 — A Saga de Percy Jackson: Um resumo dos 5 livros da saga principal de Rick Riordan e uma grade interativa com os 12 Deuses do Olimpo.

Página 5 — Arena dos Deuses: Um minijogo de batalha de RPG em turnos. O herói Otávio enfrenta três deuses em sequência (Ares, Hermes e Zeus). A interface conta com barras de vida (HP), pontos de magia, histórico de combate (Battle Log) e botões de ação (Atacar, Magia, Defender).

2. Elementos Globais da Interface
Fundo Dinâmico: Utiliza uma tag <canvas id="star-canvas"> e uma div de partículas, sugerindo que haverá um efeito visual de estrelas ou poeira cósmica via JavaScript.

Modal Global (#info-modal): Uma janela pop-up estilizada que se abre para mostrar detalhes extras (com imagens, títulos e tags coloridas) sempre que o usuário clica em elementos interativos da página (como os deuses ou livros).

Anel do Zodíaco (zodiac-ring): Uma barra com os 12 símbolos do zodíaco no topo da página.

Véu de Transição (#page-veil): Uma tela de carregamento com o símbolo de raio (⚡) usada para suavizar a transição quando o usuário muda de página.

3. Identidade Visual (O CSS)
O estilo visual é fortemente temático e trabalhado em CSS moderno através de variáveis (:root):

Paleta de Cores: Fundo escuro imitando o cosmos (--blue-void, #000B1E) contrastando com tons dourados divinos (--gold, #C9A227) e azul elétrico.

Tipografia: Utiliza as fontes Cinzel (estilo romano/clássico para títulos) e Montserrat (para textos de leitura) importadas do Google Fonts.

Efeitos Visuais: Uso intenso de sombras internas, filtros de brilho (glow-gold, glow-blue) e animações para simular raios pulsantes (@keyframes lightningPulse) e botões dourados que mudam de cor.

Padronagem Grega: A classe .greek-meander desenha de forma automática uma borda com a famosa estampa de "chave grega" usando um vetor (SVG) estilizado diretamente no CSS.
