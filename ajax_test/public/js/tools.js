//工具函数封装
//ajax封装 
function ajax(options) {

    var defaults = {
        method: 'GET',
        url: '',
        data: {},
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function() {},
        error: function() {},
        ...options
    }
    // console.log(defaults);
     let {method,url,data,header,success,error} = defaults;
    var xhr = new XMLHttpRequest();
    var params = '';
    for (var attr in data) {
        //将参数拼接成字符串,格式为:key=value&key=value
        params += attr + '=' + data[attr] + '&';
    }
    //去掉字符串最后一个&
    params = params.substring(0, params.length - 1);
    //如果是get请求,将参数拼接到url后面
    if (method == 'GET') {
        url = url + "?" + params;
    }    
    xhr.open(method,url , true);     

    if(method == 'POST'){
        //用户希望传递的请求头信息类型
        var contentType = header['Content-Type'];
        // console.log('contentType',contentType);
        xhr.setRequestHeader('Content-Type', contentType);
        //如果用户传递的是json类型,需要将json对象转化为字符串
        if (contentType == 'application/json') {
            xhr.send(JSON.stringify(data)) 
        }else{

            xhr.send(params);
        }
     }
    else{
        xhr.send(params);
    }
    
    xhr.onload = function() {
        var contentType = xhr.getResponseHeader('Content-Type');
        console.log('-----',contentType);
        //如果服务器返回的是json类型,需要将json字符串转化为json对象
        var responseText = xhr.responseText;
        if(contentType.includes('application/json')){
            responseText = JSON.parse(responseText);
        }   
        if(xhr.status == 200){
            success(responseText);
        }else{
            error(responseText);
        }
    }


}

// export default ajax;
