import React from "react";
import * as PIXI from 'pixi.js'
import cake1 from './sprites/cake_1.png'
import cake2 from './sprites/cake_2.png'
import cake3 from './sprites/cake_3.png'
import Range from '@atlaskit/range';
import Button from '@atlaskit/button';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import './Index.css';
import '@atlaskit/css-reset';

import { Checkbox } from '@atlaskit/checkbox';

import texture1 from './sprites/texture1.png';
import texture2 from './sprites/texture2.png';
import texture3 from './sprites/texture3.png';
import textureUp from './sprites/texture_up.png';
import textureAbove from './sprites/texture_above.png';
import styled from 'styled-components';

import { Label } from '@atlaskit/field-base';


interface CakeState {
    speed: number;
    canvasFrame?: any;
    x: any,
    y: any
};

declare const window: any;
export default class Index extends React.Component<{},CakeState> { 

    app: any;
    state: CakeState = {
        speed: 1,
        x: 0,
        y: 0
    };   


    cakeList: Array<any> = [];
    cakeContainerList: Array<any> = []
    container: any;
    indexToDelete: number = -1;

    canvas: any;

    cakeRowPos: any = {
        startPosY: 80,
        startPosX: 25,
        spacingX:  25,
        spacingY:  50,
        containerPosX: -60,
        maxWidth: 100,
        maxHeight: 100,
        minWidth: 25,
        minHeight: 25
    }

    frame = {
        width: 800,
        height: 600
    }

    canvasFrame: any;

    cakes: Array<any> = [];
    noisyCakes: Array<any> = [];
    cakeSizes: Array<number> = [100,95,90,85,80];



    constructor(props: any){
        super(props);
        /**
         *  cria o frame
         */
        this.app = new PIXI.Application({            
            width: this.frame.width, height: this.frame.height, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1
        });  
    }    

    /**       
     *  Rotina que cria uma fileira de 5 bolos verticalmente a partir de y = 100
     */

    randomSize = (max: number,min: number) => {
        return Math.random() * (max - min) + min;
    };


    animSpeed = () => {
        return 0.15 * this.state.speed;
    }

    r:Array<any> = [];    
    addRunningMachine(){
        
        let runningMachineContainer = new PIXI.Container();
        let n = Math.round(800/14) + 10;
        let pos = -88;

        let text1 = PIXI.Texture.from(texture1);
        runningMachineContainer.y = 80;  
        runningMachineContainer.x = 0;              

        for(var i = 0; i < n; i++){

            // let textObj = new PIXI.Sprite(text1);
            let textObj = new PIXI.AnimatedSprite([PIXI.Texture.from(texture1),
                                                   PIXI.Texture.from(texture2),PIXI.Texture.from(texture3)]);
            this.r.push(textObj);
            textObj.animationSpeed = 0.15;
            textObj.loop = true;
            textObj.anchor.set(-0.03);
            textObj.width = 14;
            textObj.height = 88*5;
            textObj.x = pos;
            textObj.play();
            runningMachineContainer.addChild(textObj);

            pos += 14;
        }
        
        let borderTexture = PIXI.Texture.from(textureUp);
        let borderObj = new PIXI.Sprite(borderTexture);
        borderObj.anchor.set(0.5);

        borderObj.x = 50;
        borderObj.y = 7;

        borderObj.width = 14*120;
        borderObj.height = 12;

        let borderTexture2 = PIXI.Texture.from(textureAbove);
        
        let p = Math.round(800/14) + 1, s = 0;
        for(var i = 0;i < p; i++){
            let borderObj2 = new PIXI.Sprite(borderTexture2);
            borderObj2.anchor.set(0.5);
            borderObj2.x = s;
            borderObj2.y = 459;
            borderObj2.height = 12;
            s += 14;
            runningMachineContainer.addChild(borderObj2);
        }
        

        runningMachineContainer.addChild(borderObj);



        
        this.app.stage.addChild(runningMachineContainer);
    }

    addCakeRow(){
        
        let containerRow = new PIXI.Container();
        containerRow.x = this.cakeRowPos.containerPosX;
        containerRow.y = this.cakeRowPos.startPosY;

        let y = containerRow.y;


        for(var i = 0;i < 4;i++){
            let i = Math.round(this.randomSize(this.cakes.length,1)) - 1;
            let textur = null;

            if(this.ruido){
                textur = this.noisyCakes[i];
            }else{
                textur = this.cakes[i];
            }

            let donutObj = new PIXI.Sprite(textur)
            // ancora a figura no centro
            donutObj.anchor.set(0.5);
            let size = Math.round(this.randomSize(this.cakeSizes.length,1)) - 1;
            donutObj.width = this.cakeSizes[size];
            donutObj.height = this.cakeSizes[size];

            // donutObj.width = this.randomSize(this.cakeRowPos.maxWidth,this.cakeRowPos.minWidth);
            // donutObj.height = this.randomSize(this.cakeRowPos.maxWidth,this.cakeRowPos.minWidth);
            donutObj.rotation += Math.random() * 2;
            
            donutObj.x = this.cakeRowPos.startPosX;
            donutObj.y = y;
            // espaçamento entre os bolos
            y += 50 + this.cakeRowPos.spacingY;

            this.cakeList.push(donutObj);
            containerRow.addChild(donutObj);          
        }

        this.cakeContainerList.push(containerRow);
        this.app.stage.addChild(containerRow);
        return containerRow;
    }

    /**
     * Aplica o ruido sal e pimenta em uma imagem RGBA
     * @param img 
     * @param width 
     * @param height 
     * @returns 
     */
    applyFilter(img: any,width: number,height: number){
        let i = Math.round(this.randomSize(10000,300));
        let num_pixels = 0;
        
        for(var j = 0;j < i;j++){
            let y_coord = Math.round(this.randomSize(height-1,0));
            let x_coord = Math.round(this.randomSize(width-1,0));

            let red = y_coord * (width * 4) + x_coord * 4;

            img[red] = 255;
            img[red + 1] = 255; // green
            img[red + 2] = 255; // blue
            // alpha: red + 3
            num_pixels = Math.round(this.randomSize(10000,300));            
        }

        for(var j = 0;j < i;j++){
            let y_coord = Math.round(this.randomSize(height - 1,0));
            let x_coord = Math.round(this.randomSize(width - 1,0));

            let red = y_coord * (width * 4) + x_coord * 4;
            img[red] = 0;
            img[red + 1] = 0; // green
            img[red + 2] = 0; // blue  
            // alpha: red + 3     
        }        
        return img;
    }

    get(src: any){
        var that = this;
        return new Promise((resolve,reject) =>{
            let element = document.createElement("canvas");
            element.width = that.frame.width;
            element.height = that.frame.height;
            let ctx = element.getContext("2d");
            let image = new Image();
            image.src = src;
            
            image.onload = () => {
                ctx?.drawImage(image,0,0);
                resolve(ctx?.getImageData(0,0,image.width,image.height));
            }
            image.onerror = reject;            
        })
    }

    async getImageData(img: any){       

        let imageData = this.get(img);
        
        return imageData;        
    }
    

    convert1dto2d(arr: Array<any>){
        let newArray = [];
        while (arr.length){
            newArray.push(arr.splice(0,3));
        }
    }

    stream: any;
    async componentDidMount(){  
        
        let loadNoisyCakes = async (textures: Array<any>) => {
            let canvas = document.createElement("canvas");
            canvas.width = this.frame.width;
            canvas.height = this.frame.height;
            var that = this; 

            for(var i = 0;i < that.cakes.length; i++){
                let url = that.cakes[i].textureCacheIds[0];
                let imageData: any = await this.getImageData(url);
                let appliedFilter = that.applyFilter(imageData.data,imageData.width,imageData.height);
                let im = new ImageData(appliedFilter,imageData.width,imageData.height);
                that.noisyCakes.push(PIXI.Texture.fromBuffer(Uint8Array.from(im.data),im.width,im.height));       
            }            
        }

        this.cakes = [
            PIXI.Texture.from(cake1),
            PIXI.Texture.from(cake2),
            PIXI.Texture.from(cake3),
        ];
        await loadNoisyCakes(this.cakes);

        // this.app = new PIXI.Application({
        //     width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1
        // });
        this.app = new PIXI.Application();        
        let divContainer = document.getElementById('container');
        divContainer?.appendChild(this.app.view);

        this.app.stop();

        const rect = new PIXI.Graphics()
                             .beginFill(0x1099bb)
                             .drawRect(0,0,800,600);

        this.app.stage.addChild(rect);
        this.app.renderer.plugins.prepare.upload(this.app.stage, () => {
            this.app.start()
        });      

        // this.canvas = document.getElementsByTagName("canvas")[0];
        // this.stream = this.canvas.captureStream(120);
        
        // setTimeout(function(){
        //     console.log('iniciando video')
        //     let vid = (document.getElementsByTagName("video")[0] as any);
        //     vid.srcObject = that.stream;
        //     console.log(that.stream.getVideoTracks()[0].requestFrame())

        //     let c_tmp = document.createElement("canvas");
        //     let contxt = c_tmp.getContext("2d");
        //     document.body.appendChild(c_tmp);
        //     const doSomethingWithTheFrame = (now: any, metadata: any) => {
        //         // Do something with the frame.
        //         contxt?.drawImage(vid,0,0,800,600);
        //         // var image = new Image();
        //         // image.src = c_tmp.toDataURL();
        //         var imag = contxt?.getImageData(0,0,800,600);
        //         let dataImg = that.applyFilter(imag?.data);
        //         let k = new ImageData(dataImg,800,600);
        //         contxt?.putImageData(k,0,0);
        //         // let mat = window.cv.imread(image)
        //         // Re-register the callback to be notified about the next frame.
        //         vid.requestVideoFrameCallback(doSomethingWithTheFrame);
        //     };

        //     vid.requestVideoFrameCallback(doSomethingWithTheFrame);

        // },1000)

        // this.container = new PIXI.Container();
        // this.app.stage.addChild(this.container); 

        
        // let donutObj = new PIXI.Sprite(donutTexture);
        // donutObj.anchor.set(0.5);
        // donutObj.width = 50;
        // donutObj.height = 50;
        // container.addChild(donutObj);        
               

        // this.container.x = 0;
        // this.container.y = 150;

        this.addRunningMachine();

        var that = this;
        this.container = this.addCakeRow();
        setInterval(function(){
            if(that.container.x > that.cakeRowPos.spacingX){
                that.container = that.addCakeRow();
            }
            if(that.indexToDelete > -1 && that.cakeContainerList[that.indexToDelete] != null){
                that.cakeContainerList.splice(that.indexToDelete,1);
                that.indexToDelete = -1;                   
            }
        },1); 

        /**
         *  Rotina que faz os bolos rolarem na esteira
         *  o container onde os bolos estão são movimentados sobre o eixo x, eixo y é constante
         */
        this.app.ticker.add((delta: any) => {
            // for(var i = 0;i < that.cakeContainerList.length; i++){
            //     if(that.cakeContainerList[i].x >= (this.frame.width + this.cakeRowPos.maxWidth)){
            //         that.indexToDelete = i;                    
            //     }else{
            //         that.cakeContainerList[i].x += this.state.speed 
            //     }                               
            // } 
            that.cakeContainerList.forEach((element,index) => {
                if(element.x >= (that.frame.width + element.width)){
                    that.container.removeChild(element);
                    that.indexToDelete = index;
                }else{
                    element.x += that.state.speed
                }                
            }) 
            // that.setState((state) => ({...state,canvasFrame: that.app.renderer.plugins.extract.base64(that.app.stage)}));
        });
    }

    ruido:boolean = false;
    setRuido(){
        this.ruido = !this.ruido;
    }

    incSpeed(){
        this.setState((state) => ({
            ...state,
            speed: state.speed + 1
        }));
    }

    decSpeed(){
        if(this.state.speed == 1) return;
        this.setState((state) => ({
            ...state,
            speed: state.speed - 1
        }));
    }  


    changeSpeed(value: number){
        this.setState((state) => ({...state, speed: value}))
        this.r.forEach(element => {
            element.animationSpeed = 0.15 * value;            
        });
    }    
    

    render(){  
        return (
            <>
            <Page>
                {/* Video <video autoPlay={true} muted={true}></video> */}
                <Grid>
                    <GridColumn medium={12}>
                       <div id={"container"}></div>
                    </GridColumn>                    
                </Grid> 
                <Grid>
                    <GridColumn medium={2}>
                        <Label label={"Velocidade"} />
                    </GridColumn>   
                    <GridColumn medium={2}>
                        <Range step={1} min={1} onChange={(value) => this.changeSpeed(value)} style={{'width':'50%'}} />
                    </GridColumn>
                </Grid> 
                <Grid>
                    <GridColumn medium={3}>
                        <Label label={"Ruído nos bolos"} />
                        <Checkbox onChange={() => this.setRuido()} />
                    </GridColumn> 
                </Grid>              
                {/* <Grid>
                    <GridColumn medium={2}>
                        Velocidade
                    </GridColumn>
                    <GridColumn medium={2}>
                        <Range step={1} onChange={(value) => console.log(value)} style={{'width':'50%'}} />
                    </GridColumn>
                </Grid> */}
            </Page>
                {/* <div style={{'textAlign':'center'}}>
                    Velocidade: {this.state.speed}
                </div>
                <div id={"container"}>
                </div>
                <div id={"controls"}>
                    <Range step={1} onChange={(value) => console.log(value)} style={{'width':'50%'}} />
                    { <button onClick={() => this.decSpeed()}>
                       <img src={minus} />
                    </button>
                    <button>                        
                        <img src={plus} onClick={() => this.incSpeed()} />
                    </button>                
                </div> */}
            </>           
        )
    }
}