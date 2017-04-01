/**
 * Created by yang on 17-3-31.
 */
var user=require('./common').user,
    bus=require('./common').bus;

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
        user:user,
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
        showSetting:function () {
            this.menuItems.forEach(function (item) {
                item.current=false;
            });
            bus.$emit("choose-app","setting");
            this.searching=false;
            this.systeming=false
        }
    },
};

var menuVM=new Vue(menuVue);

module.exports={
    menuItems:menuItems,
    menuVM:menuVM,
}