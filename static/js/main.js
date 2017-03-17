
//bus总线


var menuItems=[
     {name:'task',cname:'任务',current:true,},
     {name:'note',cname:'便签',current:false,},
     {name:'project',cname:'项目',current:false,},
     {name:'tag',cname:'标签',current:false,},
 ];
 var menuItemComponent={
     delimiters:["[[","]]"],
     template:"#menu-item-template",
     props:["name","cname","current"],
     data:function () {
         return {
             id:"menu-"+this.name,
         };
     },
     methods:{
         choose:function () {
             this.$emit('choose',this.name);
         },
     },
 }
 var quadrantComponent={
     template:"#quadrant-template",
     delimiters:["[[","]]"],
     props:["level","tasks"],
     data:function () {
         return {
             adding:false,
             newContent:"",
         }
     },
     methods:{
         clickAdd:function () {
             $("html,body").click();
             this.adding=true;
             var that=this;
             $("html,body").click(function (event) {
                 that.adding=false;
                 $("html,body").unbind("click",arguments.callee);
             });
         },
         newTask:function () {
             var taskInfo={
                 content:this.newContent,
                 level:this.level,
                 startTime:this.$refs.startTime.value,
                 endTime:this.$refs.endTime.value,
             };
             this.$emit("new-task",taskInfo);
             this.adding=false;
             this.newContent="";
         },
         chooseTask:function (task) {
            bus.$emit("choose-task",task);
         },
     },
     computed:{
         quadrantID:function () {
             return "quadrant-"+this.level;
         }
     },
 }
 var menuVue={
     el:"#whole-menu",
     components:{
         "menu-item":menuItemComponent,
     },
     delimiters:["[[","]]"],
     data:{
         systemShow:false,
         menuItems:menuItems,
         searching:false,
         systeming:false,
         showSearchBtn:false,
     },
     methods:{
         choose:function (name) {
             this.menuItems.forEach(function (item) {
                 if(item.name===name){
                     item.current=true;
                     bus.$emit("choose-app",item.name);
                 }else{
                     item.current=false;
                 }
             });
             this.searching=false;
             this.systeming=false;
         },
         search:function () {
             this.choose("");
             this.systeming=false;
             this.searching=true;
         },
         system:function () {
             this.systeming=!this.systeming;
         },
     },
 };
 var taskAppVue={
     el:"#task-app",
     delimiters:['[[',']]'],
     components:{
         "quadrant":quadrantComponent,
         "axix-tasks":axixTasksComponent,
     },
     data:{
         showThis:true,
         tasks:[new Task({
             id:'0',
             content:'啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
             level:1,
             createTime:"2017-03-02 00:00",
             startTime:"2017-03-01 00:00",
             endTime:"2017-03-01 00:00",
             project:null,
             tags:[],
             done:false}),],
         axixing:false,
         axixAdding:false,
         dateType:'day',
         dateSection:["",timer.getTime()],
         tasksType:"all",
         axixContent:"",
         axixLevel:1,
     },
     methods:{
         _comTasks:function (level) {
             var that=this;
             return function () {
                 return that.tasks.filter(function (item) {
                     var res=(item.level===level&&that._inDateSection(item.createTime));
                     if(that.tasksType==="done"){
                         res=res&&item.done;
                     }else if(that.tasksType==="notDone") {
                         res = res && !item.done;
                     }
                     return res;
                 });
             };
         },
         _isEmptyObject:function (obj) {
             return $.isEmptyObject(obj);
         },
         _inDateSection:function (createTime) {
             var dateType=this.dateType,
                 dateSection=this.dateSection,
                 dayTime=createTime.slice(0,10);
             if(dateType==="mouth"){
                 dayTime=dayTime.slice(0,7);
             }
             if(dateSection[0]){
                 return (timer.compareTime(dayTime,dateSection[0])!=-1)&&(timer.compareTime(dayTime,dateSection[1])!=1);
             }else{
                 return timer.compareTime(dayTime,dateSection[1])==0;
             }
         },
         createTask:function () {
             bus.$emit("createTask",this.$el);
         },
         setToday:function () {
             this.dateType='day';
             this.dateSection.splice(0,1,'');
             this.dateSection.splice(1,1,timer.getTime());
         },
         setDateType:function (type) {
             var dateType=this.dateType,
                 dateSection=this.dateSection;
             if(type=='day'){
                 if(dateType!='day'){
                     if(dateType=='month'){
                         dateSection.splice(1,1,dateSection[1]+'-01');
                     }
                     dateSection.splice(0,1,'');
                 }
             }else if(type=='week'){
                 if(dateType!='week'){
                     if(dateType=='day'){
                         dateSection.splice(0,1,timer.getTime(dateSection[1],'-',6));
                     }else if(dateType=='month'){
                         dateSection.splice(0,1,dateSection[1]+'-01');
                         dateSection.splice(1,1,dateSection[1]+'-06');
                     }
                 }
             }else{
                 if(dateType!='month') {
                     dateSection.splice(0,1,'');
                     dateSection.splice(1,1,dateSection[1].slice(0, 7));
                 }
             }
             this.dateType=type;
         },
         dateGo:function (dire) {
             var dateType=this.dateType,
                 dateSection=this.dateSection;
             if(dateType=='month'){
                 dateSection.splice(1,1,timer.getTime(dateSection[1],dire,1,'month'));
             }else if(dateType=='day'){
                 dateSection.splice(1,1,timer.getTime(dateSection[1],dire,1));
             }else{
                 dateSection.splice(0,1,timer.getTime(dateSection[0],dire,7));
                 dateSection.splice(1,1,timer.getTime(dateSection[1],dire,7));
             }
         },
         axixNewTask:function () {
             var taskInfo={
                 id:'12',
                 content:this.axixContent,
                 level:this.axixLevel,
                 createTime:timer.getNow(),
                 startTime:this.$refs.axixStartTime.value,
                 endTime:this.$refs.axixEndTime.value,
                 done:false,
             };
             var task=new Task(taskInfo);
             this.tasks.push(task);
             this.axixContent="";
         },
         newTask:function (taskInfo) {
             taskInfo.id='1';
             taskInfo.createTime=timer.getNow();
             taskInfo.done=false;
             var task=new Task(taskInfo);
             this.tasks.push(task);
         }
     },
     computed:{
         currentDate:function () {
             var res;
             if(this.dateType=='week'){
                 res=this.dateSection[0]+'~'+this.dateSection[1].slice(-2);
             }else{
                 res=this.dateSection[1];
             }
             return res;
         },
         tasks1:function(){
             return this._comTasks(1)();
         },
         tasks2:function() {
             return this._comTasks(2)();
         },
         tasks3:function(){
             return this._comTasks(3)();
         },
         tasks4:function(){
             return this._comTasks(4)();
         },
         axixTasks:function () {
             var that=this;
             var tasks=this.tasks.filter(function (item) {
                 return that._inDateSection(item.createTime)&&(that.tasksType==='all'||item.done==={'done':true,'notDone':false}[that.tasksType]);
             }).sort(function (task1,task2) {
                 return timer.compareTime(task1.createTime,task2.createTime);
             });
             var res={};
             tasks.forEach(function (item) {
                 var day=item.createTime.slice(0,10)+' '+timer.getWeekDay(item.createTime);
                 if(res[day]){
                     res[day].push(item);
                 }else{
                     res[day]=[item];
                 }
             });
             return res;
         },
     },
 };
 var taskDetailVue={
     el:"#task-detail",
     data:{
         newing:true,
         level:1,
         task:null,
     },
     methods:{
         close:function () {
             bus.$emit("closeTaskDetail");
         },
     },
 };
$(document).ready(function () {
    //bus
    var openTaskDeail=function () {
        $("#task-detail").animate({width: "400px"}, 200, "linear");
        $("#apps-warp").animate({marginRight: "400px"}, 200, "linear");
    };
    var closeTaskDetail=function () {
        $("#task-detail").animate({width:"0px"},200,"linear");
        $("#apps-warp").animate({marginRight:"0px"},200,"linear");
    };

    bus.$on("createTask",function () {
        openTaskDeail();
    });
    bus.$on("choose-task",function (task) {
        taskDetailVM.task=task;
        taskDetailVM.newing=false;
        openTaskDeail();
    });
    bus.$on("closeTaskDetail",function () {
        closeTaskDetail();
    });
    bus.$on("choose-app",function (appName) {
        var apps={'task':taskAppVM,'note':noteAppVM,'project':projectAppVM,'tag':tagAppVM};
        for(var key in apps){
            apps[key].showThis=(key==appName)?true:false;
        }
    });

//目录应用
    var menuVM=new Vue(menuVue);

//任务应用
    var taskAppVM=new Vue(taskAppVue);
    var taskDetailVM=new Vue(taskDetailVue);
    $(".start-time-input").jeDate({
        format:'YYYY-MM-DD hh:mm',
        isinitVal:true,
    });
    $(".end-time-input").jeDate({
        format:'YYYY-MM-DD hh:mm',
        isinitVal:true,
        initAddVal:[6,"hh"],
    });
    $("div.quadrant").perfectScrollbar();
    
//便签应用
    var noteAppVM=new Vue(noteAppVue);
    $("#notes >div:last-child").perfectScrollbar();

//项目应用
    var projectAppVM=new Vue(projectAppVue);
    $("#projects-container >div").perfectScrollbar();

//标签应用
    var tagAppVM=new Vue(tagAppVue);
    $("#tags-container >div").perfectScrollbar();
    $("#tag-tasks-container >div").perfectScrollbar();
});
