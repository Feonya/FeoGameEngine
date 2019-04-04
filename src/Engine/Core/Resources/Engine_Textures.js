"use strict";

function TextureInfo(name, w, h, id) {
    // 存储图像文件的地址
    this.mName = name;
    // mWidth、mHeight引用纹理的像素分辨率
    this.mWidth = w;
    this.mHeight = h;
    // 引用WebGL纹理存储
    this.mGLTexID = id;
    // 存储一个纹理的颜色数组
    this.mColorArray = null;
}

var gEngine = gEngine || {};

gEngine.Textures = (function () {
    // 从WebGl上下文获取颜色数组
    var getColorArray = function (textureName) {
        var texInfo = getTextureInfo(textureName);
        if (texInfo.mColorArray === null) {
            var gl = gEngine.Core.getGL();
            // create a framebuffer, bind it to the texture, and read the color content.
            // Framebuffer objects provide an alternative rendering target to the drawing buffer,
            // They are a collection of color, alpha, depth and stencil buffers and are often
            // used to render an image the will later be used as a texture.
            var fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            // attach a texture image to a framebuffer object
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texInfo.mGLTexID, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                // create an array that will store pixels's RGBA datas
                var pixels = new Uint8Array(texInfo.mWidth * texInfo.mHeight * 4);
                // read a block of pixels from the frame buffer,
                // then store them into the last parameter and return it
                gl.readPixels(0, 0, texInfo.mWidth, texInfo.mHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                texInfo.mColorArray = pixels;
            } else {
                alert("WARNING: gEngine.Textures.getColorArray() failed!");
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(fb);
        }
        return texInfo.mColorArray;
    };

    // 加载一个待绘制纹理
    var loadTexture = function (textureName) {
        // 如果纹理不存在于ResourceMap中
        if (!(gEngine.ResourceMap.isAssetLoaded(textureName))) {
            var img = new Image();

            // 更新资源并计上一数
            gEngine.ResourceMap.asyncLoadRequested(textureName);

            // 纹理图像加载后，将其转换成WebGL支持的格式，以放回mTextureMap中
            img.onload = function () {
                _processLoadedImage(textureName, img);
            };
            img.src = textureName;
        } else {
            // 如果纹理已存在于ResourceMap中，则引用计数加1
            gEngine.ResourceMap.incAssetRefCount(textureName);
        }
    };

    var unloadTexture = function (textureName) {
        var gl = gEngine.Core.getGL();
        var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);
        gl.deleteTexture(texInfo.mGLTexID);
        gEngine.ResourceMap.unloadAsset(textureName);
    };

    var _processLoadedImage = function(textureName, image) {
        var gl = gEngine.Core.getGL();

        // 创建一个WebGL纹理对象
        var textureID = gl.createTexture();

        // 绑定纹理对象到当前纹理功能
        gl.bindTexture(gl.TEXTURE_2D, textureID);

        /**
         * 根据描述信息加载纹理到纹理数据结构中
         * 参数：
         * 1、纹理将加载到哪一个绑定点，或者说哪一个目标上
         * 2、细节级别。用于mipmapping，0表示基础纹理级别
         * 3、内部格式。每个元素的构成，比如：像素
         * 4、纹素数据格式。必须与内部格式一致
         * 5、纹素数据的数据类型。这里是无符号字节
         * 6、纹理数据
         */
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // 为当前纹理创建一个mipmap
        gl.generateMipmap(gl.TEXTURE_2D);

        // 暂时解绑定，告诉WebGL这一阶段我们已经完成了对纹理对象的设置
        gl.bindTexture(gl.TEXTURE_2D, null);

        var texInfo = new TextureInfo(textureName, image.naturalWidth,
            image.naturalHeight, textureID);
        gEngine.ResourceMap.asyncLoadCompleted(textureName, texInfo);
    };

    // 激活一个WebGL纹理以便绘制
    var activateTexture = function (textureName) {
        var gl = gEngine.Core.getGL();
        var texInfo = gEngine.ResourceMap.retrieveAsset(textureName);

        // 绑定纹理对象到TEXTURE_2D
        gl.bindTexture(gl.TEXTURE_2D, texInfo.mGLTexID);

        // 禁止纹理的包装
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // 放大和缩小过滤器使用
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // 如果向让纹理变得“锐利”，可以使用：
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    };

    var deactivateTexture = function () {
        var gl = gEngine.Core.getGL();
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    var getTextureInfo = function (textureName) {
        return gEngine.ResourceMap.retrieveAsset(textureName);
    };

    var mPublic = {
        loadTexture: loadTexture,
        unloadTexture: unloadTexture,
        activateTexture: activateTexture,
        deactivateTexture: deactivateTexture,
        getTextureInfo: getTextureInfo,
        getColorArray: getColorArray
    };

    return mPublic;
})();