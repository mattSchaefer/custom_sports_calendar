import React, { useEffect, useRef } from 'react'
import p5 from 'p5'


const P5Canvas = () => {
    const containerRef = useRef(null);
    const p5InstanceRef = useRef(null);
    
    useEffect(() => {
        if (!containerRef.current) return;
        let particles = []
        const sketch = (p) => {
            p.setup = () => {
                let container_wid = document.getElementById("root").getBoundingClientRect().width;
                let container_hei = document.getElementById("root").getBoundingClientRect().height;
                //p.createCanvas(container_wid / 2, (document.getElementsByTagName("body")[0].clientHeight) - 50);
                p.createCanvas(500,500)
                for(let i = 0; i</*p.width/50*/7; i++){
                    particles.push(new Particle());
                }
                console.log(particles);
            };

            p.draw = () => {
                p.background("#010618");
                p.fill(255, 0, 0);
                for(let i = 0;i<particles.length;i++) {
                    particles[i].createParticle();
                    particles[i].moveParticle();
                    particles[i].joinParticles(particles.slice(i));
                }
            };
            class Particle {
                // setting the co-ordinates, radius and the
                // speed of a particle in both the co-ordinates axes.
                constructor() {
                    this.x = p.random(0, p.width / 2);
                    this.y = p.random(0, p.height / 2);
                    this.r = p.random(1,4);
                    this.xSpeed = p.random(-.2,.2);
                    this.ySpeed = p.random(-.2,.2);
                }
            
            // creation of a particle.
                createParticle() {
                    p.noStroke();
                    p.fill('rgba(217, 185, 243, 0.25)');
                    p.circle(this.x,this.y,this.r);
                }
            
            // setting the particle in motion.
                moveParticle() {
                if(this.x < 0 || this.x > p.width)
                    this.xSpeed*=-1;
                if(this.y < 0 || this.y > p.height)
                    this.ySpeed*=-1;
                this.x+=this.xSpeed;
                this.y+=this.ySpeed;
                }
            
            // this function creates the connections(lines)
            // between particles which are less than a certain distance apart
                joinParticles(particles) {
                particles.forEach(element =>{
                    let dis = p.dist(this.x,this.y,element.x,element.y);
                    if(dis>p.width/10) {
                        p.stroke('rgba(255, 202, 202, 0.47)');
                        p.line(this.x,this.y,element.x,element.y);
                    }
                });
                }
            }
        };

        p5InstanceRef.current = new p5(sketch, containerRef.current);

        return () => {
            if (p5InstanceRef.current) {
            p5InstanceRef.current.remove();
            }
        };
        }, []);
    
    return <div ref={containerRef} id="p5canvascontainer" className="p5canvascontainer" />;
  };
  
  export default P5Canvas;