precision mediump float; // 中精度浮点运算

// color of the object
uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor; // this is shared globally
uniform float uGlobalAmbientIntensity; // this is shared globally

void main(void) {
    // for every pixel called sets to the user specified color
    gl_FragColor = uPixelColor * uGlobalAmbientIntensity * uGlobalAmbientColor;
}