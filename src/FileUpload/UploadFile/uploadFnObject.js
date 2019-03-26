/*
    upload对外接口
*/

//对外接口暴露标准类
class UploadFnObject{
    constructor(file ,blob, progress, complete , fail){
        this.fileoption = file; //本次上传对象
        this.file = blob;//上传文件的blob对象
        this.progress = progress;//上传中
        this.complete = complete;//完成上传
        this.fail = fail;//上传失败
        //this._onCancel = null //取消上传
    }

    set cancel(_onCancel){
        this.fileoption.hasCancel = true;
        this.fileoption.cancelFn = _onCancel;//给每一项添加取消的逻辑
        //this._onCancel = onCancel
    }
    get cancel(){
        return this.fileoption.cancelFn;
    }
}

export default UploadFnObject;