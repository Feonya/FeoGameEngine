/* global
gEngine
Scene SceneFileParser MyGame
*/

function BlueLevel() {
    this.kSceneFile = "assets/BlueLevel.xml";
    this.mSqSet = [];
    this.mCamera = null;

    this.kBgClip = "assets/sounds/BG_Clip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";

    // 纹理
    this.kPortal = "assets/minion_portal.jpg";
    this.kCollector = "assets/minion_collector.jpg";
}

// 继承场景父类
gEngine.Core.inheritPrototype(BlueLevel, Scene);

// 加载完成后，由GameLoop调用
BlueLevel.prototype.initialize = function () {
    var sceneParser = new SceneFileParser(this.kSceneFile);

    this.mCamera = sceneParser.parseCamera();

    sceneParser.parseSquares(this.mSqSet);

    sceneParser.parseTextureSquares(this.mSqSet);

    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
};

// 由gEngine.Core.startScene()调用
BlueLevel.prototype.loadScene = function () {
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);

    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);

    // 加载纹理
    gEngine.Textures.loadTexture(this.kPortal);
    gEngine.Textures.loadTexture(this.kCollector);
};

BlueLevel.prototype.unloadScene = function () {
    gEngine.AudioClips.stopBackgroundAudio();

    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    gEngine.AudioClips.unloadAudio(this.kCue);
    gEngine.AudioClips.unloadAudio(this.kBgClip);

    gEngine.Textures.unloadTexture(this.kPortal);
    gEngine.Textures.unloadTexture(this.kCollector);

    var nextLevel = new MyGame();
    gEngine.Core.startScene(nextLevel);
};

BlueLevel.prototype.update = function () {
    // 这个简单示例中，我们移动白色矩形，并搏动红色矩形

    // 获得白色矩形的一个标准变换矩阵
    var whiteXform = this.mSqSet[0].getXform();
    var deltaX = 0.05; // x坐标上每帧移动的距离

    // Step A：移动白色矩形
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (whiteXform.getXPos() > 30) {
            whiteXform.setPosition(10, 60);
        }
        whiteXform.incXPosBy(deltaX);

        gEngine.AudioClips.playACue(this.kCue);
    }

    // Step B：旋转白色矩形
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        whiteXform.incRotationByDegree(1);
    }

    // 获得红色矩形的一个标准变换矩阵
    var redXform = this.mSqSet[1].getXform();
    // Step C：搏动红色矩形
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (redXform.getWidth() > 5) {
            redXform.setSize(2, 2);
        }
        redXform.incSizeBy(0.05);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        whiteXform.incXPosBy(-deltaX);
        if (whiteXform.getXPos() < 11) {
            gEngine.GameLoop.stop();
        }

        gEngine.AudioClips.playACue(this.kCue);
    }

    // 改变纹理的染色
    var c = this.mSqSet[1].getColor();
    var ca = c[3] + deltaX;
    if (ca > 1) {
        ca = 0;
    }
    c[3] = ca;
};

BlueLevel.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

    this.mCamera.setupViewProjection();

    // 绘制所有矩形
    for (var i = 0; i < this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
    }
};