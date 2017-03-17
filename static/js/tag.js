var tagComponent={
    template:"#tag-template",
    delimiters:['[[',']]'],
    props:["tag"],
    methods:{
        deleteTag:function () {
            this.$emit("delete-tag",this.tag.id);
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
var tasks=[new Task({
                id:'0',
                content:'啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
                level:1,
                createTime:"2017-03-02 00:00",
                startTime:"2017-03-01 00:00",
                endTime:"2017-03-01 00:00",
                project:null,
                tags:[],
                done:false}),];

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
        currentTag:new Tag("","",[]),
        tags:[new Tag('0','a',[]),new Tag('0','aa',tasks),new Tag('0','aa',[])],
    },
    methods:{
        deleteTag:function (tagId) {
            var tags=this.tags;
            for(var i=0;i<tags.length;i++){
                if(tags[i].id==tagId){
                    tags.splice(i,1);
                    break;
                }
            }
        },
        lookTagTasks:function (tag) {
            $("#tags").animate({"width":"250px"},200,"linear");
            $("#tag-tasks").animate({"margin-left":"250px"},200,"linear");
            this.currentTag=tag;
        },
        newTag:function () {
            this.tags.push(new Tag('0',this.newTagName,[],timer.getNow()));
            this.tagAdding=false;
            this.newTagName="";
        },
    },
};
$(document).ready(function () {


});
