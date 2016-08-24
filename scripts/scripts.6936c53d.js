"use strict";angular.module("superstockApp",["ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","ui.grid","ui.grid.pinning","firebase.auth","firebase.ref","ui.slider","btorfs.multiselect"]),$(document).on("click",".ui-grid-row",function(){var a=$(this),b=a.find(".click-row").length;$(".ui-grid-row").find(".ui-grid-cell").removeClass("click-row"),setTimeout(function(){b>0?a.children().children().removeClass("click-row"):a.children().children().addClass("click-row")},50),$(".view-containner").css("width","1366px"),console.log($(".view-containner").css("width"))}),angular.module("superstockApp").factory("draw",["$firebaseArray",function(a){var b=function(b,c,d,e,f){var g=a(b),h=[],i=!0;g.$watch(function(a){if(0!=i&&0!=g.length){var b=g[g.length-1],e={};c.idLabel&&(e[c.idLabel]=b.$id);var f=b.$value.split("|");for(var j in c.labelList)c.labelList[j].format.indexOf("percent")>-1?e[c.labelList[j].fieldName]=Math.ceil(1e4*f[j])/100:c.labelList[j].format.indexOf("bigNum")>-1||c.labelList[j].format.indexOf("number")>-1?e[c.labelList[j].fieldName]=parseFloat(f[j]):e[c.labelList[j].fieldName]=f[j];d(e),h.push(e)}}),g.$loaded(function(){i=!1,e(g),console.log("loaded"),b.on("child_added",function(a,b){console.log("add");var d={};c.idLabel&&(d[c.idLabel]=a.key);var e=a.val().split("|");for(var g in c.labelList)c.labelList[g].format.indexOf("percent")>-1?d[c.labelList[g].fieldName]=Math.ceil(1e4*e[g])/100:c.labelList[g].format.indexOf("bigNum")>-1||c.labelList[g].format.indexOf("number")>-1?d[c.labelList[g].fieldName]=parseFloat(e[g]):d[c.labelList[g].fieldName]=e[g];f.added(d,a,b)}),b.on("child_changed",function(a,b){console.log("change");var d={};c.idLabel&&(d[c.idLabel]=a.key);var e=a.val().split("|");for(var g in c.labelList)c.labelList[g].format.indexOf("percent")>-1?d[c.labelList[g].fieldName]=Math.ceil(1e4*e[g])/100:c.labelList[g].format.indexOf("bigNum")>-1||c.labelList[g].format.indexOf("number")>-1?d[c.labelList[g].fieldName]=parseFloat(e[g]):d[c.labelList[g].fieldName]=e[g];f.changed(d,a,b)}),b.on("child_removed",function(a){console.log("remove"),f.removed(a)})})};return{drawGrid:b}}]),angular.module("superstockApp").factory("utils",function(){return{getCellTemplate:function(a,b){switch(a){case"priceChange":return"<div ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-red': COL_FIELD < 0, 'grid-cell-green': COL_FIELD >= 0}\">{{COL_FIELD | number}}</div>";case"EPS":return"<div ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-red': COL_FIELD < 1000, 'grid-cell-green': COL_FIELD > 1000}\">{{COL_FIELD | number}}</div>";case"revenueChange":case"EPSChange":case"profitChange":return"<div ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-red': COL_FIELD < 0, 'grid-cell-green': COL_FIELD > 0}\">{{COL_FIELD | number}}</div>";case"point":return"<div ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-red': COL_FIELD < 5, 'grid-cell-green': COL_FIELD >= 5, 'grid-cell-purple': COL_FIELD >= 7}\">{{COL_FIELD | number}}</div>";case"roe":return"<div ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-red': COL_FIELD < 10, 'grid-cell-green': COL_FIELD > 10 }\">{{COL_FIELD | number}}</div>";case"fxEffect":case"cashFlow":return"<div ng-class=\"{'ui-grid-cell-contents': true, 'grid-cell-red': COL_FIELD < 0, 'grid-cell-green': COL_FIELD > 0 }\">{{COL_FIELD | number}}</div>";default:return b?'<div class="ui-grid-cell-contents">{{COL_FIELD | number}}</div>':'<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'}}}}),angular.module("superstockApp").filter("reverse",function(){return function(a){return angular.isArray(a)?a.slice().reverse():[]}}),angular.module("firebase.auth",[]).constant("SIMPLE_LOGIN_PROVIDERS",["password","facebook"]).constant("loginRedirectPath","/login").factory("auth",["$firebaseAuth",function(a){return a()}]),angular.module("firebase.ref",["firebase"]).factory("Ref",function(){return firebase.database().ref()}),angular.module("superstockApp").controller("LoginCtrl",["$scope","auth","$location",function(a,b,c){function d(a){var b=(rootRef.child("users").child(a.uid),$q.defer());return ref.set({email:email,name:e(email)},function(a){$timeout(function(){a?b.reject(a):b.resolve(ref)})}),b.promise}function e(a){return f(a.substr(0,a.indexOf("@"))||"")}function f(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}function g(){c.path("/account")}function h(b){a.err=b}a.loginBtn=!0,a.logoutBtn=!0,b.$onAuthStateChanged(function(b){b&&(console.log(" logged: "+b.uid),a.logoutBtn=!0,a.loginBtn=!1,c.path("/account"))}),a.oauthLogin=function(a){b.$signInWithPopup(a).then(function(a){console.log("logged"),g()})["catch"](function(a){console.log("login error"),h(a)})},a.anonymousLogin=function(){b.$signInAnonymously().then(function(a){console.log("logged ",a.uid)})["catch"](function(a){console.log("login error ",a)})},a.passwordLogin=function(a,c){b.$signInWithEmailAndPassword(a,c).then(function(a){g(),console.log("logged")})["catch"](function(a){h(a),console.log("error: "+a)})},a.createAccount=function(c,e,f){a.err=null,e?e!==f?a.err="Passwords do not match":b.$createUserWithEmailAndPassword(c,e).then(function(a){return console.log("User "+a.uid+" created successfully"),a}).then(function(a){console.log("Logged user: ",a.uid),d(),g()})["catch"](function(a){console.error("Error: ",a)}):a.err="Please enter a password"}}]),angular.module("superstockApp").controller("AccountCtrl",["$scope","auth","currentAuth",function(a,b,c,d){function e(a){console.log("Error: ",a)}a.user={uid:c.uid,name:c.displayName,photo:c.photoURL,email:c.email},a.authInfo=c,a.changePassword=function(c,d,f){a.err=null,c&&d?d!==f?e("Passwords do not match"):b.$updatePassword(d).then(function(){console.log("Password changed")},e):e("Please enter all fields")},a.changeEmail=function(a){b.$updateEmail(a).then(function(){console.log("email changed successfully")})["catch"](function(a){console.log("Error: ",a)})},a.logout=function(){b.$signOut()},a.updateProfile=function(a,b){firebase.auth().currentUser.updateProfile({displayName:a,photoURL:b}).then(function(){console.log("updated")})["catch"](function(a){console.log("error ",a)})}}]),angular.module("superstockApp").controller("MainCtrl",["$rootScope","$scope","$firebaseArray","$firebaseObject","Ref","draw","utils","$window",function(a,b,c,d,e,f,g,h){a.link="main",h.ga("send","event","Page","Tổng hợp"),$(".view-containner").css("width",$(document).width()+"px"),$("#wrapper").addClass("toggled");var i=parseFloat($(".header").css("height"))+parseFloat($(".footer").css("height")),j=$(document).height(),k=30;b.gridOptions={minRowsToShow:Math.floor((j-i-k)/30),data:[]},console.log(b.gridOptions);var l=d(e.child("summary_titles")),m=d(e.child("summary_headers")),n=d(e.child("summary_format"));l.$loaded(function(){m.$loaded(function(){n.$loaded(function(){var c=l.data.split("|"),d=m.data.split("|"),g=n.data.split("|");console.log(g),console.log(c),console.log(d);var h=[],i={idLabel:"Mã",labelList:[]};for(var j in c){i.labelList.push({fieldName:d[j],format:g[j]});var k=null,o=null;g[j].indexOf("bigNum")>-1||g[j].indexOf("number")>-1?(k="number",o="ui-cell-align-right"):o=g[j].indexOf("percent")>-1?"ui-cell-align-right":"ui-cell-align-left";var p={field:d[j],displayName:c[j],cellClass:o};k&&(p.cellFilter=k),g[j].indexOf("percent")>-1&&(p.cellClass+=" percent"),h.push(p)}a.filters=h,b.gridOptions.columnDefs=h,f.drawGrid(e.child("summary_data"),i,function(a){b.gridOptions.data.push(a)},function(a){console.log(b.gridOptions.data)},{added:function(a,c,d){var e=c.key;for(var f in b.gridOptions.data)if(b.gridOptions.data[f].symbol==e)return void(b.gridOptions.data[f]=a);b.gridOptions.data.push(a)},changed:function(a,c,d){var e=c.key;for(var f in b.gridOptions.data)if(b.gridOptions.data[f].symbol==e){b.$apply(function(){for(var c in a)b.gridOptions.data[f][c]=a[c]});break}},removed:function(a){var c=a.key;for(var d in b.gridOptions.data)if(b.gridOptions.data[d].symbol==c){b.gridOptions.data.splice(d,1);break}}})})})})}]),angular.module("superstockApp").controller("FullStockCtrl",["$rootScope","$scope","auth","$firebaseArray","$firebaseObject","Ref","draw","uiGridConstants","$sce","utils","currentAuth","$window",function(a,b,c,d,e,f,g,h,i,j,k,l){function m(a,b){if(b){for(var c in b)for(var d in a)if(a[d].field==c){a[d].filters?a[d].filters[0].term=b[c]:a[d].filter&&(a[d].filter.term=b[c]);break}return a}b={};for(var c in a)a[c].filters?b[a[c].field]=a[c].filters[0].term:a[c].filter&&(b[a[c].field]=a[c].filter.term?a[c].filter.term:null);return b}a.link="full",l.ga("send","event","Page","Đầy đủ");var n=null,o=null;if(k){var p=e(f.child("users/"+k.uid+"/filter"));p.$loaded(function(a){o={};for(var c in a)"$"!=c.charAt(0)&&"forEach"!=c&&(o[c]=a[c]);b.gridOptions.columnDefs&&(b.gridOptions.columnDefs=m(b.gridOptions.columnDefs,o))})}$("#wrapper").addClass("toggled"),b.iSrc="",b.iSrcTrust=i.trustAsResourceUrl(b.iSrc),b.uiGridConstants=h;var q=parseFloat($(".header").css("height"))+parseFloat($(".footer").css("height")),r=$(document).height(),s=30;b.gridOptions={flatEntityAccess:!0,fastWatch:!0,enableFiltering:!0,excessRows:50,excessColumns:32,minRowsToShow:Math.floor((r-q-30-s)/30),data:[],onRegisterApi:function(a){b.gridApi=a,b.gridApi.core.on.filterChanged(b,function(){n=f.child("users/"+k.uid);var a=m(b.gridOptions.columnDefs,null);n.child("filter").set(a,function(a){a?console.log(a):console.log("Saved filter")})})}};var t=1e9,u=e(f.child("superstock_titles")),v=e(f.child("superstock_fields")),w=e(f.child("superstock_format"));v.$loaded(function(){u.$loaded(function(){w.$loaded(function(){var c=u.data.split("|"),d=v.data.split("|"),e=w.data.split("|");console.log(e),console.log(c),console.log(d);var i=[50,200,130,130,120,150,150,110,70,230,220,200,120,170,80,130,120,120,100,100,100,70,80,90,130,150,250,60,100,90,90,150],k=[],l={idLabel:"Mã",labelList:[]};for(var n in c){l.labelList.push({fieldName:d[n],format:e[n]});var p=null,q=null;e[n].indexOf("bigNum")>-1||e[n].indexOf("number")>-1?(p="number",q="ui-cell-align-right"):q=e[n].indexOf("percent")>-1?"ui-cell-align-right":"ui-cell-align-left";var r={field:d[n],width:i[n],displayName:c[n],cellClass:q};if(p&&(r.cellFilter=p),e[n].indexOf("percent")>-1&&(r.cellClass+=" percent"),""!=e[n]){var s=e[n].split(":"),x=[{condition:h.filter.GREATER_THAN,placeholder:"greater than",term:"bigNum"==s[0]?parseFloat(s[2])*t:parseFloat(s[2]),min:"bigNum"==s[0]?parseFloat(s[1])*t:parseFloat(s[1]),bigNum:"bigNum"==s[0]?!0:!1},{condition:h.filter.LESS_THAN,placeholder:"less than",term:"bigNum"==s[0]?parseFloat(s[3])*t:parseFloat(s[3]),max:"bigNum"==s[0]?parseFloat(s[3])*t:parseFloat(s[3])}];r.filters=x,r.cellTemplate=j.getCellTemplate(d[n],!0)}else r.cellTemplate=j.getCellTemplate(d[n]);"shorttermSignal"==d[n]?r.filter={term:null,selectOptions:[{value:"xBán",label:"Bán"},{value:"xMua nếu cơ bản tốt",label:"Mua"}],condition:function(a,b){var c=[];for(var d in a)c.push(a[d].value);return c&&0!=a.length?c.indexOf(b)>-1:!0}}:"industry"==d[n]&&(r.filter={selectOptions:[{value:"Bao bì & đóng gói",label:"Bao bì & đóng gói"},{value:"Nông sản và thủy hải sản",label:"Nông sản và thủy hải sản"},{value:"Ngân hàng",label:"Ngân hàng"},{value:"Thực phẩm",label:"Thực phẩm"}],typeSearch:"multiple",term:null,condition:function(a,b){var c=[];for(var d in a)c.push(a[d].value);return c&&0!=a.length?c.indexOf(b)>-1:!0}}),k.push(r)}for(var n in k)"symbol"==k[n].field&&(k[n].pinnedLeft=!0,k[n].cellTemplate='<div><div ng-click="grid.appScope.symbolClick(row,col)" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>');a.filters=k,b.gridOptions.columnDefs=k,console.log(k),o&&(b.gridOptions.columnDefs=m(b.gridOptions.columnDefs,o)),g.drawGrid(f.child("superstock"),l,function(a){b.gridOptions.data.push(a)},function(a){},{added:function(a,c,d){var e=c.key;for(var f in b.gridOptions.data)if(b.gridOptions.data[f].symbol==e)return void(b.gridOptions.data[f]=a);b.gridOptions.data.push(a)},changed:function(a,c,d){var e=c.key;for(var f in b.gridOptions.data)if(b.gridOptions.data[f].symbol==e){b.$apply(function(){for(var c in a)b.gridOptions.data[f][c]=a[c]});break}},removed:function(a){var c=a.key;for(var d in b.gridOptions.data)if(b.gridOptions.data[d].symbol==c){b.gridOptions.data.splice(d,1);break}}})})})}),a.parseBigNum=function(a){var b=parseFloat(a)/t;return b},b.symbolClick=function(a,c){$("#myModal").modal("show"),b.stockInfo=a.entity.symbol+" - "+a.entity.industry,b.iSrc="https://banggia.vndirect.com.vn/chart/?symbol="+a.entity.symbol,b.iSrcTrust=i.trustAsResourceUrl(b.iSrc)},a.search=function(c){b.gridApi.grid.columns[0].filters[0]={term:a.searchTerm}},a.defaultFilter=function(a){if(a){a=a[0],l.ga("send","event","Filter",a.filterName);for(var c in b.gridOptions.columnDefs){var d=b.gridOptions.columnDefs[c].field;for(var e in a)if("filterName"!=e&&e==d){b.gridOptions.columnDefs[c].filters&&(b.gridOptions.columnDefs[c].filters[0].term=a[e]);break}}}},$(document).ready(function(){$(document).on("change",".subTerm",function(){var a=$(this);a.prop("value",a.val());var c=a.prop("id");for(var d in b.gridOptions.columnDefs)if(b.gridOptions.columnDefs[d].field==c){b.$apply(function(){b.gridOptions.columnDefs[d].filters[0].term=parseFloat(a.val())*t,a.prop("value",a.val())});break}a.parent().next().children().slider({slide:function(b,c){a.prop("value",c.value/t)}})})})}]).directive("ngEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter)}),b.preventDefault())})}}),angular.module("superstockApp").controller("MenuCtrl",["$rootScope","$scope","auth","$location","Ref","$firebaseObject",function(a,b,c,d,e,f){a.user=null,a.link="",b.filterShow=function(b){b.preventDefault(),b.stopPropagation(),"main"!=a.link&&$("#wrapper").toggleClass("toggled")};b.oauthLogin=function(a){c.$signInWithPopup(a).then(function(a){})["catch"](function(a){console.log("login error"),console.log(a)})},b.logout=function(){c.$signOut()},c.$onAuthStateChanged(function(a){})}]),angular.module("superstockApp").controller("FilterCtrl",["$rootScope","$scope","Ref","$firebaseArray","$compile",function(a,b,c,d,e){b.defaultFilter=[{EPS:1e3,maVol30:3e8,point:7,profitChange:20,roe:7,filterName:"Cơ bản tốt"}];var f='<multiselect ng-model="filter" options="defaultFilter" class="signle-select" selection-limit="1" id-prop="filterName" display-prop="filterName"></multiselect>';$(".default-filter").html(e(f)(b)),b.$watch("filter",function(){a.defaultFilter&&a.defaultFilter(b.filter)})}]),angular.module("superstockApp").directive("ngShowAuth",["auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuthStateChanged(e),e()}}}]),angular.module("superstockApp").directive("ngHideAuth",["auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuthStateChanged(e),e()}}}]),angular.module("superstockApp").directive("categoryHeader",function(){function a(a){console.log(a.gridOptions.columnDefs),a.headerRowHeight=30,a.catHeaderRowHeight=a.headerRowHeight+"px",a.categories=[];var b="",c=0,d=0;cols=a.gridOptions.columnDefs;for(var e=0;e<cols.length;e++){c+=Number(cols[e].width);var f="undefined"==typeof cols[e].categoryDisplayName?" ":cols[e].categoryDisplayName;f!==b&&(a.categories.push({displayName:b,width:c-Number(cols[e].width),widthPx:c-Number(cols[e].width)+"px",left:d,leftPx:d+"px"}),d+=c-Number(cols[e].width),c=Number(cols[e].width),b=f)}c>0&&a.categories.push({displayName:b,width:c,widthPx:c+"px",left:d,leftPx:d+"px"})}return{templateUrl:"scripts/directives/templates/category_header.html",link:a}}),angular.module("superstockApp").config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{currentAuth:["auth",function(a){return a.$waitForSignIn()}]}}).when("/full",{templateUrl:"views/full-stock.html",controller:"FullStockCtrl",resolve:{currentAuth:["auth",function(a){return a.$waitForSignIn()}]}}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/account",{templateUrl:"views/account.html",controller:"AccountCtrl",resolve:{currentAuth:["auth",function(a){return a.$requireSignIn()}]}}).when("/chat",{templateUrl:"views/chat.html",controller:"Chat",resolve:{currentAuth:["auth",function(a){return a.$waitForSignIn()}]}}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","loginRedirectPath","auth",function(a,b,c,d,e,f,g,h){d.$onAuthStateChanged(function(b){a.user=b}),a.$on("$routeChangeError",function(a,d,e,f){"AUTH_REQUIRED"===f&&b.path(c)})}]);