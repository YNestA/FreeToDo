/**
 * Created by yang on 17-3-17.
 */
var bus=new Vue();

var axixTasksComponent={
    delimiters:["[[","]]"],
    template:"#axix-tasks-template",
    props:["tasks","day"],
    methods:{
        chooseTask:function (task) {
            bus.$emit("choose-task",task);
        },
    },
}

function showMessage(message,type){
    var messageClass=type?'true':'false';
    $("#message").attr("class",messageClass).text(message).slideDown(300);
    setTimeout(closeMessage,3000);
}
function closeMessage() {
    $("#message").text("").slideUp(300);
}

var nullProject={
    id:'',
    name:'',
    content:"",
    tasks:[],
    isFile:false,
    createTime:''
};
var nullTask={
    id:'',
    content:'',
    level:1,
    createTime:"",
    startTime:"",
    endTime:"",
    project:new Project(nullProject),
    tags:[],
    done:false,
};
var confirmVM=new Vue({
    el:"#confirm",
    delimiters:["[[","]]"],
    data:{
        showThis:false,
        title:"",
        content:"",
        yesCallback:function () {
        },
        noCallback:function () {
        },
    },
    methods:{
        yes:function () {
            this.showThis=false;
            var yesCallback=this.yesCallback||function () {

                };
            yesCallback();
        },
        no:function () {
            this.showThis=false;
            var noCallback=this.noCallback||function () {

                };
            noCallback();
        },
        confirm:function (title,content,yesCallback,noCallback) {
            this.showThis=true;
            this.title=title;
            this.content=content;
            this.yesCallback=yesCallback;
            this.noCallback=noCallback;
        }
    }
});