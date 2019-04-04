/**
 * 本文件包含针对scene文件的解析逻辑
 */

/* global
glMatrix
gEngine
Camera Renderable TextureRenderable
*/

function SceneFileParser(sceneFilePath) {
    this.mSceneXml = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

SceneFileParser.prototype._getElm = function(tagElm) {
    var theElm = this.mSceneXml.getElementsByTagName(tagElm);
    if (theElm === 0) {
        console.error("警告：Level元素：[" + tagElm + "]：未发现！");
    }
    return theElm;
};

SceneFileParser.prototype.parseCamera = function () {
    var camElm = this._getElm("Camera");
    var cx = Number(camElm[0].getAttribute("CenterX"));
    var cy = Number(camElm[0].getAttribute("CenterY"));
    var w = Number(camElm[0].getAttribute("Width"));
    // split方法使用指定分隔符将一个String对象分割成字符串数组
    var viewport = camElm[0].getAttribute("Viewport").split(" ");
    var bgColor = camElm[0].getAttribute("BgColor").split(" ");
    // 确保viewport和color是number
    for (var j = 0; j < 4; j++) {
        bgColor[j] = Number(bgColor[j]);
        viewport[j] = Number(viewport[j]);
    }

    // 建立摄像机
    var cam = new Camera(
        glMatrix.vec2.fromValues(cx, cy), // 相机的位置
        w, // 相机的宽（相机的高由视口的高宽比计算出来）
        viewport // 视口数据
    );

    cam.setBackgroundColor(bgColor);
    return cam;
};

SceneFileParser.prototype.parseSquares = function (sqSet) {
    var elm = this._getElm("Square");
    var i, j, x, y, w, h, r, c, sq;
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);
        r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
        c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
        sq = new Renderable(gEngine.DefaultResources.getConstColorShader());
        // 确保color数组元素是number
        for (j = 0; j < 3; j++) {
            c[j] = Number(c[j]);
        }
        sq.setColor(c);
        sq.getXform().setPosition(x, y);
        sq.getXform().setRotationInDegree(r);
        sq.getXform().setSize(w, h);
        sqSet.push(sq);
    }
};

SceneFileParser.prototype.parseTextureSquares = function (sqSet) {
    var elm = this._getElm("TextureSquare");
    var i, j, x, y, w, h, r, c, t, sq;
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);
        r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
        c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
        t = elm.item(i).attributes.getNamedItem("Texture").value;
        sq = new TextureRenderable(t);
        // 确保color数组元素是number
        for (j = 0; j < 4; j++) {
            c[j] = Number(c[j]);
        }
        sq.setColor(c);
        sq.getXform().setPosition(x, y);
        sq.getXform().setRotationInDegree(r);
        sq.getXform().setSize(w, h);
        sqSet.push(sq);
    }
};