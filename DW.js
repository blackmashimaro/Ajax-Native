/*
    Created by Don on 2017/5/22
*/

//全局命名空间
let DW = {};

//  封装ajax
DW.ajax = function (o) {
    /*
        ajax配置项
        @param {string}    option.type         http连接方式,包括POST和GET两种方式
        @param {string}    option.url          发送请求的URL
        @param {string}    option.dataType     数据类型
        @param {object}    option.data         发送的参数，格式为对象类型
        @param {boolean}   option.async        是否为异步请求，true为异步，false为同步
        @param {function}  option.beforeSend   发送前需要执行的回调函数 
        @param {function}  option.seccess      发送并接受成功调用的回调函数
        @param {function}  option.complete     发送后需要执行的回调函数
        @param {function}  option.error        发送失败时执行的回调函数
        //@param {function}  option.onabort      发送被中断时执行的回调函数
        //@param {function}  option.ontimeout    发送超时时执行的回调函数  
    */

    //配置参数
    var xhr, type, url, async, dataType, data;

    if (typeof(o) != 'object') return false;

    type = o.type == undefined ? 'POST' : o.type.toUpperCase();
    url = o.url == undefined ? window.location.href : o.url;
    async = o.async == undefined ? true : o.async;
    dataType = o.dataType == undefined ? 'JSON' : o.dataType.toUpperCase();
    data = o.data == undefined ? {} : o.data;

    //数据格式化
    function formatParams() {
        var str = '', len = null;
        var arr = Object.keys(data);
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                str += i + "=" + data[i] + "&";
            }
        }
        len = str.length - 1;
        str = str.substring(0, len);
        console.log(str);
        return str;
    }

    //创建xhr对象
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xmlHtpp = new ActiveXObject('Microsoft.xhr');
    }

    //请求方式
    if (type == 'GET') {
        data = formatParams();
        xhr.open(type, url + "?" + data, async);

        //发送前执行的回调函数
        if (typeof (o.beforeSend) == "function") o.beforeSend(xhr);

        xhr.send();

        //发送后执行的回调函数
        if (typeof (o.complete) == "function") o.complete(xhr);

    } else if (type == "POST") {
        data = formatParams();
        console.log(data);
        xhr.open(type, url, async);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=utf-8");

        if (typeof (o.beforeSend) == "function") o.beforeSend(xhr);

        xhr.send(data);

        if (typeof (o.complete) == "function") o.complete(xhr);

        //处理状态
        xhr.onreadystatechange = function () {

            //判断状态
            if (xhr.status != 200) {
                o.error && o.error(xhr.status + ' 错误');
                return
            }
            if (xhr.status == 200 && xhr.readyState == 4) {
                var response = xhr.responseText;
                o.success && o.success(response);
            }
        }
    }
}