/**
 * Created by yang on 17-3-14.
 */
var classModule=require('./class')
    commonModule=require('./common');

var axixTasksComponent=commonModule.axixTasksComponent,
    bus=commonModule.bus,
    Project=classModule.Project,
    timer=commonModule.timer,
    showMessage=commonModule.showMessage;

var nullProject={
    id:'',
    name:'',
    content:"",
    tasks:[],
    isFile:false,
    createTime:''
};

var projectTasksComponent={
    template:"#project-tasks-template",
    delimiters:['[[',']]'],
    props:['project'],
    components:{
        'axix-tasks':axixTasksComponent,
    },
    data:function () {
        return {
            tasksType:'all',
        };
    },
    methods:{
        createTask:function (){
            bus.$emit("create-task");
        },
        _isEmptyObject:function (obj) {
            return $.isEmptyObject(obj);
        },
    },
    computed:{
        axixTasks:function () {
            var that=this;
            var tasks=this.project.tasks.filter(function (item) {
                return that.tasksType==='all'||item.done==={'done':true,'notDone':false}[that.tasksType];
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

var projectComponent={
    template:"#project-template",
    delimiters:['[[',']]'],
    props:['project'],
    data:function () {
        return {
            showMenu:false,
        };
    },
    methods:{
        openMenu:function () {
            this.showMenu=true;
            var that=this;
            $("html,body").click(function () {
                that.showMenu=false;
                $("html,body").unbind("click",arguments.callee);
            });
        },
        modifyReq:function () {
            this.$emit("modify-req",this.project);
        },
        fileProject:function () {
            var project=this.project;
            $.ajax({
                type:"POST",
                dataType:"JSON",
                contentType:"application/json;charset=utf-8",
                url:"../ModifyProject/",
                data:JSON.stringify({
                    id:project.id,
                    isFile:true,
                }),
                success:function (data) {
                    if(data['res']){
                        project.isFile=true;
                        showMessage(data['message'],true);
                    }else{
                        showMessage(data['message'],false);
                    }
                },
                error:function () {
                    showMessage('网络请求错误',false);
                }
            });
        },
        nfileProject:function () {
            var project=this.project;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                contentType: "application/json;charset=utf-8",
                url: "../ModifyProject/",
                data: JSON.stringify({
                    id: project.id,
                    isFile: false,
                }),
                success: function (data) {
                    if (data['res']) {
                        project.isFile = false;
                        showMessage(data['message'], true);
                    } else {
                        showMessage(data['message'], false);
                    }
                },
                error: function () {
                    showMessage('网络请求错误', false);
                }
            });
        },
        deleteProject:function () {
            this.$emit("delete-project",this.project);
        }
    },
    computed:{
        doneTasks:function () {
            return this.project.tasks.filter(function (item) {
                return item.done;
            });
        },
        progress:function () {
            var doneLength=this.doneTasks.length,
                wholeLength=this.project.tasks.length;
            return (wholeLength==0)?"0%":(doneLength/wholeLength).toFixed(2)*100+'%';
        },
    },
};

var projectManagerComponent={
    template:"#project-manager-template",
    delimiters:['[[',']]'],
    props:['type','id','name','content'],
    data:function () {
        return {
            newName:this.name,
            newContent:this.content,
        }
    },
    methods:{
        newProject:function () {
            var name=this.newName.trim(),
                content=this.newContent.trim();
            if(!name){
                showMessage("项目名称不能为空",false);
            }else if(!content){
                showMessage("项目简介不能为空",false);
            }else {
                var that=this;
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    contentType: "application/json;charset=utf-8",
                    url: "../CreateProject/",
                    data: {
                        name: name,
                        content: content,
                        isFile: false,
                        tasks: [],
                    },
                    success: function (data) {
                        if (data['res']) {
                            var project = new Project({
                                id: data['data']['id'],
                                name: name,
                                content:content,
                                isFile:false,
                                tasks:[],
                                createTime:data['data']['createTime'],
                            });
                            that.$emit("new-project",project);
                            that.clearManager();
                            showMessage(data['message'],true);
                        } else {
                            showMessage(data['message'])
                        }
                    },
                    error: function (){
                        var project= new Project({
                                id: 'id',
                                name: name,
                                content:content,
                                isFile:false,
                                tasks:[],
                                createTime:'createTime',
                            });
                            that.$emit("new-project",project);
                            that.clearManager();
                        showMessage("网络请求错误",false);
                    }
                });
            }
        },
        closeManager:function () {
            this.$emit("close-manager");
        },
        modifyProject:function () {
            var newName=this.newName.trim(),
                newContent=this.newContent.trim();
            if(!newName){
                showMessage("项目名称不能为空",false);
            }else if(!newContent){
                showMessage("项目简介不能为空",false);
            }else{
                var that=this;
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json;charset=utf-8",
                    url:"../ModifyProject/",
                    data:JSON.stringify({
                        id:that.id,
                        name:newName,
                        content:newContent,
                    }),
                    success:function (data) {
                        if(data['res']){
                            that.$emit('modify-project',{
                                id:that.id,
                                name:newName,
                                content:newContent,
                            });
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误",false);
                    }
                });
            }

        },
        clearManager:function () {
            this.newName="";
            this.newContent="";
        }
    },
    computed:{},
    watch:{
        id:function (val) {
            this.newName=this.name;
            this.newContent=this.content;
        },
    }
};

var projectAppVue={
    el:"#project-app",
    delimiters:['[[',']]'],
    components:{
        "project-tasks":projectTasksComponent,
        "project":projectComponent,
        "project-manager":projectManagerComponent,
    },
    data:{
        showThis:false,
        showFile:false,
        showManager:false,
        projects:[],
        currentProject:new Project(nullProject),
        managerType:'add',
        managerId:"",
        managerName:"",
        managerContent:"",
    },
    methods:{
        lookProjectTasks:function (project) {
            $("#projects").animate({"width":"250px"},200,"linear");
            $("#project-tasks").animate({"margin-left":"250px"},200,"linear");
            this.currentProject=project;
        },
        newProject:function (project) {
            this.projects.push(project);
            this.showManager=false;
        },
        modifyProject:function (projectInfo) {
            console.log(projectInfo);
            for(var i=0;i<this.projects.length;i++){
                if(this.projects[i].id==projectInfo.id){
                    var theProject=this.projects[i];
                    theProject.name=projectInfo.name;
                    theProject.content=projectInfo.content;
                    break;
                }
            }
            this.showManager=false;
        },
        managerAdd:function () {
            this.showManager=true;
            this.managerType='add';
            this.managerId="";
            this.managerName="";
            this.managerContent="";
        },
        modifyReq:function (project) {
            this.showManager=true;
            this.managerType='modify';
            this.managerId=project.id;
            this.managerName=project.name;
            this.managerContent=project.content;
        },
        deleteProject:function (project) {
            var del=function (projects,projectId) {
                for(var i=0;i<projects.length;i++){
                    if(projects[i].id==projectId){
                        projects.splice(i,1);
                        break;
                    }
                }
            };
            var that=this;
            confirmVM.confirm("删除项目","删除项目'"+project.name+"'",function () {
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json;charset=utf-8",
                    url:"../DeleteProject/",
                    data:JSON.stringify({
                        id:project.id,
                    }),
                    success:function (data) {
                        if(data['res']){
                            del(that.projects,project.id);
                            project.tasks.forEach(function (item) {
                                item.project=new Project(nullProject);
                            });
                            $("#projects").animate({"width":"100%"},200,"linear");
                            $("#project-tasks").animate({"margin-left":"100%"},200,"linear");
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage('网络请求错误',false);
                    },
                });
            });
        },
    },
    computed:{
        fProjects:function () {
            return this.projects.filter(function (item) {
                return item.isFile;
            });
        },
        nfProjects:function () {
            return this.projects.filter(function (item) {
                return !item.isFile;
            });
        },
    },
};

var projectAppVM=new Vue(projectAppVue);

module.exports={
    nullProject:nullProject,
    projectAppVM:projectAppVM,
}