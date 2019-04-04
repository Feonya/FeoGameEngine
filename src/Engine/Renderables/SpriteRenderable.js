/* global
TextureRenderable Renderable
gEngine
*/

function SpriteRenderable(myTexture) {
    TextureRenderable.call(this, myTexture);
    Renderable.prototype._setShader.call(this, gEngine.DefaultResources.getSpriteShader());

    // 纹理坐标界限：
    // 0左、1右
    this.mTexLeft = 0.0;
    this.mTexRight = 1.0;
    // 1上、0下
    this.mTexTop = 1.0;
    this.mTexBottom = 0.0;

    this._setTexInfo();
}

gEngine.Core.inheritPrototype(SpriteRenderable, TextureRenderable);

// 定义一个枚举数据类型，用于识别纹理坐标规格数组上相应的位置偏移
SpriteRenderable.eTexCoordArray = Object.freeze({
    eLeft: 2,
    eRight: 0,
    eTop: 1,
    eBottom: 5
});

// 用纹理坐标空间定义一个sprite sheet元素的uv值
SpriteRenderable.prototype.setElementUVCoordinate = function (left, right, bottom, top) {
    this.mTexLeft = left;
    this.mTexRight = right;
    this.mTexBottom = bottom;
    this.mTexTop = top;

    this._setTexInfo();
};

// 用像素位置类定义一个sprite sheet元素的uv值（结果将转化为uv值）
SpriteRenderable.prototype.setElementPixelPositions = function (left, right, bottom, top) {
    var texInfo = gEngine.ResourceMap.retrieveAsset(this.mTexture);

    // 整个图像的宽高
    var imageW = texInfo.mWidth;
    var imageH = texInfo.mHeight;

    this.mTexLeft = left / imageW;
    this.mTexRight = right / imageW;
    this.mTexBottom = bottom/ imageH;
    this.mTexTop = top / imageH;

    this._setTexInfo();
};

// 定义一个方法用于构建纹理坐标规格数组，以传递相应的值到WebGL上下文
SpriteRenderable.prototype.getElementUVCoordinateArray = function () {
    return [
        this.mTexRight, this.mTexTop,
        this.mTexLeft, this.mTexTop,
        this.mTexRight, this.mTexBottom,
        this.mTexLeft, this.mTexBottom
    ];
};

// 重构draw方法
SpriteRenderable.prototype.draw = function (vpMatrix) {
    // 设置当前纹理坐标
    this.mShader.setTextureCoordinate(this.getElementUVCoordinateArray());
    TextureRenderable.prototype.draw.call(this, vpMatrix);
};