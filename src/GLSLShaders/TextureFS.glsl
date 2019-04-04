precision mediump float;

// 从texture获取数据的对象，必须在着色器外部设置
uniform sampler2D uSampler;

// 像素颜色
uniform vec4 uPixelColor;
uniform vec4 uGlobalAmbientColor; // this is shared globally
uniform float uGlobalAmbientIntensity;

// "varying"关键字用以标记这个纹理坐标将会是线性插值的，因此它是变化的
varying vec2 vTexCoord;

void main(void) {
    // 查找纹素颜色，建立在纹理坐标中uv的值的线性插值之上。
    // 对应xyzw，纹理坐标中一般使用stpq：s宽度、t高度、p深度、q坐标类似齐次坐标。
    // texture2D方法采样并读取关联自uSampler的纹素值，uSampler使用了vTexCoord的uv插值
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));

    c = c * uGlobalAmbientIntensity * uGlobalAmbientColor;

    // 为纹理区域着色。按照纹理自身定义保留透明区域。
    // 这里依照uPixelColor中定义的颜色中的alpha值作为权重来修改纹素颜色
    // 通常没有关于纹理着色的一致方案，可以自由尝试不同的方法来组合uPixelColor与采样后的纹素颜色
    vec3 r = vec3(c) * (1.0 - uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, c.a);

    gl_FragColor = result;
}