// ====================================================================
// Jogo de Adivinhação - script.js (CÓDIGO FINAL E COMPLETO)
// ====================================================================

// 1. Variáveis de Estado
const palavras = [
    'PROGRAMACAO', 'SISTEMAS', 'TECNICO', 'JAVASCRIPT', 'ALGORITMO', 'FRONTEND', 'BACKEND', 'DATABASE',
    'SOL', 'LUA', 'MAR', 'FLORESTA', 'CHAVE', 'CORRENTE', 'RELÓGIO', 'ESPADA', 'CANETA', 'MONTANHA', 
    'LAGO', 'FOGO', 'BORBOLETA', 'LIVRO', 'NUVEM', 'CASTELO', 'VENTO', 'TESOURO', 'PIRÂMIDE', 'DRAGÃO', 
    'RIO', 'CIDADE', 'PLANETA', 'ANEL', 'PONTE', 'ÁRVORE', 'NEVE', 'ESTRELA', 'MÁSCARA', 'CADEADO', 
    'OCEANO', 'ILHA', 'FOLHA', 'TEMPLO', 'CORAÇÃO', 'ARCO', 'FUMAÇA', 'LÂMPADA', 'GATO', 'CACHORRO', 
    'FANTASMA', 'CÉU', 'CHUVA', 'PEDRA', 'AREIA', 'SEREIA', 'VELA', 'BONECA', 'MÁQUINA', 'ESPAÇO', 
    'FERRAMENTA', 'PÁSSARO', 'CAMINHO', 'PINTURA', 'MUNDO', 'TESOURA', 'LABIRINTO', 'CASTANHA', 'GAVETA', 
    'CHUVEIRO', 'BALÃO', 'RELÂMPAGO', 'CAMISA', 'VIAGEM', 'ESPELHO', 'FAROL', 'JANELA', 'PLANÍCIE', 
    'CÉREBRO', 'MÁGICA', 'SILÊNCIO', 'LAGOA', 'BARCO', 'SINO', 'TRILHA', 'MONTARIA', 'FÉRIAS', 
    'CARNAVAL', 'FESTA', 'CORUJA', 'PIANO', 'VIOLÃO', 'ARANHA', 'GLOBO', 'NEBLINA', 'NINFA', 
    'LABORATÓRIO', 'LUZ', 'CORDA', 'ILUSÃO', 'PÔR-DO-SOL', 'MONTANHA-RUSSA', 'CHOCOLATE', 'ÁGUA', 
    'FOLHAGEM', 'PÉROLA', 'NAVE', 'GUERRA', 'PAZ', 'MIRAGEM'
];
let palavraSecreta = '';
let palavraOculta = [];
let letrasUsadas = [];
let tentativasRestantes = 6;
let pontuacao = 0;

// 1.1. Configuração de Áudio
// *** VERIFIQUE SUA EXTENSÃO AQUI (.mp3 é o padrão) ***
const somAcerto = new Audio('acerto.mp3'); 
const somErro = new Audio('erro.mp3');
const somVitoria = new Audio('acerto.mp3'); 
const somDerrota = new Audio('erro.mp3');

// 2. Referências do DOM
const container = document.querySelector('.container'); 
const audioOverlay = document.getElementById('audio-overlay');
const btnIniciarAudio = document.getElementById('btn-iniciar-audio');

const palavraDisplay = document.getElementById('palavra-display');
const inputPalpite = document.getElementById('input-palpite');
const btnPalpite = document.getElementById('btn-palpite');
const tentativasSpan = document.getElementById('tentativas');
const letrasUsadasSpan = document.getElementById('letras-usadas');
const mensagemP = document.getElementById('mensagem');
const btnReiniciar = document.getElementById('btn-reiniciar');
const pontuacaoDisplay = document.getElementById('pontuacao-display');
const listaRanking = document.getElementById('lista-ranking');


// --- FUNÇÃO PARA DESBLOQUEAR O ÁUDIO E INICIAR ---

function desbloquearAudioEIniciar() {
    // Tenta tocar um som para o navegador registrar a interação
    try {
        somAcerto.play(); 
        somAcerto.pause(); 
    } catch (e) {
        console.log("Interação de áudio registrada.");
    }
    
    // Esconde a tela de inicialização e mostra o jogo
    audioOverlay.style.display = 'none';
    container.classList.remove('oculto-inicial');
    
    // Inicia o jogo principal
    iniciarJogo();
}


// --- FUNÇÕES DE RANKING ---

function carregarRanking() {
    const rankingData = JSON.parse(localStorage.getItem('rankingJogoDev') || '[]');
    rankingData.sort((a, b) => b.pontos - a.pontos);
    
    listaRanking.innerHTML = '';
    
    rankingData.slice(0, 5).forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.nome}`;
        
        const spanPontos = document.createElement('span');
        spanPontos.textContent = `${item.pontos} pts`;
        li.appendChild(spanPontos);
        
        listaRanking.appendChild(li);
    });
}

function salvarPontuacao() {
    if (pontuacao <= 0) return; 

    const nome = prompt(`Parabéns! Você fez ${pontuacao} pontos. Digite seu nome para o Ranking:`);

    if (nome) {
        let rankingData = JSON.parse(localStorage.getItem('rankingJogoDev') || '[]');
        
        rankingData.push({ 
            nome: nome.trim().substring(0, 15) || "Anônimo", 
            pontos: pontuacao 
        });

        localStorage.setItem('rankingJogoDev', JSON.stringify(rankingData));
        carregarRanking();
    }
}


// --- FUNÇÕES PRINCIPAIS DO JOGO ---

function iniciarJogo() {
    // 1. Resetar Variáveis
    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    palavraOculta = Array(palavraSecreta.length).fill('_'); 
    letrasUsadas = [];
    tentativasRestantes = 6;
    pontuacao = 0; 

    // 2. Atualizar o DOM
    palavraDisplay.textContent = palavraOculta.join(' ');
    tentativasSpan.textContent = tentativasRestantes;
    pontuacaoDisplay.textContent = pontuacao;
    letrasUsadasSpan.textContent = '';
    mensagemP.textContent = 'Boa sorte!';
    mensagemP.className = 'mensagem'; 
    
    // 3. Habilitar/Ocultar Elementos
    inputPalpite.disabled = false;
    btnPalpite.disabled = false;
    inputPalpite.focus();
    btnReiniciar.classList.add('oculto');
    container.classList.remove('erro-animacao'); 
    carregarRanking();
}

function lidarComPalpite() {
    if (tentativasRestantes === 0 || !palavraOculta.includes('_')) return; 

    container.classList.remove('erro-animacao'); 

    let palpite = inputPalpite.value.toUpperCase();
    inputPalpite.value = ''; 
    inputPalpite.focus();

    // 1. Validação (Palpite inválido ou já usado)
    if (!palpite || letrasUsadas.includes(palpite) || !/^[A-Z]$/.test(palpite)) {
        mensagemP.textContent = 'Palpite inválido ou letra já usada.';
        mensagemP.classList.add('erro');
        container.classList.add('erro-animacao'); 
        somErro.play(); 
        return;
    }

    // 2. Adicionar letra usada
    letrasUsadas.push(palpite);
    letrasUsadasSpan.textContent = letrasUsadas.join(', ');
    mensagemP.classList.remove('erro');

    // 3. Verificar Palpite
    if (palavraSecreta.includes(palpite)) {
        mensagemP.textContent = 'Parabéns! Letra correta.';
        mensagemP.classList.add('sucesso');
        pontuacao += 15; 
        pontuacaoDisplay.textContent = pontuacao;
        somAcerto.play(); 

        // Atualiza a palavra oculta
        let acertos = 0;
        for (let i = 0; i < palavraSecreta.length; i++) {
            if (palavraSecreta[i] === palpite) {
                palavraOculta[i] = palpite;
                acertos++;
            }
        }
        palavraDisplay.textContent = palavraOculta.join(' ');
        
        if (acertos > 1) pontuacao += 5 * acertos; 

        // Checar vitória
        if (!palavraOculta.includes('_')) {
            finalizarJogo(true);
        }

    } else {
        // 4. Letra errada
        tentativasRestantes--;
        tentativasSpan.textContent = tentativasRestantes;
        mensagemP.textContent = 'Ops! Essa letra não está na palavra.';
        mensagemP.classList.add('erro');
        pontuacao = Math.max(0, pontuacao - 10); 
        pontuacaoDisplay.textContent = pontuacao;
        
        container.classList.add('erro-animacao'); 
        somErro.play(); 

        // Checar derrota
        if (tentativasRestantes === 0) {
            finalizarJogo(false);
        }
    }
}

function finalizarJogo(vitoria) {
    inputPalpite.disabled = true;
    btnPalpite.disabled = true;
    btnReiniciar.classList.remove('oculto'); 
    container.classList.remove('erro-animacao'); 

    if (vitoria) {
        pontuacao += 50; 
        pontuacaoDisplay.textContent = pontuacao;
        mensagemP.textContent = `PARABÉNS! VOCÊ VENCEU! A palavra era: ${palavraSecreta}.`;
        mensagemP.className = 'mensagem vitoria';
        somVitoria.play(); 
        salvarPontuacao();
    } else {
        mensagemP.textContent = `FIM DE JOGO! A palavra era: ${palavraSecreta}.`;
        mensagemP.className = 'mensagem derrota';
        somDerrota.play(); 
    }
}

// --- LISTENERS DE EVENTO ---

btnPalpite.addEventListener('click', lidarComPalpite);
btnReiniciar.addEventListener('click', iniciarJogo);
// NOVO LISTENER: Chama a função que desbloqueia o áudio
btnIniciarAudio.addEventListener('click', desbloquearAudioEIniciar); 

// Permite usar a tecla 'Enter' para palpitar
inputPalpite.addEventListener('keyup', (e) => {
    // Verifica se o jogo está ativo (input não desabilitado)
    if (e.key === 'Enter' && !inputPalpite.disabled) {
        lidarComPalpite();
    }
});

// O jogo só será iniciado após o clique no botão de iniciar áudio.
// Não chame iniciarJogo() diretamente aqui.