import { Canvas, Label, SpriteFrame, tween } from 'cc';
import { _decorator, Component, Node, MeshRenderer, Button, Texture2D, Vec2, v2, systemEvent, SystemEventType, Vec3, Camera, Sprite } from 'cc';
import { Color, Graphics, screen } from 'cc';
const { ccclass, property } = _decorator;
const greenColor = new Color(26, 94, 26);
const blueColor = new Color(140,195,190);
const purpleColor = new Color(182, 168, 177);
const whiteColor = new Color(236,236,236);
const grayColor = new Color(83, 87, 98);
const blackColor = new Color(34, 34, 34);
const redColor = new Color(145, 30, 35);
const orangeColor = new Color(224,152,93);

const hightlightColor = new Color(235,245,255);
var outsoleMaterial = null;
var insoleMaterial = null;
var meshRenderer = null; 
var materials = null;
var shoe = null;
var originTexture = null;
const w = 260;
const h = 72;
var currentIndex = 0;
const changeView = ['laces', 'mesh', 'caps', 'inner', 'sole', 'stripes', 'band', 'patch']
const lacesColor = [blackColor, grayColor, whiteColor, redColor, blueColor, purpleColor, orangeColor]
var currentPart = null;
var materialNode = null;
var colorNode =null;

@ccclass('changeColor')
export class changeColor extends Component {
@property({type: Texture2D })
textureNormal: Texture2D = null;

@property(Texture2D)
textureFabric: Texture2D = null;

@property(Texture2D)
textureBase: Texture2D = null;

@property(Texture2D)
textureLeather: Texture2D = null;

@property(SpriteFrame)
canvas: SpriteFrame = null;

@property(SpriteFrame)
canvasSelected: SpriteFrame = null;

@property(SpriteFrame)
leather: SpriteFrame = null;

@property(SpriteFrame)
leatherSelected: SpriteFrame = null;

@property({ type: Node })
public playerPos: Node = null;

@property({ type: Node })
public rotaTarget: Node = null;

@property({ type: false })
private isMoving = false;

@property({ type: Vec2 })
public startPos: Vec2;

@property
public touchState = 1;

@property({ type: Vec2 })
public endPos: Vec2;

@property
public moveSpeed = 10;

public RotaValue = 0;
    
    start() {
        meshRenderer = this.node.getComponentInChildren(MeshRenderer);
        materials = meshRenderer.materials;
        currentPart = materials[0];
        materialNode = this.node.parent.children[1].children[1].children[1];
        colorNode = this.node.parent.children[1].children[1].children[2];
        console.log('=========colorNode', colorNode);
        var labels = colorNode.getComponentsInChildren(Label);

        console.log('=========Label', labels);
        // materialNode.active = false;

         outsoleMaterial = materials[1];
        // insoleMaterial = materials[3];
        // outsoleMaterial.setProperty("mainColor",whiteColor);
        // insoleMaterial.setProperty("mainColor",whiteColor);
        outsoleMaterial.setProperty('normalMap', this.textureFabric);
        this.initMaterialColor();
        console.log('=========materials', materials);

        originTexture = outsoleMaterial.getProperty('normalMap');
        meshRenderer.materials = materials;
        //handle button
        let button = this.node.getComponentInChildren(Button);
        this.rotaTarget.eulerAngles = new Vec3(0, -120, 0);
        shoe = this.node.children[0];
        console.log('-safcas', originTexture);
        this.setMaterialButton();
        this.updateColorSelected();
        // TODO: add color button automatic
        // this.setColorButton();
    }

    setMaterialButton() {
        let leatherNode = this.node.parent.children[1].children[1].children[1].children[0];
        let canvasNode = this.node.parent.children[1].children[1].children[1].children[1];

        let leatherButton = leatherNode.getComponent(Button);
        let canvasButton = canvasNode.getComponent(Button);

        leatherNode.on(Node.EventType.TOUCH_END, ()=>{
            leatherButton.normalSprite = this.leatherSelected;
            canvasButton.normalSprite = this.canvas;
        }, this);
        canvasNode.on(Node.EventType.TOUCH_END, ()=>{
            leatherButton.normalSprite = this.leather;
            canvasButton.normalSprite = this.canvasSelected;
        }, this);
    }

    onLoad() {
        this.touchState = 0;
        this.startPos = v2(0, 0);
        this.endPos = v2(0, 0);
        this.isMoving = false;
    
        systemEvent.on(SystemEventType.TOUCH_MOVE, this.TouchController, this);
        systemEvent.on(SystemEventType.TOUCH_END, function () {
            this.RotaValue = 0;
        }, this);
    
    }

    TouchController(event) {
        console.log("start move");
    
        let currentPos: Vec2 = event.getLocation();
        console.log("World coordinates of the current touchpoint：" + currentPos);
        let currTouchPos: Vec2 = event.getUILocation();
        console.log("current touchpoint：" + currTouchPos);
        let pos: Vec2 = event.getUIDelta();
        console.log("diff：" + pos);
        if (pos.x < 0)//left
        {
            this.RotaValue -= 3;
        }
        else //right
        {
            this.RotaValue += 3;
        }
    
        //rotate
        this.rotaTarget.eulerAngles = new Vec3(0, this.RotaValue, 0);
        console.log("current target rotate：" + this.rotaTarget.eulerAngles);
    }
    
    onColorButtonClick(_, msg) {
        console.log('start click');
        console.log('===========msg', msg);
        if (msg == 'red') { 
            this.changeShoeColor(redColor);
        } else if (msg == 'green') {
            this.changeShoeColor(greenColor);
        } else if (msg == 'blue') {
            this.changeShoeColor(blueColor);
        } else if (msg == 'purple') {
            this.changeShoeColor(purpleColor);
        } else if (msg == 'white') {
            this.changeShoeColor(whiteColor);
        } else if (msg == 'gray') {
            this.changeShoeColor(grayColor);
        } else if (msg == 'black') {
            this.changeShoeColor(blackColor);
        } else if (msg == 'orange') {
            this.changeShoeColor(orangeColor);
        }
        meshRenderer.materials = materials;
    }

    changeShoeColor(color, updateText = true) {
        console.log('==========changeShoeColor-----update', updateText);
        currentPart.setProperty("mainColor", color);
        if (color != hightlightColor && updateText) {
            console.log('=======changecolor');
            this.updateColorSelected();
        }
    }

    onMeshButtonClick(_, msg) {
        console.log('mesh button click');
        let meshText = this.node.parent.children[1].children[1].children[0].children[1];
        if (msg == 'left') { 
            currentIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
        } else if (msg == 'right') {
            currentIndex = currentIndex >= changeView.length - 1 ? currentIndex : currentIndex + 1;
        } 
        if (currentIndex == 0) {
            this.rotaTarget.eulerAngles = new Vec3(0, -120, 0);
        } else if (currentIndex == 1) {
            this.rotaTarget.eulerAngles = new Vec3(0, 0, 0);
        } else if (currentIndex == 2) {
            this.rotaTarget.eulerAngles = new Vec3(0, -50, 0);
        } else if (currentIndex == 3) {
            this.rotaTarget.eulerAngles = new Vec3(0, 120, 0);
        } else if (currentIndex == 4 || currentIndex == 5) {
            this.rotaTarget.eulerAngles = new Vec3(0, 160, 0);
        } else if (currentIndex == 6) {
            this.rotaTarget.eulerAngles = new Vec3(0, 220, 0);
        } else if (currentIndex == 7) {
            this.rotaTarget.eulerAngles = new Vec3(0, 60, 0);
        }

        meshText.getComponent(Label).string = changeView[currentIndex];
        currentPart = materials[currentIndex];
        console.log('currentIndex=======', currentIndex);
        var currentColor = currentPart.getProperty("mainColor");
        if (currentColor == null) { 
            currentColor = whiteColor;
            this.changeShoeColor(currentColor, false);
         };
        console.log('currentColor=======', currentColor.toString());
        console.log('==========hightlight');
        setTimeout(this.changeShoeColor, 100, hightlightColor, false);  
        // tween(currentPart).to(2, {}, {
        //     onUpdate(currentPart) {
        //         currentPart.setProperty("mainColor", currentColor);
        //     },
        // }).start();

        setTimeout(this.changeShoeColor, 1000, currentColor, false);  
        setTimeout(this.updateColorSelected, 1100);  
        if (currentIndex == 0 || currentIndex == 7 || currentIndex == 8 || currentIndex == 5 || currentIndex == 4 ) {
            materialNode.active = false;
            // materialNode.alpha = 0;
        } else {
            materialNode.active = true;
        } 
        //laces caps sole band patch 
    }

    onMaterialButtonClick(_, msg) {
        console.log('material button click', msg);
        this.swithcTextue(msg);
    }

    swithcTextue(msg) {
        console.log('this.texture current=======', currentPart);
        if (msg == 'canvas') { 
            currentPart.setProperty('normalMap', this.textureFabric);
            currentPart.setProperty('metallicRoughnessMap', this.textureBase);
            currentPart.setProperty('occlusionMap', this.textureBase);
        } else if (msg == 'leather') {
            currentPart.setProperty('normalMap', this.textureLeather);
            currentPart.setProperty('metallicRoughnessMap', this.textureBase);
            currentPart.setProperty('occlusionMap', this.textureBase);
        }
        meshRenderer.materials = materials;
    }

    updateColorSelected() {
        console.log('==========updateColorSelected');
        var labels = colorNode.getComponentsInChildren(Label);
        var index = 0;
        const currentColor = currentPart.getProperty("mainColor");
        console.log('==========updateColorSelected maincolor', currentColor);
        if (currentColor == null) {
            index = 2;
            currentPart.setProperty("mainColor", whiteColor);
        } else {
            if (currentColor == blackColor) {
                index = 0;
            } else if (currentColor == grayColor) {
                index = 1;
            } else if (currentColor == whiteColor) {
                index = 2;
            } else if (currentColor == redColor) {
                index = 3;
            } else if (currentColor == blueColor) {
                index = 4;
            } else if (currentColor == purpleColor) {
                index = 5;
            } else if (currentColor == orangeColor) {
                index = 6;
            } 
        }
        for(let i:number = 0 ; i < labels.length ; i++){
            if (i==index) {
                labels[i].color = blackColor;
            } else {
                labels[i].color = Color.WHITE;
            }
        }
    }

    initMaterialColor() {
        for(let i:number = 0 ; i < materials.length ; i++){
            materials[i].setProperty("mainColor",whiteColor);
        }
    }


    update(deltaTime: number) {
    }


    draw(graphics: Graphics, fillcolor: Color, strokecolor: Color, startX: number) {
        graphics.clear();
        console.log('=========satrtx', startX);
        graphics.roundRect(startX, -h / 2, w, h, h / 2);
        graphics.fillColor = fillcolor;
        graphics.fill();
        graphics.lineWidth = 3;
        graphics.strokeColor = strokecolor;
        graphics.stroke();
    }

    setColorButton() {
        let colorNode = this.node.parent.children[1].children[1].children[2]
        console.log('===========othernode', this.node.parent.children[1].children[1].children[1]);
        let screeWidth = screen.windowSize.width
        console.log('===========screeWidth', screeWidth);
        var startx = (screeWidth - 64 * lacesColor.length - 10 * (lacesColor.length - 1)) / 2;
        for(let i:number = 0 ; i < lacesColor.length ; i++){
         let buttonNode = new Node();
         
        
         buttonNode.addComponent(Button);
         buttonNode.addComponent(Graphics).circle(startx/2 + i * 32, 0, 32);
         var button = buttonNode.getComponent(Button);
         var graphics = buttonNode.getComponent(Graphics);
         console.log('===========colorNode', colorNode);
         console.log('===========button', buttonNode);
        //  button.addComponent(Graphics);
        //  graphics.clear();
         var x = startx/2 + i * 32
         console.log('===========xxxxx', x);
         graphics.circle(startx/2 + i * 32, 0, 32);
         graphics.fillColor = lacesColor[i];
         graphics.fill();
         graphics.node.active = true;
         button.getComponent(Graphics).fillColor = Color.RED;   

         var clickEventHandler = new Component.EventHandler();
         clickEventHandler.target = this.node; 
         clickEventHandler.component = "changeColor";
         clickEventHandler.handler = "onColorButtonClick";
         clickEventHandler.customEventData = lacesColor[i].toString();
 
         button.clickEvents.push(clickEventHandler);

         colorNode.addChild(buttonNode);
        } 
        
        //  colorNode.addComponent(Button);
        //  var button = colorNode.getComponent(Button);
        //  console.log('===========colorNode', colorNode);
        //  console.log('===========button', buttonNode);
        //  button.addComponent(Graphics);
        //  var graphics = button.getComponent(Graphics);
         
        // //  graphics.clear();
         
       
        //  graphics.circle(startx/2, 0, 32);
        //  graphics.fillColor = lacesColor[3];
        //  graphics.fill();
    }
}

