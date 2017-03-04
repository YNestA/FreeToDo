/**
 * Created by yang on 17-3-3.
 */
function Task(id,content,level,startTime,endTime,project,tags,done){
    this.id=id;
    this.content=content;
    this.level=level;
    this.startTime=startTime;
    this.endTime=endTime;
    this.project=project;
    this.tags=tags;
    this.done=done;
}
Task.prototype={
    constructor:Task,
}

function Note(id,content,time){
    this.id=id;
    this.content=content;
    this.time=time;
}

Note.prototype={
    constructor:Note,
}

function Project(id,name,tasks,isFile) {
    this.id=id;
    this.name=name;
    this.tasks=tasks;
    this.isFile=isFile;
}
Project.prototype={
    constructor:Project,
}

function Tag(id,name,tasks) {
    this.id=id;
    this.name=name;
    this.tasks=tasks;
}

Tag.prototype={
    constructor:Tag,
}
