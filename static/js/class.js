/**
 * Created by yang on 17-3-3.
 */
function Task(taskInfo){
    this.id=taskInfo.id;
    this.content=taskInfo.content;
    this.level=taskInfo.level;
    this.createTime=taskInfo.createTime
    this.startTime=taskInfo.startTime;
    this.endTime=taskInfo.endTime;
    this.project=taskInfo.project;
    this.tags=taskInfo.tags;
    this.done=taskInfo.done;
}
Task.prototype={
    constructor:Task,
}

function Note(id,content,time){
    this.id=id;
    this.content=content;
    this.time=time;
}

Note.prototype={
    constructor:Note,
}

function Project(id,name,tasks,isFile) {
    this.id=id;
    this.name=name;
    this.tasks=tasks;
    this.isFile=isFile;
}
Project.prototype={
    constructor:Project,
}

function Tag(id,name,tasks) {
    this.id=id;
    this.name=name;
    this.tasks=tasks;
}

Tag.prototype={
    constructor:Tag,
}

var timer={
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
}