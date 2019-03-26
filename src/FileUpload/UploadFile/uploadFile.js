
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

//内部操作索引初始值
var uuid = 0;

/*
    渲染用户已有图片；
    创建新图片
*/

export default class UploadFile {

    constructor(file, isCompleted = false){
        //id
        this.id = file.id ||'';

        //**内部操作的uuid
        this.uuid = file.uuid != null ? file.uuid : uuid++;

        //默认用附件名做名字
        this.name = file.name;

        //url
        this.url = file.url || "";
        
        //用户自定义数据
        this.data = file.data || [];
        
        //是否已经数据库
        this.isSaved = file.isSaved || false;
        
        //**上传的进度
        this.progress = 0;
        
        //**是否上传完成
        this.isCompleted = isCompleted;

        //**是否删除
        this.isDelete = false;

        //是否可以取消
        this.hasCancel = file.hasCancel || false;

        //取消函数
        this.cancelFn = file.cancelFn || null;
    }

    //获取扩展名
    getExtensionName(){
        return (/\.(\w+)$/.exec(this.name)[1] || "").toUpperCase();
    }
}
