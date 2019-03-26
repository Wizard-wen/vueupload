/**
 * Created by njz on 2017/4/20.
 */
var imageUtil = {
    //将base64转为blob
    dataURL2Blob: function (dataurl) {
        var arr = dataurl.split(',');
        var type = arr[0].match(/:(.*?);/)[1];
        var bin = atob(arr[1]);
        //创建空的Uint8Array
        var buffer = new Uint8Array(bin.length);
        //将图像数据逐字节放入Uint8Array中
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        //利用Uint8Array创建Blob对象
        var blob = new Blob([buffer.buffer], {type: type});
        return blob;
    },
    //将base64转为File
    dataURL2File: function (dataurl, fileName) {
        var arr = dataurl.split(',');
        var type = arr[0].match(/:(.*?);/)[1];
        var bin = atob(arr[1]);
        //创建空的Uint8Array
        var buffer = new Uint8Array(bin.length);
        //将图像数据逐字节放入Uint8Array中
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        //利用Uint8Array创建Blob对象
        var file = new File([buffer.buffer], fileName, {type: type});
        return file;
    },
    //将Blob转dataURL
    blob2DataURL: async function (blob) {
        //将blob转为base64
        function _blob2DataURL(blob) {
            return new Promise((resolve, reject) => {
                //使用reader读取图片
                var reader = new FileReader();
                reader.onload = function (e) {
                    resolve(this.result)
                };
                reader.readAsDataURL(blob);
            })
        }


        var dataURL = await _blob2DataURL(blob);
        return dataURL;
    },
    //将dataURL转img控件对象
    dataURL2Img: function (dataURL) {
        return new Promise((resolve, reject) => {
            var img = document.createElement('img');
            img.onload = function () {
                resolve(img)
            };
            img.src = dataURL;
        })
    },
    //获取图片大小
    getImageSize: function (dataURL) {
        return new Promise((resolve, reject) => {
            let img = document.createElement("IMG");
            //图片加载后
            img.onload = function(){
                resolve({
                    width: img.width,
                    height: img.height,
                })
            }
            //加载失败
            img.onerror = function(err){
                reject(err)
            }
            //图片路径
            img.src = dataURL
        })
    },
    //裁剪图片
    /*
        width : 图片框宽
        height : 图片框高
        dataUrl : 原始图片dataUrl信息
    */
    compressPicture : async function(picwidth, dataUrl){

        let originalImageSize =  await imageUtil.getImageSize(dataUrl)//原始图片尺寸

        let width = originalImageSize.width

        let height = originalImageSize.height

        let originalimg =  await imageUtil.dataURL2Img(dataUrl) //获取当前图片对象

        let canvas = document.createElement('canvas');

        if(width > height){
            let createHeight = parseInt(height * picwidth / width)
            
            canvas.width = picwidth;
            canvas.height = createHeight;

            //上下距离
            let xWidth = parseInt((picwidth - createHeight) / 2)
            
            var ctx = canvas.getContext("2d");
        
            ctx.drawImage(originalimg, 0, xWidth, picwidth, createHeight);


        } else if(width < height) {
            let createWidth = parseInt(width * picwidth / height)
            
            canvas.width = createWidth;
            canvas.height = picwidth;

            //左右距离
            let yWidth = parseInt((picwidth - createWidth) / 2)

            var ctx = canvas.getContext("2d");
        
            ctx.drawImage(originalimg, yWidth, 0, createWidth, 100);
        } else {
            
            canvas.width = picwidth;
            canvas.height = picwidth;
            
            var ctx = canvas.getContext("2d");
            
            ctx.drawImage(originalimg, 0, 0, picwidth, picwidth);
        }
        return {
            dataurl : canvas.toDataURL("image/jpeg", 0.9),
            size : {
                height : canvas.height,
                width : canvas.width
            }
        }
    }
}


export default imageUtil;
