import { _decorator, Component, Node, MeshRenderer, Button, Texture2D, Vec2, v2, systemEvent, SystemEventType, Vec3, Camera, Sprite } from 'cc';
import { Color } from 'cc';
const { ccclass, property } = _decorator;
const brownColor = new Color(104, 52, 52);
const greenColor = new Color(26, 94, 26);
const blueColor = new Color(101,153,148);
const purpleColor = new Color(137, 101, 153);
const whiteColor = new Color(236,236,236);
const grayColor = new Color(89, 85, 91);
const blackColor = new Color(34, 34, 34);
const bgColor = new Color(52, 36, 65);
var outsoleMaterial = null;
var insoleMaterial = null;
var meshRenderer = null; 
var materials = null;
var shoe = null;
var originTexture = null;

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
        // find(‘Main Camera’).getComponent(Camera).clearColor = new Color(233, 200, 100, 255)
        //init color
        meshRenderer = this.node.getComponentInChildren(MeshRenderer);
        //const mainCamera = this.node.parent.parent.children[1];
        // mainCamera.getComponent(Camera).clearColor = bgColor;

        materials = meshRenderer.materials;
        outsoleMaterial = materials[1];
        insoleMaterial = materials[3];
        outsoleMaterial.setProperty("mainColor",brownColor);
        insoleMaterial.setProperty("mainColor",whiteColor);

        originTexture = outsoleMaterial.getProperty('normalMap');
        meshRenderer.materials = materials;
        //handle button
        let button = this.node.getComponentInChildren(Button);

        shoe = this.node.children[0];
        console.log('-safcas', originTexture);
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
            this.RotaValue -= 5;
        }
        else //right
        {
            this.RotaValue += 5;
        }
    
        //rotate
        this.rotaTarget.eulerAngles = new Vec3(0, this.RotaValue, 0);
        console.log("current target rotate：" + this.rotaTarget.eulerAngles);
    }
    

    onButtonClick(_, msg) {
        console.log('start click');
        if (msg == 'brown') { 
            outsoleMaterial.setProperty("mainColor",brownColor);
        } else if (msg == 'green') {
            outsoleMaterial.setProperty("mainColor",greenColor);
        } else if (msg == 'blue') {
            outsoleMaterial.setProperty("mainColor",blueColor);
        } else if (msg == 'purple') {
            outsoleMaterial.setProperty("mainColor",purpleColor);
        } else if (msg == 'white') {
            insoleMaterial.setProperty("mainColor",whiteColor);
        } else if (msg == 'gray') {
            insoleMaterial.setProperty("mainColor",grayColor);
        } else if (msg == 'black') {
            insoleMaterial.setProperty("mainColor",blackColor);
        } else {
            this.swithcTextue(msg);
        }
        meshRenderer.materials = materials;
        console.log('msg=======', msg);
    }

    swithcTextue(msg) {
        console.log('this.texture current=======', outsoleMaterial);
        if (msg == 'classic') { 
            outsoleMaterial.setProperty('normalMap', this.textureNormal);
            outsoleMaterial.setProperty('metallicRoughnessMap', this.textureBase);
            outsoleMaterial.setProperty('occlusionMap', this.textureBase);
        } else if (msg == 'fabric') {
            outsoleMaterial.setProperty('normalMap', this.textureFabric);
            outsoleMaterial.setProperty('metallicRoughnessMap', this.textureBase);
            outsoleMaterial.setProperty('occlusionMap', this.textureBase);
        } else {
            outsoleMaterial.setProperty('normalMap', this.textureLeather);
            outsoleMaterial.setProperty('metallicRoughnessMap', this.textureBase);
            outsoleMaterial.setProperty('occlusionMap', this.textureBase);
        }
        // console.log('this.textureLeather=======', this.textureLeather);
        meshRenderer.materials = materials;
    }

    

    update(deltaTime: number) {
    }
}

