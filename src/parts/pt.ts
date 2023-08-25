import { Color } from "three";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Rect } from "../libs/rect";
import { Util } from "../libs/util";

// -----------------------------------------
//
// -----------------------------------------
export class Pt extends MyDisplay {

  private _rect: Rect = new Rect()
  public get rect(): Rect { return this._rect }

  constructor(opt:any) {
    super(opt)

    const col = new Color(Util.random(0, 1), Util.random(0, 1), Util.random(0, 1))
    const a = Util.random(0.05, 0.5)
    Tween.instance.set(this.el, {
      backgroundColor: 'rgba(' + col.r * 255 + ',' + col.g * 255 + ',' + col.b * 255 + ', ' + a + ')',
      'backdrop-filter': 'blur(' + Util.randomInt(5, 10) + 'px)',
      border: '1px solid ' + col.getStyle(),
    })

    this.useGPU(this.el)
  }

  public setSize(rect: Rect):void {
    this._rect.copy(rect)

    Tween.instance.set(this.el, {
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    })
  }
}