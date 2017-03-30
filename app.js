var eatApp = angular.module("eatApp", ['ui.router', 'ngAnimate', 'eatApp.directives', "oc.lazyLoad", 'ui.bootstrap']);

/*****首页路由******/

eatApp.config(['$stateProvider', '$urlRouterProvider', "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('myInterceptor');

    $stateProvider
        .state('main', { //首页
            url: '/main',
            templateUrl: 'template/home.html',
            controller: 'homeController',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load(['js/libs/swiper.min.js']);
                }]
            }

        })

    .state('findTest', { //找试吃的首页
        url: '/findTest',
        templateUrl: 'template/findEat.html',
        controller: 'findEatController'

    })

    .state('findDetail', { //找试吃的商品详情
        url: '/findDetail/:proSku',
        templateUrl: 'template/findDetail.html',
        controller: 'findetController',
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load(['js/libs/iscroll.js']);
            }]
        }

    })

    .state('apply', { //入团申请页面
        url: '/apply',
        templateUrl: 'template/apply.html',
        controller: 'applyController'

    })

    .state('readCom', { //吃货秀首页
        url: '/readCom',
        templateUrl: 'template/comment.html',
        controller: 'commentController'

    })

    .state('reportDetails', { //吃货秀详情页
            url: '/reportDetails/:code/:sku',
            templateUrl: 'template/comDet.html',
            controller: 'commentDetailCtrl'

        })
        .state('reportShare', {
            url: '/reportShare',
            templateUrl: 'template/comDet.html',
            controller: 'commentDetailCtrl'
        })

    .state('personal', { //个人中心
        url: '/personal',
        templateUrl: 'template/personal.html',
        controller: 'perController'
    })

    .state('goldMore', {
        url: '/goldMore',
        templateUrl: 'template/gold.html',
        controller: 'goldController'
    })

    .state('scoreDef', { //分数解读页面
        url: '/scoreDef',
        templateUrl: 'template/scoreDef.html',
        controller: 'scoredefController'
    })

    .state('myApply', { //我的申请页面
        url: '/myApply',
        templateUrl: 'template/myApply.html',
        controller: 'myTryApplyCtrl'
    })

    .state('myReport', { //我的试吃报告页面
        url: '/myReport',
        templateUrl: 'template/myReport.html',
        controller: 'myComtCtrl'

    })

    .state('myAddr', { //地址页
        url: '/myAddr/:orderCode',
        templateUrl: 'template/addresslist.html',
        controller: 'addrController'

    })

    .state('newAddress', { //地址详情页
        url: '/newAddress/:orderCode',
        templateUrl: 'template/address.html',
        controller: 'addressDetails'
    })

    .state('newAddress2', { //地址详情页
        url: '/newAddress2',
        templateUrl: 'template/address.html',
        controller: 'addressDetails'
    })

    .state('proState', { //我申请商品的状态页面
        url: '/proState',
        templateUrl: 'template/proState.html',
        controller: 'psController'

    })

    .state('writeCom', { //撰写评论页面
        url: '/writeCom',
        templateUrl: 'template/writeCom.html',
        controller: 'wcController',
        resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load(['js/libs/lrz.all.bundle.js']);
            }]
        }

    })

    .state('applyIng', { //我的试吃报告页面
        url: '/applyIng/:applySku/:orderCode',
        templateUrl: 'template/proState.html',
        controller: 'psController'
    })

    .state('applyShare', {
        url: '/applyShare',
        templateUrl: 'template/proState.html',
        controller: 'psController'
    })

    .state('store', { //导流到旺币商城
        url: '/store/:proCode',
        templateUrl: '跳转商城链接'
    })

    // $urlRouterProvider.otherwise('/main');

}])

eatApp.factory('myInterceptor', ["$rootScope", "$timeout", function($rootScope, $timeout) {
    var myInterceptor = {
        request: function(config) {
            $rootScope.loading = true;
            return config;
        },
        response: function(response) {
            if ($rootScope.loading == true) {
                $rootScope.loading = false;
            }
            return response;
        }
    };
    return myInterceptor;
}]);

eatApp.filter('cut', function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };

});

eatApp.filter('replaceCode', function() {
    return function(value) {
        if (!value) value = '';
        return value.replace(/^\:[a-z0-9_]+\:$/, '')
    }
})



eatApp.controller('indexCtrl', ['$scope', '$rootScope', 'memberFun', 'DataAPI', '$compile', 'weixinShare', '$location', '$state', '$window', function($scope, $rootScope, memberFun, DataAPI, $compile, weixinShare, $location, $state, $window) {
    $rootScope.hasMM = false;
    $scope.hasIndexPro = true;
    $scope.hasIndexCom = true;
    var url = $location.absUrl();
    if (url.indexOf('#') < 0) {
        $state.go('main');
    }
    var isCancel = true;
    if (url.indexOf('shareCode') >= '92') {
        var shareCode = url.substr(102, url.length);
    }

    $rootScope.selected = 1;

    $rootScope.getIndexPro = function() {
        DataAPI.post('/eat/product/indexShow.ctrl', {}, function(data) {
            if (data.object) {
                $scope.hasIndexPro = true;
                $scope.proName = data.object.activityName;
                $scope.proSku = data.object.sku;
                $scope.flavour = data.object.productItem.flavour;
                var hasVideo = data.object.hasVideo;
                if (hasVideo == 0) {
                    $scope.hasVideo = false;
                } else {
                    $scope.hasVideo = true;
                }
                $scope.toDetail = false;
                if (data.object.note == null || data.object.note == '申请试吃') {
                    $scope.note1 = data.object.note;
                } else {
                    $scope.note1 = data.object.note.split('&')[0];
                    $scope.note2 = data.object.note.split('&')[1];
                    $scope.note3 = data.object.note.split('&')[2];
                }
                if ($scope.note1 == '填写地址') {
                    $scope.note = '填写地址';
                    $scope.isSL = false;
                } else if ($scope.note1 == '申请试吃' || $scope.note1 == null) {
                    $scope.isSL = true;
                    $scope.note = '立即申请';
                } else if ($scope.note1 == '集气中') {
                    $scope.isSL = false;
                    $scope.note = '集气中';
                } else if ($scope.note1 == '待评论') {
                    $scope.isSL = false;
                    $scope.note = '待评论';
                    DataAPI.post('/eat/order/intervalTwoDays.ctrl', { 'code': $scope.note2 }, function(data) {
                        if (data.object == false) {
                            $rootScope.canWrite = true;
                            $scope.canwrite2 = function() {
                                $scope.promptMsg = '亲爱的旺粉！填写地址后要经过48小时才可以发表评论唷！';
                                DataAPI.showPromptSingle();
                                $compile(angular.element(document.querySelector('errorsingle')))($scope);
                                $scope.btn1 = function() {
                                    angular.element(document.querySelector('#errorMsgAlert')).remove();
                                }
                            }
                        } else {
                            $rootScope.canWrite = false;
                        }
                    }, function(data) { console.log('error') })
                } else if ($scope.note1 == '已评论') {
                    $scope.isSL = false;
                    $scope.toDetail = true;
                    $scope.note = '已评论';
                }
            } else {
                $scope.hasIndexPro = false;
            }

        }, function(data) {

        })
    }

    $rootScope.getIndexPro();



    //分享
    $rootScope.channel = memberFun.getChannel(); //获取channel
    $rootScope.shareShow = function() {
        if ($rootScope.channel != 'WEIXIN') {
            $scope.msg = '请在微信中分享！';
            DataAPI.showError();
            $compile(angular.element(document.querySelector('erroralert')))($scope);
        } else {
            DataAPI.showPop();
            $compile(angular.element(document.querySelector('sharing')))($scope);
            $scope.popClose = function() {
                angular.element(document.querySelector('sharing')).remove();
            }
        }
    };


    $rootScope.code = memberFun.GetQueryString("code");
    //alert($rootScope.code);
    var memberPromise = memberFun.memberProfile(); //判断登陆
    memberPromise.then(function(data) {
        if (data.error) {
            if ($rootScope.channel == 'WEIXIN') {
                var useropenID = memberFun.init($rootScope.code);
                useropenID.then(function(data) {
                    var currentUrl = $window.location.href;
                    if (currentUrl.indexOf('#') < 0) {
                        $state.go('main');
                    }
                    if (data.object) {
                        $rootScope.openId = data.object.openId;
                        $rootScope.unionId = data.object.unionId;
                        console.log(data.object)
                        var openIdLogin = memberFun.loginByOpenId($rootScope.openId); //根据openId登录
                        openIdLogin.then(function(data) {
                            if (data.object) {
                                $rootScope.hasMember = true;
                                $rootScope.getIndexPro();
                                console.log($rootScope.hasMember)
                                $rootScope.member = data.object;
                                var imgPromise = memberFun.getUserImg(data.object.openId); //获取微信头像    
                                imgPromise.then(function(data) {
                                    if (data.object) {
                                        if (data.object.user_info_list[0].headimgurl) {
                                            $rootScope.headImg = data.object.user_info_list[0].headimgurl;
                                            $rootScope.nickName = data.object.user_info_list[0].nickName;
                                        } else {
                                            $rootScope.headImg = "images/mask.png";
                                            $rootScope.nickName = '旺粉';
                                        }
                                    } else {
                                        $rootScope.headImg = "images/mask.png";
                                    }
                                }, function(data) {
                                    console.log('获取微信用户信息错误')
                                })

                            } else {
                                // $rootScope.memberLogin('inDex');
                                throw data.error
                            }
                        }, function(data) { console.log('error') })

                    } else {
                        //$rootScope.memberLogin('inDex');
                        console.log('获取openId失败');
                    }

                }, function(data) { console.log('error') })

            } else {
                //$rootScope.memberLogin('inDex');
            }

        } else { //用户已登录
            if (url.indexOf('#') < 0) {
                $state.go('main');
            }
            $rootScope.hasMember = true;
            $rootScope.member = data.object;
            console.log($rootScope.member);
            var headImg = memberFun.getUserImg(data.object.openId);
            headImg.then(function(data) {
                if (data.object) {
                    if (data.object.user_info_list[0].headimgurl) {
                        $rootScope.headImg = data.object.user_info_list[0].headimgurl;
                        $rootScope.nickName = data.object.user_info_list[0].nickName;
                    } else {
                        $rootScope.headImg = "images/mask.png";
                        $rootScope.nickName = '旺粉';
                    }
                } else {
                    $rootScope.headImg = "images/mask.png";
                }
            }, function(data) { console.log('error') });

        }
    }, function(data) { console.log('error') });


        $rootScope.memberLogin = function(a) {
            $rootScope.hasMM = true;
            $rootScope.sideNavShow = false;
            $rootScope.WHICH = a;
            memberFun.showMemberDiv('login');
            $compile(angular.element(document.querySelector('login')))($scope);
            loginCallBack = function(data) {
                $rootScope.hasMember = true;
                $rootScope.member = data;
                $rootScope.hasMM = false;
            };

        }

    // 显示侧边栏
    $rootScope.sideNav = function() {
        $rootScope.sideNavShow = true;
        if (!document.querySelector('#sideNav')) {
            angular.element(document.querySelector('body')).append("<sideNav></sideNav>");
            $compile(angular.element(document.querySelector('sideNav')))($scope);
        }

    };
    // 关闭遮罩层
    $rootScope.closeSideNav = function() {
        $rootScope.sideNavShow = false;
    };

    // logout
    $rootScope.logout = function() {
        DataAPI.post('/member/logout.ctrl', {}, function(data) {
            if (data != null) {
                $rootScope.sideNavShow = false;
                $rootScope.hasMember = false;
                $rootScope.errorAlert("注销成功");
            }
        }, function(data) { console.log('error'); })
    }

    $rootScope.errorAlert = function(msg) {
        $scope.msg = msg;
        angular.element(document.querySelector('body')).append("<erroralert></erroralert>");
        $compile(angular.element(document.querySelector('erroralert')))($scope);
    }

    if ($rootScope.hasMember) {
        $rootScope.getIndexPro();
    }


}])

//首页
eatApp.controller('homeController', ['$scope', '$rootScope', 'DataAPI', 'memberFun', '$http', function($scope, $rootScope, DataAPI, memberFun, $http) {
    $rootScope.selected = 1;
    $scope.hasMore = true;
    $scope.bannersArr = [{ 'src': 'images/banner.png', 'link': 'http://dev.hotkidclub.com/eat/index.html#/findTest' }, { 'src': 'images/banner.png', 'link': '#' }, { 'src': 'images/banner.png', 'link': '#' }]
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        var SwiperH = new Swiper('.sw1 .swiper-container', {
            // direction: 'horizonal',
            loop: true,
            autoplay: 3000,
            // lazyLoading: true,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
        });
    });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        var SwiperHH = new Swiper('.sw2 .swiper-container', {
            // direction: 'horizonal',
            // loop: true,
            autoplay: 3000,
            // lazyLoading: true,
            // pagination: '.swiper-pagination',
            paginationClickable: true,
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            observer: true //修改swiper自己或子元素时，自动初始化swiper

        });
    });

    // $rootScope.getIndexPro = function() {
    //     DataAPI.post('/eat/product/indexShow.ctrl', {}, function(data) {
    //         if (data.object) {
    //             $scope.hasIndexPro = true;
    //             $scope.proName = data.object.activityName;
    //             $scope.proSku = data.object.sku;
    //             $scope.flavour = data.object.productItem.flavour;
    //             var hasVideo = data.object.hasVideo;
    //             if (hasVideo == 0) {
    //                 $scope.hasVideo = false;
    //             } else {
    //                 $scope.hasVideo = true;
    //             }
    //             $scope.toDetail = false;
    //             if (data.object.note == null || data.object.note == '申请试吃') {
    //                 $scope.note1 = data.object.note;
    //             } else {
    //                 $scope.note1 = data.object.note.split('&')[0];
    //                 $scope.note2 = data.object.note.split('&')[1];
    //                 $scope.note3 = data.object.note.split('&')[2];
    //             }
    //             if ($scope.note1 == '填写地址') {
    //                 $scope.note = '填写地址';
    //                 $scope.isSL = false;
    //             } else if ($scope.note1 == '申请试吃' || $scope.note1 == null) {
    //                 $scope.isSL = true;
    //                 $scope.note = '立即申请';
    //             } else if ($scope.note1 == '集气中') {
    //                 $scope.isSL = false;
    //                 $scope.note = '集气中';
    //             } else if ($scope.note1 == '待评论') {
    //                 $scope.isSL = false;
    //                 $scope.note = '待评论';
    //                 DataAPI.post('/eat/order/intervalTwoDays.ctrl', { 'code': $scope.note2 }, function(data) {
    //                     if (data.object == false) {
    //                         $rootScope.canWrite = true;
    //                         $scope.canwrite2 = function() {
    //                             $scope.promptMsg = '亲爱的旺粉！填写地址后要经过48小时才可以发表评论唷！';
    //                             DataAPI.showPromptSingle();
    //                             $compile(angular.element(document.querySelector('errorsingle')))($scope);
    //                             $scope.btn1 = function() {
    //                                 angular.element(document.querySelector('#errorMsgAlert')).remove();
    //                             }
    //                         }
    //                     } else {
    //                         $rootScope.canWrite = false;
    //                     }
    //                 }, function(data) { console.log('error') })
    //             } else if ($scope.note1 == '已评论') {
    //                 $scope.isSL = false;
    //                 $scope.toDetail = true;
    //                 $scope.note = '已评论';
    //             }
    //         } else {
    //             $scope.hasIndexPro = false;
    //         }

    //     }, function(data) {

    //     })
    // }

    // $rootScope.getIndexPro();

    if ($rootScope.hasMember) {
        $rootScope.getIndexPro();
    }

    DataAPI.post('/eat/comment/commentIndex.ctrl', {}, function(data) {
        if (data.object) {
            $scope.hasIndexCom = true;
            var len = data.object.length;
            if (len == 1) {
                $scope.hasMore = false;
            } else {
                $scope.hasMore = true;
            }
            $scope.indexCom = data.object;
            $scope.comObj = {};
            for (var i = 0; i < data.object.length; i++) {
                var span = [];
                for (var j = 0; j < data.object[i].productStars; j++) {
                    span[j] = true;
                };
                if (data.object[i].likeNumbers > 1000) {
                    $scope.indexCom.likeNumbers = '999+';
                }
                $scope.indexCom[i].span = span;
                $scope.memberId = data.object[i].member.openId;
            }
            $scope.getUserInfo = function(i) {
                $scope.memberId = data.object[i].member.openId;
                var promise = memberFun.getUserImg($scope.memberId);
                promise.then(function(data) {
                    if (data.object) {
                        if (data.object.user_info_list[0].headimgurl && data.object.user_info_list[0].nickname) {
                            $scope.comImg = data.object.user_info_list[0].headimgurl;
                            $scope.userName = data.object.user_info_list[0].nickname;
                        } else {
                            $scope.comImg = "images/mask.png";
                            $scope.userName = '旺粉'
                        }
                    } else {
                        $scope.comImg = "images/mask.png";
                        $scope.userName = '旺粉'
                    }
                    $scope.indexCom[i].comImg = $scope.comImg;
                    $scope.indexCom[i].userName = $scope.userName;
                });
            }
            for (var i = 0; i < len; i++) {
                $scope.getUserInfo(i)
            }

        } else {
            $scope.hasIndexCom = false;
        }
    }, function(data) { console.log('error') })

}])
