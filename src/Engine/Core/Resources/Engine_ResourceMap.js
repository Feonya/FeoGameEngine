"use strict";

var gEngine = gEngine || {};

gEngine.ResourceMap = (function () {
    // 定义一个对象，用于存储每个单一资源
    var MapEntry = function (rName) {
        this.mAsset = rName;
        this.mRefCount = 1; // 1表示该资源只有一个引用；大于1表示有多个引用；0表示没有引用，可以卸载该资源
    };

    // 资源仓库（MapEntry的哈希图容器）
    var mResourceMap = {};

    // 未完成的加载操作数量（等于0时引用mLoadComleteCallback回调）
    var mNumOutstandingLoads = 0;

    // 纹理资源全部加载后的回调
    var mLoadCompleteCallback = null;

    // 定义mLoadCompleteCallback回调的设置和执行支持
    var _checkForAllLoadCompleted = function () {
        if ((mNumOutstandingLoads === 0) && (mLoadCompleteCallback !== null)) {
            // 确保回调只执行一次
            var funToCall = mLoadCompleteCallback;
            mLoadCompleteCallback = null;
            funToCall();
        }
    };

    // 确保在所有加载命令下达之后设置回调
    var setLoadCompleteCallback = function (funct) {
        mLoadCompleteCallback = funct;
        // 在所有加载完成后
        _checkForAllLoadCompleted();
    };

    // 记录异步加载申请
    var asyncLoadRequested = function (rName) {
        mResourceMap[rName] = new MapEntry(rName);
        ++mNumOutstandingLoads;
    };

    // 记录异步加载完成
    var asyncLoadCompleted = function (rName, loadedAsset) {
        if (!isAssetLoaded(rName)) {
            alert("gEngine.asyncLoadCompleted: [" + rName + "] not in map!");
        }
        mResourceMap[rName].mAsset = loadedAsset; // 这里才真正存储了加载的资源的实质性内容
        --mNumOutstandingLoads;
        _checkForAllLoadCompleted();
    };

    // 检测加载状态
    var isAssetLoaded = function (rName) {
        return (rName in mResourceMap);
    };

    // 获取资源
    var retrieveAsset = function (rName) {
        var r = null;
        if (rName in mResourceMap) {
            r = mResourceMap[rName].mAsset;
        }
        return r;
    };

    // 卸载资源方法，返回一次卸载后该资源的剩余引用数
    var unloadAsset = function (rName) {
        var c = 0;
        if (rName in mResourceMap) {
            mResourceMap[rName].mRefCount -= 1;
            c = mResourceMap[rName].mRefCount;
            if (c === 0) {
                delete mResourceMap[rName];
            }
        }
        return c;
    };

    // 增加一个资源引用记录
    var incAssetRefCount = function (rName) {
        mResourceMap[rName].mRefCont += 1;
    };

    var mPublic = {
        // 异步资源加载支持
        asyncLoadRequested: asyncLoadRequested,
        asyncLoadCompleted: asyncLoadCompleted,
        setLoadCompleteCallback: setLoadCompleteCallback,

        //资源仓库支持
        retrieveAsset: retrieveAsset,
        unloadAsset: unloadAsset,
        isAssetLoaded: isAssetLoaded,
        incAssetRefCount: incAssetRefCount
    };

    return mPublic;
})();