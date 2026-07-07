declare module "flipdown" {
  export default class FlipDown {
    constructor(
      timestamp: number,
      element: string | HTMLElement,
      options?: {
        theme?: "light" | "dark"
      }
    )

    start(): this
    ifEnded(callback: () => void): this
  }
}