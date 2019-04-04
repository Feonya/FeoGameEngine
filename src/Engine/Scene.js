/**
 * 抽象的场景类
 * 因为是抽象的，所以所有的方法都是空的，
 * 预期其子类将实现并重载这些方法。
 */
function Scene() {
    // constructor
}

Scene.prototype.initialize = function () {
    // 加载完成后，由GameLoop调用
};

Scene.prototype.loadScene = function () {
    // 由gEngine.Core.startScene()调用
};

Scene.prototype.unloadScene = function () {

};

Scene.prototype.update = function () {

};

Scene.prototype.draw = function () {

};