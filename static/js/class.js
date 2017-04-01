/**
 * Created by yang on 17-3-3.
 */
function Task(taskInfo){
    this.id=taskInfo.id;
    this.content=taskInfo.content;
    this.level=taskInfo.level;
    this.createTime=taskInfo.createTime
    this.startTime=taskInfo.startTime;
    this.endTime=taskInfo.endTime;
    this.project=taskInfo.project;
    this.tags=taskInfo.tags;
    this.done=taskInfo.done;
}
Task.prototype={
    constructor:Task,
}

function Note(id,content,createTime){
    this.id=id;
    this.content=content;
    this.createTime=createTime;
}

Note.prototype={
    constructor:Note,
}


function Project(projectInfo) {
    this.id=projectInfo.id;
    this.name=projectInfo.name;
    this.content=projectInfo.content;
    this.tasks=projectInfo.tasks;
    this.isFile=projectInfo.isFile;
    this.createTime=projectInfo.createTime;
}
Project.prototype={
    constructor:Project,
}

function Tag(id,name,tasks,createTime) {
    this.id=id;
    this.name=name;
    this.tasks=tasks;
    this.createTime=createTime;
}

Tag.prototype={
    constructor:Tag,
}

module.exports={
    Task:Task,
    Note:Note,
    Project:Project,
    Tag:Tag,
}