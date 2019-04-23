import mimic from './mimic'

const gifAddInput = document.querySelector('#gif-add-input')
const gifAddButton = document.querySelector('#gif-add-button')
const columnWidthInput = document.querySelector('#gif-input')
const illusionImg = document.querySelector('#illusion-img')
const overlayImg = document.querySelector('#overlay-img')

const state = {
  columnWidth: 1,
  image: null
}

gifAddButton.addEventListener('click', () => gifAddInput.click())
gifAddInput.addEventListener('change', handleFileChange)

function readAsDataURL(file) {
	return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', (e) => reject(e))
    reader.readAsDataURL(file)
  })
}

function handleFileChange(e) {
  const { files } = e.target
  const file = files[0]

  if (file) {
    const buttonText = file.name || 'File Selected'
    gifAddButton.innerText = buttonText
    state.image = file
    generateIllusion()
  }
}

function generateIllusion () {
  const { image, columnWidth } = state
  if (image === null) return

  readAsDataURL(image)
  	.then(url => mimic({url, columnWidth}))
    .then(handleIllusionGenerated)
}

function handleIllusionGenerated ({canvas, overlay, animationDuration}) {
  illusionImg.src = canvas.toDataURL()
  overlayImg.src = overlay.toDataURL()
  overlayImg.style.animationDuration = animationDuration + 's'
}
