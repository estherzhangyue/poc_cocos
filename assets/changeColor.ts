import { Canvas, Label, SpriteFrame } from 'cc';
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
const bgColor = new Color(52, 36, 65);
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
        outsoleMaterial = materials[1];
        insoleMaterial = materials[3];
        outsoleMaterial.setProperty("mainColor",whiteColor);
        insoleMaterial.setProperty("mainColor",whiteColor);
        outsoleMaterial.setProperty('normalMap', this.textureFabric);
        console.log('=========materials', materials);

        originTexture = outsoleMaterial.getProperty('normalMap');
        meshRenderer.materials = materials;
        //handle button
        let button = this.node.getComponentInChildren(Button);

        shoe = this.node.children[0];
        console.log('-safcas', originTexture);
        this.setMaterialButton();
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

    changeShoeColor(color) {
        console.log('currentpart', currentPart, 'current color', color);
        currentPart.setProperty("mainColor", color);
    }

    onMeshButtonClick(_, msg) {
        console.log('mesh button click');
        let meshText = this.node.parent.children[1].children[1].children[0].children[1];
        console.log('=========materialNode', meshText);
        if (msg == 'left') { 
            currentIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
        } else if (msg == 'right') {
            currentIndex = currentIndex >= changeView.length - 1 ? currentIndex : currentIndex + 1;
        } 
        meshText.getComponent(Label).string = changeView[currentIndex];
        currentPart = materials[currentIndex];
        console.log('currentIndex=======', currentIndex);
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
        console.log('===========devicePixelRatio', screen.devicePixelRatio);
        console.log('===========start x', startx);
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

