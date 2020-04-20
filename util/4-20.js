/**
 * 格式统一如下
 * // 时间 + 使用场景
 * 
 * let 中文说明 = function 英文名(参数){
 * // 问题描述 + 参数说明
 *  ...函数体
 * }
 */


// 4-20 h5唤起app用到
let getParams = function 获取URL参数返回对象(){
    let params = {} 
    if(window.location.search){
        let query = window.location.search.substring(1).split("&")
        query.forEach(e=>{
            let eArr = e.split("=")
            params[eArr[0]] = eArr[1] || ''
        })
    }
    return params
}

// 4-20 移动端开发 动态计算rem值 设计稿 750px  100px的宽 写成 1rem
let computeRem = function 动态计算REM值(){
    // 为什么不写成 100px = 100rem? 因为 字体最小值为12px 不可能换成0.12px
    (function () {
        function w() {
            /*document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + "px";*/
            var r = document.documentElement; //根元素html
            var a = r.clientWidth;
            //按照750的设计稿换算
            if (a > 750) {
                a = 750;
            }
            rem = a / 7.5;
            r.style.fontSize = rem + "px";
        }
        var t;
        w();
        window.addEventListener("resize", function () {
            clearTimeout(t);
            t = setTimeout(w, 300);
        }, false);
    })();
}

// 4-20 h5唤起app使用到 获取当前是什么浏览器
let getNowBrowser = function 浏览器信息(){
    const ua = window.navigator.userAgent || '';
    const isAndroid = /android/i.test(ua);
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isWechat = /micromessenger\/([\d.]+)/i.test(ua);
    const isWeibo = /(weibo).*weibo__([\d.]+)/i.test(ua);
    const isQQ = /qq\/([\d.]+)/i.test(ua);
    const isQQBrowser = /(qqbrowser)\/([\d.]+)/i.test(ua);
    const isQzone = /qzone\/.*_qz_([\d.]+)/i.test(ua);  
    const isOriginalChrome = /chrome\/[\d.]+ Mobile Safari\/[\d.]+/i.test(ua) && isAndroid;// 安卓 chrome 浏览器，很多 app 都是在 chrome 的 ua 上进行扩展的,即安卓的应用app很多都是内置chrome浏览器
    // chrome for ios 和 safari 的区别仅仅是将 Version/<VersionNum> 替换成了 CriOS/<ChromeRevision>
    // ios 上很多 app 都包含 safari 标识，但它们都是以自己的 app 标识开头，而不是 Mozilla
    const isSafari = /safari\/([\d.]+)$/i.test(ua) && isIos && ua.indexOf('Crios') < 0 && ua.indexOf('Mozilla') === 0;
 
    
    const wechatVersion = navigator.appVersion.match(/micromessenger\/(\d+\.\d+\.\d+)/i)[1]//获取 微信 版本号
    
    let iosVersion = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);  //获取 ios 大版本号


    iosVersion=parseInt(iosVersion[1], 10);
    const ios9 = iosVersion < 9
}

// 4-20 h5唤起app 使用iframe换起app
let createdIframe = function 创建IFRAME(tinUrl){
    /**
     * 
     * @param {Strin} tinUrl 要打开的src地址
     */
    const iframe = document.createElement('iframe');
    iframe.frameborder = '0';
    iframe.src = tinUrl;
    iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
    document.body.appendChild(iframe);
}

// 4-20 h5唤起app 使用a换起app
let createdA = function 创建A标签(tinUrl){
    /**
     * @param {Strin} tinUrl 要打开的src地址
     */
    const tagA = document.createElement('a');
    tagA.setAttribute('href', tinUrl);
    tagA.style.display = 'none';
    document.body.appendChild(tagA);
    tagA.click(); 
}

// 4-20 h5唤起app 进入后台清除定时器/否则就执行回调
let checkOpenAA = function 进入后台成功清除定时器否则执行回调(failCallback, timeout=2000){
    checkOpen(failCallback, timeout=2000)

    
    function checkOpen(failCallback, timeout=2000){
        const visibilityChangeProperty = getVisibilityChangeProperty();
        const timer = setTimeout(() => {
            const hidden = isPageHidden();  //判断页面是否隐藏（进入后台）
            if (!hidden) {  //没有进入后端，说明唤起失败，唤起失败，就执行失败的函数
                failCallback();
            }
        }, timeout);
    
        if (visibilityChangeProperty) {
            document.addEventListener(visibilityChangeProperty, () => {
                clearTimeout(timer);
            });
    
            return;
        }
    
        window.addEventListener('pagehide', () => { //页面关闭时 清除定时器
            clearTimeout(timer);
        });
    }

    /**
     * 获取判断页面 显示|隐藏 状态改变的属性，webkitvisibilitychange/mozvisibilitychange/msvisibilitychange/ovisibilitychange/visibilitychange文档的可见性改变时触发
     */
    function getVisibilityChangeProperty() {
        const prefix = getPagePropertyPrefix();
        if (prefix === false) return false;
   
        return `${prefix}visibilitychange`;
    }

    /**
     * 获取页面隐藏属性的前缀
     * 如果页面支持 hidden 属性，返回 '' 就行
     * 如果不支持，各个浏览器对 hidden 属性，有自己的实现，不同浏览器不同前缀，遍历看支持哪个
     */
    function getPagePropertyPrefix() {
        const prefixes = ['webkit', 'moz', 'ms', 'o'];
        let correctPrefix;
        if ('hidden' in document) return '';
        prefixes.forEach((prefix) => {
            if (`${prefix}Hidden` in document) {
            correctPrefix = prefix;
            }
        });

        return correctPrefix || false;  //返回结果是'webkit', 'moz', 'ms', 'o' ,false
    }
    /**
     * 判断页面是否隐藏（进入后台）
     */
    function isPageHidden() {
        const prefix = getPagePropertyPrefix();
        if (prefix === false) return false;

        const hiddenProperty = prefix ? `${prefix}Hidden` : 'hidden';
        return document[hiddenProperty];  //返回结果是document.hidden，document.mozHidden，document.msHidden， document.webkitHidden，document.oHidden,是判断页面是否隐藏（进入后台）
    }
}