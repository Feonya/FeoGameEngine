precision mediump float;

// the object that fetch data from texture
uniform sampler2D uSampler;

// color of pixel
uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor; // this is shared globally
uniform float uGlobalAmbientIntensity;

// ligth information
#define kGLSLuLightArraySize 4
    // GLSL fragment shader requires loop control variable to be a constant number.
    // this number 4 says, this fragment shader will always process all 4 light sources.
    // [this number must correspond to the constant with the same name defined in LightShader.js file]
    // to change this number make sure: to update the kGLSLuLightArraySize defined in LightShader.js file
struct Light {
    vec4 Position; // in pixel space
    vec4 Color;
    float Near; // distance in pixel space
    float Far; // distance in pixel space
    float Intensity;
    bool IsOn;
};

uniform Light uLights[kGLSLuLightArraySize]; // maximum array of lights this shader supports

vec4 LightEffect(Light lgt) {
    vec4 result = vec4(0);
    float atten = 0.0;
    float dist = length(lgt.Position.xyz - gl_FragCoord.xyz);
    if (dist <= lgt.Far) {
        if (dist <= lgt.Near) {
            atten = 1.0; // no attenuation
        } else {
            // simple quadratic drop off
            float n = dist - lgt.Near;
            float d = lgt.Far - lgt.Near;
            atten = smoothstep(0.0, 1.0, 1.0 - (n * n) / (d * d)); // blended attenuation
        }
    }
    result = atten * lgt.Intensity * lgt.Color;
    return result;
}

varying vec2 vTexCoord;

void main(void) {
    // simple tint based on uPixelColor setting
    vec4 textureMapColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    vec4 lgtResults = uGlobalAmbientIntensity * uGlobalAmbientColor;

    // now decide if we should illuminate by the light
    if (textureMapColor.a > 0.0) {
        for (int i = 0; i < kGLSLuLightArraySize; i++) {
            if (uLights[i].IsOn) {
                lgtResults += LightEffect(uLights[i]);
            }
        }
    }
    lgtResults *= textureMapColor;

    // tint the texture area, and leave transparent area as defined by the texture
    vec3 r = vec3(lgtResults) * (1.0 - uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, textureMapColor.a);

    gl_FragColor = result;
}