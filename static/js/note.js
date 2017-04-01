/**
 * Created by yang on 17-3-9.
 */
var classModule=require('./class'),
    commonModule=require('./common');

var Note=classModule.Note,
    showMessage=commonModule.showMessage,
    confirmVM=commonModule.confirmVM;

var noteComponent={
    template:"#note-template",
    delimiters:["[[","]]"],
    props:['note','ul'],
    computed:{
        phs:function () {
            return this.note.content.split('\n');
        },
    },
    methods:{
        deleteNote:function () {
            this.$emit("delete-note",this.note,this.ul);
        },
    },
};

var noteAppVue={
    el:"#note-app",
    delimiters:["[[","]]"],
    components:{
        "note":noteComponent,
    },
    created:function () {
        var initNotesUl=function () {
            var notesUl=[[this.notes1,0],[this.notes2,0],[this.notes3,0],[this.notes4,0]];
            this.notesAll.forEach(function (item) {
                var len=item.content.split('\n').length;
                var theOne=notesUl[0];
                notesUl.forEach(function (item1) {
                    if(item1[1]<theOne[1]){
                        theOne=item1;
                    }
                })
                theOne[0].push(item);
                theOne[1]+=len;
            });
        };
        initNotesUl.apply(this);
    },
    data:{
        adding:false,
        showThis:false,
        notesAll:[],
        notes1:[],
        notes2:[],
        notes3:[],
        notes4:[],
        newNoteContent:'',
    },
    methods:{
        dealNoteInput:function (event) {
            if(event.ctrlKey&&event.keyCode==13){
                var content=this.newNoteContent.trim();
                if(content){
                    var that=this;
                    $.ajax({
                        type:"POST",
                        dataType:"json",
                        contentType:"application/json;charset=utf-8",
                        url:"../CreateNote/",
                        data:JSON.stringify({
                            content:content,
                        }),
                        success:function (data) {
                            if(data['res']){
                                var newNote=new Note(data['data']['id'],content,data['data']['createTime']);
                                that.notesAll.push(newNote);
                                var theOne=[that.$refs.notes1,that.notes1];
                                [[that.$refs.notes2,that.notes2],
                                    [that.$refs.notes3,that.notes3],
                                    [that.$refs.notes4,that.notes4]].forEach(function (item) {
                                        if(item[0].clientHeight<theOne[0].clientHeight){
                                            theOne=item;
                                        }
                                    });
                                theOne[1].push(newNote);
                                that.newNoteContent='';
                                that.$nextTick(function () {
                                    $("#notes >div:last-child").perfectScrollbar('update');
                                });
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
                    showMessage("便签内容不能为空",false);
                }
            }
        },
        deleteNote:function (note,ulNum) {
            var that=this;
            confirmVM.confirm("删除便签","删除便签'"+note.content+"'",function () {
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json;charset",
                    url:"../DeleteNote",
                    data:JSON.stringify({
                        id:note.id,
                    }),
                    success:function (data) {
                        if(data['res']){
                            for(var i=0;i<that.notesAll.length;i++){
                                if(that.notesAll[i].id==note.id){
                                    that.notesAll.splice(i,1);
                                    break;
                                }
                            }
                            var ul=that['notes'+ulNum];
                            for( var i=0;i<ul.length;i++){
                                if(ul[i].id==note.id){
                                    ul.splice(i,1);
                                    break;
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

            });
        }
    },
};

var noteAppVM=new Vue(noteAppVue);

module.exports={
    noteAppVM:noteAppVM,
    noteAppVue:noteAppVue,
}