var gEngine = gEngine || {};

gEngine.AudioClips = (function () {
    var mAudioContext = null;
    var mBgAudioNode = null;

    var initAudioContext = function () {
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext; // 某些浏览器需要webkit前缀
            mAudioContext = new AudioCtx();
        } catch (e) {
            alert("不支持Web Audio");
        }
    };

    // 异步加载声音文件
    var loadAudio = function (clipName) {
        if (!(gEngine.ResourceMap.isAssetLoaded(clipName))) {
            // 记录异步加载申请
            gEngine.ResourceMap.asyncLoadRequested(clipName);

            // 开始异步申请数据
            var req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(clipName + ": 加载失败！[提示：不能直接双击index.html来运行本项目]");
                }
            };

            req.open("GET", clipName, true);

            // 指定该请求请求的时二进制数据
            req.responseType = "arraybuffer";

            req.onload = function () {
                // 异步解码，然后调用函数参数
                mAudioContext.decodeAudioData(
                    req.response,
                    function (buffer) { // 参数代表解码后的数据缓存
                        // 记录异步加载完成
                        gEngine.ResourceMap.asyncLoadCompleted(clipName, buffer);
                    }
                );
            };

            req.send();
        } else {
            gEngine.ResourceMap.incAssetRefCount(clipName);
        }
    };

    var unloadAudio = function (clipName) {
        gEngine.ResourceMap.unloadAsset(clipName);
    };

    var playACue = function (clipName) {
        var clipInfo = gEngine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            // SourceNode（AudioNode）只使用一次，它用来播放被包含在AudioBuffer中的音频数据
            var sourceNode = mAudioContext.createBufferSource();
            sourceNode.buffer = clipInfo;
            // connect方法用来连接node的输出到一个目标，这个目标可以是其他AudioNode（从而引导声音数据到特定的node）。
            // destination是AudioContext的一个属性，它返回一个AudioDestinationNode，代表上下文中所有音频的最终目标
            // 它也常用来代表一个真实的音频渲染设备，比如你的扬声器
            sourceNode.connect(mAudioContext.destination);
            sourceNode.start(0);
        }
    };

    // 播放、停止并测试背景音效
    var playBackgroundAudio = function (clipName) {
        var clipInfo = gEngine.ResourceMap.retrieveAsset(clipName);
        if (clipInfo !== null) {
            // 如果正在播放，停止播放
            stopBackgroundAudio();

            mBgAudioNode = mAudioContext.createBufferSource();
            mBgAudioNode.buffer = clipInfo;
            mBgAudioNode.connect(mAudioContext.destination);
            mBgAudioNode.loop = true;
            mBgAudioNode.start(0);
            
            // 如果AudioContext是在用户对浏览器进行某种操作之前创建的，那么它的播放状态将会自动suspended。
            // 这里注册一个事件，一旦用户点击浏览器，如果不是running状态，那么将AudioContext的播放状态设为running
            window.addEventListener("mousedown", function () {
                if (mAudioContext.state !== "running") {
                    mAudioContext.resume();
                }
            });
        }
    };

    var stopBackgroundAudio = function () {
        // 检查音频是否正在播放
        if (mBgAudioNode !== null) {
            mBgAudioNode.stop(0);
            mBgAudioNode = null;
        }
    };

    var isBackgroundAudioPlaying = function () {
        return (mBgAudioNode !== null);
    };

    var mPublic = {
        initAudioContext: initAudioContext,
        loadAudio: loadAudio,
        unloadAudio: unloadAudio,
        playACue: playACue,
        playBackgroundAudio: playBackgroundAudio,
        stopBackgroundAudio: stopBackgroundAudio,
        isBackgroundAudioPlaying: isBackgroundAudioPlaying
    };

    return mPublic;
})();