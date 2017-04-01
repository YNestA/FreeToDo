/**
 * Created by yang on 17-3-17.
 */
function showMessage(message,type){
    var messageClass=type?'true':'false';
    $("#message").attr("class",messageClass).text(message).slideDown(300);
    setTimeout(closeMessage,3000);
}
function closeMessage() {
    $("#message").text("").slideUp(300);
}

var user={
    nickname:"用户昵称",
    email:"",
    summary:"",
    headImg:"../static/img/user.png",
}

var bus=new Vue();

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

var timer={
    week:{
        0:"星期日",
        1:"星期一",
        2:"星期二",
        3:"星期三",
        4:"星期四",
        5:"星期五",
        6:"星期六",
    },
    splitTime:function(time){
        var temp=time.split(' ');
        var res=temp[0].split('-').map(function (item) {
            return +item;
        });
        if(temp.length==2) {
            res=res.concat(temp[1].split(':').map(function (item) {
                return +item;
            }));
        }
        return res;
    },
    compareTime:function (time1,time2) {
        var timeL1=this.splitTime(time1),
            timeL2=this.splitTime(time2);
        for(var i=0;i<timeL1.length;i++){
            if(timeL1[i]>timeL2[i]){
                return 1;
            }else if(timeL1[i]<timeL2[i]){
                return -1;
            }
        }
        return 0;
    },
    getTime:function (time,calu,num,type) {
        var myDate=null;
        if(type=='month'){
            var temp=this.splitTime(time);
            myDate=new Date(+temp[0],calu=='+'?(+temp[1]-1+num):(+temp[1]-1-num));
            var year = myDate.getFullYear(),
                month = myDate.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            return year+'-'+month;
        }else {
            if (arguments.length == 0) {
                myDate = new Date();
            } else {
                var temp = this.splitTime(time);
                myDate = new Date(+temp[0], +temp[1] - 1, calu == '+' ? (+temp[2] + num) : (+temp[2] - num));
            }
            var year = myDate.getFullYear(),
                month = myDate.getMonth() + 1,
                day = myDate.getDate();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return [year, month, day].join('-');
        }
    },
    getNow:function () {
        var myDate=new Date(),
            year=myDate.getFullYear(),
            month=myDate.getMonth()+1,
            day=myDate.getDate(),
            hour=myDate.getHours(),
            minute=myDate.getMinutes();
        if(minute<10){
            minute='0'+minute;
        }

        return [year,month,day].join('-')+' '+[hour,minute].join(':');
    },
    getWeekDay:function (time) {
        var temp=this.splitTime(time);
        var myDate=new Date(temp[0],temp[1]-1,temp[2]);
        return this.week[myDate.getDay()];
    },
}

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
};



module.exports={
    user:user,
    bus:bus,
    axixTasksComponent:axixTasksComponent,
    showMessage:showMessage,
    timer:timer,
    commonAjax:commonAjax,
    confirmVM:confirmVM,
}
