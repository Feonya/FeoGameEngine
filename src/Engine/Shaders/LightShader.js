/* global
glMatrix
gEngine
SpriteShader
*/

"use strict";

function LightShader(vertexShaderPath, fragmentShaderPath) {
    // call super class constructor
    SpriteShader.call(this, vertexShaderPath, fragmentShaderPath);

    // glsl uniform position references
    this.mColorRef = null;
    this.mPosRef = null;
    this.mRadiusRef = null;
    this.mIsOnRef = null;
    this.mLight = null; // this is the light source in the Game Engine

    // create the references to these uniforms in the LightShader
    var shader = this.mCompiledShader;
    var gl = gEngine.Core.getGL();
    this.mColorRef = gl.getUniformLocation(shader, "uLightColor");
    this.mPosRef = gl.getUniformLocation(shader, "uLightPosition");
    this.mRadiusRef = gl.getUniformLocation(shader, "uLightRadius");
    this.mIsOnRef = gl.getUniformLocation(shader, "uLightOn");
}

gEngine.Core.inheritPrototype(LightShader, SpriteShader);

LightShader.prototype.setLight = function (l) {
    this.mLight = l;
};

LightShader.prototype.activateShader = function (pixelColor, aCamera) {
    // first call the super class's activate
    SpriteShader.prototype.activateShader.call(this, pixelColor, aCamera);

    // push the light information to the shader
    if (this.mLight !== null) {
        this._loadToShader(aCamera);
    } else {
        gEngine.Core.getGL().uniform1i(this.mIsOnRef, false); // switch off the light
    }
};

// load the light's properties into the corresponding shader
LightShader.prototype._loadToShader = function (aCamera) {
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mIsOnRef, this.mLight.isLightOn());
    if (this.mLight.isLightOn()) {
        var p = aCamera.wcPosToPixel(this.mLight.getPosition());
        var r = aCamera.wcSizeToPixel(this.mLight.getRadius());
        var c = this.mLight.getColor();

        gl.uniform4fv(this.mColorRef, c);
        gl.uniform3fv(this.mPosRef, glMatrix.vec3.fromValues(p[0], p[1], p[2]));
        gl.uniform1f(this.mRadiusRef, r);
    }
};