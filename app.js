function initCanvas() {
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage = new Image(); // nave
    var enemiespic1 = new Image(); // enemigo 1
    var enemiespic2 = new Image(); // enemigo 2


    backgroundImage.src = "images/background-pic.jpg"; //Fondo
    naveImage.src = "images/spaceship-pic.png"; //Nave
    // Enemigos fotos
    enemiespic1.src = "images/enemigo1.png";
    enemiespic2.src = "images/enemigo2.png"; //Enemigos

    // tamaño de canvas
    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px

    // naves
    var enemyTemplate = function (options) {
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    // evitar bucles
    var enemies = [
        new enemyTemplate({ id: "enemigo 1", x: 100, y: -20, w: 50, h: 30 }),
        new enemyTemplate({ id: "enemigo 2", x: 225, y: -20, w: 50, h: 30 }),
        new enemyTemplate({ id: "enemigo 3", x: 350, y: -20, w: 80, h: 30 }),
        new enemyTemplate({ id: "enemigo 4", x: 100, y: -70, w: 80, h: 30 }),
        new enemyTemplate({ id: "enemigo 5", x: 225, y: -70, w: 50, h: 30 }),
        new enemyTemplate({ id: "enemigo 6", x: 350, y: -70, w: 50, h: 30 }),
        new enemyTemplate({ id: "enemigo 7", x: 475, y: -70, w: 50, h: 30 }),
        new enemyTemplate({ id: "enemigo 8", x: 600, y: -70, w: 80, h: 30 }),
        new enemyTemplate({ id: "enemigo 9", x: 475, y: -20, w: 50, h: 30 }),
        new enemyTemplate({ id: "enemigo 10", x: 600, y: -20, w: 50, h: 30 }),

        // Segundo grupo de enemigos
        new enemyTemplate({ id: "enemigo 11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "eenemigo 16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemigo 20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
    ];


    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);

            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher() {
        //(ubicación de balas)
        this.y = 500,
            this.x = cW * .5 - 25,
            this.w = 100,
            this.h = 100,
            this.direccion,
            this.bg = "white", // color de las balas
            this.misiles = [];


        this.gameStatus = {
            over: false,
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            if (this.direccion === 'left') {
                this.x -= 5;
            } else if (this.direccion === 'right') {
                this.x += 5;
            } else if (this.direccion === "downArrow") {
                this.y += 5;
            } else if (this.direccion === "upArrow") {
                this.y -= 5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); // fondo
            ctx.drawImage(naveImage, this.x, this.y, 100, 90); // asegurar posición de balas con nave

            for (var i = 0; i < this.misiles.length; i++) {
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y -= 5, m.w, m.h); // direccion de la bala
                this.hitDetect(this.misiles[i], i);
                if (m.y <= 0) {
                    this.misiles.splice(i, 1);
                }
            }
            // esto pasa si Ganaste
            if (enemies.length === 0) {
                clearInterval(animateInterval); // parar
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('Ganaste!', cW * .5 - 80, 50);
            }
        }
        // Detectar impacto de bullet (bala)
        this.hitDetect = function (m, mi) {
            console.log('crush');
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if (m.x + m.w >= e.x &&
                    m.x <= e.x + e.w &&
                    m.y >= e.y &&
                    m.y <= e.y + e.h) {
                    this.misiles.splice(this.misiles[mi], 1); // borrar misil
                    enemies.splice(i, 1); // borrar el enemigo que se mató
                    document.querySelector('.barra').innerHTML = "Mataste " + e.id + " ";
                }
            }
        }

        this.hitDetectLowerLevel = function (enemy) {

            if (enemy.y > 550) {
                this.gameStatus.over = true;
                this.gameStatus.message = 'El enemigo pasó';
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> where is spaceship location
            if (enemy.id === 'enemy3') {
                //console.log(this.y);
                console.log(this.x);
            }

            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) {
                this.gameStatus.over = true;
                this.gameStatus.message = 'Perdiste'
            }

            if (this.gameStatus.over === true) {
                clearInterval(animateInterval);
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;

                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50);
            }
        }
    }

    var launcher = new Launcher();
    function animate() {
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate, 6);

    var left_btn = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn = document.getElementById('fire_btn');

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 37) // left arrow
        {
            launcher.direccion = 'left';
            if (launcher.x < cW * .2 - 130) {
                launcher.x += 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 37) {
            launcher.x += 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 39) // right arrow
        {
            launcher.direccion = 'right';
            if (launcher.x > cW - 110) {
                launcher.x -= 0;
                launcher.direccion = '';
            }

        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 39) // right arrow
        {
            launcher.x -= 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 38) // up arrow
        {
            launcher.direccion = 'upArrow';
            if (launcher.y < cH * .2 - 80) {
                launcher.y += 0;
                launcher.direccion = '';
            }
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 38) // up arrow
        {
            launcher.y -= 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 40) // down arrow
        {
            launcher.direccion = 'downArrow';
            if (launcher.y > cH - 110) {
                launcher.y -= 0;
                launcher.direccion = '';
            }
        }
    });
    document.addEventListener('keyup', function (event) {
        if (event.keyCode == 40) // down arrow
        {
            launcher.y += 0;
            launcher.direccion = '';
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 80) // restart game
        {
            location.reload();
        }
    });

    // control buttons
    left_btn.addEventListener('mousedown', function (event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function (event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function (event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function (event) {
        launcher.direccion = '';
    });

    fire_btn.addEventListener('mousedown', function (event) {
        launcher.misiles.push({ x: launcher.x + launcher.w * .5, y: launcher.y, w: 3, h: 10 });
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 32) {
            launcher.misiles.push({ x: launcher.x + launcher.w * .5, y: launcher.y, w: 3, h: 10 });
        }
    });
}

window.addEventListener('load', function (event) {
    alert("¡Bienvenido! Juegas con las flechitas de tu teclado, y la barra espaciadora. Elimina todos los enemigos y no los dejes pasar. Hecho por Carlos.");
    initCanvas();
});
