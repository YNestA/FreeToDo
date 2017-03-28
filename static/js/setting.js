/**
 * Created by yang on 17-3-27.
 */
var settingVue={
    el:"#setting-app",
    delimiters:["[[","]]"],
    data:{
        showThis:false,
        passwording:false,
        user:user,
        modifying:"",
        oldPassword:"",
        newPassword1:"",
        newPassword2:"",
    },
    methods:{
        modifyNickname:function () {
            this.modifying="nickname";
            var that=this;
            $("html,body").click(function () {
                that.modifying="";
                $("html,body").unbind("click",arguments.callee);
            });
        },
        modifySummary:function () {
            this.modifying="summary";
            $("html,body").click(function () {
                that.modifying="";
                $("html,body").unbind("click",arguments.callee);
            });
        },
        saveNickname:function () {
            var nickname=this.$refs.nicknameInput.value;
            if(!nickname){
                showMessage("昵称不能为空",false);
            }else{
                var that=this;
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json;charset=utf-8",
                    url:"../ModifyUser/",
                    data:JSON.stringify({
                        nickname:nickname,
                    }),
                    success:function (data) {
                        if(data['res']){
                            user.nickname=nickname;
                            that.modifying="";
                            showMessage(data['message'],true);
                        }else{
                            that.$refs.nicknameInput.value=user.nickname;
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        that.$refs.nicknameInput.value=user.nickname;
                        showMessage("网络请求错误",false);
                    }
                });
            }
        },
        saveSummary:function () {
            var summary=this.$refs.summaryInput.value;
            var that=this;
            $.ajax({
                type:"POST",
                dataType:"JSON",
                contentType:"application/json;charset=utf-8",
                url:"../ModifyUser",
                data:JSON.stringify({
                    summary:summary,
                }),
                success:function (data) {
                    if(data['res']){
                        user.summary=summary;
                        that.modifying="";
                        showMessage(data['message'],true);
                    }else{
                        that.$refs.summaryInput.value=user.summary;
                        showMessage(data['message'],false);
                    }
                },
                error:function () {
                    that.$refs.summaryInput.value=user.summary;
                    showMessage("网络请求错误",false);
                },
            })
        },
        clearPassword:function () {
            this.oldPassword="";
            this.newPassword1="";
            this.newPassword2="";
        },
        modifyPassword:function () {
            var oldPassword=this.oldPassword,
                newPassword1=this.newPassword1,
                newPassword2=this.newPassword2;
            if(!(oldPassword&&newPassword1&&newPassword2)){
                showMessage("有必填项为空",false);
            }else if(newPassword1!=newPassword2){
                showMessage("两次密码不一致",false);
            }else{
                var that=this;
                $.ajax({
                    type:"POST",
                    dataType:"JSON",
                    contentType:"application/json;charset=utf-8",
                    data:JSON.stringify({
                        oldPassword:oldPassword,
                        newPassword1:newPassword1,
                        newPassword2:newPassword2,
                    }),
                    success:function (data) {
                        if(data['res']){
                            that.clearPassword();
                            showMessage(data['message'],true);
                        }else{
                            showMessage(data['message'],false);
                        }
                    },
                    error:function () {
                        that.clearPassword();
                        showMessage("网络请求错误",false);
                    }
                })
            }
        },
        uploadHead:function () {
            var formData=new FormData();
            formData.append('headImg',this.$refs.headInput.files[0]);
            var that=this;
            $.ajax({
                type:"POST",
                url:"../UploadHead/",
                processData:false,
                contentType:false,
                cache:false,
                data:formData,
                success:function (data) {
                    var jsonData=JSON.parse(data);
                    if(jsonData['res']){
                        var url=jsonData['data']['url'];
                        user.headImg=url;
                        showMessage(data['message'],true);
                    }else{
                        showMessage(data['message'],false);
                    }
                },
                error:function () {
                    showMessage("网络请求错误",false);
                }
            });
        }
    },
    computed:{
        headImg:function () {
            return this.user.headImg;
        },
        nickname:function () {
            return this.user.nickname;
        },
        email:function () {
            return this.user.email;
        },
        summary:function () {
            return this.user.summary;
        }
    }
};
