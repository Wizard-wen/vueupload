import FileUpload from './FileUpload/Upload.vue'


var Myplugin = {}

Myplugin.install = function(Vue , options){

    Vue.component('FileUpload', FileUpload);

}