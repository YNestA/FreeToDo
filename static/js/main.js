$(document).ready(function () {
    var bus=new Vue();
    bus.$on("createTask",function () {
        $("#task-detail").animate({width:"400px"},200,"linear");
        $("#apps-warp").animate({marginRight:"400px"},200,"linear");
    });
    bus.$on("closeTaskDetail",function () {
        $("#task-detail").animate({width:"0px"},200,"linear");
        $("#apps-warp").animate({marginRight:"0px"},200,"linear");
    })

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
    var menuVM=new Vue({
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
        },
        methods:{
            choose:function (name) {
                this.menuItems.forEach(function (item) {
                    if(item.name===name){
                        item.current=true;
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
    });

    var quadrantComponent={
        template:"#quadrant-template",
        delimiters:["[[","]]"],
        props:["level","tasks"],
        data:function () {
            return {
                adding:false,
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
        },
        computed:{
            quadrantID:function () {
                return "quadrant-"+this.level;
            }
        },
    }
    var axixTasks={
        delimiters:["[[","]]"],
        template:"#axix-tasks-template",
        props:["tasks","day"],
    }

    var taskAppVM=new Vue({
        el:"#task-app",
        components:{
            "quadrant":quadrantComponent,
            "axix-tasks":axixTasks,
        },
        data:{
            tasks:[new Task('0','啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',1,"02/08 23:30","2017-03-01 00:00",null,[])],
            axixing:false,
            axixAdding:false,
        },
        methods:{
            _comTasks:function (level) {
                var that=this;
                return function () {
                    return that.tasks.filter(function (item) {
                        return item.level===level;
                    });
                };
            },
            createTask:function () {
                bus.$emit("createTask",this.$el);
            },
        },
        computed:{
            tasks1:function(){
                return this._comTasks(1)();
            },
            tasks2:function(){
                return this._comTasks(2)();
            },
            tasks3:function(){
                return this._comTasks(3)();
            },
            tasks4:function(){
                return this._comTasks(4)();
            },
        },
    });

    var taskDetailVM=new Vue({
        el:"#task-detail",
        data:{
            newing:true,
            level:1,
        },
        methods:{
            close:function () {
                bus.$emit("closeTaskDetail");
            },
        },
    });

});
