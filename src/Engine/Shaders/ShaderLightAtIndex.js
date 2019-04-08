/* global
gEngine
*/

"use strict";

function ShaderLightAtIndex(shader, index) {
    this._setShaderReferences(shader,index);
}

ShaderLightAtIndex.prototype._setShaderReferences = function (aLightShader, index) {
    var gl = gEngine.Core.getGL();

    this.mColorRef = gl.getUniformLocation(aLightShader, "uLight[" + index + "].Color");
    this.mPosRef = gl.getUniformLocation(aLightShader, "uLight[" + index + "].Position");
    this.mNearRef = gl.getUniformLocation(aLightShader, "uLight[" + index + "].Near");
    this.mFarRef = gl.getUniformLocation(aLightShader, "uLight[" + index + "].Far");
    this.mIntensityRef = gl.getUniformLocation(aLightShader, "uLight[" + index + "].Intensity");
    this.mIsOnRef = gl.getUniformLocation(aLightShader, "uLight[" + index + "].IsOn");
};

ShaderLightAtIndex.prototype.switchOffLight = function () {
    var gl = gEngine.Core.getGL();
    gl.uniform1i(this.mIsOnRef, false);
};