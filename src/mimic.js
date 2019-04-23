import gifFrames from 'gif-frames'

export default function mimic({url, columnWidth, overlayScale = 1.5}) {
	return gifFrames({ url, frames: 'all', outputType: 'canvas' })
    .then(frames => createIllusion(frames, columnWidth))

  function createIllusion(frames, columnWidth = 2) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
		const { width, height, delay } = frames[0].frameInfo
		const columnDelay = (delay || 1) / columnWidth
		const animationDuration = columnDelay * frames.length * overlayScale
    canvas.width = width
    canvas.height = height
    frames.forEach(drawFrameDataToCanvas)

    return {
			numberOfColumns: frames.length,
			columnWidth,
			columnDelay,
			animationDuration,
      overlay: createOverlay(),
    	canvas,
  	}

    function drawFrameDataToCanvas({frameIndex, frameInfo, getImage}) {
      const imageCanvas = getImage()
      const imageContext = imageCanvas.getContext('2d')
      const start = frameIndex * columnWidth
      const increment = frames.length * columnWidth

      for (let i = start; i < canvas.width; i += increment) {
        const columnData = imageContext.getImageData(i, 0 , columnWidth, frameInfo.height)
        context.putImageData(columnData, i, 0)
      }
    }

    function createOverlay() {
      const overlayCanvas = document.createElement('canvas')
      const overlayContext = overlayCanvas.getContext('2d')
      const overlayColumnWidth = (frames.length - 1) * columnWidth
      const increment = overlayColumnWidth + columnWidth
      overlayCanvas.width = canvas.width * overlayScale
      overlayCanvas.height = canvas.height

      for (let i = 0; i < overlayCanvas.width; i += increment) {
        overlayContext.fillRect(i, 0, overlayColumnWidth, overlayCanvas.height)
      }
      return overlayCanvas
    }
  }
}
