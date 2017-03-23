/**
 * Created by yang on 17-3-17.
 */
var bus=new Vue();

var commonAjax={
    toggleDone:function (task) {
        $.ajax({
            type:"POST",
            url:"../ModifyTask/",
            dataType:"json",
            contentType:"application/json;charset=utf-8",
            data:JSON.stringify({
                id:task.id,
                done:!task.done,
            }),
            success:function (data) {
                if(data['res']){
                    task.done=!task.done;
                }
            },
            error:function () {
                showMessage("网络请求错误?",false);
            }
        });
    }
}

var axixTasksComponent={
    delimiters:["[[","]]"],
    template:"#axix-tasks-template",
    props:["tasks","day"],
    methods:{
        chooseTask:function (task) {
            bus.$emit("choose-task",task);
        },
        toggleDone:commonAjax.toggleDone,
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

