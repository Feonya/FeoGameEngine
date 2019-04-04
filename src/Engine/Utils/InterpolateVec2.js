/* global
glMatrix
gEngine
Interpolate
*/

"use strict";

function InterpolateVec2(value, cycle, rate) {
    Interpolate.call(this, value, cycle, rate);
}

gEngine.Core.inheritPrototype(InterpolateVec2, Interpolate);

InterpolateVec2.prototype._interpolateValue = function () {
    glMatrix.vec2.lerp(this.mCurrentValue, this.mCurrentValue, this.mFinalValue, this.mRate);
};