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
                p.createCanvas(p.windowWidth, (p.windowHeight / 2) + 100);//(2*(p.windowWidth/3))//(2*(p.windowHeight/3))
                for(let i = 0; i<p.width / 12; i++){
                    particles.push(new Particle());
                }
                console.log(particles);
            };

            p.draw = () => {
                p.background("#90877cff", 0);
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
                    this.x = p.random(0,  p.windowWidth - 50);//(2*(p.windowWidth/3))
                    this.y = p.random(0, p.windowHeight / 2);//(2*(p.windowHeight/3))
                    this.r = p.random(5,10);
                    this.xSpeed = p.random(-.2,.2);
                    this.ySpeed = p.random(-.2 ,.2);
                }
            
            // creation of a particle.
                createParticle() {
                    p.noStroke();
                    p.fill('#009fff');//rgba(185, 229, 243, 0.25)
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
                    if(dis<p.width/20) {//p.width/10
                        p.stroke('#009fff');//rgba(255, 127, 77, 1)
                        p.strokeWeight(2)
                        p.line(this.x,this.y,element.x,element.y);
                        if(this.x > element.x){
                            this.moveParticle()
                        }else{
                            element.moveParticle()
                        }
                    }
                });
                }
            }
        };
        // const sk = (sketch) => {
        //         // an array to add multiple particles
        //         let particles = [];
        //         let drawIterator = 0;
        //         //let rgbastring = 'rgba(' + sketch.round(sketch.random(0,255)) + ',' + sketch.round(sketch.random(0,255)) + ',' + sketch.round(sketch.random(0,255)) + ',' + sketch.round(sketch.random(0,10)) + ')';
        //         let rgbastring = 'rgba(255, 145, 77, 1)';
        //         sketch.setup = () => {
        //             sketch.createCanvas((2*(sketch.windowWidth/3)), sketch.windowHeight/2);
        //             for(let i = 0;i<sketch.windowWidth/50;i++){
        //                 particles.push(new Particle());
        //             }
        //         }
        //         sketch.draw = () => {
        //             sketch.background('#cee7f4');
        //             drawIterator++;
        //             if(drawIterator % 120 == 0){
        //                 // rgbastring = 'rgba(' + sketch.round(sketch.random(0,255)) + ',' + sketch.round(sketch.random(0,255)) + ',' + sketch.round(sketch.random(0,255)) + ',' + sketch.round(sketch.random(0,10)) + ')';
        //                 // document.getElementById('centered-card').style.border = "4px solid " + rgbastring;
        //                 // var headers = document.getElementsByClassName('project-header')
        //                 // for(var i = 0; i < headers.length; i++){
        //                 //     headers[i].style["text-shadow"] = "2px 1px " + rgbastring;
        //                 // }
        //                 // var links = document.querySelector('a')
        //                 // for(var i = 0; i < links.length; i++){
        //                 //     links[i].style['text-decoration-color'] = rgbastring;
        //                 // }
        //                 //document.getElementById('centered-card').style.background = rgbastring
        //                 // document.getElementById('main-header').style.color = rgbastring;
        //                 // document.getElementById('secondary-header').style.color = rgbastring;
        //                 // document.getElementById('p1').style.color = rgbastring;
        //                 // document.getElementById('p2').style.color = rgbastring;
        //             }
        //             for(let i = 0;i<particles.length;i++){
        //                 particles[i].createParticle();
        //                 particles[i].moveParticle();
        //                 particles[i].joinParticles(particles.slice(i));
        //             }
        //         }
        //         class Particle{
        //             constructor(){
        //                 this.width = sketch.windowWidth
        //                 this.height = sketch.windowHeight
        //                 this.x = sketch.random(0,this.width);
        //                 this.y = sketch.random(0,this.height);
        //                 this.r = sketch.random(1,8);
        //                 this.xSpeed = sketch.random((this.r* -.225)/5,(this.r*.5)/100);
        //                 this.ySpeed = sketch.random((this.r* -.225)/5,(this.r*.5)/100);
        //                 //this.ySpeed = sketch.random((this.r*-.5)/4,(this.r*.2 )/50);
        //             }
        //             createParticle(){
        //                 sketch.noStroke();
        //                 sketch.fill('rgba(20, 188, 255, 0.75)');
        //                 sketch.circle(this.x,this.y,this.r);
        //             }
        //             joinParticles(){
        //                 particles.forEach(element =>{
        //                     let dis = sketch.dist(this.x,this.y,element.x,element.y);
        //                     if(dis<150) {
        //                         //sketch.stroke('rgba(1,222,3,0.4)');
        //                         sketch.stroke(rgbastring)
        //                         sketch.strokeWeight(sketch.round(sketch.random(0,6)))
        //                         sketch.line(this.x,this.y,element.x,element.y);
        //                         if(this.x > element.x){
        //                             this.moveParticle()
        //                         }else{
        //                             element.moveParticle()
        //                         }
        //                     }
        //                 });
        //             }
        //             moveParticle(){
        //                 if(this.x < 0 || this.x > this.width)
        //                     this.xSpeed*=-1;
        //                 if(this.y < 0 || this.y > this.height)
        //                     this.ySpeed*=-1;
        //                 this.x+=this.xSpeed;
        //                 this.y+=this.ySpeed;
        //             }
        //         }
        //     }
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