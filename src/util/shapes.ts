import { P5CanvasInstance } from 'react-p5-wrapper'

export const redGrid = (
  p5: P5CanvasInstance,
  array: number[][],
  scale: number
) => {
  p5.noFill()
  p5.stroke(255, 0, 0)
  array.forEach(([u, v]) => {
    const x = u * p5.width
    const y = v * p5.height
    p5.line(x - scale, y, x + scale, y)
    p5.line(x, y - scale / 4, x, y + scale / 4)
  })
}
