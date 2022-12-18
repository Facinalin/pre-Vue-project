"use strict";

var loginEmail = document.querySelector('.loginEmail');
var loginPSW = document.querySelector('.loginPSW');
var signUpEmail = document.querySelector('.signUpEmail');
var signUpPSW = document.querySelector('.signUpPSW');
var signUpBtn = document.querySelector('.signUpBtn');
var loginBtn = document.querySelector('.loginBtn');
var api_Url = 'http://localhost:3005/';
var getUserId = localStorage.getItem('userId');
var getUserToken = localStorage.getItem('user1hrToken');
var logSignPanel = document.querySelector('.logSignPanel');
var logOutBtn = document.querySelector('.logOutBtn');
var toAdmin = document.querySelector('.toAdmin');
var sightListArea = document.querySelector('.sightListArea');
var sightId = location.href.split("=")[1];
var likeListArea = document.querySelector('.likeListArea'); //後台收藏

var perSightArticle = document.querySelector('.perSightArticle');

function checkLoggedIn() {
  return getUserId && getUserToken ? true : false;
}

function signUp() {
  if (signUpEmail && signUpBtn && signUpPSW) {
    signUpBtn.addEventListener('click', function (e) {
      var emailVal = signUpEmail.value;
      var pswVal = signUpPSW.value;
      var obj = {};
      obj.email = emailVal;
      obj.password = pswVal;
      signUpPost(obj);
      alert('註冊成功！');
    });
  }
}

function signUpPost(obj) {
  axios.post("".concat(api_Url, "register"), obj).then(function (response) {
    console.log(response.data);
  })["catch"](function (error) {
    console.log(error);
  });
}

var token = '';
var id = '';

function loginPost(obj) {
  axios.post("".concat(api_Url, "login"), obj).then(function (response) {
    console.log(response.data);
    token = response.data.accessToken;
    id = response.data.user.id;
    localStorage.setItem('user1hrToken', token);
    localStorage.setItem('userId', id);
    loginEmail.value = "";
    loginPSW.value = "";
    alert('登入成功');
    location.href = '/index.html';
  })["catch"](function (error) {
    console.log(error);
    alert('帳號或密碼不存在，請重新輸入');
  });
}

function login() {
  if (loginEmail && loginPSW && loginBtn) {
    loginBtn.addEventListener('click', function (e) {
      var emailVal = loginEmail.value;
      var pswVal = loginPSW.value;
      var obj = {};
      obj.email = emailVal;
      obj.password = pswVal;
      loginPost(obj);
    });
  }
}

function logInChange() {
  if (getUserId && getUserToken) {
    logSignPanel.textContent = '';
    toAdmin.classList.remove('display-none');
  }
}

function logOut() {
  if (logOutBtn) {
    logOutBtn.addEventListener('click', function (e) {
      console.log('有點到');
      localStorage.clear();
      setTimeout(function () {
        window.location.replace('/'); //導回首頁
      }, 300);
    });
  }
}

function logOutChange() {
  if (!getUserId && !getUserToken) {
    logOutBtn.classList.add('display-none');
  }
}

signUp();
login();
logInChange();
logOut();
logOutChange();
adminChange();

function adminChange() {
  if (likeListArea) {
    toAdmin.classList.add('display-none');
  }
} //以上登入註冊區


if (sightListArea) {
  getSightList();
}

var sightData = [];

function getSightList() {
  axios.get("".concat(api_Url, "sights")).then(function (response) {
    console.log(response.data);
    sightData = response.data;
    renderSightList(sightListArea, sightData);
  })["catch"](function (error) {
    console.log(error); //alert('資料庫異常');
  });
} //首頁渲染產品列表


function renderSightList(dom, data) {
  var str = '';
  data.forEach(function (el) {
    var title = el.title,
        imgUrl = el.imgUrl,
        description = el.description,
        id = el.id;

    if (data.length > 0) {
      str += "<div class=\"col-lg-3 card my-4 mx-3\" style=\"width: 18rem;\">\n      <img src=\"".concat(imgUrl, "\" class=\"card-img-top\" alt=\"\">\n      <div class=\"card-body\">\n        <h5 class=\"card-title\">").concat(title, "</h5>\n        <p class=\"card-text\">").concat(description, "</p>\n        <a href=\"/article.html?id=").concat(id, "\" class=\"btn btn-primary text-white\">\u770B\u66F4\u591A\u8CC7\u8A0A...</a>\n      </div>\n    </div>");
    } else {
      return '';
    }

    dom.innerHTML = str;
  });
} //單頁article get


if (perSightArticle) {
  getPerSight();
}

var perSightData = {};

function getPerSight() {
  axios.get("".concat(api_Url, "sights/").concat(sightId)).then(function (response) {
    console.log(response.data);
    perSightData = response.data;
    console.log(perSightArticle);
    renderPerSight(perSightArticle, perSightData);
  })["catch"](function (err) {
    console.log(err);
  });
} //渲染單頁景點文章


function renderPerSight(dom, data) {
  var title = data.title,
      imgUrl = data.imgUrl,
      description = data.description,
      blogUrl = data.blogUrl,
      id = data.id;
  dom.innerHTML = "<div class=\"d-flex flex-column align-items-center\">\n    <img src=\"".concat(imgUrl, "\" class=\"article-img\" alt=\"\">\n    <div class=\"card-body-article\">\n      <h5 class=\"card-title\">").concat(title, "</h5>\n      <p class=\"card-text\">").concat(description, "</p>\n      <div class=\"btnArea d-flex justify-content-between\">\n      <a target=\"_blank\" href=\"").concat(blogUrl, "\" class=\"btn btn-secondary text-white mt-4 me-8\">\u9EDE\u6211\u770B\u53C3\u8003\u90E8\u843D\u683C\u6587\u7AE0\uFF01</a>\n      <button class=\"btn btn-info text-white mt-4 ms-8 addToLike\" data-id=\"").concat(id, "\">\u2661 \u6536\u85CF</button>\n      <button class=\"disabled btn btn-success text-white mt-4 ms-8 alreadyInLike\" data-id=\"").concat(id, "\">&#10003;\u5DF2\u6536\u85CF</button>\n    </div>\n    </div>\n  </div>");
  var addToLike = document.querySelector('.addToLike');
  var alreadyInLike = document.querySelector('.alreadyInLike');

  if (true) {}

  var likesData = [];

  if (checkLoggedIn()) {
    axios.get("".concat(api_Url, "600/users/").concat(getUserId, "/likes?_expand=sight"), {
      headers: {
        "authorization": "Bearer ".concat(getUserToken)
      }
    }).then(function (response) {
      likesData = response.data;
      console.log(likesData);
      console.log(sightId);
      var indicate = likesData.filter(function (el) {
        return el.sightId == sightId;
      });
      console.log(indicate);

      if (indicate.length != 0) {
        addToLike.classList.add('display-none');
      } else {
        alreadyInLike.classList.add('display-none');
      }
    })["catch"](function (error) {
      console.log(error);
    });
  } else {
    addToLike.classList.add('display-none');
    alreadyInLike.classList.add('display-none');
  }

  console.log(addToLike);
  addToLike.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(e.target);
  }); //收藏功能記得加到這，總
} //收藏功能
//監聽收藏按鈕


function addToLikePost() {
  axios.post("".concat(api_Url, "600/likes"), {}).then(function (response) {})["catch"](function (error) {
    console.log(error);
  });
}

addToLikesGet();
var likesData = [];

function addToLikesGet() {
  axios.get("".concat(api_Url, "600/users/").concat(getUserId, "/likes?_expand=sight"), {
    headers: {
      "authorization": "Bearer ".concat(getUserToken)
    }
  }).then(function (response) {
    console.log(response.data);
    likesData = response.data;
    renderAdminLikeList(likeListArea, likesData);
  })["catch"](function (error) {
    console.log(error);
  });
} //渲染後台收藏列表


function renderAdminLikeList(dom, data) {
  var likeStr = '';
  data.forEach(function (el) {
    var _el$sight = el.sight,
        title = _el$sight.title,
        imgUrl = _el$sight.imgUrl,
        description = _el$sight.description,
        id = _el$sight.id;
    likeStr += "<div class=\"card my-4 d-flex flex-row likePerCard\">\n    <img src=\"".concat(imgUrl, "\" class=\"card-img-top\" alt=\"\">\n    <div class=\"card-body\">\n      <h5 class=\"card-title\">").concat(title, "</h5>\n      <p class=\"card-text\">").concat(description, "</p>\n      <span class=\"text-success\">&#10003;\u5DF2\u6536\u85CF</span><a href=\"/article.html\" class=\"btn btn-warning text-white ms-4\" data-id=\"").concat(id, "\">\u53D6\u6D88\u6536\u85CF</a>\n    </div>\n  </div>");
    dom.innerHTML = likeStr;
  });
} //判定已收藏/未收藏
//# sourceMappingURL=all.js.map
