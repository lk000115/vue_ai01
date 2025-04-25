//工具函数封装
//ajax封装 
function ajax(options) {
    var xhr = new XMLHttpRequest();
    var params = '';
    for (var attr in options.data) {
        param += attr + '=' + options.data[attr] + '&';
    }
    params = params.substring(0, params.length - 1);
    if (options.method == 'GET') {
        options.url = options.url + "?" + params;
    }    
    xhr.open(options.method, options.url , true);     

    if(options.method == 'POST'){
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }else{
        xhr.send();
    }
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            options.success(xhr.responseText);
        }
    }

}

// module.exports = {
//     ajax,
// }

