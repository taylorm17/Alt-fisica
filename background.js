/* =====================================
    expoxt e funcionamento geral
====================================== */
export function initBackground(canvas) {
    const ctx = canvas.getContext("2d"); // pega o contexto 2D do canvas, que permite desenhar formas e partículas

    canvas.width = window.innerWidth; // define a largura inicial do canvas igual à largura da janela
    canvas.height = window.innerHeight; // define a altura inicial do canvas igual à altura da janela

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth; // atualiza a largura quando a janela for redimensionada
        canvas.height = window.innerHeight; // atualiza a altura quando a janela for redimensionada
    });
    
    /* =====================================
        configurações de comportamento geral
    ====================================== */

    const G = 0.15;                 //força gravitacional(quanto maior, mais forte))
    const DAMPING = 0.999;          //amortecimento (o que faz as partículas perderem velocidade)
    const ORBIT_RADIUS = 70;        //raio minimo(onde a orbita acontece)
    const GRAVITY_RADIUS = 150;     //raio máximo, até onde a gravidade é aplicada
    const MAX_SPEED = 4;            //velocidade máxima para as partículas
    const PERSPECTIVE = 400;        //valor do efeito 3D (quanto menor, mais forte)
    const ESCAPE_TIME = 100000;     //tempo que uma particula fica orbitando até escapar (em frames, 60 frames = 1 segundo)
    const ATTRACTOR_SPEED = 0.2;    //vvelocidade dos atratores(a bolinha vermelha)
    const CURSOR_FORCE = 0.03;      //força que o cursor puxa as partículas
    const CURSOR_RADIUS = 200;      //raio que o cursor consegue puxar as partículas

    /* =====================================
        mouse e tracking do mouse
    ====================================== */
    // aq só rastreia a posição do mouse e salva pra depois permitir ele atrairr as partículas
    let mouse = {
        x: canvas.width / 2, // começa com o mouse no centro horizontal da tela
        y: canvas.height / 2 // começa com o mouse no centro vertical da tela
    };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX; // atualiza posição x do mouse em tempo real
        mouse.y = e.clientY; // atualiza posição y do mouse em tempo real
    });

    /* =====================================
        funcionamento das partículas
    ====================================== */

    class Particle {
        constructor(type) {
            this.type = type; // define se a partícula será attractor ou orbiter

            this.x = Math.random() * canvas.width;              //posiciona de forma aleatória a particula no eixo x
            this.y = Math.random() * canvas.height;             //posiciona de forma aleatória a particula no eixo y
            this.vx = (Math.random() - 0.5);                    //define uma velocidade inicial aleatória( nesse caso indo de -0,5 a 0,5) no eixo x
            this.vy = (Math.random() - 0.5);                    //mesma coisa que o de cima, mas para o eixo y
            this.z = 0;                                         //profundidade pro efeito 3D
            this.orbitAngle = Math.random() * Math.PI * 2;      //angulo inicial do efeito 3D
            this.orbitTimer = 0;                                //timer para contar quanto tempo a particula ficou orbitando, pra depois fazer ela escapar

            if (type === "attractor") {                         //decide que se for uma bolinha vermelha vai ter as caracteristicas abaixo
                this.mass = 80;                                 //massa da particula, serve pro calculo de atração gravitacional(quanto maior, mais forte a gravidade)
                this.radius = 14;                               //tamanho da bolinha vermelha
                this.color = "red";                             //cor da bolinha vermelha (pode trocar sem problemas)

                let angle = Math.random() * Math.PI * 2;        //gera um angulo aleatório pra definir a direção inicial do movimento da bolinha vermelha   
                this.vx = Math.cos(angle) * ATTRACTOR_SPEED;    //define a velocidade inicial da bolinha vermelha no eixo x, usando o angulo gerado e a constante de velocidade definida lá em cima
                this.vy = Math.sin(angle) * ATTRACTOR_SPEED;   //mesma coisa que o de cima, mas para o eixo y

            } else {                            //diz que se não for uma bolinha azul, vai ter as caracteristicas abaixo
                this.mass = 2;                  //massa da particula, aq é menor porque ela deve ser atraida pela de massa maior, 
                this.radius = 4;                //tamanhoda da bolinha azul
                this.color = "cyan";            //cor da bolinha azul (também pode trocar sem problemas)
            }
        }

        limitSpeed() {
            if (this.type !== "orbiter") return;        // dá uma velocidade limite pras bolinhas azul
            let speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);   // calcula a velocidade da bolinha azul(usa uma formula pra calcular a velocidade a partir dos componentes vx e vy(pitagoras)))
            if (speed > MAX_SPEED) {                    //não permite que a velocidade seja maior que o limite
                this.vx = (this.vx / speed) * MAX_SPEED;    //normaliza o vetor da velocidade, mantém a direção mas ajusta o comprimento pra ser igual ao limite
                this.vy = (this.vy / speed) * MAX_SPEED;    //mesma coisa que o de cima, mas para o componente y 
            }
        }

        update() {
            this.x += this.vx;                      //atualiza a posição da particula somando a velocidade atual
            this.y += this.vy;                      //mesma coisa que o de cima, mas para o eixo y

            if (this.type === "orbiter") {
                this.vx *= DAMPING; // aplica amortecimento na velocidade horizontal da bolinha azul
                this.vy *= DAMPING; // aplica amortecimento na velocidade vertical da bolinha azul
                this.limitSpeed(); // garante que ela não ultrapasse a velocidade máxima
            }

            if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width)
                this.vx *= -1; // inverte direção horizontal quando encosta na borda lateral

            if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height)
                this.vy *= -1; // inverte direção vertical quando encosta na borda superior/inferior
        }

        draw() {
            let drawRadius = this.radius; // define o raio que será usado no desenho da partícula

            ctx.beginPath(); // inicia um novo desenho no canvas
            ctx.arc(this.x, this.y, drawRadius, 0, Math.PI * 2); // desenha o círculo da partícula

            let gradient = ctx.createRadialGradient(
                this.x - drawRadius/3, // ponto inicial x do brilho interno
                this.y - drawRadius/3, // ponto inicial y do brilho interno
                drawRadius/5, // raio interno do brilho
                this.x, // centro x do gradiente
                this.y, // centro y do gradiente
                drawRadius // raio externo total do gradiente
            );

            gradient.addColorStop(0, "white"); // centro claro para dar efeito de brilho
            gradient.addColorStop(1, this.color); // borda com a cor principal da partícula

            ctx.fillStyle = gradient; // aplica o gradiente como preenchimento
            ctx.fill(); // preenche o círculo desenhado
        }
    }

    /* =====================================
            Funções
    ====================================== */

    function applyOrbitGravity(attractor, orbiter) {
        let dx = attractor.x - orbiter.x; // distância horizontal entre atrator e orbiter
        let dy = attractor.y - orbiter.y; // distância vertical entre atrator e orbiter
        let dist = Math.sqrt(dx*dx + dy*dy); // calcula a distância real entre os dois

        if (dist > GRAVITY_RADIUS) {
            orbiter.z = 0; // remove efeito 3D se estiver longe demais
            orbiter.orbitTimer = 0; // reseta o tempo de órbita
            return; // interrompe porque não há gravidade aplicada
        }

        let softening = 80; // suaviza a força gravitacional para evitar aceleração extrema
        let force = (G * attractor.mass) / (dist*dist + softening); // calcula força gravitacional

        let nx = dx / dist; // vetor normalizado x da direção até o atrator
        let ny = dy / dist; // vetor normalizado y da direção até o atrator

        orbiter.vx += force * nx; // aplica força no eixo x
        orbiter.vy += force * ny; // aplica força no eixo y

        if (dist < ORBIT_RADIUS) {
            orbiter.orbitTimer++; // conta quanto tempo ficou dentro da órbita

            let radialSpeed = orbiter.vx * nx + orbiter.vy * ny; // mede quanto da velocidade aponta direto pro centro

            orbiter.vx -= radialSpeed * nx * 0.5; // reduz velocidade radial no eixo x para favorecer órbita
            orbiter.vy -= radialSpeed * ny * 0.5; // reduz velocidade radial no eixo y para favorecer órbita

            orbiter.vx *= 1.01; // pequeno impulso para manter movimento orbital
            orbiter.vy *= 1.01; // mesma coisa no eixo y

            orbiter.orbitAngle += 0.05; // avança o ângulo da animação 3D
            orbiter.z = Math.sin(orbiter.orbitAngle) * 40; // cria efeito de profundidade simulada

            if (orbiter.orbitTimer > ESCAPE_TIME) {
                orbiter.vx -= nx * 0.8; // empurra a partícula para fora da órbita no eixo x
                orbiter.vy -= ny * 0.8; // empurra a partícula para fora da órbita no eixo y
                orbiter.orbitTimer = 0; // reinicia o contador
                orbiter.z = 0; // remove profundidade após escapar
            }

        } else {
            orbiter.orbitTimer = 0; // reseta se sair da zona de órbita
            orbiter.z = 0; // remove efeito 3D fora da órbita
        }
    }

    function applyCursorGravity(orbiter) {
        let dx = mouse.x - orbiter.x; // distância horizontal até o cursor
        let dy = mouse.y - orbiter.y; // distância vertical até o cursor
        let dist = Math.sqrt(dx*dx + dy*dy); // distância real até o cursor

        if (dist > CURSOR_RADIUS || dist === 0) return; // só aplica força dentro do raio permitido

        let force = CURSOR_FORCE / (dist * 0.1 + 1); // calcula força de atração do cursor

        orbiter.vx += dx / dist * force; // aplica força horizontal puxando pro mouse
        orbiter.vy += dy / dist * force; // aplica força vertical puxando pro mouse
    }

    function resolveOrbiterCollisions(orbiters) {
        for (let i = 0; i < orbiters.length; i++) {
            for (let j = i + 1; j < orbiters.length; j++) {
                let a = orbiters[i]; // primeira partícula da comparação
                let b = orbiters[j]; // segunda partícula da comparação

                let dx = b.x - a.x; // distância horizontal entre elas
                let dy = b.y - a.y; // distância vertical entre elas
                let dist = Math.sqrt(dx*dx + dy*dy); // distância total entre partículas
                let minDist = a.radius + b.radius; // distância mínima antes de colidirem

                if (dist < minDist && dist > 0) {
                    let nx = dx / dist; // normalização da direção x
                    let ny = dy / dist; // normalização da direção y
                    let overlap = minDist - dist; // quanto uma está invadindo a outra

                    a.x -= nx * overlap / 2; // afasta a primeira partícula no eixo x
                    a.y -= ny * overlap / 2; // afasta a primeira partícula no eixo y
                    b.x += nx * overlap / 2; // afasta a segunda partícula no eixo x
                    b.y += ny * overlap / 2; // afasta a segunda partícula no eixo y

                    let tempVx = a.vx; // guarda velocidade x temporariamente
                    let tempVy = a.vy; // guarda velocidade y temporariamente

                    a.vx = b.vx; // troca velocidade x entre partículas
                    a.vy = b.vy; // troca velocidade y entre partículas

                    b.vx = tempVx; // finaliza troca da velocidade x
                    b.vy = tempVy; // finaliza troca da velocidade y
                }
            }
        }
    }

    /* =====================================
        Inicialização
    ====================================== */

    let particles = []; // array principal onde todas as partículas serão armazenadas

    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768; // detecta se o dispositivo é mobile
    const attractorCount = isMobile ? 4 : 7; // define menos atratores em celular para melhorar desempenho
    const orbiterCount = isMobile ? 50 : 90; // define menos orbiters em celular pelo mesmo motivo

    for (let i = 0; i < attractorCount; i++) {
        particles.push(new Particle("attractor")); // cria e adiciona as bolinhas vermelhas
    }

    for (let i = 0; i < orbiterCount; i++) {
        particles.push(new Particle("orbiter")); // cria e adiciona as bolinhas azuis
    }

    /* =====================================
            Loop
    ====================================== */

    let frame = 0; // contador de frames usado para controlar eventos periódicos

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // limpa o canvas a cada frame antes de redesenhar

        let attractors = particles.filter(p => p.type === "attractor"); // separa apenas os atratores
        let orbiters = particles.filter(p => p.type === "orbiter"); // separa apenas os orbiters

        for (let a of attractors) {
            for (let o of orbiters) {
                applyOrbitGravity(a, o); // cada atrator aplica gravidade em cada orbiter
            }
        }

        for (let o of orbiters) {
            applyCursorGravity(o); // aplica atração do mouse em cada orbiter
        }

        if (frame % 2 === 0) {
            resolveOrbiterCollisions(orbiters); // verifica colisões a cada 2 frames para economizar processamento
        }

        particles.sort((a, b) => a.z - b.z); // ordena por profundidade para simular efeito 3D

        for (let p of particles) {
            p.update(); // atualiza física e movimento
            p.draw(); // desenha a partícula na tela
        }

        requestAnimationFrame(animate); // chama o próximo frame da animação
        frame++; // incrementa o contador de frames
    }

    animate(); // inicia o loop principal da animação
}