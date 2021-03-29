import React from "react";
import * as PIXI from 'pixi.js'
import cat from './sprites/cat.png';
import cake from './sprites/cake.png'
import donut from './sprites/chocolate_icing.png'
import plus from './sprites/buttons/Plus (1).png'
import minus from './sprites/buttons/Minus (1).png'
import './Index.css';

interface CakeState {
    speed: number;
};

export default class Index extends React.Component<{},CakeState> { 

    app: any;
    state: CakeState = {
        speed: 1
    };

    cakeList: Array<any> = [];
    cakeContainerList: Array<any> = []
    donutTexture: PIXI.Texture;
    container: any;
    indexToDelete: number = -1;

    cakeRowPos: any = {
        startPosY: 100,
        startPosX: 25,
        spacingX:  10,
        spacingY:  5,
        containerPosX: -50,
        defaultWidth: 50,
        defaultHeight: 50
    }



    constructor(props: any){
        super(props);
        this.app = new PIXI.Application({
            width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1
        });

        this.donutTexture = PIXI.Texture.from(donut);       
    }    

    /**       
     *  Rotina que cria uma fileira de 5 bolos verticalmente a partir de y = 100
     */

    addCakeRow(){    
        
        let containerRow = new PIXI.Container();
        containerRow.x = this.cakeRowPos.containerPosX;
        containerRow.y = this.cakeRowPos.startPosY;

        let y = containerRow.y;


        for(var i = 0;i < 5;i++){
            let donutObj = new PIXI.Sprite(this.donutTexture);
            // ancora a figura no centro
            donutObj.anchor.set(0.5);
            donutObj.width = this.cakeRowPos.defaultWidth;
            donutObj.height = this.cakeRowPos.defaultHeight;
            
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

    componentDidMount(){
        this.app = new PIXI.Application({
            width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1
        });
        let divContainer = document.getElementById('container');
        divContainer?.appendChild(this.app.view);

        // this.container = new PIXI.Container();
        // this.app.stage.addChild(this.container); 

        
        // let donutObj = new PIXI.Sprite(donutTexture);
        // donutObj.anchor.set(0.5);
        // donutObj.width = 50;
        // donutObj.height = 50;
        // container.addChild(donutObj);        
               

        // this.container.x = 0;
        // this.container.y = 150;

        var that = this;
        this.container = this.addCakeRow();
        setInterval(function(){
            if(that.container.x > 0){
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
            for(var i = 0;i < that.cakeContainerList.length; i++){
                if(that.cakeContainerList[i].x >= 800){
                    that.indexToDelete = i;
                }else{
                    that.cakeContainerList[i].x += this.state.speed 
                }                               
            }
        });

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
    
    render(){  
        return (
            <>
                <div style={{'textAlign':'center'}}>
                    Velocidade: {this.state.speed}
                </div>
                <div id={"container"}>
                </div>
                <div id={"controls"}>
                    <button onClick={() => this.decSpeed()}>
                       <img src={minus} />
                    </button>
                    <button>
                        <img src={plus} onClick={() => this.incSpeed()} />
                    </button>                    
                </div>
            </>           
        )
    }
}