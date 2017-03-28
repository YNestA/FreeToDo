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
            this.$nextTick(function(){
                this.$refs.contentInput.focus();
            });
            $("html,body").click(function (event) {
                that.adding=false;
                $("html,body").unbind("click",arguments.callee);
            });
        },
        newTask:function () {
            var taskInfo={
                content:this.newContent.trim(),
                level:this.level,
                startTime:this.$refs.startTime.value,
                endTime:this.$refs.endTime.value,
                tags:[],
                done:false,
            };
            var that=this;
            if(!taskInfo.content){
                showMessage("请填写任务名",false);
            }else if(timer.compareTime(taskInfo.endTime,taskInfo.startTime)!=1){
                showMessage("时间区间不正确",false);
            }else {
                $.ajax({
                    type:"POST",
                    url:"../CreateTask/",
                    dataType:"json",
                    contentType:"application/json;charset=utf-8",
                    data:JSON.stringify(taskInfo),
                    success:function (data) {
                        if(data['res']){
                            taskInfo.id=data['data']['id'];
                            taskInfo.createTime=data['data']['createTime'];
                            taskInfo.project=new Project(nullProject);
                            showMessage(data['message'],true);
                            that.$emit("new-task", taskInfo);
                            that.adding = false;
                            that.newContent = "";
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误?",false);
                    }
                });

            }
        },
        chooseTask:function (task) {
            bus.$emit("choose-task",task);
        },
        toggleDone:commonAjax.toggleDone,
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
                content:this.axixContent,
                level:this.axixLevel,
                startTime:this.$refs.axixStartTime.value,
                endTime:this.$refs.axixEndTime.value,
                tags:[],
                done:false,
            };
            var that=this;
            if(!taskInfo.content){
                showMessage("请填写任务内容",false);
            }else if(timer.compareTime(taskInfo.endTime,taskInfo.startTime)!=1){
                showMessage("时间区间不正确");
            }else {
                $.ajax({
                    type: 'POST',
                    url: "../CreateTask/",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(taskInfo),
                    success: function (data) {
                        if (data['res']) {
                            taskInfo.id = data['data']['id'];
                            taskInfo.createTime = data['data']['createTime'];
                            taskInfo.project = new Project(nullProject);
                            that.tasks.push(new Task(taskInfo));
                            showMessage("创建成功", true);
                            that.axixContent="";
                            that.axixAdding=false;
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误?",false);
                    },
                });
            }
        },
        newTask:function (taskInfo) {
            this.tasks.push(new Task(taskInfo));
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
    watch:{
        axixAdding:function (val) {
            if(val){
                this.$nextTick(function () {
                    this.$refs.axixAddInput.focus();
                });
            }
        }
    },
};
var taskDetailVue={
    el:"#task-detail",
    delimiters:["[[","]]"],
    data:{
        newing:true,
        user:user,
        task:new Task(nullTask),
        showProjectList:false,
        showTagsList:false,
    },
    methods:{
        close:function() {
            bus.$emit("close-task-detail");
            this.task=new Task(nullTask);
        },
        changeContent:function (event) {
            if(this.newing){
                this.task.content=event.target.value;
            }
        },
        newTask:function () {
            var taskInfo={
                content:this.$refs.contentInput.value,
                level:this.task.level,
                startTime:this.task.startTime,
                endTime:this.task.endTime,
                projectId:this.task.project.id,
                tagsId:this.task.tags.map(function (item) {
                    return item.id;
                }),
                done:false,
            };
            if(!taskInfo.content){
                showMessage("请填写任务内容",false);
            }else if((!taskInfo.startTime)||(!taskInfo.endTime)||timer.compareTime(taskInfo.endTime,taskInfo.startTime)!=1){
                showMessage("请正确填写任务区间",false);
            }else {
                var that = this;
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    url: "../CreateTask/",
                    data: JSON.stringify(taskInfo),
                    success: function (data) {
                        if (data['res']) {
                            taskInfo.id = data['data']['id'];
                            taskInfo.createTime = data['data']['createTime'];
                            taskInfo.project = that.task.project;
                            taskInfo.tags = that.task.tags;
                            var newTask = new Task(taskInfo);
                            newTask.project.tasks.push(newTask);
                            newTask.tags.forEach(function (item) {
                                item.tasks.push(newTask);
                            });
                            taskAppVM.tasks.push(newTask);
                            bus.$emit("close-task-detail");
                            showMessage(data['message'], true);
                        } else {
                            showMessage(data["message"], false);
                        }
                    },
                    error: function () {
                        showMessage("网络请求错误", false);
                    },
                });
            }
        },
        deleteTask:function () {
            var theTask=this.task;
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
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json;charset=utf-8",
                    url:"",
                    data:JSON.stringify({
                        id:that.task.id,
                    }),
                    success:function (data) {
                        if(data['res']){
                            del(taskAppVM.tasks,theTask.id);
                            del(theTask.project.tasks,theTask.id);
                            theTask.tags.forEach(function (item,index) {
                                del(item.tasks,theTask.id);
                            });
                            that.task=new Task(nullTask);
                            showMessage(data['message'],true);
                            bus.$emit("close-task-detail");
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误",false);
                    },
                });
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
            if(!this.newing) {
                var that=this;
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    url:"../DeleteTaskFromProject/",
                    contentType:"application/json;charset=utf-8",
                    data:JSON.stringify({
                        id: that.task.id,
                    }),
                    success:function (data) {
                        if(data['res']){
                            var theProject = that.task.project;
                            that.task.project = new Project(nullProject);
                            for (var i = 0; i < theProject.tasks.length; i++) {
                                if (theProject.tasks[i].id == that.task.id) {
                                    theProject.tasks.splice(i, 1);
                                }
                            }
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误",false);
                    }
                });
            }else{
                this.task.project=new Project(nullProject);
            }
        },
        chooseProject:function (project) {
            if(!this.newing) {
                if (project.id != this.task.project.id) {
                    var that = this;
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "../ModifyProjectOfTask/",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify({
                            taskId: that.task.id,
                            projectId: project.id,
                        }),
                        success: function (data) {
                            if (data['res']) {
                                if (that.task.project.id) {
                                    var theProject = that.task.project;
                                    for (var i = 0; i < theProject.tasks.length; i++) {
                                        if (theProject.tasks[i].id == that.task.id) {
                                            theProject.tasks.splice(i, 1);
                                        }
                                    }
                                }
                                that.task.project = project;
                                project.tasks.push(that.task);
                                showMessage(data['message'], true);
                            } else {
                                showMessage(data['message'], false);
                            }
                        },
                        error: function () {
                            showMessage("网络请求错误", false);
                        }
                    });
                }
            }else{
                this.task.project=project;
            }
        },
        cancelTag:function (tag) {
            if(!this.newing){
                var that=this;
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    contentType:"application/json;charset=utf-8",
                    url:"../DeleteTaskFromTag/",
                    data:JSON.stringify({
                        taskId:that.task.id,
                        tagId:tag.id,
                    }),
                    success:function (data) {
                        if(data['res']){
                            var tags=that.task.tags;
                            for(var i=0;i<tags.length;i++){
                                if(tag.id==tags[i].id){
                                    tags.splice(i,1);
                                }
                            }
                            var tasks=tag.tasks;
                            for(var i=0;i<tasks.length;i++){
                                if(that.task.id==tasks[i].id){
                                    tasks.splice(i,1);
                                }
                            }
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误",false);
                    },
                })
            }else{
                var tags=this.task.tags;
                for(var i=0;i<tags.length;i++){
                    if(tag.id==tags[i].id){
                        tags.splice(i,1);
                    }
                }
            }
        },
        chooseTag:function (tag) {
            if(!this.newing){
                var that=this;
                $.ajax({
                    type:"POST",
                    dataType:"json",
                    contentTYpe:"application/json;charset=utf-8",
                    url:"../AddTaskToTag/",
                    data:JSON.stringify({
                        taskId:that.task.id,
                        tagId:tag.id,
                    }),
                    success:function (data) {
                        if(data['res']){
                            that.task.tags.push(tag);
                            tag.tasks.push(that.task);
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误",false);
                    },
                });
            }
            else{
                this.task.tags.push(tag);
            }
        },
        toggleDone:commonAjax.toggleDone,
        modifyContent:function () {
            if(!this.newing) {
                var newContent = this.$refs.contentInput.value.trim();
                if(newContent!=this.task.content) {
                    if (newContent) {
                        var that = this;
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            url: "../ModifyTask/",
                            data: JSON.stringify({
                                id: that.task.id,
                                content: newContent,
                            }),
                            success: function (data) {
                                if (data['res']) {
                                    that.task.content = newContent;
                                    showMessage(data['message'], true);
                                } else {
                                    showMessage(data['message'], false);
                                }
                            },
                            error: function () {
                                showMessage("网络请求错误?", false);
                            }
                        });
                    } else {
                        showMessage("任务内容不能为空", false);
                    }
                }
            }
        },
        modifyLevel:function (level) {
            if(!this.newing) {
                if (level != this.task.level) {
                    var that = this;
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        url: "../ModifyTask/",
                        data: JSON.stringify({
                            id: that.task.id,
                            level: level,
                        }),
                        success: function (data) {
                            if (data['res']) {
                                that.task.level = level;
                                showMessage(data['message'], true);
                            } else {
                                showMessage(data['message'], false);
                            }
                        },
                        error: function () {
                            showMessage("网络请求错误?", false);
                        }
                    });
                }
            }else{
                this.task.level=level;
            }
        },

    },
    computed:{
        startTime:{
            get:function () {
                return this.task.startTime;
            },
            set:function (val) {
                if(!this.newing) {
                    var cancel = function () {
                        this.startTime = this.task.startTime;
                        this.$refs.startTimeInput.value = this.task.startTime;
                    }.bind(this);
                    if (val !== this.task.startTime) {
                        var that = this;
                        if (timer.compareTime(this.endTime, val) == 1) {
                            $.ajax({
                                type: "POST",
                                dataType: "json",
                                url: "../ModifyTask/",
                                contentType: "application/json;charset=utf-8",
                                data: JSON.stringify({
                                    id: that.task.id,
                                    startTime: val,
                                }),
                                success: function (data) {
                                    if (data['res']) {
                                        that.task.startTime = val;
                                        showMessage(data['message'], true);
                                    }
                                    else {
                                        cancel();
                                        showMessage(data['message'], false);
                                    }
                                },
                                error: function () {
                                    cancel();
                                    showMessage("网络请求错误?", false);
                                }
                            });
                        } else {
                            cancel();
                            showMessage("时间区间不正确", false);
                        }
                    }
                }else{
                    this.task.startTime=val;
                }
            }
        },
        endTime:{
            get:function () {
                return this.task.endTime;
            },
            set:function (val) {
                if(!this.newing) {
                    var cancel = function () {
                        this.endTime = this.task.endTime;
                        this.$refs.endTimeInput.value = this.task.endTime;
                    }.bind(this);
                    if (val !== this.task.endTime) {
                        var that = this;
                        if (timer.compareTime(val, this.startTime) == 1) {
                            $.ajax({
                                type: "POST",
                                dataType: "json",
                                url: "../ModifyTask/",
                                contentType: "application/json;charset=utf-8",
                                data: JSON.stringify({
                                    id: that.task.id,
                                    endTime: val,
                                }),
                                success: function (data) {
                                    if (data['res']) {
                                        that.task.endTime = val;
                                        showMessage(data['message'], true);
                                    }
                                    else {
                                        cancel();
                                        showMessage(data['message'], false);
                                    }
                                },
                                error: function () {
                                    cancel();
                                    showMessage("网络请求错误?", false);
                                }
                            });
                        } else {
                            cancel();
                            showMessage("时间区间不正确", false);
                        }
                    }
                }else{
                    this.task.endTime=val;
                }
            },
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