
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


var menuVM=new Vue(menuVue);
var noteAppVM=new Vue(noteAppVue);
var projectAppVM=new Vue(projectAppVue);
var tagAppVM=new Vue(tagAppVue);
var taskAppVM=new Vue(taskAppVue);
var taskDetailVM=new Vue(taskDetailVue);


function initData() {
    function _init(originData) {
        noteAppVM.notesAll=originData.notes.map(function (item) {
            return new Note(item.id,item.content,item.createTime);
        });
        noteAppVue.created.apply(noteAppVM);
        tagAppVM.tags=originData.tags.map(function (item) {
            return new Tag(item.id,item.name,[],item.createTime);
        });
        projectAppVM.projects=originData.projects.map(function (item) {
            var project=new Project(item);
            project.tasks=[];
            return project;
        });
        taskAppVM.tasks=originData.tasks.map(function (item) {
            var taskInfo=item;
            var originTags=tagAppVM.tags,
                originProjects=projectAppVM.projects;
            taskInfo.tags=item.tags.map(function (item1) {
                for(var i=0;i<=originTags.length;i++){
                    if(item1==originTags[i].id){
                        return originTags[i];
                    }
                }
            });
            for(var i=0;i<originProjects.length;i++){
                if(originProjects[i].id==item.project){
                    taskInfo.project=originProjects[i];
                    break;
                }
            };
            return new Task(taskInfo);
        });
        var attachTasksFunc=function (origin) {
            var func=function (item) {
                var taskIds=[],
                    tasks=taskAppVM.tasks;
                for(var i=0;i<origin.length;i++){
                    if(item.id==origin[i].id){
                        taskIds=origin[i].tasks;
                        break;
                    }
                }
                item.tasks=taskIds.map(function (item1) {
                    for(var i=0;i<tasks.length;i++){
                        if(item1==tasks[i].id){
                            return tasks[i];
                        }
                    }
                });
            };
            return func;
        }
        tagAppVM.tags.forEach(attachTasksFunc(originData.tags));
        projectAppVM.projects.forEach(attachTasksFunc(originData.projects));
    }
    
    $.ajax({
        type:"GET",
        url:"../GetAllDetails/",
        data:JSON.stringify({}),
        contentType:"application/json",
        success:function (data) {
            _init(data);
        },
        error:function () {
            showMessage("网络未连通?",false);
            _init(originData);
        }
    });

}

$(document).ready(function () {

    initData();

    //bus
    var openTaskDeail=function () {
        $("#task-detail").animate({width: "400px"}, 200, "linear");
        $("#apps-warp").animate({marginRight: "400px"}, 200, "linear");
    };
    var closeTaskDetail=function () {
        $("#task-detail").animate({width:"0px"},200,"linear");
        $("#apps-warp").animate({marginRight:"0px"},200,"linear");
    };

    bus.$on("create-task",function () {
        taskDetailVM.task=new Task(nullTask);
        taskDetailVM.newing=true;
        openTaskDeail();
    });
    bus.$on("choose-task",function (task) {
        taskDetailVM.task=task;
        taskDetailVM.newing=false;
        openTaskDeail();
    });
    bus.$on("close-task-detail",function () {
        closeTaskDetail();
    });
    bus.$on("choose-app",function (appName) {
        var apps={'task':taskAppVM,'note':noteAppVM,'project':projectAppVM,'tag':tagAppVM};
        for(var key in apps){
            apps[key].showThis=(key==appName)?true:false;
        }
        closeTaskDetail();
    });

//目录应用


//任务应用

    $("#task-detail-start-time-input").jeDate({
        format:'YYYY-MM-DD hh:mm',
        isClear:false,
        choosefun:function (elem,val) {
            if(elem.context.id=="task-detail-start-time-input"){
                taskDetailVM.startTime=val;
            }
        },
    });
    $("#task-detail-end-time-input").jeDate({
        format:'YYYY-MM-DD hh:mm',
        isClear:false,
        choosefun:function (elem,val) {
            if(elem.context.id=='task-detail-end-time-input'){
                taskDetailVM.endTime=val;
            }
        }
    });
    $(".add-start-time-input").jeDate({
        format:'YYYY-MM-DD hh:mm',
        isClear:false,
        isinitVal:true,
    });
    $(".add-end-time-input").jeDate({
        format:'YYYY-MM-DD hh:mm',
        isClear:false,
        isinitVal:true,
        initAddVal:[6,"hh"],
    });

    $("div.quadrant").perfectScrollbar();
    $("#task-detail-project-list,#task-detail-tags-list").perfectScrollbar();
    
//便签应用

    $("#notes >div:last-child").perfectScrollbar();

//项目应用

    $("#projects-container >div").perfectScrollbar();

//标签应用

    $("#tags-container >div").perfectScrollbar();
    $("#tag-tasks-container >div").perfectScrollbar();
    
});
