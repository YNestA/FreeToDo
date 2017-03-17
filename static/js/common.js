/**
 * Created by yang on 17-3-17.
 */
var bus=new Vue();

var axixTasksComponent={
    delimiters:["[[","]]"],
    template:"#axix-tasks-template",
    props:["tasks","day"],
    methods:{
        chooseTask:function (task) {
            bus.$emit("choose-task",task);
        },
    },
}
