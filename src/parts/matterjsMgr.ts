import { Bodies, Body, Composite, Engine, Render, Runner, Mouse, MouseConstraint } from "matter-js";
import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";

export class MatterjsMgr extends MyDisplay {

  public engine:Engine;
  public render:Render;

  private _runner:Runner;

  public item:Array<Body> = [];

  // 外枠
  private _frame:Array<Body> = [];
  private _frameSize:number = 100;


  constructor() {
    super()

    const sw = Func.sw();
    const sh = Func.sh();

    // エンジン
    this.engine = Engine.create();
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;

    // レンダラー
    this.render = Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: sw,
        height: sh,
        showAngleIndicator: false,
        showCollisions: false,
        showVelocity: false,
        pixelRatio:Conf.instance.FLG_SHOW_MATTERJS ? 1 : 0.1
      }
    });
    this.render.canvas.classList.add('l-matter');

    if(!Conf.instance.FLG_SHOW_MATTERJS) {
      this.render.canvas.classList.add('-hide');
    }

    const num = Conf.instance.ITEM_NUM;
    for(let i = 0; i < num; i++) {
      const baseSize = Math.max(sw, sh)
      const radius = (!Util.hit(5) ? Util.random(baseSize * 0.015, baseSize * 0.05) : Util.random(baseSize * 0.15, baseSize * 0.3)) * 0.5

      const x = Util.random(0, sw);
      const y = Util.random(0, sh);
      const item:Body = Bodies.circle(x, y, radius, {
        isStatic:false,
        friction:0.001,
        restitution:0.75,
        render:{
          visible: Conf.instance.FLG_SHOW_MATTERJS
        }
      });

      this.item.push(item);

      Composite.add(this.engine.world, [
        item
      ]);
    }

    // マウス
    const mouse = Mouse.create(this.render.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
    })
    Composite.add(this.engine.world, mouseConstraint)
    this.render.mouse = mouse

    this._runner = Runner.create();

    this.start();
    this._resize();
  }


  private _makeFrame(): void {
    // 一旦破棄
    if(this._frame.length > 0) {
      Composite.remove(this.engine.world, this._frame[0])
      Composite.remove(this.engine.world, this._frame[1])
      Composite.remove(this.engine.world, this._frame[2])
      Composite.remove(this.engine.world, this._frame[3])
      this._frame = [];
    }

    const sw = Func.sw();
    const sh = Func.sh();

    // 外枠
    this._frameSize = 500;
    const width = this._frameSize

    this._frame[0] = Bodies.rectangle(-1000, -width * 0.5, 9999, width, {isStatic:true, render:{visible: Conf.instance.FLG_SHOW_MATTERJS}});
    this._frame[1] = Bodies.rectangle(sw + width * 0.5, -width * 0.25, width, 9999, {isStatic:true, render:{visible: Conf.instance.FLG_SHOW_MATTERJS}});

    this._frame[2] = Bodies.rectangle(-1000, sh + width * 0.5, 9999, width, {isStatic:true, render:{visible: Conf.instance.FLG_SHOW_MATTERJS}});

    this._frame[3] = Bodies.rectangle(width * -0.5, -1000, width, 9999, {isStatic:true, render:{visible: Conf.instance.FLG_SHOW_MATTERJS}});

    if(this._frame.length > 0) {
      Composite.add(this.engine.world, [
        this._frame[0],
        this._frame[1],
        this._frame[2],
        this._frame[3],
      ])
    }
  }


  public start(): void {
    Render.run(this.render);
    Runner.run(this._runner, this.engine);
  }


  public stop(): void {
    Render.stop(this.render);
    Runner.stop(this._runner);
  }




  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update();
  }


  protected _resize(): void {
    super._resize();

    const sw = Func.sw()
    const sh = Func.sh()

    this.render.canvas.width = sw
    this.render.canvas.height = sh

    this._makeFrame();
  }
}