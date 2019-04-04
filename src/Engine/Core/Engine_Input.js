"use strict";

var gEngine = gEngine || {};

gEngine.Input = (function (){
    // a set of constants to represent the three mouse buttons
    var kMouseButton = {
        Left: 0,
        Middle: 1,
        Right: 2
    };

    // support mouse
    var mCanvas = null;
    var mButtonPreviousState = [];
    var mIsButtonPressed = [];
    var mIsButtonClicked = [];
    var mMousePosX = -1;
    var mMousePosY = -1;

    var _onMouseMove = function (event) {
        var inside = false;
        var bBox = mCanvas.getBoundingClientRect();

        // in canvas space now. convert via ratio from canvas to client
        var x = Math.round((event.clientX - bBox.left) * (mCanvas.width / bBox.width));
        var y = Math.round((event.clientY - bBox.top) * (mCanvas.width / bBox.width));

        if ((x >= 0) && (x < mCanvas.width) && (y >= 0) && (y < mCanvas.height)) {
            mMousePosX = x;
            mMousePosY = mCanvas.height - 1 - y;
            inside = true;
        }
        return inside;
    };

    var _onMouseDown = function (event) {
        if (_onMouseMove(event)) {
            mIsButtonPressed[event.button] = true;
        }
    };

    var _onMouseUp = function (event) {
        _onMouseMove(event);
        mIsButtonPressed[event.button] = false;
    };

    var isButtonPressed = function (button) {
        return mIsButtonPressed[button];
    };

    var isButtonClicked = function (button) {
        return mIsButtonClicked[button];
    };

    var getMousePosX = function () {
        return mMousePosX;
    };

    var getMousePosY = function () {
        return mMousePosY;
    };

    // 键码常量
    var kKeys = {
        // 方向键
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,

        // 空格键
        Space: 32,

        // 数字键
        Zero: 48,
        One: 49,
        Two: 50,
        Three: 51,
        Four: 52,
        Five: 53,
        Six: 54,
        Seven: 55,
        Eight: 56,
        Nine: 57,

        //字母键（A: 65 - Z: 90）
        A: 65,
        B: 66,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        W: 87,

        LastKeyCode: 222
    };

    // 先前的按键状态（按下或弹起状态）
    var mKeyPreviousState = [];

    // 某按键是否按下（按下或弹起状态）
    var mIsKeyPressed = [];

    // 点击事件（先前的按键状态是弹起的，而后变为按下的瞬间产生的事件）
    var mIsKeyClicked = [];

    // 事件服务方法：捕捉当前按键状态的改变（按下或弹起状态）
    var _onKeyDown = function (event) {
        mIsKeyPressed[event.keyCode] = true;
    };

    var _onKeyUp = function (event) {
        mIsKeyPressed[event.keyCode] = false;
    };

    // 初始化按键状态，并将按键事件通过事件处理器注册到浏览器
    var initialize = function (canvasID) {
        // keyboard support
        var i;
        var kLastKeyCode = kKeys.LastKeyCode;
        for (i = 0; i < kLastKeyCode; i++) {
            mIsKeyPressed[i] = false;
            mKeyPreviousState[i] = false;
            mIsKeyClicked[i] = false;
        }

        // 注册事件
        window.addEventListener("keyup", _onKeyUp);
        window.addEventListener("keydown", _onKeyDown);

        // mouse support
        for (i = 0; i < 3; i++) {
            mButtonPreviousState[i] = false;
            mIsButtonPressed[i] = false;
            mIsButtonClicked[i] = false;
        }

        window.addEventListener("mousedown", _onMouseDown);
        window.addEventListener("mouseup", _onMouseUp);
        window.addEventListener("mousemove", _onMouseMove);
        mCanvas = document.getElementById(canvasID);
    };

    var update = function () {
        var i;
        var kLastKeyCode = kKeys.LastKeyCode;
        for (i = 0; i < kLastKeyCode; i++) {
            mIsKeyClicked[i] = (!mKeyPreviousState[i]) && mIsKeyPressed[i];
            mKeyPreviousState[i] = mIsKeyPressed[i];
        }
        for (i = 0; i < 3; i++) {
            mIsButtonClicked[i] = (!mButtonPreviousState[i]) && mIsButtonPressed[i];
            mButtonPreviousState[i] = mIsButtonPressed[i];
        }
    };

    // 测试方法：某个按键是否按下
    var isKeyPressed = function (keyCode) {
        return mIsKeyPressed[keyCode];
    };

    var isKeyClicked = function (keyCode) {
        return mIsKeyClicked[keyCode];
    };

    var mPublic = {
        initialize: initialize,
        update: update,
        isKeyPressed: isKeyPressed,
        isKeyClicked: isKeyClicked,
        keys: kKeys,
        isButtonPressed: isButtonPressed,
        isButtonClicked: isButtonClicked,
        getMousePosX: getMousePosX,
        getMousePosY: getMousePosY,
        mouseButton: kMouseButton
    };

    return mPublic;
})();