/**
 * This file implements the per-pixel specific support for SpriteRenderable objects
 */

/* global
SpriteRenderable
*/

SpriteRenderable.prototype._setTexInfo = function () {
    // get entire texture's pixel size
    var imageW = this.mTextureInfo.mWidth;
    var imageH = this.mTextureInfo.mHeight;

    // calculate sprite's pixel info in texture coordinate
    this.mTexLeftIndex = this.mTexLeft * imageW;
    this.mTexBottomIndex = this.mTexBottom * imageH;
    this.mTexWidth = (this.mTexRight - this.mTexLeft) * imageW;
    this.mTexHeight = (this.mTexTop - this.mTexBottom) * imageH;
};