/* global
gEngine
*/

function CharacterInfo() {
    // uv坐标和字符的表现信息能够通过.fnt文件内容计算出来

    // 将纹理坐标映射到整个图像
    this.mTexCoordLeft = 0;
    this.mTexCoordRight = 1;
    this.mTexCoordBottom = 0;
    this.mTexCoordTop = 0;

    // 名义上的字符尺寸，1表示标准宽高
    this.mCharWidth = 1;
    this.mCharHeight = 1;
    this.mCharWidthOffset = 0;
    this.mCharHeightOffset = 0;

    // 字符宽高比
    this.mCharAspectRatio = 1;
}

var gEngine = gEngine || {};

gEngine.Fonts = (function () {
    var loadFont = function (fontName) {
        if (!(gEngine.ResourceMap.isAssetLoaded(fontName))) {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";

            // 在ResourceMap中注册entry
            gEngine.ResourceMap.asyncLoadRequested(fontName);

            gEngine.Textures.loadTexture(textureSourceString);
            gEngine.TextFileLoader.loadTextFile(fontInfoSourceString,
                gEngine.TextFileLoader.eTextFileType.eXMLFile, _storeLoadedFont);
        } else {
            gEngine.ResourceMap.incAssetRefCount(fontName);
        }
    };

    var _storeLoadedFont = function (fontInfoSourceString) {
        var fontName = fontInfoSourceString.slice(0, -4); // 去掉.fnt后缀
        var fontInfo = gEngine.ResourceMap.retrieveAsset(fontInfoSourceString);
        fontInfo.FontImage = fontName + ".png";
        gEngine.ResourceMap.asyncLoadCompleted(fontName, fontInfo);
    };

    var unloadFont = function (fontName) {
        gEngine.ResourceMap.unloadAsset(fontName);
        if (!(gEngine.ResourceMap.isAssetLoaded(fontName))) {
            var fontInfoSourceString = fontName + ".fnt";
            var textureSourceString = fontName + ".png";

            gEngine.Textures.unloadTexture(textureSourceString);
            gEngine.TextFileLoader.unloadTextFile(fontInfoSourceString);
        }
    };

    // 基于.fnt文件计算CharacterInfo
    var getCharInfo = function (fontName, aChar) {
        var returnInfo = null;
        var fontInfo = gEngine.ResourceMap.retrieveAsset(fontName);
        var commonPath = "font/common";
        var commonInfo = fontInfo.evaluate(commonPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        commonInfo = commonInfo.iterateNext();
        if (commonInfo === null) {
            return returnInfo;
        }
        var charHeight = commonInfo.getAttribute("base");

        var charPath = "font/chars/char[@id=" + aChar + "]";
        var charInfo = fontInfo.evaluate(charPath, fontInfo, null, XPathResult.ANY_TYPE, null);
        charInfo = charInfo.iterateNext();
        if (charInfo === null) {
            return returnInfo;
        }

        returnInfo = new CharacterInfo();
        var texInfo = gEngine.Textures.getTextureInfo(fontInfo.FontImage);
        var leftPixel = Number(charInfo.getAttribute("x"));
        var rightPixel = leftPixel + Number(charInfo.getAttribute("width"));
        var topPixel = texInfo.mHeight - Number(charInfo.getAttribute("y"));
        var bottomPixel = topPixel - Number(charInfo.getAttribute("height"));

        // 纹理坐标信息
        returnInfo.mTexCoordLeft = leftPixel / texInfo.mWidth;
        returnInfo.mTexCoordTop = topPixel / texInfo.mHeight;
        returnInfo.mTexCoordRight = rightPixel / texInfo.mWidth;
        returnInfo.mTexCoordBottom = bottomPixel / texInfo.mHeight;

        // 相关字符尺寸
        var charWidth = charInfo.getAttribute("xadvance");
        returnInfo.mCharWidth = charInfo.getAttribute("width") / charWidth;
        returnInfo.mCharHeight = charInfo.getAttribute("height") / charHeight;
        returnInfo.mCharWidthOffset = charInfo.getAttribute("xoffset") / charWidth;
        returnInfo.mCharHeightOffset = charInfo.getAttribute("yoffset") / charHeight;

        return returnInfo;
    };

    var mPublic = {
        loadFont: loadFont,
        unloadFont: unloadFont,
        getCharInfo: getCharInfo
    };
    return mPublic;
})();