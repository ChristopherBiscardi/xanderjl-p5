import SketchWrapper from 'components/SketchWrapper'
import { NextPage } from 'next'
import { Draw } from 'types/CustomP5'
import createGrid from 'util/createGrid'
import { redGrid } from 'util/shapes'

const width: number = 2048
const height: number = 2048
const dimensions: number[] = [width, height]
const padding: number[] = [40]
const background: number[] = [0]
const count: number = 9
const points = createGrid(count)
const vertices: number[][] = [
  [0, 0],
  [0, count],
  [count, count],
]

const draw: Draw = p5 => {
  const scale: number = p5.width / 8
  p5.background(0)
  p5.frameRate(1)

  p5.fill(255, 251, 245)
  p5.beginShape()
  vertices.forEach((ver, i) => {
    if (ver[0] === vertices.length && ver[1] !== vertices.length) {
      ver[1] = ver[1] - 2
    }

    p5.vertex(ver[0] * scale, ver[1] * scale)
  })
  p5.endShape()

  redGrid(p5, points, scale)
}

const TriangleShifting: NextPage = () => (
  <SketchWrapper
    draw={draw}
    dimensions={dimensions}
    padding={padding}
    background={background}
  />
)

export default TriangleShifting
