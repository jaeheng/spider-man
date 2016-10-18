var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 1;
var url = "http://www.beautyleg.com/photo/show.php?no=";

function fetchPage(x) {
    startRequest(x);
}

function startRequest(x) {
    // 采用http模块向服务器发起一次get请求
    http.get(x, function (res) {
        var html = ''; // 用来存储请求页面的html内容

        res.setEncoding('utf-8');

        // 监听data事件， 每次读取一块数据
        var times = 0;
        res.on('data', function (chunk) {
            html += chunk;
            times ++;
            console.log('loading...' + times);
        });
        // 监听end事件， 都读取完毕执行回调函数
        res.on('end', function () {
            var $ = cheerio.load(html); // 采用cheerio模块解析html
            var imgs = $('.table_all').first().find('a');
            saveImgs(imgs);

            if(i < 78){
                i++;
                fetchPage(encodeURI(url +i));
            }else{
                console.log('success !!');
            }
        });

    })
}

// 保存图片
function saveImgs(imgs) {
    var j = 0;
    var len = imgs.length;
    for(j; j < len; j++){
        var url = imgs[j].attribs.href + "\r\n";
        fs.appendFile('./images.txt', url, 'utf-8', function (err) {
            if(err){
                console.log(err);
            }
        })
    }
    console.log("No." + i + " complated\r\n");
}

fetchPage(url + i);