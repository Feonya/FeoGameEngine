attribute vec3 aSquareVertexPosition;

uniform mat4 uModelTransform; // 对顶点位置进行变换
uniform mat4 uViewProjTransform; // 视图投影矩阵变换

void main(void) {
    gl_Position = uViewProjTransform * uModelTransform * vec4(aSquareVertexPosition, 1.0);
}