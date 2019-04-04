/**
 * 文本文件加载组件
 * TextFileLoader与ResourceMap协同完成文本文件的异步加载功能
 */

var gEngine = gEngine || {};

gEngine.TextFileLoader = (function () {
    // 定义待加载的不同类型文本文件，比如XML或纯文本
    var eTextFileType = Object.freeze({
        eXMLFile: 0,
        eTextFile: 1
    });

    /**
     * 异步加载给定文本文
     * @param {string} fileName 文件的唯一地址和文件名
     * @param {number} fileType
     * @param {function} callbackFunction
     */
    var loadTextFile = function (fileName, fileType, callbackFunction) {
        // 验证该地址的文件是否加载过
        if (!(gEngine.ResourceMap.isAssetLoaded(fileName))) {
            // 记录异步加载申请，待完成的加载数量+1
            gEngine.ResourceMap.asyncLoadRequested(fileName);

            // 异步请求服务器端的数据
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if ((req.readyState === 4) && (req.status !== 200)) {
                    alert(fileName + ": 加载错误！[提示：你不能双击index.html来运行程序，必须启动一个web服务器来加载它]");
                }
            };
            req.open("GET", fileName, true);
            req.setRequestHeader("Content-Type", "text/xml");

            req.onload = function () {
                var fileContent = null;
                if (fileType === eTextFileType.eXMLFile) {
                    var parser = new DOMParser();
                    // 这里将xml源文件解析成XMLDocument
                    fileContent = parser.parseFromString(req.responseText, "text/xml");
                } else {
                    fileContent = req.responseText;
                }
                // 记录异步加载完成，待完成加载数量-1，并会触发自定义的回调
                gEngine.ResourceMap.asyncLoadCompleted(fileName, fileContent);

                if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                    callbackFunction(fileName);
                }
            };
            req.send();
        } else {
            if ((callbackFunction !== null) && (callbackFunction !== undefined)) {
                callbackFunction(fileName);
            }
        }
    };

    // 卸载操作
    var unloadTextFile = function (fileName) {
        gEngine.ResourceMap.unloadAsset(fileName);
    };

    var mPublic = {
        loadTextFile: loadTextFile,
        unloadTextFile: unloadTextFile,
        eTextFileType: eTextFileType
    };

    return mPublic;
})();