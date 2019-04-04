/* global
glMatrix
*/

"use strict";

function Transform() {
    this.mPosition = glMatrix.vec2.fromValues(0, 0); // 变形操作
    this.mScale = glMatrix.vec2.fromValues(1, 1); // 缩放操作
    this.mRotationInRad = 0.0; // 根据弧度旋转
}

/* 位置有关方法 */

Transform.prototype.setPosition = function (xPos, yPos) {
    this.setXPos(xPos);
    this.setYPos(yPos);
};

Transform.prototype.setXPos = function (xPos) {
    this.mPosition[0] = xPos;
};

Transform.prototype.setYPos = function (yPos) {
    this.mPosition[1] = yPos;
};

Transform.prototype.incXPosBy = function (deltaX) {
    this.mPosition[0] += deltaX;
};

Transform.prototype.incYPosBy = function (deltaY) {
    this.mPosition[1] += deltaY;
};

Transform.prototype.getPosition = function () {
    return this.mPosition;
};

Transform.prototype.getXPos = function () {
    return this.mPosition[0];
};

Transform.prototype.getYPos = function () {
    return this.mPosition[1];
};

/* 尺寸有关方法 */

Transform.prototype.setSize = function (width, height) {
    this.setWidth(width);
    this.setHeight(height);
};

Transform.prototype.setWidth = function (width) {
    this.mScale[0] = width;
};

Transform.prototype.setHeight = function (height) {
    this.mScale[1] = height;
};

Transform.prototype.incSizeBy = function (deltaSize) {
    this.mScale[0] += deltaSize;
    this.mScale[1] += deltaSize;
};

Transform.prototype.getSize = function () {
    return this.mScale;
};

Transform.prototype.getWidth = function () {
    return this.mScale[0];
};

Transform.prototype.getHeight = function () {
    return this.mScale[1];
};

/* 旋转有关方法 */

Transform.prototype.setRotationInRad = function (rotationInRadians) {
    this.mRotationInRad = rotationInRadians;
    while (this.mRotationInRad > (2 * Math.PI)) {
        this.mRotationInRad -= (2 * Math.PI);
    }
};

Transform.prototype.incRotationByRad = function (deltaRad) {
    this.mRotationInRad += deltaRad;
};

Transform.prototype.setRotationInDegree = function (rotationInDegree) {
    this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
};

Transform.prototype.incRotationByDegree = function (deltaDegree) {
    this.mRotationInRad += deltaDegree * Math.PI / 180;
};

Transform.prototype.getRotationInRad = function () {
    return this.mRotationInRad;
};

// 得到最终的变形操作
Transform.prototype.getXform = function () {
    var matrix = glMatrix.mat4.create(); // 创建一个单位矩阵

    glMatrix.mat4.translate(matrix, matrix, glMatrix.vec3.fromValues(this.getXPos(), this.getYPos(), 0.0));
    glMatrix.mat4.rotateZ(matrix, matrix, this.getRotationInRad());
    glMatrix.mat4.scale(matrix, matrix, glMatrix.vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

    return matrix;
};