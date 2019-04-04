/**
 * 引擎核心
 * 提供通用的游戏系统功能。
 */

"use strict";

var gEngine = gEngine || {}; // 游戏引擎单例

gEngine.Core = (function () {
    // 实例变量：引用WebGL上下文
    var mGL = null;

    // WebGL上下文访问器
    var getGL = function () {
        return mGL;
    };

    // 初始化WebGL
    var _initializeWebGL = function (htmlCanvasID) {
        var canvas = document.getElementById(htmlCanvasID);
        // getContext方法的第二个参数告诉浏览器，canvas是不透明的，
        // 这能够加速透明内容和图像的绘制
        mGL = canvas.getContext("webgl", {alpha: false}) ||
            canvas.getContext("experimental-webgl", {alpha: false});

        // 允许透明的纹理
        // blendFunc方法用于指定像素的算法，第一个参数指定如何计算r、g、b、a的来源混合因子，
        // 第二个参数指定如何计算r、g、b、a的目标混合因子
        mGL.blendFunc(mGL.SRC_ALPHA, mGL.ONE_MINUS_SRC_ALPHA);
        // enable方法用于指定一个符号常量以代表一个GL能力，
        // 参数BLEND符号常量表示将根据色彩缓存器中的值计算出来的fragement颜色值进行混合
        mGL.enable(mGL.BLEND);

        // 翻转图片的坐标轴y轴以匹配纹理坐标空间
        mGL.pixelStorei(mGL.UNPACK_FLIP_Y_WEBGL, true);

        if (mGL === null) {
            document.write("<br><b>不支持WebGL！</b>");
            // return;
        }
    };

    var startScene = function (myGame) {
        myGame.loadScene.call(myGame); // 使用call方法维持正确的上下文
        gEngine.GameLoop.start(myGame); // 再start方法内，当异步完成后执行initialize
    };

    // 继承函数
    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype); // 创建一个对象，原型属性指向父类的原型对象
        prototype.constructor = subClass; // 修正子类的constructor
        subClass.prototype = prototype; // 再将该对象作为子类的原型对象
    };

    // 初始化所有EngineCore组件
    var initializeEngineCore = function (htmlCanvasID, myGame) {
        _initializeWebGL(htmlCanvasID);
        gEngine.VertexBuffer.initialize();
        gEngine.Input.initialize(htmlCanvasID);
        gEngine.AudioClips.initAudioContext();
        gEngine.DefaultResources.initialize(function () {
            startScene(myGame);
        });
    };

    var cleanUp = function () {
        gEngine.VertexBuffer.cleanUp();
        gEngine.DefaultResources.cleanUp();
    };

    // 清理绘制区域并绘制一个方形
    var clearCanvas = function (color) {
        mGL.clearColor(color[0], color[1], color[2], color[3]);
        mGL.clear(mGL.COLOR_BUFFER_BIT);
    };

    // 可访问函数与变量
    var mPublic = {
        getGL: getGL,
        initializeEngineCore: initializeEngineCore,
        clearCanvas: clearCanvas,
        startScene: startScene,
        inheritPrototype: inheritPrototype,
        cleanUp: cleanUp
    };

    return mPublic;
})();