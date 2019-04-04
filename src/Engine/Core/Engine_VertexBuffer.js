/**
 * 引擎顶点缓冲器
 * 初始化顶点信息并载入顶点缓冲器
 */

"use strict";

var gEngine = gEngine || {};

gEngine.VertexBuffer = (function () {
    // 定义矩形顶点数组
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];

    // 定义对应的纹理坐标
    var textureCoordnates = [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
    ];

    // 引用gl上下文中矩形的顶点位置信息
    var mSquareVertexBuffer = null;

    // 引用gl上下文中矩形顶点的纹理位置信息
    var mTextureCoordBuffer = null;

    var getGLVertexRef = function () {
        return mSquareVertexBuffer;
    };

    var getGLTexCoordRef = function () {
        return mTextureCoordBuffer;
    };

    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // Step A: 分配并存储顶点位置信息到webgl上下文中
        // 为顶点位置创建一个上下文缓冲器
        mSquareVertexBuffer = gl.createBuffer();
        // 将顶点缓冲器绑定到上下文类型化数组
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
        // 按照数据（verticesOfSquare数组）大小分配类型化数组的大小，并将数据载入绑在类型化数组上的缓冲器中
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);

        // Step B: 分配并存储纹理坐标
        mTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordnates), gl.STATIC_DRAW);
    };

    var cleanUp = function () {
        var gl = gEngine.Core.getGL();
        gl.deleteBuffer(mSquareVertexBuffer);
        gl.deleteBuffer(mTextureCoordBuffer);
    };

    var mPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef,
        getGLTexCoordRef: getGLTexCoordRef,
        cleanUp: cleanUp
    };

    return mPublic;
})();