/**
 * Created by yang on 17-3-19.
 */

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
        tasks:[],
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
            bus.$emit("create-task");
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
                tags:[],
                project:new Project(nullProject),
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
            taskInfo.tags=[];
            taskInfo.project=new Project(nullProject);
            var task=new Task(taskInfo);
            this.tasks.push(task);
        },
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
    delimiters:["[[","]]"],
    data:{
        newing:true,
        task:new Task(nullTask),
        showProjectList:false,
        showTagsList:false,
    },
    methods:{
        close:function() {
            bus.$emit("close-task-detail");
            this.task=new Task(nullTask);
        },
        newTask:function () {
            var taskInfo={
                id:'task10',
                content:this.task.content,
                level:this.task.level,
                createTime:timer.getNow(),
                startTime:this.startTime,
                endTime:this.endTime,
                project:new Project(nullProject),
                tags:[],
                done:false,
            };
            taskAppVM.tasks.push(new Task(taskInfo));
            showMessage("保存成功");
            bus.$emit("close-task-detail");
        },
        deleteTask:function () {
            var theTask=this.task
            var del=function (tasks,taskId) {
                for(var i=0;i<tasks.length;i++){
                    if(tasks[i].id==taskId){
                        tasks.splice(i,1);
                        break;
                    }
                }
            };
            var that=this;
            confirmVM.confirm("删除任务","删除任务'"+theTask.content+"'",function () {
                del(taskAppVM.tasks,theTask.id);
                del(theTask.project.tasks,theTask.id);
                theTask.tags.forEach(function (item,index) {
                    del(item.tasks,theTask.id);
                });
                that.task=new Task(nullTask);
                showMessage("删除成功");
                setTimeout(closeMessage,3000);
                bus.$emit("close-task-detail");
            });

        },
        showProjects:function () {
            this.showProjectList=true;
            this.showTagsList=false;
            var that=this;
            $("html,body").click(function () {
                that.showProjectList=false;
                $("html,body").unbind("click",arguments.callee);
            })
        },
        showTags:function () {
            this.showTagsList=true;
            this.showProjectList=false;
            var that=this;
            $("html,body").click(function () {
                that.showTagsList=false;
                $("html,body").unbind("click",arguments.callee);
            });
        },
        cancelProject:function () {
            var theProject=this.task.project;
            this.task.project=new Project(nullProject);
            for(var i=0;i<theProject.tasks;i++){
                if(theProject.tasks[i].id==this.task.id){
                    theProject.splice(i,1);
                }
            }
        },
        chooseProject:function (project) {
            this.cancelProject();
            this.task.project=project;
            project.tasks.push(this.task);
        },
        cancelTag:function (tag) {
            var tags=this.task.tags;
            for(var i=0;i<tags.length;i++){
                if(tag.id==tags[i].id){
                    tags.splice(i,1);
                }
            }
            var tasks=tag.tasks;
            for(var i=0;i<tasks.length;i++){
                if(this.task.id==tasks[i].id){
                    tasks.splice(i,1);
                }
            }
        },
        chooseTag:function (tag) {
            this.task.tags.push(tag);
            tag.tasks.push(this.task);
        }
    },
    computed:{
        content:{
            get:function () {
                return this.task.content;
            },
            set:function (val) {
                this.task.content=val;
            },
        },
        startTime:{
            get:function () {
                return this.task.startTime;
            },
            set:function (val) {
                this.task.startTime=val;
            }
        },
        endTime:{
            get:function () {
                return this.task.endTime;
            },
            set:function (val) {
                this.task.endTime=val;
            },
        },
        level:{
            get:function () {
                return this.task.level;
            },
            set:function (val) {
                this.task.level=val;
            },
        },
        done:{
            get:function () {
                return this.task.done;
            },
            set:function (val) {
                this.task.done=val;
            }
        },
        project:function () {
            return this.task.project;
        },
        tags:function () {
            return this.task.tags;
        },
        projectList:function () {
            return projectAppVM.projects;
        },
        tagList:function () {
            var that=this;
            return tagAppVM.tags.filter(function (item1) {
                return that.task.tags.every(function (item2) {
                    return item1.id!=item2.id;
                });
            });
        }
    }
};