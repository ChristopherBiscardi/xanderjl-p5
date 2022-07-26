import { Box } from '@chakra-ui/react'
import useGetOs from 'hooks/useGetOs'
import dynamic from 'next/dynamic'
import { Color, RENDERER } from 'p5'
import { ComponentClass, FC, KeyboardEvent } from 'react'
import { SketchProps } from 'react-p5'
import { ColorValue, P5 } from 'types/CustomP5'
import setupDefault from 'util/setup'
import windowResizedDefault from 'util/windowResized'

export interface SketchWrapperProps
  extends Omit<SketchProps, 'keyPressed' | 'setup'> {
  setup?: (p5: P5, canvasParentRef: Element) => void
  keyPressed?: (p5: P5, e: KeyboardEvent) => void
  suffix?: string | number
  padding?: number[]
  width?: number
  height?: number
  dimensions?: number[]
  renderer?: RENDERER
  background?: ColorValue
  pixelDensity?: number
  seed?: number
  renderSVG?: boolean
}

const Sketch = dynamic<SketchWrapperProps>(
  () =>
    import('react-p5').then(mod => {
      require('p5.js-svg')

      return mod.default
    }) as Promise<ComponentClass<SketchWrapperProps, any>>,
  {
    ssr: false,
  }
)

const SketchWrapper: FC<SketchWrapperProps> = ({
  setup,
  suffix,
  padding,
  width,
  height,
  dimensions,
  renderer,
  background,
  pixelDensity,
  seed,
  renderSVG,
  ...rest
}) => {
  const os = useGetOs()

  const defaultSetup = (p5: P5, canvasParentRef: Element) =>
    setupDefault({
      p5,
      canvasParentRef,
      width,
      height,
      dimensions,
      background,
      padding,
      renderer,
      renderSVG,
      seed,
      pixelDensity,
    })

  const windowResized = (p5: P5) =>
    windowResizedDefault({
      p5,
      width,
      height,
      dimensions,
      padding,
      background,
      seed,
    })

  const date = new Date().toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const fileName = date + (suffix ? `-${suffix}` : '')

  const keyPressed = (p5: P5, e: KeyboardEvent) => {
    if (os === 'mac') {
      if (e.key === 's' && e.metaKey) {
        e.preventDefault()
        seed && p5.randomSeed(seed)
        seed && p5.noiseSeed(seed)
        const ratio =
          ((dimensions && dimensions[0]) ?? width ?? p5.width) / p5.width
        p5.pixelDensity(ratio)
        background && p5.background(background as unknown as Color)
        p5.draw()
        renderSVG ? p5.save(fileName) : p5.saveCanvas(fileName, 'png')
      }
    } else {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault()
        seed && p5.randomSeed(seed)
        seed && p5.noiseSeed(seed)
        const ratio =
          ((dimensions && dimensions[0]) ?? width ?? p5.width) / p5.width
        p5.pixelDensity(ratio)
        background && p5.background(background as unknown as Color)
        p5.draw()
        renderSVG ? p5.save(fileName) : p5.saveCanvas(fileName, 'png')
      }
    }
  }

  return (
    <Box
      css={{
        '&:first-of-type': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          minHeight: '100vh',
        },
        '.p5Canvas': {
          boxShadow: '1px 3px 6px -1px rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Sketch
        setup={setup ? setup : defaultSetup}
        windowResized={windowResized}
        keyPressed={keyPressed}
        {...rest}
      />
    </Box>
  )
}

export default SketchWrapper
