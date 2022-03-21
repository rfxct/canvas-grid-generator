import { useEffect, useRef, useState } from 'react'
import { createResponsiveText } from '../utils/CanvasUtils'

// Tamanho padrão para as imagens do grid
const DEFAULT_SIZE = 250
const DEFAULT_COLUMNS = 3
const DEFAULT_ROWS = 3

export const Grid: React.FC = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [generating, setGenerating] = useState(false)
  const [image, setImage] = useState('')

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const resultRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      canvas.setAttribute('width', DEFAULT_COLUMNS * DEFAULT_SIZE + 'px')
      canvas.setAttribute('height', DEFAULT_ROWS * DEFAULT_SIZE + 'px')

      setContext(canvas.getContext('2d'))
    }
  }, [])

  // Carregar a imagem de forma assíncrona, para que não carregue uma de cada vez no canvas
  async function loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image()

      image.setAttribute('src', source)
      image.setAttribute('crossOrigin', 'anonymous')

      image.onload = () => resolve(image)
    })
  }

  async function drawGrid(ctx: CanvasRenderingContext2D, COLUMNS = DEFAULT_COLUMNS, ROWS = DEFAULT_ROWS) {
    const images = await Promise.all([...Array(COLUMNS * ROWS)].map((_, i) =>
      loadImage(`https://picsum.photos/500/500?version=${i + Date.now()}`)
    ))

    let position = 0
    for (let GRID_X = 0; GRID_X < COLUMNS; GRID_X++) {
      for (let GRID_Y = 0; GRID_Y < ROWS; GRID_Y++) {
        const X = DEFAULT_SIZE * GRID_X
        const Y = DEFAULT_SIZE * GRID_Y
        const SIZE = 20

        ctx.drawImage(images[position++], X, Y, DEFAULT_SIZE, DEFAULT_SIZE)

        // Gradient
        ctx.globalCompositeOperation = 'source-over'
        const GRADIENT = ctx.createLinearGradient(X, Y, X, Y + DEFAULT_SIZE)
        GRADIENT.addColorStop(0, 'rgba(0, 0, 0, .5)')
        GRADIENT.addColorStop(0.10, 'rgba(0, 0, 0, .4)')
        GRADIENT.addColorStop(0.28, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = GRADIENT
        ctx.fillRect(X, Y, DEFAULT_SIZE, DEFAULT_SIZE)

        ctx.font = 'normal 15px RobotoCondensed'
        ctx.fillStyle = '#ffffff)'
        createResponsiveText(ctx, 'Test', X + 5, Y + 5 + 16 + 13, DEFAULT_SIZE - 10,
          'normal %S%px RobotoCondensed', 13)
      }
    }

    return canvasRef.current!.toDataURL('image/jpeg')
  }

  return (
    <>
      <button
        disabled={generating}
        onClick={() => {
          setGenerating(true)

          drawGrid(context as CanvasRenderingContext2D)
            .then(setImage)
            .then(() => setGenerating(false))
        }}
      >
        Gerar
      </button>

      {generating && <span>Gerando grid...</span>}

      <img
        className="result"
        crossOrigin="anonymous"
        style={{ visibility: generating ? 'hidden' : 'visible' }}
        ref={resultRef}
        src={image}
      />

      <canvas ref={canvasRef} />
    </>
  )
}
