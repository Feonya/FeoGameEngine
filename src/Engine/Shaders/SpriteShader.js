/**
 * SpriteShader必须能够辨识图像的唯一异同子区域，以映射纹理的不同元素
 */

/* global
TextureShader gEngine SimpleShader
*/

"use strict";

function SpriteShader(vertexShaderPath, fragmentShaderPath) {
    TextureShader.call(this, vertexShaderPath, fragmentShaderPath);

    this.mTexCoordBuffer = null; // 包含纹理坐标的gl缓冲器

    var initTexCoord = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    var gl = gEngine.Core.getGL();

    this.mTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    // DYNAMIC_DRAW表示缓冲器中的数据将会频繁修改并多次使用
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
}

gEngine.Core.inheritPrototype(SpriteShader, TextureShader);

SpriteShader.prototype.setTextureCoordinate = function (texCoord) {
    var gl = gEngine.Core.getGL();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    // bufferSubData可重新定义一部分或者所有的存储在当前绑定了目标的缓冲器中的数据。
    // 数据开始于第二个参数的位置（字节偏移），然后根据第三个参数进行拷贝修改
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(texCoord));
};

SpriteShader.prototype.activateShader = function (pixelColor, vpMatrix) {
    SimpleShader.prototype.activateShader.call(this, pixelColor, vpMatrix);

    // 绑定目标纹理坐标缓存
    var gl = gEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mTexCoordBuffer);
    gl.vertexAttribPointer(this.mShaderTextureCoordAttribute,
        2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
};

SpriteShader.prototype.cleanUp = function () {
    var gl = gEngine.Core.getGL();
    gl.deleteBuffer(this.mTexCoordBuffer);
    SimpleShader.prototype.cleanUp.call(this);
};