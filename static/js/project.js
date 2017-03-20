/**
 * Created by yang on 17-3-14.
 */
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
            this.project.isFile=true;
            //this.$emit("file-project",this.project);
        },
        nfileProject:function () {
            this.project.isFile=false;
            //this.$emit("nfile-project",this.project);
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
        };
    },
    methods:{
        newProject:function () {
            this.$emit("new-project",{
                name: this.newName,
                content:this.newContent,
            });
            this.clearManager();
        },
        closeManager:function () {
            this.$emit("close-manager");
        },
        modifyProject:function () {
            this.$emit("modify-project",{
                id:this.id,
                name:this.newName,
                content:this.newContent,
            });
            this.clearManager();
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
/*
var tasks=[new Task({
                id:'0',
                content:'啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
                level:1,
                createTime:"2017-03-02 00:00",
                startTime:"2017-03-01 00:00",
                endTime:"2017-03-01 00:00",
                project:new Project(nullProject),
                tags:[],
                done:false,
            }),new Task({
                id:'1',
                content:'啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
                level:1,
                createTime:"2017-03-02 00:00",
                startTime:"2017-03-01 00:00",
                endTime:"2017-03-01 00:00",
                project:new Project(nullProject),
                tags:[],
                done:true,
            })];
var projects=[new Project({id:'pro0',name:'啊啊啊啊啊啊啊啊',content:"aaaaa",tasks:[],isFile:false,createTime:''}),
    new Project({id:'pro1',name:'啊啊啊啊啊啊啊啊',content:"aaaaa",tasks:tasks,isFile:false,createTime:''}),
    new Project({id:'pro2',name:'啊啊啊啊啊啊啊啊',content:"aaaaa",tasks:tasks,isFile:false,createTime:''}),
    new Project({id:'pro3',name:'啊啊啊啊啊啊啊啊',content:"aaaaa",tasks:tasks,isFile:false,createTime:''}),
    new Project({id:'pro4',name:'啊啊啊啊啊啊啊啊',content:"aaaaa",tasks:tasks,isFile:false,createTime:''}),
    new Project({id:'pro5',name:'啊啊啊啊啊啊啊啊',content:"aaaaa",tasks:tasks,isFile:false,createTime:''})];

*/
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
        newProject:function (projectInfo) {
            console.log(projectInfo);
        },
        modifyProject:function (projectInfo) {
            console.log(projectInfo);
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
                del(that.projects,project.id);
                project.tasks.forEach(function (item) {
                    console.log(item);
                    item.project=new Project(nullProject);
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
$(document).ready(function () {

    
});