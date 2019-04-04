/* global
Camera BoundingBox glMatrix
*/

"use strict";

Camera.prototype.panBy = function (dx, dy) {
    var newC = glMatrix.vec2.clone(this.getWCCenter());
    this.newC[0] += dx;
    this.newC[1] += dy;
    this.mCameraState.setCenter(newC);
};

Camera.prototype.panTo = function (cx, cy) {
    this.setWCCenter(cx, cy);
};

// pan the camera based on the bounds of a Transform object
Camera.prototype.panWith = function (aXform, zone) {
    var status = this.collideWCBound(aXform, zone);
    if (status !== BoundingBox.eboundCollideStatus.eInside) {
        var pos = aXform.getPosition();
        var newC = glMatrix.vec2.clone(this.getWCCenter());
        if ((status & BoundingBox.eboundCollideStatus.eCollideTop) !== 0) {
            newC[1] = pos[1] + (aXform.getHeight() / 2) - (zone * this.getWCHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideBottom) !== 0) {
            newC[1] = pos[1] - (aXform.getHeight() / 2) + (zone * this.getWCHeight() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideRight) !== 0) {
            newC[0] = pos[0] + (aXform.getWidth() / 2) - (zone * this.getWCWidth() / 2);
        }
        if ((status & BoundingBox.eboundCollideStatus.eCollideLeft) !== 0) {
            newC[0] = pos[0] - (aXform.getWidth() / 2) + (zone * this.getWCWidth() / 2);
        }
        this.mCameraState.setCenter(newC);
    }
};

Camera.prototype.zoomBy = function (zoom) {
    if (zoom > 0) {
        this.mCameraState.setWidth(this.getWCWidth() * zoom);
    }
};

Camera.prototype.zoomTowards = function (pos, zoom) {
    var delta = [];
    var newC = [];
    glMatrix.vec2.sub(delta, pos, this.getWCCenter());
    glMatrix.vec2.scale(delta, delta, zoom - 1);
    glMatrix.vec2.sub(newC, this.getWCCenter(), delta);
    this.zoomBy(zoom);
    this.mCameraState.setCenter(newC);
};

Camera.prototype.update = function () {
    if (this.mCameraShake !== null) {
        if (this.mCameraShake.shakeDone()) {
            this.mCameraShake = null;
        } else {
            this.mCameraShake.setRefCenter(this.getWCCenter());
            this.mCameraShake.updateShakeState();
        }
    }
    this.mCameraState.updateCameraState();
};

Camera.prototype.configInterpolation = function (stiffness, duration) {
    this.mCameraState.configInterpolation(stiffness, duration);
};