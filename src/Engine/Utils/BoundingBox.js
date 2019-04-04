/* global glMatrix */

function BoundingBox(centerPos, w, h) {
    this.mLL = glMatrix.vec2.fromValues(0, 0); // low left corner position
    this.setBounds(centerPos, w, h);
}

// 注意每个枚举值的二进制都只有1位是非0，这能够让枚举值进行按位与（|）操作，
// 者能够表现多方向碰撞的情况。如：一个碰撞发生在碰撞盒的上方和左方，那么碰撞的状态是：
// eCollideLeft | eCollideTop = 4 | 1 = 5
BoundingBox.eboundCollideStatus = Object.freeze({
    eCollideLeft: 1,
    eCollideRight: 2,
    eCollideTop: 4,
    eCollideBottom: 8,
    eInside: 16,
    eOutside:0
});

BoundingBox.prototype.setBounds = function (centerPos, w, h) {
    this.mWidth = w;
    this.mHeight = h;
    this.mLL[0] = centerPos[0] - (w / 2);
    this.mLL[1] = centerPos[1] - (h / 2);
};

// 检测一个位置是否在绑定的碰撞盒内
BoundingBox.prototype.containsPoint = function (x, y) {
    return (
        (x > this.minX()) &&
        (x < this.maxX()) &&
        (y > this.minY()) &&
        (y < this.maxY())
    );
};

// 检测一个绑定盒是否与其他盒重叠（碰撞）
BoundingBox.prototype.intersectsBound = function (otherBound) {
    return (
        (this.minX() < otherBound.maxX()) &&
        (this.maxX() > otherBound.minX()) &&
        (this.minY() < otherBound.maxY()) &&
        (this.maxY() > otherBound.minY())
    );
};

// 计算一个绑定盒与其他盒碰撞的状态
BoundingBox.prototype.boundCollideStatus = function (otherBound) {
    var status = BoundingBox.eboundCollideStatus.eOutside;
    if (this.intersectsBound(otherBound)) {
        if (otherBound.minX() < this.minX()) {
            status |= BoundingBox.eboundCollideStatus.eCollideLeft;
        }
        if (otherBound.maxX() > this.maxX()) {
            status |= BoundingBox.eboundCollideStatus.eCollideRight;
        }
        if (otherBound.minY() < this.minY()) {
            status |= BoundingBox.eboundCollideStatus.eCollideBottom;
        }
        if (otherBound.maxY() > this.maxY()) {
            status |= BoundingBox.eboundCollideStatus.eCollideTop;
        }
        // 彻底重叠（包含）
        if (status === BoundingBox.eboundCollideStatus.eOutside) {
            status = BoundingBox.eboundCollideStatus.eInside;
        }
    }
    return status;
};

BoundingBox.prototype.minX = function () {
    return this.mLL[0];
};

BoundingBox.prototype.maxX = function () {
    return this.mLL[0] + this.mWidth;
};

BoundingBox.prototype.minY = function () {
    return this.mLL[1];
};

BoundingBox.prototype.maxY = function () {
    return this.mLL[1] + this.mHeight;
};