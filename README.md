> 在H5中唤起APP原理：通过Scheme协议打开APP
>
> Scheme的组成：scheme:path[#fragment]

#### 一、直接使用协议打开APP，打开失败进入下载页

```javascript
<div class="btn" onClick="openApp">打开App</div>

function openApp() {
    // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP
    // 每个APP有自己scheme协议名称，例如微信是weixin:// 
    // 否则跳转APP下载页
    var ifr = document.createElement('iframe');
    ifr.src = 'APP协议://打开页面路径';
    ifr.style.display = 'none';
    document.body.appendChild(ifr);
    window.setTimeout(function(){
        downloadAPP()
        document.body.removeChild(ifr);
    },2000)
}

function downloadAPP() {
    // 判断是Android还是iOS
    const u = navigator.userAgent;
    let system = '';
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        system = 'Android';
    } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        system = 'iOS';
    } else {
        system = 'unknown';
    }
    // 根据系统不同，跳转不同的下载APP地址
    if(system === 'Android') {
        // TODO：这里还可以根据手机厂商的不同跳转各自厂商的应用商店
        window.location = "安卓下载地址"
    } else if(system === 'iOS') {
        window.location = "iOS商店地址"
    }
}
```

#### 二、使用第三方插件，原理还是一样的

[https://github.com/suanmei/ca...](https://github.com/suanmei/callapp-lib)，具体使用见github

```javascript 
import CallApp from 'callapp-lib';
// 或者直接引
// <script src="https://unpkg.com/callapp-lib@2.1.5/dist/index.umd.min.js"></script>
function openApp(){     

    const option = {

      scheme: {

        protocol: 'matchu',

      },

      appstore: 'appstore的应用地址',

      yingyongbao: '应用宝地址',

      fallback: '打开失败后的页面',

      timeout: 3000,

    };

    const lib = new CallApp(option);

    lib.open({

        path: '打开APP的指定页面',

    });  

}
```



判断微信浏览器

```js
 var u = navigator.userAgent;

            if (/MicroMessenger/gi.test(u)) {

            document.getElementById("mc").style.display = 'block';

            return;

        }
```

