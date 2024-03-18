import {Container} from 'pixi.js'

// TODO add jsDocs for this module

export enum Pin {
  TopLeft = 'start:start',
  TopCenter = 'center:start',
  TopRight = 'end:start',
  CenterLeft = 'start:center',
  Center = 'center:center',
  CenterRight = 'end:center',
  BottomLeft = 'start:end',
  BottomCenter = 'center:end',
  BottomRight = 'end:end',
}

export type resizeCallback =
  (width: number, height: number, scale?: number) => void;
export type subscribeFunction =
  (callback: resizeCallback) => () => void;

export class PinnedContainer extends Container {
  static subscribeResizeEvent: subscribeFunction
  unsubscribeResizeEvent: () => void

  location: Pin
  offsetX: number
  offsetY: number

  constructor(
    pinnedLocation: Pin,
    offsetX = 0,
    offsetY = 0,
  ) {
    super()

    this.location = pinnedLocation
    this.offsetX = offsetX
    this.offsetY = offsetY

    this.unsubscribeResizeEvent = null

    // automatically subscribe to resize Event
    if (PinnedContainer.subscribeResizeEvent) {
      this.unsubscribeResizeEvent =
        PinnedContainer.subscribeResizeEvent(this.resize.bind(this))
    }
  }

  resize(width: number, height: number, scale = 1): void {
    // apply scaling before calculating
    this.scale.set(scale)

    const positionDict = {
      startX: (): number => this.offsetX * scale,
      startY: (): number => this.offsetY * scale,

      centerX: (): number => (width / 2) - (this.width / 2),
      centerY: (): number => (height / 2) - (this.height / 2),

      endX: (): number =>
        width - this.width - (this.offsetX * scale),
      endY: (): number =>
        height - this.height - (this.offsetY * scale),
    }

    const positions = this.location.split(':')
    this.position.set(
      positionDict[positions[0] + 'X'](),
      positionDict[positions[1] + 'Y'](),
    )
  }

  destroy(options: any): void {
    if (this.unsubscribeResizeEvent) {
      this.unsubscribeResizeEvent()
    }

    super.destroy(options)
  }
}

export default PinnedContainer
