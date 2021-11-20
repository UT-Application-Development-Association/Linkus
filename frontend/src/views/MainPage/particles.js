export default class Particles{
    config = {
        color: "#0d3a52",
        lineColor: "#0d74a6",
        count: 20,
        lined: false,
        lineDist: 6000,
        size: 5
    };
    canvas = null;

    constructor(config={}) {
        Object.assign(this.config, config);
        this.canvas = document.getElementById("particles");
    }

    run(){
        function resize() {
            canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }
        const RAF = (function (){
            return window.requestAnimationFrame;
        })();
        const hex2rgba = (hex, alpha = 1) => {
            const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
            return `rgba(${r},${g},${b},${alpha})`;
        };
        function animate(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let nParticles = [warea].concat(particles);
            particles.forEach(function (particle) {
                particle.xa *= (particle.x > canvas.width || particle.x < 0)? -1 : 1;
                particle.ya *= (particle.y > canvas.height || particle.y < 0)? -1 : 1;

                particle.x += particle.xa;
                particle.y += particle.ya;

                ctx.beginPath();
                ctx.arc(particle.x,particle.y,config.size,0,360,false);
                ctx.fillStyle=config.color;
                ctx.fill();
                ctx.closePath();

                for(let i=0;i<nParticles.length;i++){
                    let p2 = nParticles[i];
                    if(particle === p2 || p2.x === null || p2.y === null) continue;
                    let xc = particle.x - p2.x;
                    let yc = particle.y - p2.y;

                    let distance = xc * xc + yc * yc;
                    let ratio;

                    if(distance < p2.max){
                        if(p2 === warea && distance > (p2.max / 2)){
                            particle.x -= xc * 0.01;
                            particle.y -= yc * 0.01;
                        }
                        ratio = (p2.max - distance) / p2.max;

                        ctx.beginPath();
                        ctx.lineWidth = ratio * config.size / 1.5;
                        ctx.strokeStyle = hex2rgba(config.lineColor, ratio + 0.2);
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
                nParticles.splice(nParticles.indexOf(particle), 1);
            });
            RAF(animate);
        }

        let canvas = this.canvas;
        let config = this.config;
        let ctx = canvas.getContext("2d");

        resize();
        window.onresize = resize;
        const warea = {x: null, y: null, max: 20000};
        window.onmousemove = function (e) {
            e = e || window.event;
            warea.x = e.clientX;
            warea.y = e.clientY;
        };
        window.onmouseout = function (e) {
            warea.x = null;
            warea.y = null;
        };

        const particles = [];
        for(let i=0;i<config.count;i++){
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                xa: Math.random() * 2 - 1,
                ya: Math.random() * 2 - 1,
                max: config.lineDist
            })
        }

        setTimeout(function (){
            animate();
        }, 100);
    }
}
