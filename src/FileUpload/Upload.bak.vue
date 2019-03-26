<template>
    <div class="ihm-upload">
    </div>
</template>
<script>

// 对外提供附件类型
// interface Attachment {
//     //附件名称
//     name: string,
//     //如果是图片，图片的url
//     url: string,
//     //数据库里面的附件对象序列化的结果
//     data: any,
//     //该附件是否已经存入数据库中。默认附件是存入数据库中
//     isSaved: boolean = false,
// }

// interface UploadFileObject{
//     //上传的进度，例：progress(1)
//     progress(progress: number);
//     //上传成功回调，complete(name, data)
//     complete(name, data);
//     //取消。默认值为null,如果用户定义了取消事件，则控件会渲染一个取消按钮
//     oncancel(attachment: Attachment)
// }

    export default {
        //接收用户配置的参数
        props: {
            //帮用户校验
            //上传文件的大小，KB
            fileSizeLimit: {
                default: 1024 * 5,
                type: Number,
            },
            //合法的后缀名，空数组表示什么类型都有效
            extensions: {
                default: [],
                type: Array,
            },
            //附件的数量
            maxCount:{
                type: Number,
                default: Infinity,
            },
            //上传按钮的文字
            uploadButtonText: {
                type: String,
                default: ''
            },
            //附件列表对应附件是否显示删除按钮。值是boolean类型，也可以传一个函数，参数是对应附件，返回true和false决定该附件是否有删除按钮
            deletable : {
                type : Boolean | Function,
                default : false
            },
            //附件列表对应附件是否显示查看按钮。值是boolean类型，也可以传一个函数，参数是对应附件，返回true和false决定该附件是否有查看按钮
            viewable : {
                type : Boolean | Function,
                default : false
            },


            //上传附件时候的校验
            checkAttach: {
                default: ()=>{},
                type: Function,
            },
            /**
             * 已经上传的，是附件的数组，附件的格式要求为：
             * [{
             *     //附件名称
             *     name: string,
             *     //如果是图片，图片的url
             *     url: string,
             *     //数据库里面的附件对象序列化的结果
             *     data: any,
             * }]
             */
            value:{
                type: Array,
                default: function () {
                    return [];
                },
            }
        },
        methods: {
            ////////////////////////////对外暴露的接口
        },
    }

    //事件
    var events = {
        // 上传事件
        upload: function(UploadFileObject){

        },
        // 删除事件
        delete: function(attachment){

        },
        // 查看事件
        view: function(attachment){
            
        },
        // 用户新上传附件，删除附件，排序附件，修改附件状态，都会调用change函数，将修改后的附件列表
        input: function(newValue){

        },
    }
</script>
