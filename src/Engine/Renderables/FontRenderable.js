/* global gEngine SpriteRenderable Transform */

"use strict";

// FontRenderable不是SpriteRenderable的子类，但是却使用了SpriteRenderable
function FontRenderable(aString) { // aString参数是要写下的信息
    this.mFont = gEngine.DefaultResources.getDefaultFont();
    this.mOneChar = new SpriteRenderable(this.mFont + ".png");
    this.mXform = new Transform();
    this.mText = aString;
}

// 使用mOneChar变量来粘贴并绘制每一个字符
FontRenderable.prototype.draw = function (vpMatrix) {
    var widthOfOneChar = this.mXform.getWidth() / this.mText.length;
    var heightOfOneChar = this.mXform.getHeight();
    var yPos = this.mXform.getYPos();

    // 首字符的中心位置
    var xPos = this.mXform.getXPos() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
    var charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
    for (charIndex = 0; charIndex < this.mText.length; charIndex++) {
        aChar = this.mText.charCodeAt(charIndex);
        charInfo = gEngine.Fonts.getCharInfo(this.mFont, aChar);

        // 设置纹理坐标
        this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft,
            charInfo.mTexCoordRight, charInfo.mTexCoordBottom, charInfo.mTexCoordTop);

        // 设置字符尺寸
        xSize = widthOfOneChar * charInfo.mCharWidth;
        ySize = heightOfOneChar * charInfo.mCharHeight;
        this.mOneChar.getXform().setSize(xSize, ySize);

        // 从中心位置的偏移
        xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
        yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;
        this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

        this.mOneChar.draw(vpMatrix);

        xPos += widthOfOneChar;
    }
};

FontRenderable.prototype.getXform = function () {
    return this.mXform;
};

FontRenderable.prototype.getFont = function () {
    return this.mText;
};

FontRenderable.prototype.setFont = function (t) {
    this.mFont = t;
    this.mOneChar.setTexture(this.mFont + ".png");
};

FontRenderable.prototype.setColor = function (c) {
    this.mOneChar.setColor(c);
};

FontRenderable.prototype.getColor = function () {
    return this.mOneChar.getColor();
};

FontRenderable.prototype.setTextHeight = function (h) {
    // this is for "A"
    var charInfo = gEngine.Fonts.getCharInfo(this.mFont, "A".charCodeAt(0));
    var w = h * charInfo.mCharAspectRatio;
    this.getXform().setSize(w * this.mText.length, h);
};

FontRenderable.prototype.setText = function (t) {
    this.mText = t;
    this.setTextHeight(this.getXform().getHeight());
};

FontRenderable.prototype.getText = function () {
    return this.mText;
};