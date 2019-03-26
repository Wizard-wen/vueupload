<template>
    <div class="ihm-upload" @mouseup="mouseup" @mouseleave="mouseup" >

        <!-- 上传框 -->
        <div class="ihm-upload_add" @drop="getFiles" @dragleave="dragleave" @dragover="dragover" v-show="fileList.length < maxCount">
            <label class="ihm-upload_drag" :class="{'ihm-upload_drag_hover': isHover}">
                <span class="ihm-upload_drag-icon">+</span>
                <p class="ihm-upload_drag_note">{{uploadButtonText}}</p>
                <input type="file" style="display: none" multiple @change="getFiles"/>
            </label>
        </div>

        <!-- 图片列表 -->
        <ul class="ihm-upload_list">
            <li class="ihm-upload_item"
                v-for="(item , index) in fileList"
                :key="item.uuid"
                :class="{'ihm-upload_item_uncomplete': !item.isCompleted}"
                :title="item.name">

                <!-- 拖放 -->
                <div :ref="'dragging_' + item.uuid"
                     @mousedown="mousedown(item.uuid, $event)"
                     @mousemove="mousemove($event)"
                     @mouseover="mouseenter(item.uuid)"
                     class="ihm-upload_item_frame"
                     :class="{'ihm-upload_item_frame_dragging': item.uuid == draggingId}">

                    <div class="ihm-upload_item-icon" :style="{
                        'top':  item.uuid == draggingId ? `${moveY}px` : '',
                        'left':  item.uuid == draggingId ? `${moveX}px` : ''}">

                        <img draggable="false" :src="item.url" />
                    </div>
                </div>

                <div class="ihm-upload_item-bottom">

                    <template v-if="!item.isCompleted">
                        <!--上传进度条-->
                        <progress class="ihm-upload_item_progress" :value="item.progress" max="100" ></progress>
                        <!-- 取消 -->
                        <a class="ihm-upload_item-button ihm-upload_item-button_delete"
                        @click="cancelFn(item)"
                        v-if="item.hasCancel">
                            <span>取消</span>
                        </a>
                    </template>

                    <template v-else>
                        <!--附件名-->
                        <div class="ihm-upload_item_name">{{item.name}}</div>

                        <!-- 查看 -->
                        <a class="ihm-upload_item-button"
                            @click="viewFn(item.url)"
                            v-if="typeof viewable == 'function' ? viewable(item , index) : !!viewable">
                            <span>查看</span>
                        </a>

                        <!-- 删除 -->
                        <a class="ihm-upload_item-button ihm-upload_item-button_delete"
                            @click="deleteFn(item.uuid)"
                            v-if="typeof deletable == 'function' ? deletable(item , index) : !!deletable" >
                            <span>删除</span>
                        </a>
                    </template>

                </div>
            </li>

            <li class="ihm-upload_item ihm-upload_item_empty" :key="i" v-for="i in 10"></li>
        </ul>
    </div>
</template>

<style rel="stylesheet/scss" lang="scss">
    .ihm-upload{
        position: relative;
        // overflow-x: hidden;
        overflow-y: visible;
    }

    /*可拖拽的上传部分*/
    .ihm-upload_add{
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
        margin: 0px; padding: 0px;
    }
    .ihm-upload_drag{
        display: block;
        box-sizing: border-box;
        margin: 0px;
        padding: 20px 0px;
        border: 1px dashed rgb(221, 222, 225);
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s ease;
    }
    .ivu-form-item-error .ihm-upload_drag{
        border: 1px dashed #ed3f14;
    }
    .ihm-upload_drag:hover{
        border: 1px dashed #2d8cf0;
    }
    .ivu-form-item-error .ihm-upload_drag:hover{
        border: 1px dashed #ed3f14;
    }
    .ihm-upload_drag:hover{
        border: 1px dashed #2d8cf0;
    }
    .ihm-upload_drag_hover{
        border-color: #069;
        box-shadow: inset 2px 2px 4px rgba(0, 0, 0, .5);
        transition: box-shadow .1s;
        color: #333;
    }
    .ihm-upload_drag-icon{
        box-sizing: border-box;
        display: inline-block;
        // speak: none;
        text-rendering: auto;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        font-size: 52px;
        color: rgb(51, 153, 255);
        transition: transform .1s;

        .ihm-upload_drag_hover &{
            transform: translate(2px, 2px);
        }
    }
    .ihm-upload_drag_note{
        box-sizing: border-box;
        margin: 5px;
        padding: 0px;
        font-size: 14px;
        transition: transform .1s;

        .ihm-upload_drag_hover &{
            transform: translate(2px, 2px);
        }
    }

    /*附件列表部分*/
    .ihm-upload_list{
        margin: 0 -15px;
        padding: 0 0 10px 0;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .ihm-upload_item {
        width: 100px;
        margin: 10px 15px 0 15px;
        user-select: none;
    }
    .ihm-upload_item_uncomplete{
        position: relative;
    }
    .ihm-upload_item_uncomplete::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background: rgba(32,32,32,.6);
        z-index: 100;
    }
    /*底部*/
    .ihm-upload_item-bottom{
        height: 40px;
        text-align: center;
    }
    .ihm-upload_item-button{
        font-size: 12px;
        line-height: 1.5;
        margin: 0px;
        overflow: visible;
        padding: 2px 7px;
        vertical-align: middle;
        touch-action: manipulation;
        cursor: pointer;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(45, 140, 240);
        white-space: nowrap;
        user-select: none;
        border-radius: 32px;
        transition: color 0.2s linear, background-color 0.2s linear, border 0.2s linear; color: rgb(255, 255, 255);
        background-color: rgb(45, 140, 240);
        outline: 0px;

        & span{
            // -webkit-tap-highlight-color: transparent;
            box-sizing: border-box;
        }

        &.ihm-upload_item-button_delete {
            color: #fff;
            background-color: #ed3f14;
            border-color: #ed3f14;
        }
    }
    /*上传进度条*/
    .ihm-upload_item_progress{
        width: 100px;
        height: 10px;
        margin: 5px 0;
        box-sizing: border-box;
    }
    .ihm-upload_item_progress::-webkit-progress-bar
    {
        background-color:#d7d7d7;
    }
    .ihm-upload_item_progress::-webkit-progress-value
    {
        background-color:orange;
    }
    /*附件名字*/
    .ihm-upload_item_name{
        line-height: 20px;
        height: 20px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        text-align: center;
        white-space: nowrap;
        word-break: break-all;
    }
    /*占位的元素*/
    .ihm-upload_item_empty {
        margin-top: 0;
    }

    /*用于触摸拖动的筐子*/
    .ihm-upload_item_frame{
        width: 100px;
        height: 100px;
    }
    /*附件的图片*/
    .ihm-upload_item-icon{
        display: flex;
        width: 100px;
        height: 100px;
        line-height: 100px;
        border: 1px solid #DFDFDF;
        position: relative;
        user-select: none;
        box-sizing: border-box;
        cursor: pointer;
        justify-content: center;
        align-items: center;

        & > div{
            width: 50px;
            height: 70px;
            border: 3px solid #DFDFDF;
            position: absolute;
            top: 10px;
            left: 10px;
            border-top-left-radius: 10px;
            background: #eee;
        }
        & > span{
            line-height: 30px;
            text-align: center;
            color: #fff;
            background: red;
            position: relative;
            z-index: 1;
            left: 10px;
            top: 5px;
            padding: 2px 10px;
        }
        & > img{
            max-width: 100%;
            max-height: 100%;
        }
        & > svg{
            width: 100%;
            height: 100%;
        }
    }
    .ihm-upload_item_frame_dragging{
        border: 1px dashed #999;
        box-sizing: border-box;
        & .ihm-upload_item-icon{
            cursor: move;
            position: absolute;
            z-index: 999;
            transition: transfrom 0.1s;
            opacity: 0.8;
        }
    }
</style>



<script>
    //附件信息类
    import UploadFile from './UploadFile/uploadFile';
    //upload方法回调类
    import UploadFnObject from './UploadFile/uploadFnObject';
    //图片转换
    import imageUtil from './util/imageUtil';
    //文件大小
    import renderSize from './util/renderSize';
    //默认图标
    import attachment from './icon/attachment.png'
    //事件广播插件
    import Emitter from '../dispatch.js'

    //阻止浏览器默认行为，即四个事件（拖离、拖后放、拖进、拖来拖去），这样能够阻止浏览器默认将附件打开的行为
    ['dragleave','drop','dragenter','dragover'].forEach(name=>{
        document.addEventListener(name, function (e) {
            e.preventDefault();
        })
    })
    //#6149初次加载数据
    export default {
        //父组件v-model
        model : {
            prop : 'value',
            event : 'change'
        },
        //多级父组件传播事件
        mixins: [ Emitter ],
        data () {
            return {
                //数据循环列表
                fileList :[],
                //
                in_count : 0,
                //是不有文件被拖动到上传按钮上
                isHover: false,
                //被拖拽移动的附件index
                draggingId : -1,
                //控件偏移x
                moveX: 0,
                //控件偏移y
                moveY: 0,
            }
        },
        watch : {
            //父组件自主更改数据，子组件监听其变化
            value(newval , oldval){
                this.fileList = this.value.map((item) => {
                    //添加数据
                    let uploadFile = new UploadFile(item, true);
                    return uploadFile;
                });

                //#6149
                if(this.in_count == 0){
                    this.$emit('change' , this.fileList);
                    //事件向上广播
                    this.dispatch('FormItem', 'on-form-change', this.fileList);
                    this.in_count++;
                }
            },
        },
        //接收用户配置的参数
        props: {
            /***********初始数据***************/
            //v-model父组件绑定的数据
            value :{
                default : function(){
                    return []
                },
                type : Array
            },
            /************配置项****************/
            //上传文件的大小，KB
            fileSizeLimit: {
                default: 1024 * 5,
                type: Number,
            },
            //合法的后缀名，空数组表示什么类型都有效
            extensions: {
                default: function(){
                    return []
                },
                type: Array,
            },
            //附件的数量
            maxCount : {
                type: Number,
                default: Infinity,
            },
            //上传按钮的文字
            uploadButtonText : {
                type: String,
                default: ''
            },
            //是否可以删除
            deletable : {
                type : [Boolean, Function],
                default : false
            },
            //是否展示
            viewable : {
                type : [Boolean, Function],
                default : false
            },
            //是否可以排序
            sortable : {
                type : Boolean,
                default : false
            },
            //上传附件时候的校验
            checkAttach : {
                default: null,
                type: Function,
            },
        },
        methods: {

            //触发父组件查看函数
            viewFn(itemurl){

                this.$emit('view' , itemurl)
            },

            //触发父组件删除函数
            deleteFn(item){ 
                this.$emit('delete' , item)
            },

            //触发父组件取消事件
            cancelFn(item){

                //执行删除函数
                item.cancelFn();

                //直接删除这个上传项
                this.removeUploadFileById(item.uuid)
            },

            //拖动上传的离开事件
            dragleave: function(e){
                e.preventDefault();
                this.isHover = false;
            },

            //拖动上传的进入事件
            dragover: function(e){
                e.preventDefault();
                this.isHover = true;
                e.dataTransfer.effectAllowed = "move";
            },

            //鼠标下落
            mousedown: function (uuid, $event) {
                if(!this.sortable){
                    return false;
                }

                //鼠标落下记录下被移动元素的uuid
                this.draggingId = uuid;

                var a = $event.currentTarget.offsetLeft;

                //鼠标距离视口距离 - 元素的定位偏移量
                this.clientX = $event.clientX - $event.currentTarget.offsetLeft;
                this.clientY = $event.clientY - $event.currentTarget.offsetTop;
            },

            //鼠标位移
            mousemove: function ($event) {

                //鼠标到视口边界距离 - 元素到视口边界
                this.moveX = $event.clientX - this.clientX;
                this.moveY = $event.clientY - this.clientY;

                //鼠标到视口边界距离
                var x = $event.clientX;
                var y = $event.clientY;

                if(this.draggingId != -1){

                    Object.keys(this.$refs).forEach( key => {

                        //startswith是es6的方法

                        if( key.startsWith("dragging_") ){

                            var el = this.$refs[key][0];

                            let id1 = key.replace("dragging_", '');

                            //判断是不是移出边框了

                            if(id1 == this.draggingId || !el)

                                return;

                            var clientRect = el.getBoundingClientRect();

                            if( clientRect.left < x &&  x < (clientRect.left + clientRect.width) &&
                                clientRect.top < y && y < (clientRect.top + clientRect.height)){

                                //交换
                                this.tempExchangeFile(this.draggingId, id1);

                            }
                        }
                    })
                }
            },

            //鼠标抬起
            mouseup: function () {

                this.draggingId = -1;
                this._tempId = null;
            },

            //鼠标进入
            mouseenter: function (otherId) {
                if(this.draggingId != -1 && otherId != this.draggingId){
                    this.tempExchangeFile(this.draggingId, otherId)
                }
            },

            //交换数组中某两个附件的位置
            exchangeFile(id1, id2){
                var index1, index2;
                for(let i = 0; i < this.fileList.length; i++){
                    if( this.fileList[i].uuid == id1){
                        index1 = i;
                    }
                    if( this.fileList[i].uuid == id2){
                        index2 = i;
                    }
                }

                var fileList = [...this.fileList];

                var temp = fileList[index1];
                fileList[index1] = fileList[index2];
                fileList[index2] = temp;

                this.fileList = fileList;
            },

            /**
             * 临时交换数组中某两个附件的位置
             * @param id1           当前节点id
             * @param id2           临时交换的节点id
             */
            tempExchangeFile(id1, id2){

                if(this._tempId != null ){
                    if(this._tempId == id2){
                        //交换回来，则归位
                        this.exchangeFile(id1, this._tempId);
                        this._tempId = null;
                    } else {
                        //如果存在临时节点，将其归位
                        this.exchangeFile(id1, this._tempId);
                        //缓存临时交换的节点
                        this._tempId = id2;
                        this.exchangeFile(id1, id2);
                    }
                } else {
                    //如果一切没有临时交换id，将当期临时交换的节点id缓存，交换节点
                    this._tempId = id2;
                    this.exchangeFile(id1, id2);
                }
            },

            //step1----拖动/点击 上传按钮时候，选择可以上传的控件
            getFiles : async function(e){

                //取消默认浏览器拖拽效果

                e.preventDefault();

                //获取文件对象  确认是拖拽还是点击上传 file对象

                var thisuploadfile = e.target.files || e.dataTransfer.files;

                this.validateFile(thisuploadfile)
                e.srcElement.value = '';
            },
            //step2
            async validateFile(thisuploadfile){
                //如果没有文件
                
                if(thisuploadfile.length == 0){
                    return false;
                }
                //定义检测变量

                var hasAboveSizeFile = false,      //是否有附件超出大小限制
                    hasErrorExtensionFile = false, //是否有附件扩展名错误
                    hasExceedMaxCount = false,     //是否超过了附件的最大限制
                    hasUserDefineFault = false;    //存在用户自定义错误

                for(let i = 0; i < thisuploadfile.length; i++){

                    let file = thisuploadfile[i];
                    // console.log(file,'file')
                    //校验附件大小是否超过限制（第一优先级）
                    if(file.size < this.fileSizeLimit * 1024){

                        //校验附件扩展名
                        //获取文件扩展名
                        var fileArrary = /\.(\w+)$/.exec(file.name),
                            extensionName;

                        if(!Array.isArray(fileArrary)){
                            this.isHover = false;
                            this.$Message.info({
                                content: '请不要拖入文件夹',
                                duration: 5,
                                closable: true
                            });

                            return false;
                        }else{
                            extensionName = (fileArrary[1] ||  "").toUpperCase();
                        }
                        
                        //如果extensions不是数组，或者是空数组，则不校验。否则做扩展名校验（第二优先级）
                        if(!Array.isArray(this.extensions) || !this.extensions.length || this.extensions.filter(name=>name && name.toString().toUpperCase() == extensionName).length) {

                            //定义自定义校验参数
                            let result = true;

                            //fileInfo返回的是什么
                            let fileInfo = await this.getFileInfo(file);


                            //执行自定义校验函数
                            if (typeof this.checkAttach == 'function' && this.checkAttach != null) {

                                result =  this.checkAttach(file).isPass;

                                //返回错误原因

                                var resultMess = this.checkAttach(file).failmessage;

                                if( result == false){

                                    hasUserDefineFault = true;
                                }

                            }else{
                                result = true;
                            }

                            //执行完自定义校验函数后的校验逻辑
                            if (result !== false) {

                                //附件数量校验（第三优先级）

                                if(this.fileList.length < this.maxCount){
                                    console.log(this.fileList.length)
                                    await this.upload(file, fileInfo.icon);

                                } else {

                                    hasExceedMaxCount = true; //超出最大限制
                                }
                            }
                        }else {
                            hasErrorExtensionFile = true;
                        }
                    } else {
                        hasAboveSizeFile = true;
                    }
                }

                //显示错误
                let msg = [];

                if(thisuploadfile.length > 1){
                    if(hasAboveSizeFile){
                        msg.push(`存在超过最大上传限制的附件，您不能上传大于${renderSize(this.fileSizeLimit * 1024)}的附件！`);
                    }
                    if(hasErrorExtensionFile){
                        msg.push(`存在扩展名错误的附件，您必须上传扩展名${this.extensions.length > 1 ? `必须是“${this.extensions.join(',')}”中的一种！` : `必须是“${this.extensions}”类型！`}`);
                    }
                    //自定义校验函数
                    if(hasUserDefineFault){
                        msg.push('存在用户自定义错误，错误为'+resultMess);
                    }
                } else {
                    if(hasAboveSizeFile){
                        msg.push(`该附件大小超过${renderSize(this.fileSizeLimit * 1024)}，不能上传！`);
                    }
                    if(hasErrorExtensionFile){
                        msg.push(`该附件扩展名${this.extensions.length > 1 ? `必须是“${this.extensions.join(',')}”中的一种` : `必须是“${this.extensions}”类型`}，不能上传！`);
                    }
                    //自定义校验函数
                    if(hasUserDefineFault){
                        msg.push('存在用户自定义错误，错误为'+resultMess);
                    }
                }

                if(hasExceedMaxCount){
                    msg.push(`至多只能上传${this. maxCount}个附件！`);
                }

                //错误提示
                if(msg.length){

                    this.$Message.info({
                        content: msg.join('\n\t'),
                        duration: 10,
                        closable: true
                    });
                }

                //样式恢复
                this.isHover = false;
                // e.srcElement.value = '';
            },
            //step3----上传
            upload : async function (file, iconUrl) {

                //将上传文件包装成UploadFile对象
                var uploadFile = new UploadFile({
                    name: file.name,
                    url: iconUrl,
                    hasCancel: false,
                    cancelFn : null,
                    data: []
                });

                this.fileList.push(uploadFile);
                /**
                 * 上传的回调函数
                 *  param file          blob        需要上传的附件的blob对象
                 *  param progress      function    上传的进度，例：progress(1)
                 *  param complete      function    上传成功回调，complete(name, data)
                 *  param fail          function    上传失败回调
                 */

                //实例化对外接口暴露
                var paramsFile = new UploadFnObject(
                    //本次上传文件信息
                    uploadFile,
                    //blob对象
                    file,
                    //上传进度函数
                    (number) =>{

                        //上传进度的回调函数
                        if(typeof number == 'number'){
                            uploadFile.progress = Math.min(number, 100);
                        }
                    },
                    //上传成功函数
                    (name = '', data={}) => {
                        //重载
                        if(typeof name == 'object'){
                            data = name;
                            name = '';
                        }
                        //
                        uploadFile = this.fileList.find(item=> item.uuid == uploadFile.uuid)
                        
                        uploadFile.isCompleted = true;
                        uploadFile.data = data;

                        //如果有名字，修改附件名字
                        if(name){
                            uploadFile.name = name;
                        }
                        //通知附件改变
                        this.$emit('change' , this.fileList);
                        //向上层广播事件
                        this.dispatch('FormItem', 'on-form-change', this.fileList);
                    },
                    //上传失败函数
                    () => {
                        //
                        uploadFile = this.fileList.find(item=> item.uuid == uploadFile.uuid)
                        
                        //上传失败的回调函数，如果沒有上传成功，移除这个附件。
                        if(!uploadFile.isCompleted){
                            //上传失败后直接移出函数
                            this.removeUploadFileById(uploadFile.uuid)
                        }
                    }
                );
                //向父组件传回数据
                this.$emit('upload', paramsFile);
            },

            //获取文件的信息，如文件大小，封面图等。如果是图片文件，获取图片的信息。
            async getFileInfo(file){

                //判断附件是不是图片，如果是图片提供预览图，不是图片提供后缀名显示
                var fileReg = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

                if (!fileReg.test(file.type)) {
                    return {
                        name: file.name,
                        blob : file,
                        isImage: false,
                        icon: attachment,
                        size: file.size
                    };
                } else {

                    //blob -> dataUrl
                    var dataURL = await imageUtil.blob2DataURL(file);
                    //压缩图片
                    var compressdataURL = await imageUtil.compressPicture(100, dataURL)  

                    return {
                        name: file.name,
                        blob : file,
                        isImage: true,
                        icon: compressdataURL.dataurl,
                        imageSize : compressdataURL.size,
                        size: file.size,
                    };;
                }
            },

            //从数组中移除某附件
            removeUploadFileById(uuid){
                var index;
                for(let i = 0; i < this.fileList.length; i++){
                    if( this.fileList[i].uuid == uuid){
                        index = i;
                        break;
                    }
                }

                //如果找到id相等的附件，删除此附件
                if(index != null){
                    this.fileList.splice(index, 1)
                }
            }
        },
        mounted(){
            if(this.value.length){
                this.fileList = this.value.map((item) => {

                    //添加数据
                    let uploadFile = new UploadFile(item, true);
                    return uploadFile;
                });

                if(this.in_count == 0){
                    this.$emit('change' , this.fileList);
                    //事件向上广播
                    this.dispatch('FormItem', 'on-form-change', this.fileList);
                    this.in_count++;
                }
            }
        },
    }


</script>

