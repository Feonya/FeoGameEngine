/**
 * 摄像机对象
 * 摄像机对象基础性封装了有关视图投射和视口的相关功能。
 * 视图投射变换允许我们定义世界坐标绘制在哪里。现实世界中，可以用照相机类比，照相机镜头的中心就是世界坐标中心，
 * 通过镜头取景得到的宽高就是世界坐标的规模。如此类比，拍照行为与计算世界坐标中的物体图形是类似的，
 * 最后，视口描述了展示经过计算后图像的位置。
 */

/* global
glMatrix
gEngine
BoundingBox CameraState CameraShake
*/

"use strict";

function PerRenderCache() {
    this.mWCToPixelRatio = 1; // wc to pixel transformation
    this.mCameraOrgX = 1; // lower-left corner of camera in wc
    this.mCameraOrgY = 1;
}

function Camera(wcCenter, wcWidth, viewportArray, bound) {
    // 世界坐标和视口的位置、尺寸
    this.mViewport = []; // [x, y, width, height]
    this.mViewportBound = 0;
    if (bound != undefined) {
        this.mViewportBound = bound;
    }
    this.mScissorBound = []; // use for bound
    this.setViewport(viewportArray, this.mViewportBound);

    this.mNearPlane = 0.0;
    this.mFarPlane = 1000;

    this.mCameraState = new CameraState(wcCenter, wcWidth);
    this.mCameraShake = null;

    // 变换矩阵
    this.mViewMatrix = glMatrix.mat4.create();
    this.mProjMatrix = glMatrix.mat4.create();
    this.mVPMatrix = glMatrix.mat4.create();

    // 背景颜色
    this.mBgColor = [0.8, 0.8, 0.8, 1.0];

    // per rendering cahed information
    // needed for computiong transforms for shaders
    // updated each time in setupViewProjection()
    this.mRenderCache = new PerRenderCache(); // should not be used except xform operations during the rendering
        // client game should not access this
}

Camera.eViewport = Object.freeze({
    eOrgX: 0,
    eOrgY: 1,
    eWidth: 2,
    eHeight: 3
});

Camera.prototype.setWCCenter = function (xPos, yPos) {
    var p = glMatrix.vec2.fromValues(xPos, yPos);
    this.mCameraState.setCenter(p);
};

Camera.prototype.getWCCenter = function () {
    return this.mCameraState.getCenter();
};

Camera.prototype.setWCWidth = function (width) {
    this.mCameraState.setWidth(width);
};

Camera.prototype.getWCWidth = function () {
    return this.mCameraState.getWidth();
};

Camera.prototype.getWCHeight = function () {
    return this.mCameraState.getWidth() * this.mViewport[Camera.eViewport.eHeight] / this.mViewport[Camera.eViewport.eWidth];
};

Camera.prototype.setViewport = function (viewportArray) {
    this.mViewport = viewportArray;
};

Camera.prototype.getViewport = function () {
    return this.mViewport;
};

Camera.prototype.setBackgroundColor = function (newColor) {
    this.mBgColor = newColor;
};

Camera.prototype.getBackgroundColor = function () {
    return this.mBgColor;
};

// 获得视图投射变换操作
Camera.prototype.getVPMatrix = function () {
    return this.mVPMatrix;
};

Camera.prototype.setViewport = function (viewportArray, bound) {
    if (bound === undefined) {
        bound = this.mViewportBound;
    }
    // [x, y, width, height]
    this.mViewport[0] = viewportArray[0] + bound;
    this.mViewport[1] = viewportArray[1] + bound;
    this.mViewport[2] = viewportArray[2] - (2 * bound);
    this.mViewport[3] = viewportArray[3] - (2 * bound);
    this.mScissorBound[0] = viewportArray[0];
    this.mScissorBound[1] = viewportArray[1];
    this.mScissorBound[2] = viewportArray[2];
    this.mScissorBound[3] = viewportArray[3];
};

Camera.prototype.getViewport = function () {
    var out = [];
    out[0] = this.mScissorBound[0];
    out[1] = this.mScissorBound[1];
    out[2] = this.mScissorBound[2];
    out[3] = this.mScissorBound[3];
    return out;
};

// 初始化摄像机
Camera.prototype.setupViewProjection = function () {
    var gl = gEngine.Core.getGL();

    /* 设置视口 */

    // 建立canvas上用于绘制的区域
    gl.viewport(
        this.mViewport[0], // x坐标位置，左下角
        this.mViewport[1], // y坐标位置，左下角
        this.mViewport[2], // 绘制区域的宽
        this.mViewport[3] // 绘制区域的高
    );

    // 建立相应的裁剪区域以限制只清理该区域
    gl.scissor(
        this.mScissorBound[0], // x坐标位置，左下角
        this.mScissorBound[1], // y坐标位置，左下角
        this.mScissorBound[2], // 绘制区域的宽
        this.mScissorBound[3] // 绘制区域的高
    );

    // 设置清理颜色
    gl.clearColor(this.mBgColor[0], this.mBgColor[1], this.mBgColor[2], this.mBgColor[3]);

    // 激活裁剪区域，清理后再禁用它
    gl.enable(gl.SCISSOR_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);

    // 定义视图矩阵
    var center = [];
    if (this.mCameraShake !== null) {
        center = this.mCameraShake.getCenter();
    } else {
        center = this.getWCCenter();
    }
    glMatrix.mat4.lookAt(
        this.mViewMatrix,
        [center[0], center[1], 10], // 观察者所在的位置
        [center[0], center[1], 0], // 观察者所看到的位置
        [0, 1, 0] // 方向：向量朝上
    );

    // 定义投射矩阵
    var halfWCWidth = 0.5 * this.getWCWidth();
    var halfWCHeight = 0.5 * this.getWCHeight();
    glMatrix.mat4.ortho(
        this.mProjMatrix,
        -halfWCWidth, // 到世界坐标左侧的距离
        halfWCWidth, // 到世界坐标右侧的距离
        -halfWCHeight, // 到世界坐标下侧的距离
        halfWCHeight, // 到世界坐标上侧的距离
        this.mNearPlane, // 到近裁剪平面的z距离
        this.mFarPlane // 到远裁剪平面的z距离
    );

    // 连结视图和投射矩阵
    glMatrix.mat4.multiply(this.mVPMatrix, this.mProjMatrix, this.mViewMatrix);

    // compute and cache per rendering information
    this.mRenderCache.mWCToPixelRatio = this.mViewport[Camera.eViewport.eWidth] / this.getWCWidth();
    this.mRenderCache.mCameraOrgX = center[0] - (this.getWCWidth() / 2);
    this.mRenderCache.mCameraOrgY = center[1] - (this.getWCHeight() / 2);
};

Camera.prototype.shake = function (xDelta, yDelta, shakeFrequency, duration) {
    this.mCameraShake = new CameraShake(this.mCameraState, xDelta, yDelta, shakeFrequency, duration);
};

Camera.prototype.collideWCBound = function (aXform, zone) {
    var bbox = new BoundingBox(aXform.getPosition(), aXform.getWidth(), aXform.getHeight());
    var w = zone * this.getWCWidth();
    var h = zone * this.getWCHeight();
    var cameraBound = new BoundingBox(this.getWCCenter(), w, h);
    return cameraBound.boundCollideStatus(bbox);
};

// forbid an object move outside a given zone
Camera.prototype.clampAtBoundary = function (aXform, zone) {  // zone is a ratio value of WC bounds
    var status = this.collideWCBound(aXform, zone);
    if (status !== BoundingBox.eboundCollideStatus.eInside) {
        var pos = aXform.getPosition();
        if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) {
            pos[1] = (this.getWCCenter())[1] + (zone * this.getWCHeight() / 2) - (aXform.getHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) {
            pos[1] = (this.getWCCenter())[1] - (zone * this.getWCHeight() / 2) + (aXform.getHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) {
            pos[0] = (this.getWCCenter())[0] + (zone * this.getWCWidth() / 2) - (aXform.getWidth() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) {
            pos[0] = (this.getWCCenter())[0] - (zone * this.getWCWidth() / 2) + (aXform.getWidth() / 2);
        }
    }
};