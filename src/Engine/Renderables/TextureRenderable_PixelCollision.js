/**
 * All per-pixel collision functionality for the TextureRenderable object
 * will be implemented in this file.
 */

/* global
glMatrix
gEngine
TextureRenderable
*/

TextureRenderable.prototype.setColorArray = function () {
    if (this.mColorArray === null) {
        this.mColorArray = gEngine.Textures.getColorArray(this.mTexture);
    }
};

// this function return the alpha value, or the transparency, of any given pixel(x, y).
TextureRenderable.prototype._pixelAlphaValue = function (x, y) {
    x += this.mTexLeftIndex;
    y += this.mTexBottomIndex;
    x = x * 4;
    y = y * 4;
    return this.mColorArray[(y * this.mTextureInfo.mWidth) + x + 3];
};

// compute the WC position of a given pixel(i, j)
TextureRenderable.prototype._indexToWCPosition = function (returnWCPos, i, j, xDir, yDir) {
    var x = i * this.mXform.getWidth() / this.mTexWidth;
    var y = j * this.mXform.getHeight() / this.mTexHeight;
    // the offset ratio value of the given xform in WC position
    var xDisp = x - (this.mXform.getWidth() * 0.5);
    var yDisp = y - (this.mXform.getHeight() * 0.5);

    var xDirDisp = [];
    var yDirDisp = [];

    glMatrix.vec2.scale(xDirDisp, xDir, xDisp);
    glMatrix.vec2.scale(yDirDisp, yDir, yDisp);
    glMatrix.vec2.add(returnWCPos, this.mXform.getPosition(), xDirDisp);
    glMatrix.vec2.add(returnWCPos, returnWCPos, yDirDisp);
};

// use a WC position to compute the texture pixel indices.
TextureRenderable.prototype._wcPositionToIndex = function (returnIndex, wcPos, xDir, yDir) {
    // use wcPos to compute the corresponding returnIndex[0 and 1]
    var delta = [];
    glMatrix.vec2.sub(delta, wcPos, this.mXform.getPosition());

    // used formula: V = (V • L)L + (V • M)M
    // L and M are the normalized perpendicular component vectors
    var xDisp = glMatrix.vec2.dot(delta, xDir);
    var yDisp = glMatrix.vec2.dot(delta, yDir);

    // convert the wc offset value to the texture local value
    returnIndex[0] = this.mTexWidth * (xDisp / this.mXform.getWidth());
    returnIndex[1] = this.mTexHeight * (yDisp / this.mXform.getHeight());

    // Texture origin is at lower-left corner
    returnIndex[0] += this.mTexWidth / 2;
    returnIndex[1] += this.mTexHeight / 2;

    returnIndex[0] = Math.floor(returnIndex[0]);
    returnIndex[1] = Math.floor(returnIndex[1]);
};

// 像素碰撞算法
TextureRenderable.prototype.pixelTouches = function (other, wcTouchPos) {
    var pixelTouch = false;
    var xIndex = 0, yIndex;
    var otherIndex = [0, 0];

    var xDir = [1, 0];
    var yDir = [0, 1];
    var otherXDir = [1, 0];
    var otherYDir = [0, 1];

    glMatrix.vec2.rotate(xDir, xDir, [0, 0], this.mXform.getRotationInRad());
    glMatrix.vec2.rotate(yDir, yDir, [0, 0], this.mXform.getRotationInRad());
    glMatrix.vec2.rotate(otherXDir, otherXDir, [0, 0], other.mXform.getRotationInRad());
    glMatrix.vec2.rotate(otherYDir, otherYDir, [0, 0], other.mXform.getRotationInRad());

    while ((!pixelTouch) && (xIndex < this.mTexWidth)) {
        yIndex = 0;
        while ((!pixelTouch) && (yIndex < this.mTexHeight)) {
            if (this._pixelAlphaValue(xIndex, yIndex) > 0) {
                this._indexToWCPosition(wcTouchPos, xIndex, yIndex, xDir, yDir);
                other._wcPositionToIndex(otherIndex, wcTouchPos, otherXDir, otherYDir);
                if ((otherIndex[0] >= 0) && (otherIndex[0] < other.mTexWidth) &&
                    (otherIndex[1] >= 0) && (otherIndex[1] < other.mTexHeight)) {
                        pixelTouch = other._pixelAlphaValue(otherIndex[0], otherIndex[1]) > 0;
                    }
            }
            yIndex++;
        }
        xIndex++;
    }
    return pixelTouch;
};