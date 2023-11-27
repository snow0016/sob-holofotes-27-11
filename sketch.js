var torreImg, torre;
var portaImg, porta, grupoPorta;
var gradeImg, grade, grupoGrade;
var player, player_parado, player_pulando;
var grupoBlocoInvisivel, blocoInvisivel;
var estadoJogo = "inicio";
var somAssustador;

function preload() {
    // Carregar as imagens da torre, da grade e da porta
    torreImg = loadImage("torre.png");
    portaImg = loadImage("porta.png");
    gradeImg = loadImage("grade.png");

    // Carregando as animações do fantasma
    player_parado = loadAnimation("fantasma parado.png");
    player_pulando = loadAnimation("fantasma pulando.png");

    // Carregar som
    somAssustador = loadSound("uuu.mp3");

    // Criar os grupos das grades e das portas
    grupoGrade = new Group();
    grupoBlocoInvisivel = new Group();
    grupoPorta = new Group();
}

function setup() {
    createCanvas(600, 600);
    // Tocar o som em loop
    somAssustador.loop();

    // Criando a torre
    torre = createSprite(300, 300);
    torre.addImage("torre", torreImg);
    torre.velocityY = 1;

    // Criando o player
    player = createSprite(200, 200, 50, 50);
    player.addAnimation("player parado", player_parado);
    player.addAnimation("player pulando", player_pulando);
    player.scale = 0.3;

    edges = createEdgeSprites();
}

function draw() {
    background(200);

    if (estadoJogo === "inicio") {
        background(0);
        fill("yellow");
        textSize(13);
        text("Um mega monstro prendeu fantasmas em uma torre. Eles estão bravos e querem te pegar. FUJA.", 30, 200);
        text("Aperte espaço para começar. Jogue com as SETAS.", 30, 300);

        if (keyDown("space")) {
            estadoJogo = "jogar";
        }
    }

    if (estadoJogo === "jogar") {
        
        somAssustador.play();
        
        player.changeAnimation("player parado");

        // Código para controlar o jogador para cima
        if (keyDown("up") || touches.length > 0) {
            player.velocityY = -10;
            player.changeAnimation("player pulando");
            touches = [];
        }

        // Código para controlar o jogador para Esquerda
        if (keyDown("left")) {
            player.x -= 3;
            player.changeAnimation("player pulando");
        }

        // Código para controlar o jogador para direita
        if (keyDown("right")) {
            player.x += 3;
            player.changeAnimation("player pulando");
        }

        // Gravidade
        player.velocityY += 0.8;

        // Código para reiniciar a torre
        if (torre.y > height) {
            torre.y = height / 2;
        }

        // Verificar colisão com a porta
        if (grupoPorta.isTouching(player)) {
            estadoJogo = "fim";
        }

        gerarPortas();
        drawSprites();
    }

    if (estadoJogo === "fim") {
        background(0);
        fill("red");
        textSize(30);
        text("O PALHAÇO TE PEGOU! HAHAHAHAHA", 30, 200);
    }
}

function gerarPortas() {
    if (frameCount % 240 === 0) {
        porta = createSprite(200, -50);
        porta.x = Math.round(random(120, 400));

        grade = createSprite(porta.x, 10);

        blocoInvisivel = createSprite(porta.x, 25, grade.width, 2);
        blocoInvisivel.visible = false;

        porta.addImage(portaImg);
        grade.addImage(gradeImg);

        blocoInvisivel.velocityY = 1;
        grade.velocityY = 1;
        porta.velocityY = 1;

        blocoInvisivel.lifetime = 800;
        player.depth = porta.depth + 1;

        grupoBlocoInvisivel.add(blocoInvisivel);
        grupoGrade.add(grade);
        grupoPorta.add(porta);
    }
}

