import { useState } from 'react'
import styled from 'styled-components'

import { FileInput } from '@/components/FileInput'

const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 100px 0;
  flex-direction: column;
  align-items: center;
`
const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
`

const Button = styled.button`
  border-radius: 4px;
  background-color: #6f00ff;
  color: white;
  padding: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #4b0082;
  }
`
const Title = styled.h1`
  color: #6f00ff;
  padding: 20px;
`

const ColorCard = styled.article`
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  min-width: 260px;
  background-color: ${props => props.color};
  cursor: pointer;

  span {
    color: white;
    font-weight: bold;
    font-size: 16px;
    display: none;
  }

  &:hover {
    span {
      display: block;
    }
  }
`

const PaletteContainer = styled.div`
  width: 80%;
  padding: 40px 400px 0 400px;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-direction: row;
  flex-wrap: wrap;
`

export const Home = () => {
  const [image, setImage] = useState()
  const [palette, setPalette] = useState()

  const handleRemoveImage = () => {
    setImage(null)
    setPalette([])
  }

  const copyColor = color => {
    navigator.clipboard.writeText(color)
  }

  const buildRgb = imageData => {
    const rgbValues = []

    for (let i = 0; i < imageData.length; i += 4) {
      const rgb = {
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2]
      }

      rgbValues.push(rgb)
    }

    return rgbValues
  }

  const findBiggestColorRange = rgbValues => {
    let rMin = Number.MAX_VALUE
    let gMin = Number.MAX_VALUE
    let bMin = Number.MAX_VALUE

    let rMax = Number.MIN_VALUE
    let gMax = Number.MIN_VALUE
    let bMax = Number.MIN_VALUE

    rgbValues.forEach(pixel => {
      rMin = Math.min(rMin, pixel.r)
      gMin = Math.min(gMin, pixel.g)
      bMin = Math.min(bMin, pixel.b)

      rMax = Math.max(rMax, pixel.r)
      gMax = Math.max(gMax, pixel.g)
      bMax = Math.max(bMax, pixel.b)
    })

    const rRange = rMax - rMin
    const gRange = gMax - gMin
    const bRange = bMax - bMin

    const biggestRange = Math.max(rRange, gRange, bRange)
    if (biggestRange === rRange) {
      return 'r'
    } else if (biggestRange === gRange) {
      return 'g'
    } else {
      return 'b'
    }
  }

  const quantization = (rgbValues, depth) => {
    const MAX_DEPTH = 4

    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev, curr) => {
          prev.r += curr.r
          prev.g += curr.g
          prev.b += curr.b

          return prev
        },
        {
          r: 0,
          g: 0,
          b: 0
        }
      )

      color.r = Math.round(color.r / rgbValues.length)
      color.g = Math.round(color.g / rgbValues.length)
      color.b = Math.round(color.b / rgbValues.length)

      return [color]
    }

    const componentToSortBy = findBiggestColorRange(rgbValues)
    rgbValues.sort((p1, p2) => {
      return p1[componentToSortBy] - p2[componentToSortBy]
    })

    const mid = rgbValues.length / 2
    return [
      ...quantization(rgbValues.slice(0, mid), depth + 1),
      ...quantization(rgbValues.slice(mid + 1), depth + 1)
    ]
  }

  const removeDuplicates = array => {
    return array.reduce((accumulator, current) => {
      if (
        !accumulator.find(
          prev => JSON.stringify(prev) === JSON.stringify(current)
        )
      ) {
        accumulator.push(current)
      }
      return accumulator
    }, [])
  }

  const rgbColorsToStrings = rgbArray => {
    return rgbArray.map(rgb => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
  }

  const generatePalette = () => {
    const canvas = document.getElementById('canvas')
    canvas.height = image.height
    canvas.width = image.width
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const rgbValues = buildRgb(imageData.data)
    const quantifiedPixels = quantization(rgbValues, 0)
    const rgbColorObjects = removeDuplicates(quantifiedPixels)
    const colorStrings = rgbColorsToStrings(rgbColorObjects)
    setPalette(colorStrings.slice(0, 6))
  }

  return (
    <Container>
      <Title>Discover the palette from your image</Title>
      <FileInput image={image} setImage={setImage} />
      <canvas id="canvas" hidden />
      {image ? (
        <ActionsContainer>
          <Button onClick={generatePalette}>Generate palette</Button>
          <Button onClick={handleRemoveImage}>Remove image</Button>
        </ActionsContainer>
      ) : null}
      <PaletteContainer>
        {palette
          ? palette.map(color => (
              <ColorCard
                key={color}
                color={color}
                onClick={() => copyColor(color)}
              >
                <span>{color}</span>
              </ColorCard>
            ))
          : null}
      </PaletteContainer>
    </Container>
  )
}
