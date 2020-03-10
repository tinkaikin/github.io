
function getParams(){
    let params = {} 
    let query = window.location.search.substring(1).split("&")
    query.forEach(e=>{
        let eArr = e.split("=")
        params[eArr[0]] = eArr[1] || ''
    })
   return params
}

/*
http://www.runoob.com/index.php?id=1&image=awesome.jpg
调用 getQueryVariable("id") 返回 1。

调用 getQueryVariable("image") 返回 "awesome.jpg"。
*/ 