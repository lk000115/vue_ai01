//工具函数封装
//ajax封装 
function ajax(options) {
    var xhr = new XMLHttpRequest();
    var params = '';
    for (var attr in options.data) {
        params += attr + '=' + options.data[attr] + '&';
    }
    params = params.substring(0, params.length - 1);
    if (options.method == 'GET') {
        options.url = options.url + "?" + params;
    }    
    xhr.open(options.method, options.url , true);     

    if(options.method == 'POST'){
        //用户希望传递的请求头信息类型
        var contentType = options.header['Content-Type'];
        xhr.setRequestHeader('Content-Type', contentType);
        if (contentType == 'application/json') {
            xhr.send(JSON.stringify(options.data)) ; 
        }else{
            xhr.send(params);
        }
    }else{
        xhr.send();
    }
    
    xhr.onload = function() {
        var contentType = xhr.getResponseHeader('Content-Type');
        // console.log(contentType);
        var responseText = xhr.responseText;
        if(contentType.includes('application/json')){
            responseText = JSON.parse(responseText);
        }   
        if(xhr.status == 200){
            options.success(responseText,xhr);
        }else{
            options.error(xhr.responseText,xhr);
        }
    }

}

// module.exports = {
//     ajax,
// }

