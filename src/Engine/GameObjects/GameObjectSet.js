function GameObjectSet() {
    this.mSet = [];
}

GameObjectSet.prototype.update = function () {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].update();
    }
};

GameObjectSet.prototype.draw = function (aCamera) {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera);
    }
};

GameObjectSet.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};