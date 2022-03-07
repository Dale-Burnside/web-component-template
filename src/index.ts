import {
  AssetLoadContext,
  CADAssembly,
  CADAsset,
  CADPart,
  Color,
  EnvMap,
  GLRenderer,
  Scene,
  TreeItem,
  Vec3,
  ZeaMouseEvent,
  ZeaPointerEvent
} from '@zeainc/zea-engine'

import { SelectionManager, UndoRedoManager } from '@zeainc/zea-ux'

interface AssetJson {
  url: string
}

interface ProjectJson {
  assets: AssetJson[]
}

class ZeaWebComponent extends HTMLElement {
  private scene: Scene
  private renderer: GLRenderer
  private selectionManager: SelectionManager
  private undoRedoManager: UndoRedoManager
  private assets: CADAsset[] = []

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    const $mainWrapper = document.createElement('div')
    $mainWrapper.style.width = '100%'
    $mainWrapper.style.height = '100%'

    const $canvas = document.createElement('canvas')
    $mainWrapper.appendChild($canvas)

    this.shadowRoot?.appendChild($mainWrapper)

    this.renderer = new GLRenderer($canvas)

    this.scene = new Scene()

    const envMap = new EnvMap()
    envMap.load('data/StudioG.zenv')
    this.scene.setEnvMap(envMap)

    const selectionOutlineColor = new Color('gold')
    selectionOutlineColor.a = 0.1
    this.selectionManager = new SelectionManager(
      {
        scene: this.scene,
        renderer: this.renderer
      },
      {
        enableXfoHandles: true,
        selectionOutlineColor,
        branchSelectionOutlineColor: selectionOutlineColor
      }
    )

    this.undoRedoManager = UndoRedoManager.getInstance()

    this.renderer.setScene(this.scene)

    const filterItem = (geomItem: TreeItem) => {
      let item = geomItem
      while (
        item &&
        !(item instanceof CADPart) &&
        !(item instanceof CADAssembly)
      ) {
        // console.log(item.getName(), item.getClassName())
        item = <TreeItem>item.getOwner()
      }
      return item
    }
    this.renderer.getViewport().on('pointerDown', (event: ZeaPointerEvent) => {
      console.log(event.pointerRay.dir.toString())

      if (event.intersectionData) {
        const geomItem = event.intersectionData.geomItem
        const item = filterItem(geomItem)

        const mousevent = <ZeaMouseEvent>event
        this.selectionManager.toggleItemSelection(item, !mousevent.ctrlKey)
      }
    })

    // renderer.getViewport().backgroundColorParam.value = new Color(1, 0, 0)
    this.clearScene()
  }

  clearScene(): void {
    this.renderer
      .getViewport()
      .getCamera()
      .setPositionAndTarget(new Vec3(2000, 2000, 2000), new Vec3(0, 0, 0))

    this.scene.getRoot().removeAllChildren()
    this.scene.setupGrid(1000, 10)

    this.assets = []
  }

  loadAsset(url: string) {
    const cadAsset = new CADAsset()

    const context = new AssetLoadContext()
    context.units = 'Millimeters'

    cadAsset.load(url, context).then(() => {
      this.renderer.frameAll()
    })

    this.scene.getRoot().addChild(cadAsset)

    this.assets.push(cadAsset)
  }

  frameView() {
    this.renderer.frameAll()
  }

  // /////////////////////////////////////////
  // Persistence

  saveJson(): ProjectJson {
    const projectJson: ProjectJson = { assets: [] }
    this.assets.forEach((asset: CADAsset) => {
      const assetJson: AssetJson = {
        url: asset.url
      }

      projectJson.assets.push(assetJson)
    })
    return projectJson
  }

  loadJson(projectJson: ProjectJson) {
    projectJson.assets.forEach((assetJson: AssetJson) => {
      this.loadAsset(assetJson.url)
    })
  }

  // /////////////////////////////////////////
  // Undo /Redo

  undo() {
    this.undoRedoManager.undo()
  }

  redo() {
    this.undoRedoManager.redo()
  }
}

customElements.define('zea-web-component', ZeaWebComponent)
