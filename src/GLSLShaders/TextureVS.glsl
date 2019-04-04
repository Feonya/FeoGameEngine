attribute vec3 aSquareVertexPosition; // 顶点的xyz坐标
attribute vec2 aTextureCoordinate; // 顶点的uv坐标

// 纹理坐标，用于将整个图像映射到一个完整矩形
varying vec2 vTexCoord;

// 用于变化顶点位置
uniform mat4 uModelTransform;
uniform mat4 uViewProjTransform;

void main(void) {
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0);

    // 将纹理坐标传递给片元着色器
    vTexCoord = aTextureCoordinate;
}