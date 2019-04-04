/* global
gEngine
SimpleShader
*/

"use strict";

function TextureShader(vertexShaderPath, fragmentShaderPath) {
    // 调用父类的构造器
    SimpleShader.call(this, vertexShaderPath, fragmentShaderPath);

    // 引用着色器中的aTextureCoordnate
    this.mShaderTextureCoordAttribute = null;

    // 从着色器获得aTextureCoordnate的引用
    var gl = gEngine.Core.getGL();
    this.mShaderTextureCoordAttribute =
        gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
}

// 继承SimpleShader（从SimpleShader获得所有prototype方法）
gEngine.Core.inheritPrototype(TextureShader, SimpleShader);

// 重构activateShader方法
TextureShader.prototype.activateShader = function (pixelColor, vpMatrix) {
    // 首先调用父类的本方法
    SimpleShader.prototype.activateShader.call(this, pixelColor, vpMatrix);

    var gl = gEngine.Core.getGL();
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLTexCoordRef());
    gl.vertexAttribPointer(this.mShaderTextureCoordAttribute,
        2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.mShaderTextureCoordAttribute);
};