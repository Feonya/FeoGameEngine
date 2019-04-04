/* global glMatrix BoundingBox */

function GameObject(renderableObj) {
    this.mRenderComponent = renderableObj;
    this.mVisible = true;
    this.mCurrentFrontDir = glMatrix.vec2.fromValues(0, 1);
    this.mSpeed = 0;
}

GameObject.prototype.getXform = function () {
    return this.mRenderComponent.getXform();
};

// 如果mCurrentFrontDir被rotateObjPointTo方法操作，那么update方法将会移动物体朝向位置p，
// 物体就表现出追踪目标的行为
GameObject.prototype.update = function () {
    var pos = this.getXform().getPosition();
    glMatrix.vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());
};

GameObject.prototype.getRenderable = function () {
    return this.mRenderComponent;
};

GameObject.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        this.mRenderComponent.draw(aCamera);
    }
};

GameObject.prototype.setVisibility = function (f) {
    this.mVisible = f;
};

GameObject.prototype.isVisible = function () {
    return this.mVisible;
};

GameObject.prototype.setSpeed = function (s) {
    this.mSpeed = s;
};

GameObject.prototype.getSpeed = function () {
    return this.mSpeed;
};

GameObject.prototype.incSpeedBy = function (delta) {
    this.mSpeed += delta;
};

GameObject.prototype.setCurrentFrontDir = function (f) {
    glMatrix.vec2.normalize(this.mCurrentFrontDir, f);
};

GameObject.prototype.getCurrentFrontDir = function () {
    return this.mCurrentFrontDir;
};

// 旋转正方向指向某一位置
GameObject.prototype.rotateObjPointTo = function (p, rate) {
    // Step A：检测是否已经在终点位置p上
    var dir = [];
    glMatrix.vec2.sub(dir, p, this.getXform().getPosition());
    var len = glMatrix.vec2.length(dir);
    if (len < Number.MIN_VALUE) {
        return; // 到达
    }
    glMatrix.vec2.scale(dir, dir, 1 / len);

    // Step B：计算需要旋转角度
    var fdir = this.getCurrentFrontDir();
    var cosTheta = glMatrix.vec2.dot(dir, fdir);
    if (cosTheta > 0.999999) { // 方向几乎一致
        return;
    }

    // Step C：锁定cosTheda在-1到1之间
    if (cosTheta > 1) {
        cosTheta = 1;
    } else {
        if (cosTheta < -1) {
            cosTheta = -1;
        }
    }

    // Step D：计算是正始终旋转还是逆时钟旋转
    var dir3d = glMatrix.vec3.fromValues(dir[0], dir[1], 0);
    var f3d = glMatrix.vec3.fromValues(fdir[0], fdir[1], 0);
    var r3d = [];
    glMatrix.vec3.cross(r3d, f3d, dir3d);

    var rad = Math.acos(cosTheta);
    if (r3d[2] < 0) {
        rad = -rad;
    }

    // Step E：根据角度和倍率旋转正方向
    rad *= rate;
    glMatrix.vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), [0, 0], rad); // 旋转物体的正方向
    this.getXform().incRotationByRad(rad); // 旋转物体
};

GameObject.prototype.getBBox = function () {
    var xform = this.getXform();
    var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};