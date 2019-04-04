/* global
Scene Camera FontRenderable Hero Minion GameObject Light LightRenderable Renderable
gEngine
glMatrix
*/

"use strict";

// eslint-disable-next-line no-unused-vars
function MyGame() {
    // texture
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kBg = "assets/bg.png";

    // the camera to view the sence
    this.mCamera = null;
    this.mBg = null;

    this.mMsg = null;

    // the hero and the support objects
    this.mHero = null;
    this.mLMinion = null;
    this.mRMinion = null;

    this.mTheLight = null;
    this.mBlock1 = null; // to verify switching between shaders is fine
    this.mBlock2 = null;
}

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // 加载纹理
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kBg);
};

MyGame.prototype.unloadScene = function () {
    // 卸载纹理
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kBg);
};

MyGame.prototype.initialize = function () {
    // 创建摄像机
    this.mCamera = new Camera(
        glMatrix.vec2.fromValues(50, 37.5), // 摄像机位置
        100, // 摄像机宽度
        [0, 0, 640, 480] // 视口
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]); // 背景设为灰色

    // the light
    this.mTheLight = new Light();
    this.mTheLight.setRadius(8);
    this.mTheLight.setZPos(2);
    this.mTheLight.setXPos(30);
    this.mTheLight.setYPos(30);
    this.mTheLight.setColor([0.9, 0.9, 0.2, 1]);

    var bgR = new LightRenderable(this.kBg);
    bgR.setElementPixelPositions(0, 1900, 0, 1000);
    bgR.getXform().setSize(190, 100);
    bgR.getXform().setPosition(50, 35);
    bgR.addLight(this.mTheLight);
    this.mBg = new GameObject(bgR);

    this.mHero = new Hero(this.kMinionSprite);
    this.mHero.getRenderable().addLight(this.mTheLight);

    this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
    this.mLMinion.getRenderable().addLight(this.mTheLight);
    this.mRMinion = new Minion(this.kMinionSprite, 70, 30);

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(1, 2);
    this.mMsg.setTextHeight(1.5);

    this.mBlock1 = new Renderable();
    this.mBlock1.setColor([1, 0, 0, 1]);
    this.mBlock1.getXform().setSize(5, 5);
    this.mBlock1.getXform().setPosition(30, 50);

    this.mBlock2 = new Renderable();
    this.mBlock2.setColor([0, 1, 0, 1]);
    this.mBlock2.getXform().setSize(5, 5);
    this.mBlock2.getXform().setPosition(70, 50);
};

// 更新游戏状态
MyGame.prototype.update = function () {
    var msg, i, c;
    var deltaC = 0.01;
    var deltaZ = 0.05;

    this.mCamera.update();  // to ensure proper interpolated movement effects
    this.mLMinion.update(); // ensure sprite animation
    this.mRMinion.update();
    this.mHero.update();  // allow keyboard control to move

    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
        this.mTheLight.set2DPosition(this.mHero.getXform().getPosition());
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        c = this.mTheLight.getColor();
        for (i = 0; i < 4; i++) {
            c[i] += deltaC;
        }
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        c = this.mTheLight.getColor();
        for (i = 0; i < 4; i++) {
            c[i] -= deltaC;
        }
    }

    /**
     * @TODO 键代码未设置
     */
    var p = this.mTheLight.getPosition(), r;
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        p[2] += deltaZ;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        p[2] -= deltaZ;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
        r = this.mTheLight.getRadius();
        r += deltaC;
        this.mTheLight.setRadius(r);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.V)) {
        r = this.mTheLight.getRadius();
        r -= deltaC;
        this.mTheLight.setRadius(r);
    }

    c = this.mTheLight.getColor();
    msg = "LightColor:" + c[0].toPrecision(4) + " " + c[1].toPrecision(4) +
                    " " + c[2].toPrecision(4) + " " + c[3].toPrecision(4) +
          " Z=" + p[2].toPrecision(3) +
          " r=" + this.mTheLight.getRadius().toPrecision(3);
    this.mMsg.setText(msg);
};

MyGame.prototype.drawCamera = function (camera) {
    camera.setupViewProjection();

    this.mBg.draw(camera);
    this.mBlock1.draw(camera);
    this.mHero.draw(camera);
    this.mLMinion.draw(camera);
    this.mBlock2.draw(camera);
    this.mRMinion.draw(camera);
};

MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0, 1, 0, 1.0]);

    this.drawCamera(this.mCamera);
    this.mMsg.draw(this.mCamera); // only draw status in the main camera
};