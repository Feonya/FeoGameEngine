/* global
Transform
gEngine
*/

function Renderable() {
    this.mShader = gEngine.DefaultResources.getConstColorShader();
    this.mColor = [1.0, 1.0, 1.0, 1.0]; // 片元着色器的颜色
    this.mXform = new Transform();
}

Renderable.prototype._setShader = function (s) {
    this.mShader = s;
};

Renderable.prototype.draw = function (aCamera) {
    var gl = gEngine.Core.getGL();
    this.mShader.activateShader(this.mColor, aCamera);
    this.mShader.loadObjectTransform(this.mXform.getXform()); // 加载变换
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

Renderable.prototype.setColor = function (color) {
    this.mColor = color;
};

Renderable.prototype.getColor = function () {
    return this.mColor;
};

Renderable.prototype.getXform = function () {
    return this.mXform;
};