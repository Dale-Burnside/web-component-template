const $wc = document.getElementById('zea-web-component')

// ///////////////////////////////////////////////
// Persistence
document.getElementById('newProject').addEventListener('click', () => {
  $wc.clearScene()
  generateViewButtons()
})

function download(file, text) {
  //creating an invisible element
  var element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8, ' + encodeURIComponent(text)
  )
  element.setAttribute('download', file)
  document.body.appendChild(element)
  //onClick property
  element.click()
  document.body.removeChild(element)
}

document.getElementById('save').addEventListener('click', event => {
  const json = $wc.saveJson()
  console.log(json)

  if (event.ctrlKey) {
    download('myProject.proj', JSON.stringify(json))
  } else {
    localStorage.setItem('zea-web-component', JSON.stringify(json))
  }
})

document.getElementById('load').addEventListener('click', () => {
  const jsonStr = localStorage.getItem('zea-web-component')

  if (!jsonStr) {
    console.warn('No project data available')
    return
  }

  $wc.loadJson(JSON.parse(jsonStr))
  generateViewButtons()
})

const urlParams = new URLSearchParams(window.location.search)
if (urlParams.has('proj')) {
  const projUrl = urlParams.get('proj')
  fetch(projUrl)
    .then(response => response.text())
    .then(txt => {
      $wc.loadJson(JSON.parse(txt))
      generateViewButtons()
    })
}

document.getElementById('frameView').addEventListener('click', () => {
  $wc.frameView()
})

// ///////////////////////////////////////////////
// Undo and Redo

$wc.undoRedoManager.on('changeAdded', () => {
  console.log('changeAdded')
})

document.getElementById('undo').addEventListener('click', event => {
  console.log('undo')
  $wc.undo()
})
document.getElementById('redo').addEventListener('click', event => {
  console.log('redo')
  $wc.redo()
})

// ///////////////////////////////////////////////
// Assets
document.getElementById('loadAsset').addEventListener('click', () => {
  $wc.loadAsset('data/Dead_eye_bearing.stp.zcad')
})
// ////////////////////////////////////////////////
//  Tabs
const $tab1 = document.querySelector('#tab1')
const $tab2 = document.querySelector('#tab2')

document.querySelector('#showTab1').addEventListener('click', () => {
  $tab1.style.visibility = 'visible'
  $tab2.style.visibility = 'hidden'
})

document.querySelector('#showTab2').addEventListener('click', () => {
  $tab1.style.visibility = 'hidden'
  $tab2.style.visibility = 'visible'
})

// ////////////////////////////////////////////////
//  Tree view
const $treeView = document.querySelector('#treeView')
$treeView.setTreeItem($wc.scene.getRoot())
$treeView.setSelectionManager($wc.selectionManager)
