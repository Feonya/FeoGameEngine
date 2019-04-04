/* global
glMatrix
SimpleShader TextureShader SpriteShader LightShader
*/

var gEngine = gEngine || {};

gEngine.DefaultResources = (function () {
    // global ambient color
    var mGlobalAmbientColor = [0.3, 0.3, 0.3, 1];
    var mGlobalAmbientIntensity = 1;

    var getGlobalAmbientIntensity = function () {
        return mGlobalAmbientIntensity;
    };

    var setGlobalAmbientIntensity = function (v) {
        mGlobalAmbientIntensity = v;
    };

    var getGlobalAmbientColor = function () {
        return mGlobalAmbientColor;
    };

    var setGlobalAmbientColor = function (v) {
        mGlobalAmbientColor = glMatrix.vec4.fromValues(v[0], v[1], v[2], v[3]);
    };

    // 默认字体
    var kDefaultFont = "assets/fonts/system-default-font";

    var getDefaultFont = function () {
        return kDefaultFont;
    };

    // 关于SimpleShader
    var kSimpleVS = "src/GLSLShaders/SimpleVS.glsl";
    var kSimpleFS = "src/GLSLShaders/SimpleFS.glsl";
    var mConstColorShader = null; // 引用SimpleShader对象
    var mSpriteShader = null; // 引用SpriteShader对象

    var getConstColorShader = function () {
        return mConstColorShader;
    };

    // 关于TextureShader
    var kTextureVS = "src/GLSLShaders/TextureVS.glsl";
    var kTextureFS = "src/GLSLShaders/TextureFS.glsl";
    var mTextureShader = null; // 引用TextureShader对象

    var getTextureShader = function () {
        return mTextureShader;
    };

    var getSpriteShader = function () {
        return mSpriteShader;
    };

    // Light shader
    var kLightFS = "src/GLSLShaders/LightFS.glsl";
    var mLightShader = null;

    var getLightShader = function () {
        return mLightShader;
    };

    // glsl加载完成后的回调
    var _createShaders = function (callBackFunction) {
        gEngine.ResourceMap.setLoadCompleteCallback(null);
        mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
        mTextureShader = new TextureShader(kTextureVS, kTextureFS);
        mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
        // mLineShader = new LineShader(kSimpleVS, kSimpleFS);
        mLightShader = new LightShader(kTextureVS, kLightFS);
        callBackFunction();
    };

    // 初始化异步加载glsl文件
    // 这里callBackFunction对应的是Engine_Core.js中的function () { startScene(myGame); }
    var initialize = function (callBackFunction) {
        // 关于LightShader
        gEngine.TextFileLoader.loadTextFile(kLightFS,
            gEngine.TextFileLoader.eTextFileType.eTextFile);

        // 关于SimpleShader
        gEngine.TextFileLoader.loadTextFile(kSimpleVS,
            gEngine.TextFileLoader.eTextFileType.eTextFile);

        gEngine.TextFileLoader.loadTextFile(kSimpleFS,
            gEngine.TextFileLoader.eTextFileType.eTextFile);

        // 关于TextureShader
        gEngine.TextFileLoader.loadTextFile(kTextureVS,
            gEngine.TextFileLoader.eTextFileType.eTextFile);

        gEngine.TextFileLoader.loadTextFile(kTextureFS,
            gEngine.TextFileLoader.eTextFileType.eTextFile);

        // 加载默认字体
        gEngine.Fonts.loadFont(kDefaultFont);

        gEngine.ResourceMap.setLoadCompleteCallback(
            function () {
                _createShaders(callBackFunction);
            }
        );
    };

    var cleanUp = function () {
        mConstColorShader.cleanUp();
        mTextureShader.cleanUp();
        mSpriteShader.cleanUp();

        gEngine.TextFileLoader.unloadTextFile(kLightFS);

        gEngine.TextFileLoader.unloadTextFile(kSimpleVS);
        gEngine.TextFileLoader.unloadTextFile(kSimpleFS);

        gEngine.TextFileLoader.unloadTextFile(kTextureVS);
        gEngine.TextFileLoader.unloadTextFile(kTextureFS);

        gEngine.Fonts.unloadFont(kDefaultFont);
    };

    var mPublic = {
        initialize: initialize,
        getConstColorShader: getConstColorShader,
        getTextureShader: getTextureShader,
        getSpriteShader: getSpriteShader,
        getDefaultFont: getDefaultFont,
        cleanUp: cleanUp,

        getGlobalAmbientIntensity: getGlobalAmbientIntensity,
        setGlobalAmbientIntensity: setGlobalAmbientIntensity,
        getGlobalAmbientColor: getGlobalAmbientColor,
        setGlobalAmbientColor: setGlobalAmbientColor,
        getLightShader: getLightShader
    };

    return mPublic;
})();