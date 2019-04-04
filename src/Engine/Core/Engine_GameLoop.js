"use strict";

var gEngine = gEngine || {};

gEngine.GameLoop = (function () {
    var kFPS = 60; // 帧每秒
    var kMPF = 1000 / kFPS; // 毫秒每帧

    // 循环测量变量
    var mPreviousTime;
    var mLagTime;
    var mCurrentTime;
    var mElapsedTime;

    // 当前循环状态（运行或需要停止）
    var mIsLoopRunning = false;

    // 引用游戏逻辑
    var mMyGame = null;

    // 将此函数看作是MyGame类的方法
    var _runLoop = function () {
        if (mIsLoopRunning) {
            // Step A：建立下一个到_runLoop和update输入的调用
            // window.requestAnimationFrame()告诉浏览器：我希望执行一个动画，并要求其在下次重绘之前调用指定回调函数更新动画数据
            requestAnimationFrame(function () {
                _runLoop.call(mMyGame);
            });

            // Step B：在上一次循环执行后，计算与当前时间的间隔
            mCurrentTime = Date.now();
            mElapsedTime = mCurrentTime - mPreviousTime;
            mPreviousTime = mCurrentTime;
            mLagTime += mElapsedTime;

            // Step C：以适当的次数更新游戏
            while ((mLagTime >= kMPF) && mIsLoopRunning) {
                gEngine.Input.update();
                this.update(); // 调用MyGame.update()
                mLagTime -= kMPF;
            }

            // Step D：开始绘制
            this.draw(); // 调用MyGame.draw()
        } else {
            // 游戏循环结束，卸载当前场景
            mMyGame.unloadScene();
        }
    };

    var _startLoop = function () {
        // Step A：重置帧时间
        mPreviousTime = Date.now();
        mLagTime = 0.0;

        // Step B：循环状态开始
        mIsLoopRunning = true;

        // Step C：当读取完成后，请求_runLoop
        requestAnimationFrame(function () {
            _runLoop.call(mMyGame);
        });
    };

    var start = function (myGame) {
        mMyGame = myGame;

        gEngine.ResourceMap.setLoadCompleteCallback(
            function () {
                mMyGame.initialize();
                _startLoop();
            }
        );
    };

    var stop = function () {
        mIsLoopRunning = false;
    };
    
    var mPublic = {
        start: start,
        stop: stop
    };

    return mPublic;
})();