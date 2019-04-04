/* global gEngine SpriteRenderable GameObject */

function DyePack(spriteTexture) {
    this.mDyePack = new SpriteRenderable(spriteTexture);
    this.mDyePack.setColor([1, 1, 1, 0.1]);
    this.mDyePack.getXform().setPosition(50, 33);
    this.mDyePack.getXform().setSize(1, 1.8);
    this.mDyePack.setElementPixelPositions(510, 595, 23, 153);

    GameObject.call(this, this.mDyePack);
}

gEngine.Core.inheritPrototype(DyePack, GameObject);