var classModule=require('./class'),
    commonModule=require('./common');

var axixTasksComponent=commonModule.axixTasksComponent,
    timer=commonModule.timer,
    showMessage=commonModule.showMessage,
    Tag=classModule.Tag,
    confirmVM=commonModule.confirmVM,
    bus=commonModule.bus;

var tagComponent={
    template:"#tag-template",
    delimiters:['[[',']]'],
    props:["tag"],
    methods:{
        deleteTag:function () {
            this.$emit("delete-tag",this.tag);
        },
    },
};

var tagTasksComponent={
    template:"#tag-tasks-template",
    delimiters:['[[',']]'],
    props:["tag"],
    components:{
        "axix-tasks": axixTasksComponent,
    },
    data:function () {
        return {
            tasksType:"all",
        };
    },
    methods:{
        createTask:function () {
             bus.$emit("create-task");
        },
        _isEmptyObject:function (obj) {
            return $.isEmptyObject(obj);
        }
    },
    computed:{
        axixTasks:function () {
            var that=this;
            var tasks=this.tag.tasks.filter(function (item) {
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

var tagAppVue={
    el:"#tag-app",
    components:{
        'tag':tagComponent,
        'tag-tasks':tagTasksComponent,
    },
    data:{
        showThis:false,
        tagAdding:false,
        newTagName:"",
        currentTag:new Tag("","",[],""),
        tags:[],
    },
    methods:{
        deleteTag:function (tag) {
            var del=function (tags,tagId) {
                for(var i=0;i<tags.length;i++){
                    if(tags[i].id==tagId){
                        tags.splice(i,1);
                        break;
                    }
                }
            }
            var that=this;
            confirmVM.confirm("删除标签","删除标签'"+tag.name+"'",function () {
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json",
                    url:"../DeleteTag/",
                    data:JSON.stringify({
                        id:tag.id,
                    }),
                    success:function (data) {
                        if(data['res']){
                            del(that.tags,tag.id);
                            tag.tasks.forEach(function (item) {
                                del(item.tags,tag.id);
                            });
                            $("#tags").animate({"width":"100%"},200,"linear");
                            $("#tag-tasks").animate({"margin-left":"100%"},200,"linear");
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误",false);
                    }
                });

            });
        },
        lookTagTasks:function (tag) {
            $("#tags").animate({"width":"250px"},200,"linear");
            $("#tag-tasks").animate({"margin-left":"250px"},200,"linear");
            this.currentTag=tag;
        },
        newTag:function () {
            var tagName=this.newTagName.trim();
            if(tagName){
                var that=this;
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json;charset=utf-8",
                    url:"../CreateTag/",
                    data:JSON.stringify({
                        name:tagName,
                    }),
                    success:function (data) {
                        if(data['res']){
                            that.tags.push(new Tag(data['data']['id'],tagName,[],data['data']['createTime']));
                            that.tagAdding=false;
                            that.newTagName="";
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        showMessage("网络请求错误",false);
                    },
                });
            }else{
                showMessage("标签名字不能为空",false);
            }
        },
    },
};

var tagAppVM=new Vue(tagAppVue);

module.exports={
    tagAppVM:tagAppVM,
}