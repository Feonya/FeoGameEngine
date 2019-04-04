/* global
gEngine
*/

function SimpleShader(vertexShaderPath, fragmentShaderPath) {
    this.mCompiledShader = null; // 用于引用上下文中编译后的shader
    this.mShaderVertexPositionAttribute = null; // 用于引用顶点着色器中的SquareVertexPosition
    this.mPixelColor = null; // 用于引用片元着色器中的uPixelColor uniform变量
    this.mModelTransform = null; // 用于引用顶点着色器中的uModelTransform uniform变量
    this.mViewProjTransform = null; // 用于引用顶点着色器中的uViewProjTransform uniform变量

    this.mGlobalAmbientColor = null;
    this.mGlobalAmbientIntensity = null;

    var gl = gEngine.Core.getGL();

    // 开始构造器
    // 加载和编译顶点及片元shader
    this.mVertexShader = this._compileShader(vertexShaderPath, gl.VERTEX_SHADER);
    this.mFragmentShader = this._compileShader(fragmentShaderPath, gl.FRAGMENT_SHADER);

    // 创建program并链接shader
    this.mCompiledShader = gl.createProgram();
    gl.attachShader(this.mCompiledShader, this.mVertexShader);
    gl.attachShader(this.mCompiledShader, this.mFragmentShader);
    gl.linkProgram(this.mCompiledShader);

    // 错误检查
    if (!gl.getProgramParameter(this.mCompiledShader, gl.LINK_STATUS)) {
        alert("着色器链接错误");
        return null;
    }

    // 获得指向aSquareVertexPosition attribute的地址
    this.mShaderVertexPositionAttribute = gl.getAttribLocation(this.mCompiledShader, "aSquareVertexPosition");

    // 将顶点缓冲器绑定到上下文类型化数组
    gl.bindBuffer(gl.ARRAY_BUFFER, gEngine.VertexBuffer.getGLVertexRef());

    // 设置aSquareVertexPosition attribute在顶点缓冲器中mShaderVertexPositionAttribute位置的元素数据
    // （也可以理解为一个顶点属性指针，指向的位置是数组中第一个元素，然后设置这个元素的数据）
    gl.vertexAttribPointer(this.mShaderVertexPositionAttribute,
        3, // 每个元素是三个float（x,y,z）
        gl.FLOAT, // 类型为FLOAT
        false, // 内容是否是标准化向量
        0, // 元素间忽略多少字节
        0); // 首元素偏移量

    // 获得指向uPixel uniform的地址
    this.mPixelColor = gl.getUniformLocation(this.mCompiledShader, "uPixelColor");
    // 获得指向uModelTransform uniform的地址
    this.mModelTransform = gl.getUniformLocation(this.mCompiledShader, "uModelTransform");
    // 获得指向uViewProjTransform uniform的地址
    this.mViewProjTransform = gl.getUniformLocation(this.mCompiledShader, "uViewProjTransform");

    this.mGlobalAmbientColor = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientColor");
    this.mGlobalAmbientIntensity = gl.getUniformLocation(this.mCompiledShader, "uGlobalAmbientIntensity");
}

// 根据地址获得一个GLSL文件并返回一个编译后的shader
SimpleShader.prototype._compileShader = function(filePath, shaderType) {
    var shaderSource = null, compiledShader = null;

    var gl = gEngine.Core.getGL();

    // 访问shader文件
    shaderSource = gEngine.ResourceMap.retrieveAsset(filePath);

    // 根据shader类型创建shader
    compiledShader = gl.createShader(shaderType);

    // 根据源编译shader
    gl.shaderSource(compiledShader, shaderSource);
    gl.compileShader(compiledShader);

    // 检查错误并返回结果（如果错误返回null）
    if (!gl.getShaderParameter(compiledShader, gl.COMPILE_STATUS)) {
        alert("发生一个着色器编译错误：" + gl.getShaderInfoLog(compiledShader));
    }

    return compiledShader;
};

// 加载变换操作到顶点着色器
SimpleShader.prototype.loadObjectTransform = function (modelTransform) {
    var gl = gEngine.Core.getGL();

    // 为mModelTransform传入值
    gl.uniformMatrix4fv(this.mModelTransform, false, modelTransform);
};

// 激活shader
SimpleShader.prototype.activateShader = function (pixelColor, aCamera) {
    var gl = gEngine.Core.getGL();
    gl.useProgram(this.mCompiledShader);
    // 为mViewProjTransform传入值
    gl.uniformMatrix4fv(this.mViewProjTransform, false, aCamera.getVPMatrix());
    // 在mShaderVertexPositionAttribute位置激活顶点属性数组
    // （可以理解为，前面使用vertexAttribPointer()设置了数组中第一个元素的数据，这里使用该设置依次向后遍历）
    gl.enableVertexAttribArray(this.mShaderVertexPositionAttribute);
    // 为mPixelColor传入值
    gl.uniform4fv(this.mPixelColor, pixelColor);

    gl.uniform4fv(this.mGlobalAmbientColor, gEngine.DefaultResources.getGlobalAmbientColor());
    gl.uniform1f(this.mGlobalAmbientIntensity, gEngine.DefaultResources.getGlobalAmbientIntensity());
};

SimpleShader.prototype.getShader = function () {
    return this.mCompiledShader;
};

SimpleShader.prototype.cleanUp = function () {
    var gl = gEngine.Core.getGL();
    gl.detachShader(this.mCompiledShader, this.mVertexShader);
    gl.detachShader(this.mCompiledShader, this.mFragmentShader);
    gl.deleteShader(this.mVertexShader);
    gl.deleteShader(this.mFragmentShader);
};