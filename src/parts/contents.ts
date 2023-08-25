import { Conf } from "../core/conf";
import { MyDisplay } from "../core/myDisplay";
import { Rect } from "../libs/rect";
import { MatterjsMgr } from "./matterjsMgr";
import { Pt } from "./pt";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _m: MatterjsMgr = new MatterjsMgr()
  private _item: Array<Pt> = []

  constructor(opt:any) {
    super(opt)

    const num = Conf.instance.ITEM_NUM;
    const parent = document.querySelector('.l-pt') as HTMLElement
    for(let i = 0; i < num; i++) {
      const el = document.createElement('div')
      el.classList.add('item')
      parent.append(el)

      this._item.push(new Pt({
        el: el,
      }))
    }

    this._resize()
  }

  protected _update(): void {
    super._update();

    this._m.item.forEach((item, i) => {
      const radius = Number(item.circleRadius) * 2
      const size = new Rect(
        item.position.x - radius * 0.5,
        item.position.y - radius * 0.5,
        radius,
        radius,
      )
      this._item[i].setSize(size)
    })
  }
}