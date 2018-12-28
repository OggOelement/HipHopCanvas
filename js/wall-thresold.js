/**
 * @author Olivier Darmon
 */

class Brush{

    /**
     * 
     * @param {Object} ctx 
     * @param {Number} x 
     * @param {Number} y 
     */

    constructor(ctx , x=0 , y=0){
        this.tickAlpha = 1;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = "black";
        this.isActive = false;
        this.init();

    }


    init(){
        this.color = `hsl(${Math.floor(Math.random() * 360 )}, 80%, 70%)`;
        this.decAlpha = Math.random()* 0.05 + 0.005;
        this.drops = [];
        this.radius = Math.floor(Math.random() * 5 + 1 );

        for (let i = 0; i < 30; i++) {
           let a = Math.random()* (Math.PI *2);
            let sX = this.x + Math.cos(a) * this.radius;
            let sY = this.y + Math.sin(a) * this.radius;

            this.drops[i] = {
                angle : a ,
                distance: Math.floor(Math.random() * 30 + 2),
                radius : Math.random() * 3 + 0.8,
                lineWidth : Math.random() * 1.5,
                x : sX,
                y : sY,
                startX: sX,
                startY: sY
            };
        }        
    }


    start(){
        this.tickAlpha = 1;
        this.isActive = true;
    }



    draw(){

        if(!this.isActive) return;

        this.tickAlpha -= this.decAlpha;

        if(this.tickAlpha <= 0.01){
            this.isActive = false;
            this.x = Math.floor(Math.random() * 300 + 350 );
            this.y = Math.floor(Math.random() * 300 + 150 );
            this.init();
            return;
        }


        this.ctx.save();
        this.ctx.globalAlpha = this.tickAlpha;
        this.circleShape(this.x, this.y , this.radius);


        let px, py;

        for (let i = 0; i < this.drops.length; i++) {

            
            px = this.x + Math.cos(this.drops[i].angle) * this.drops[i].distance + 5;
            py = this.y + Math.sin(this.drops[i].angle) * this.drops[i].distance + 5;

            this.drops[i].x -= ( this.drops[i].x - px) /2;
            this.drops[i].y -= ( this.drops[i].y - py) /2;
            this.circleShape(this.drops[i].x , this.drops[i].y , this.drops[i].radius);

        }
        
        this.ctx.restore();
    }


    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} radius 
     */

    circleShape(x, y, radius){

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}



class AudioAnalyser{
    /**
     * 
     * @param {Sound} soundMedia 
     */
    constructor(soundMedia){

        this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        this.analyser  = this.audioCtx.createAnalyser();
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.audioSourceNode  = this.audioCtx.createMediaElementSource(soundMedia);

        this.analyser.fftSize = 64;
        this.analyser.getByteFrequencyData(this.dataArray);
        this.audioSourceNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination); 

    }


}


class HipHopText{

    constructor(ctx, text="label"){
        this.ctx = ctx;
        this.text = text;
        this.init();

    }


    init(){  
        this.color = "black";
        this.x =  Math.floor(Math.random()*220 + 400);
        this.y = Math.floor(Math.random()*400 + 150);
        this.isActif = false;
        this.life = Math.floor(Math.random()*5 + 3);
        this.scale = Math.random() * 0.85 + 0.7;
    }


    draw(){

        if(!this.isActif) return;

        this.life -= 0.1;
        if(this.life <= 0){
            this.init();
            return;
        } 
        
        
        this.ctx.save();
        this.ctx.font = '33px undergroundregular';
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = this.color;
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate( -Math.floor(Math.random()* 5) * Math.PI/180);
        this.ctx.scale(this.scale , this.scale);
        this.ctx.fillText(this.text, -5 + Math.floor(Math.random()*5), -5 + Math.floor(Math.random()*5));
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle  = `#E2CEBC`;
        this.ctx.strokeText(this.text, -10 + Math.floor(Math.random()*10), -10+ Math.floor(Math.random()*10) );    
        this.ctx.restore();
  
    }


}


class ThresoldVideo{
    /**
     * create hide canvas and context 2d temp and apply filter thresold from video source
     * 
     * @param {Video} sourceVideo 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} thresold 
     */
    constructor(sourceVideo , width, height, thresold){
        this.thresold = thresold;
        this.width = width;
        this.height = height;
        this.source = sourceVideo;
        this.canvas_temp = document.createElement("canvas");
        this.canvas_temp.style.backgroundColor = "white";
        this.canvas_temp.width = width;
        this.canvas_temp.height = height;
        this.ctx_temp = this.canvas_temp.getContext("2d");
        this.rgb = [0,0,0];
        

        this.drawVideoThresold();

    }


    thresoldData (imgData) {
        
        for (let i=0; i<imgData.data.length; i+=4) {

            if(imgData.data[i] < this.thresold || imgData.data[i+1] < this.thresold || imgData.data[i+2] < this.thresold ){
                imgData.data[i] = this.rgb[0];
                imgData.data[i+1] =this.rgb[1];
                imgData.data[i+2] =this.rgb[2];

            }else{
                imgData.data[i+3] = 0;
            }
        }

    }




    drawVideoThresold(){

        this.ctx_temp.drawImage(this.source , 0, 0, this.width, this.height);
        this.bmpData = this.ctx_temp.getImageData(0, 0 , this.width, this.height);
        this.thresoldData(this.bmpData);
        this.ctx_temp.putImageData(this.bmpData, 0 , 0);  
    }

    

}


class Main{

    constructor(){

        //check all the Elements we need and initialize param and medias.
        this.audioInfo = document.querySelector("#audioInfo>div");
        this.sound = document.querySelector("#sound");
        this.container = document.querySelector("#container");
        this.image = document.querySelector("#wall");
        
        this.source1 = document.querySelector("#source1");
        this.source1.src = "https://media.giphy.com/media/X8yeP7BkK4zfasdfF0/giphy.mp4";
        this.source2 = document.querySelector("#source2");
        this.source2.src = "https://media.giphy.com/media/MMFdUyTV6cqVG/giphy.mp4";

        this.canvas = document.querySelector("#output");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 960;
        this.canvas.height = 640;
        this.isLocked = false; 
        this.rgb = [0,0,0];

        //create some brushers.
        this.brushers = [];
        for (let i = 0; i < 16; i++) {
            const brush = new Brush(this.ctx , Math.floor(Math.random() * 500 + 280) , Math.floor(Math.random() * 300 + 100) );
            this.brushers.push(brush);
        }
        //create pop text fx with HipHopText
        this.popText= [
                new HipHopText(this.ctx, "hip hop"),
                new HipHopText(this.ctx, "yeah"),
                new HipHopText(this.ctx, "groove"),
                new HipHopText(this.ctx, "break"),
                new HipHopText(this.ctx, "dance")
        ]


        this.displayGraffiti();

        //first click for create audio context and thresold filter from video source
        this.audioInfo.addEventListener("click" , e => {

            let width = this.source1.videoWidth;
            let height = this.source1.videoWidth;
            
            this.tVideo1 = new ThresoldVideo(this.source1 , width , height , 120);
            this.tVideo2 = new ThresoldVideo(this.source2 , width , height , 30);
            this.currentVideo = this.tVideo1;
            

            this.audioInfo.parentNode.style.display = "none";

            this.audioAnalyser = new AudioAnalyser(this.sound);


            
            this.displayAll();

        })

        //pause all when sound is complete
        this.sound.addEventListener('ended', (e)=> {  
            this.currentVideo.source.pause();
            this.isLocked = false;
            clearTimeout(this.timeoutVideo);
            
        }, false);
        

        //toggle play/pause for all
        this.canvas.addEventListener("click" , e => {
            if(!this.isLocked){

                this.timeoutVideo = setTimeout(()=>this.changeSourceSRC() , 5000);
                this.isLocked = true;
                this.sound.play();
                this.currentVideo.source.play();
                this.loop();

            }else{

                this.sound.pause();
                this.currentVideo.source.pause();
                this.isLocked = false;
                clearTimeout(this.timeoutVideo);
                
            }
        })

    }


    //toggle with 2 ThresoldVideo
    changeSourceSRC(){

        if(this.isLocked){
           
           
            if(this.currentVideo.source === this.tVideo1.source){

                this.currentVideo.source.pause();
                this.currentVideo = this.tVideo2;

            }else{             

                this.currentVideo.source.pause();
                this.currentVideo = this.tVideo1;
            }

            this.currentVideo.source.play();
            this.timeoutVideo = setTimeout(()=>this.changeSourceSRC() , Math.floor(Math.random() * 8000 + 3000));
        }
    }


    displayVideo(){

        this.currentVideo.drawVideoThresold();
        this.ctx.drawImage(this.currentVideo.canvas_temp , 280 , 100);
    }

    

    //draw brush, color(thresold), and pop text with audio analyser
    displayBrushers(){

        if(!this.audioAnalyser) return;

            this.audioAnalyser.analyser.getByteTimeDomainData(this.audioAnalyser.dataArray);

            let amout;
            for (let i = 0; i < this.audioAnalyser.bufferLength; i++) {


                amout = this.audioAnalyser.dataArray[i]/2;

                if(amout > 80 && Math.random()>0.85){

                    if(this.popText[i] ){
                        this.popText[i].color = `rgb(${this.rgb[0]}, ${this.rgb[1] } , ${this.rgb[2]})`;
                        this.popText[i].isActif = true;
                    } 
                } 

                if(amout > 70){
                    
                    if(Math.random()>0.995){
                        this.rgb[0] = Math.floor(Math.random()* 200);
                        this.rgb[1] = Math.floor(Math.random()* 200 );
                        this.rgb[2] = Math.floor(Math.random()* 200 );
                        this.currentVideo.rgb = this.rgb;
                        
                    }


                    if(this.brushers[i] && !this.brushers[i].isActive ){

                        this.brushers[i].start();  
                    }
                            
                }

                if(this.brushers[i]){
                    this.brushers[i].draw();
                
                }

                if(this.popText[i] && this.popText[i].isActif) this.popText[i].draw();
                
                
            }

    }

    //draw static graphitti
    displayGraffiti(){

        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor ="black";
        this.ctx.font = '33px undergroundregular';
        this.ctx.fillStyle = 'black';
        this.ctx.translate(150, 150);
        this.ctx.rotate(-5 *Math.PI/180);
        this.ctx.fillText('click', 20, 40);
        this.ctx.fillText('where', 8, 80);
        this.ctx.fillText('you want', 0, 120);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor ="black";
        this.ctx.font = '20px undergroundregular';
        this.ctx.fillStyle = 'black';
        this.ctx.translate(800, 450);
        this.ctx.rotate(-4 *Math.PI/180);
        this.ctx.textAlign = "center";
        this.ctx.fillText('freestyle', 0, 0);
        this.ctx.fillText('by oggoelement', 7, 20);
        this.ctx.restore();
    }



    displayAll(){
        
        this.ctx.drawImage(this.image , 0 , 0);

        this.displayGraffiti();
        this.displayBrushers();

        this.ctx.save();
        this.ctx.globalAlpha = 0.8;
        this.ctx.globalCompositeOperation = "color-burn";
        this.displayVideo();
        
        this.ctx.restore(); 

    }

    //loop for update render
    loop(){

        if(this.isLocked){

            requestAnimationFrame(this.loop.bind(this));

            this.ctx.clearRect(0,0,960,640);

            this.displayAll();
        }
    }

}



window.onload = function(){

    const app = new Main();


}






