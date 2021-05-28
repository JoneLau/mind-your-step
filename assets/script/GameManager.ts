
import { _decorator, Component, Node, Prefab, instantiate, game } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_STONE,
}

enum GameState{
    GS_INIT,
    GS_PLAYING,
    GS_END,
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    curPrefab: Prefab = null!;

    @property
    roadLength = 50;

    @property(PlayerController)
    playCtrl: PlayerController = null!;

    @property(Node)
    startMenu: Node = null!;

    private _road: BlockType[] = [];

    set curState(value: GameState){
        switch(value){
            case GameState.GS_PLAYING:
                this.startMenu.active = false;
                setTimeout(() => {
                    this.playCtrl.setInputActive(true);
                }, 0.1);
                break;
            case GameState.GS_END:
                break;
            default:
                this.init();
        }
    }

    init(){
        this.generateRoad();
        this.startMenu.active = true;
        this.playCtrl.setInputActive(false);
        this.playCtrl.node.setPosition(0, 0.5, 0);
        this.playCtrl.reset();
    }

    start () {
        this.curState = GameState.GS_INIT;
        this.playCtrl.node.on('jumpEnd', this.onPlayerJumpEnd, this);
    }

    generateRoad(){
        this.node.removeAllChildren();
        this._road.length = 0;
        this._road.push(BlockType.BT_STONE);
        for (let i = 1; i < this.roadLength; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE);
            } else {
                this._road.push(Math.floor(Math.random() * 2));
            }
        }

        for (let j = 0; j < this.roadLength; j++) {
            const child = this.spwanBlockByType(this._road[j]);
            if (child) {
                this.node.addChild(child);
                child.setPosition(j, 0, 0);
            }
        }
    }

    spwanBlockByType(type: BlockType){
        if(!this.curPrefab){
            return null;
        }

        let block: Node | null = null;
        switch(type){
            case BlockType.BT_STONE:
                block = instantiate(this.curPrefab);
                break;
        }

        return block;
    }

    onStartButtonClicked(){
        this.curState = GameState.GS_PLAYING;
    }

    chechResult(moveIndex: number){
        if (moveIndex < this.roadLength) {
            if (this._road[moveIndex] === BlockType.BT_NONE) {
                this.curState = GameState.GS_INIT;
            }
        } else {
            this.curState = GameState.GS_INIT;
        }
    }

    onPlayerJumpEnd(moveIndex: number){
        this.chechResult(moveIndex);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
