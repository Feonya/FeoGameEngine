/* global
glMatrix
ShakePosition
*/

"use strict";

function CameraShake(state, xDelta, yDelta, shakeFrequency, shakeDuration) {
    this.mOrgCenter = glMatrix.vec2.clone(state.getCenter());
    this.mShakeCenter = glMatrix.vec2.clone(this.mOrgCenter);
    this.mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
}

// triggers the displacement computation for accomplishing the shaking effect
CameraShake.prototype.updateShakeState = function () {
    var s = this.mShake.getShakeResults();
    glMatrix.vec2.add(this.mShakeCenter, this.mOrgCenter, s);
};

CameraShake.prototype.shakeDone = function () {
    return this.mShake.shakeDone();
};

CameraShake.prototype.getCenter = function () {
    return this.mShakeCenter;
};

CameraShake.prototype.setRefCenter = function (c) {
    this.mOrgCenter[0] = c[0];
    this.mOrgCenter[1] = c[1];
};