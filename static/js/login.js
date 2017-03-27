$(document).ready(function () {
    var LRVM=new Vue({
        el:"#main",
        delimiters:["[[","]]"],
        data:{
            logining:true,
            loginEmail:"",
            loginPassword:"",
            showLoginError:false,
            showRegisterError:false,
            showRegisterSuccess:false,
            loginErrorMessage:"",
            registerErrorMessage:"",
            registerEmail:"",
            registerPassword1:"",
            registerPassword2:"",
        },
        methods:{
            login:function (event) {
                if(!this.loginEmail){
                    this.showLoginError=true;
                    this.loginErrorMessage="登录邮箱不能为空";
                    event.preventDefault();
                }else if(!/^([0-9a-zA-Z\_\-])+@([0-9a-zA-Z\_\-])+(\.[0-9a-zA-Z\_\-])+/g.test(this.loginEmail)){
                    this.showLoginError=true;
                    this.loginErrorMessage="邮箱格式不正确";
                    event.preventDefault()
                }else if(!this.loginPassword){
                    this.showLoginError=true;
                    this.loginErrorMessage="登录密码不能为空";
                    event.preventDefault();
                }
            },
            register:function () {
                var email=this.registerEmail,
                    password1=this.registerPassword1,
                    password2=this.registerPassword2;
                if(!email){
                    this.showRegisterError=true;
                    this.registerErrorMessage="注册邮箱不能为空";
                }else if(!/^([0-9a-zA-Z\_\-])+@([0-9a-zA-Z\_\-])+(\.[0-9a-zA-Z\_\-])+/g.test(email)){
                    this.showRegisterError=true;
                    this.registerErrorMessage="邮箱格式不正确";
                }else if(!(password1&&password2)){
                    this.showRegisterError=true;
                    this.registerErrorMessage="密码不能为空";
                }else if(password1!=password2){
                    this.showRegisterError=true;
                    this.registerErrorMessage="两次密码不一致";
                }else{
                    var that=this;
                    $.ajax({
                        type:"POST",
                        url:"../Register/",
                        data:{
                            email:email,
                            password1:password1,
                            password2:password2,
                        },
                        success:function (data) {
                            var jsonData=JSON.parse(data);
                            if(jsonData['res']){
                                that.showRegisterError=false;
                                that.registerErrorMessage="";
                                that.showRegisterSuccess=true;
                                that.logining=true;
                            }else{
                                that.showRegisterError=true;
                                that.registerErrorMessage=jsonData['message'];
                            }
                        },
                    });
                }
            },
        }
    });
});