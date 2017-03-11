/**
 * Created by yang on 17-3-9.
 */
$(document).ready(function () {
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
                this.$emit("delete-note",this.note.id,this.ul);
            },
        },
    };
    var noteAppVM=new Vue({
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
            notesAll:[new Note('0','sadsadsadsadsadd',timer.getNow()),new Note('0','sadsadsadsadsadd',timer.getNow()),new Note('0','sadsadsadsadsadd',timer.getNow()),new Note('0','sadsadsadsadsadd',timer.getNow())],
            notes1:[],
            notes2:[],
            notes3:[],
            notes4:[],
            newNoteContent:'',
        },
        methods:{
            dealNoteInput:function (event) {
                if(event.ctrlKey&&event.keyCode==13){
                    if(this.newNoteContent.trim()){
                        var newNote=new Note('0',this.newNoteContent,timer.getNow());
                        this.notesAll.push(newNote);
                        var theOne=[this.$refs.notes1,this.notes1];
                        [[this.$refs.notes2,this.notes2],
                            [this.$refs.notes3,this.notes3],
                            [this.$refs.notes4,this.notes4]].forEach(function (item) {
                            if(item[0].clientHeight<theOne[0].clientHeight){
                                theOne=item;
                            }
                        });
                        theOne[1].push(newNote);
                        this.newNoteContent='';
                    }
                }
            },
            deleteNote:function (noteId,ul) {
                for(var i=0;i<this.notesAll.length;i++){
                    if(this.notesAll[i].id==noteId){
                        this.notesAll.splice(i,1);
                        break;
                    }
                }
                var ul=this['notes'+ul];
                for( var i=0;i<ul.length;i++){
                    if(ul[i].id==noteId){
                        ul.splice(i,1);
                        break;
                    }
                }
            }
        },
    });
});
