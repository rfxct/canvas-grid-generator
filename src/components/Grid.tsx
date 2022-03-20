import { useEffect, useRef, useState } from 'react'

// Tamanho padrão para as imagens do grid
const DEFAULT_SIZE = 250

export const Grid: React.FC = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [generating, setGenerating] = useState(false)
  const [image, setImage] = useState('')

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const resultRef = useRef<HTMLImageElement | null>(null)

  // Carregar a imagem de forma assíncrona, para que não carregue uma de cada vez no canvas
  async function loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image()

      image.setAttribute('src', source)
      image.setAttribute('crossOrigin', 'anonymous')

      image.onload = () => resolve(image)
    })
  }

  async function drawGrid(ctx: CanvasRenderingContext2D, COLUMNS = 5, ROWS = 5) {
    const images = await Promise.all([...Array(COLUMNS * ROWS)].map((_, i) =>
      loadImage(`https://picsum.photos/500/500?version=${i + Date.now()}`)
    ))

    let position = 0
    for (let GRID_X = 0; GRID_X < COLUMNS; GRID_X++) {
      for (let GRID_Y = 0; GRID_Y < ROWS; GRID_Y++) {
        ctx.drawImage(images[position++], DEFAULT_SIZE * GRID_X, DEFAULT_SIZE * GRID_Y, DEFAULT_SIZE, DEFAULT_SIZE)
      }
    }

    return canvasRef.current!.toDataURL()
  }

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      canvas.setAttribute('width', '1250px')
      canvas.setAttribute('height', '1250px')

      setContext(canvas.getContext('2d'))
    }
  }, [])

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

      <a href={image} download={`grid-${Date.now()}`}>
        <img
          className="result"
          style={{ visibility: generating ? 'hidden' : 'visible' }}
          ref={resultRef}
          src={image}
        />

      </a>
      <canvas ref={canvasRef} />
    </>

  )
}
