/* global
gEngine
SpriteRenderable Renderable
*/

"use strict";

function SpriteAnimateRenderable(myTexture) {
    SpriteRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

    // 纹理坐标中的所有的坐标（uv 0-1）

    // sprite元素的信息
    this.mFirstElmLeft = 0.0; // 0.0是图像的最左边
    this.mElmTop = 1.0; // 1.0是图像的最上边
    this.mElmWidth = 1.0; // 默认的sprite元素尺寸是整个图像的尺寸
    this.mElmHeight = 1.0;
    this.mWidthPadding = 0.0;
    this.mNumElems = 1; // 动画中的元素数量

    // 每个动画的设定
    this.mAnimationType = SpriteAnimateRenderable.eAnimationType.eAnimateRight;
    this.mUpdateInterval = 1; // 动画前进的间隔

    // 当前动画状态
    this.mCurrentAnimAdvance = -1; // 帧播放方向
    this.mCurrentElm = 0; // 当前帧

    this._initAnimation();
}

gEngine.Core.inheritPrototype(SpriteAnimateRenderable, SpriteRenderable);

// 假设：某个动画中的第一个sprite总是最左边的元素
SpriteAnimateRenderable.eAnimationType = Object.freeze({
    eAnimateRight: 0, // 从左到右的动画
    eAnimateLeft: 1, // 从右到左的动画
    eAnimateSwing: 2 // 先从左到右，再从右到左
});

SpriteAnimateRenderable.prototype.setAnimationType = function (animationType) {
    this.mAnimationType = animationType;
    this.mCurrentAnimAdvance = -1;
    this.CurrentElm = 0;
    this._initAnimation();
};

SpriteAnimateRenderable.prototype._initAnimation = function () {
    // 当前播放中的动画
    this.mCurrentTick = 0;
    switch (this.mAnimationType) {
        case SpriteAnimateRenderable.eAnimationType.eAnimateRight:
            this.mCurrentElm = 0;
            this.mCurrentAnimAdvance = 1; // 1或-1
            break;

        case SpriteAnimateRenderable.eAnimationType.eAnimateSwing:
            this.mCurrentAnimAdvance = -1 * this.mCurrentAnimAdvance;
            this.mCurrentElm += 2 * this.mCurrentAnimAdvance;
            break;

        case SpriteAnimateRenderable.eAnimationType.eAnimateLeft:
            this.mCurrentElm = this.mNumElems - 1;
            this.mCurrentAnimAdvance = -1;
            break;
    }

    this._setSpriteElement();
};

SpriteAnimateRenderable.prototype._setSpriteElement = function () {
    var left = this.mFirstElmLeft + (this.mCurrentElm * (this.mElmWidth + this.mWidthPadding));

    SpriteRenderable.prototype.setElementUVCoordinate.call(this, left, left + this.mElmWidth,
        this.mElmTop - this.mElmHeight, this.mElmTop);
};

// 总是设置最左边的元素将是首元素
SpriteAnimateRenderable.prototype.setSpriteSequence = function (
    topPixel,
    leftPixel,
    elmWidthInPixel,
    elmHeightInPixel,
    numElements,
    wPaddingInPixel
) {
    var texInfo = gEngine.ResourceMap.retrieveAsset(this.mTexture);
    // 整个图像的宽高
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;

    this.mNumElems = numElements;
    this.mFirstElmLeft = leftPixel / imageW;
    this.mElmTop = topPixel / imageH;
    this.mElmWidth = elmWidthInPixel / imageW;
    this.mElmHeight = elmHeightInPixel / imageH;
    this.mWidthPadding = wPaddingInPixel / imageW;

    this._initAnimation();
};

SpriteAnimateRenderable.prototype.setAnimationSpeed = function (tickInterval) {
    this.mUpdateInterval = tickInterval;
};

SpriteAnimateRenderable.prototype.incAnimationSpeed = function (deltaInterval) {
    this.mUpdateInterval += deltaInterval;
};

SpriteAnimateRenderable.prototype.updateAnimation = function () {
    this.mCurrentTick++;
    if (this.mCurrentTick >= this.mUpdateInterval) {
        this.mCurrentTick = 0;
        this.mCurrentElm += this.mCurrentAnimAdvance;
        if ((this.mCurrentElm >= 0) && (this.mCurrentElm < this.mNumElems)) {
            this._setSpriteElement();
        } else {
            this._initAnimation();
        }
    }
};