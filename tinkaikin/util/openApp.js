    let {id, type} = getParams()
    console.log(id)
    
    let iosOpenUrl='RenWaiRenApp.User.AppStore://UVRUpDataShopModelHome?id=' + id;
    let androidOpenUrl='';
    let iosDownUrl='https://apps.apple.com/cn/app/%E4%B9%B0%E6%9D%A1%E8%A1%97/id1484463343';
    let androidDownUrl="";
    let intent=null;  //安卓原生谷歌浏览器必须传递 Intent 协议地址，才能唤起 APP
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

    function open(){
      if(isIos){  //iOS设备
        // 近期ios版本qq禁止了scheme和universalLink唤起app，安卓不受影响 - 18年12月23日
        // ios qq浏览器禁止了scheme和universalLink - 2019年5月1日
        // ios 微信自 7.0.5 版本放开了 Universal Link 的限制
        if ((isWechat && wechatVersion < '7.0.5') || isQQ || isQQBrowser) {//微信且微信的版本小于7.0.5，或者是qq打开，或者是qq浏览器打卡
          window.top.location.href = iosOpenUrl;
        } else if (iosVersion < 9) { //ios9版本以下
          const iframe = document.createElement('iframe');
          iframe.frameborder = '0';
          iframe.src = iosOpenUrl;
          iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
          document.body.appendChild(iframe);
        } else {
          window.top.location.href = iosOpenUrl;
        }
      }else { //android设备
        if(isWechat){ //android的微信
          window.top.location.href = androidOpenUrl;
        }else if(isOriginalChrome){ //android的原生浏览器
          if (typeof intent !== 'undefined') {  //安卓原生谷歌浏览器必须传递 Intent 协议地址，才能唤起 APP
            window.top.location.href = androidOpenUrl;
          } else {  // scheme 在 andriod chrome 25+ 版本上必须手势触发
            const tagA = document.createElement('a');
            tagA.setAttribute('href', androidOpenUrl);
            tagA.style.display = 'none';
            document.body.appendChild(tagA);
            tagA.click();  
          }
        }else{  //android设备其他应用
          const iframe = document.createElement('iframe');
          iframe.frameborder = '0';
          iframe.src = androidOpenUrl;
          iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
          document.body.appendChild(iframe);
        }
      }
    }
 
    
 
    console.log(1234)

    document.getElementById('openApp').addEventListener("click",()=>{
      open()
      checkOpen(()=>{
        if(isIos){
          window.top.location.href = iosDownUrl;
        }else{
          window.top.location.href = androidDownUrl;
        }
      },2000);
    })
    function checkOpen(failCallback, timeout=2000) {
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
  