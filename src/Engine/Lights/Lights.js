/* global
glMatrix
*/

"use strict";

function Light() {
    this.mColor = glMatrix.vec4.fromValues(0.1, 0.1, 0.1, 1); // light color
    this.mPosition = glMatrix.vec3.fromValues(0, 0, 5); // light position in wc
    this.mNear = 5; // within near is fully lighted
    this.mFar = 10; // farther than far is not lighted
    this.mIntensity = 1;
    this.mIsOn = true;
}

Light.prototype.setColor = function (c) {
    this.mColor = glMatrix.vec4.clone(c);
};

Light.prototype.getColor = function () {
    return this.mColor;
};

Light.prototype.set2DPosition = function (p) {
    this.mPosition = glMatrix.vec3.fromValues(p[0], p[1], this.mPosition[2]);
};

Light.prototype.setXPos = function (x) {
    this.mPosition[0] = x;
};

Light.prototype.setYPos = function (y) {
    this.mPosition[1] = y;
};

Light.prototype.setZPos = function (z) {
    this.mPosition[2] = z;
};

Light.prototype.getPosition = function () {
    return this.mPosition;
};

Light.prototype.setLightTo = function (isOn) {
    this.mIsOn = isOn;
};

Light.prototype.isLightOn = function () {
    return this.mIsOn;
};

Light.prototype.setNear = function (r) {
    this.mNear = r;
};

Light.prototype.getNear = function () {
    return this.mNear;
};

Light.prototype.setFar = function (r) {
    this.mFar = r;
};

Light.prototype.getFar = function () {
    return this.mFar;
};

Light.prototype.setIntensity = function (i) {
    this.mIntensity = i;
};

Light.prototype.getIntensity = function () {
    return this.mIntensity;
};