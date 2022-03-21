export const createResponsiveText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    style: string,
    startingSize: number
) => {
    ctx.font = style.replace('%S%', String(startingSize))
    let width = ctx.measureText(text).width
    let size = startingSize
    while (width > maxWidth) {
        size--
        ctx.font = style.replace('%S%', String(size))
        width = ctx.measureText(text).width
        if (size === 2) break
    }
    ctx.font = style.replace('%S%', String(size))
    ctx.fillText(text, x, y)
}