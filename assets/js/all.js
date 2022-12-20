"use strict";

var loginEmail = document.querySelector('.loginEmail');
var loginPSW = document.querySelector('.loginPSW');
var signUpEmail = document.querySelector('.signUpEmail');
var signUpPSW = document.querySelector('.signUpPSW');
var signUpBtn = document.querySelector('.signUpBtn');
var loginBtn = document.querySelector('.loginBtn');
var api_Url = 'https://pre-vue-json-server-auth.vercel.app';
var getUserId = localStorage.getItem('userId');
var getUserToken = localStorage.getItem('user1hrToken');
var getUserAdmin = localStorage.getItem('admin');
var logSignPanel = document.querySelector('.logSignPanel');
var logOutBtn = document.querySelector('.logOutBtn');
var toAdmin = document.querySelector('.toAdmin');
var myLikesList = document.querySelector('.myLikesList');
var sightListArea = document.querySelector('.sightListArea');
var sightId = location.href.split("=")[1];
var likeListArea = document.querySelector('.likeListArea');
var perSightArticle = document.querySelector('.perSightArticle');
var manageSightList = document.querySelector('.manageSightList');
var addToSightBtn = document.querySelector('.addToSightBtn');
var sightTitle = document.querySelector('#sightTitle');
var sightDescription = document.querySelector('#sightDescription');
var sightImgUrl = document.querySelector('#sightImgUrl');
var sightBlogUrl = document.querySelector('#sightBlogUrl');
var patchSightBtn = document.querySelector('.patchSightBtn');

function selfRefresh() {
  window.location.replace(location.href);
}

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
  axios.post("".concat(api_Url, "/register"), obj).then(function (response) {
    console.log(response.data);
  })["catch"](function (error) {
    console.log(error);
  });
}

var token = '';
var id = '';
var admin = '';

function loginPost(obj) {
  axios.post("".concat(api_Url, "/login"), obj).then(function (response) {
    console.log(response.data);
    token = response.data.accessToken;
    id = response.data.user.id;
    admin = response.data.user.isAdmin;
    localStorage.setItem('user1hrToken', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('admin', admin);
    loginEmail.value = "";
    loginPSW.value = "";
    alert('登入成功');

    if (admin === true) {
      location.href = '/myAdmin.html';
    } else {
      location.href = '/index.html';
    }
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
    myLikesList.classList.remove('display-none');
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
myAdminChange(); //這邊不懂

function myAdminChange() {
  if (getUserAdmin === "true") {
    console.log('有吃到');
    toAdmin.classList.remove('display-none');
  }
}

console.log(toAdmin);
console.log(getUserAdmin);

function adminChange() {
  if (likeListArea) {
    myLikesList.classList.add('display-none');
  }
} //以上登入註冊區


if (sightListArea) {
  getSightList();
}

var sightData = [];

function getSightList() {
  axios.get("".concat(api_Url, "/sights")).then(function (response) {
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
      str += "<div class=\"col-lg-3 card my-4 mx-3\" style=\"width: 18rem;\">\n      <img src=\"".concat(imgUrl, "\" class=\"card-img-top\" alt=\"\">\n      <div class=\"card-body\">\n        <h5 class=\"card-title\">").concat(title, "</h5>\n        <p class=\"card-text\">").concat(description, "</p>\n        <a href=\"./article.html?id=").concat(id, "\" class=\"btn btn-primary text-white\">\u770B\u66F4\u591A\u8CC7\u8A0A...</a>\n      </div>\n    </div>");
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
  axios.get("".concat(api_Url, "/sights/").concat(sightId)).then(function (response) {
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
    axios.get("".concat(api_Url, "/600/users/").concat(getUserId, "/likes?_expand=sight"), {
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

      if (indicate.length === 0) {
        console.log('未收藏過');
        alreadyInLike.classList.add('display-none');
      } else {
        console.log('收藏過了');
        addToLike.classList.add('display-none');
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
    var sightId = e.target.getAttribute('data-id');
    var obj = {};
    obj.sightId = sightId;
    addToLikePost(obj, addToLike, alreadyInLike);
  }); //收藏功能記得加到這，總
} //收藏功能
//監聽收藏按鈕


function addToLikePost(obj, dom1, dom2) {
  axios.post("".concat(api_Url, "/600/users/").concat(getUserId, "/likes"), obj, {
    headers: {
      "authorization": "Bearer ".concat(getUserToken)
    }
  }).then(function (response) {
    console.log(response.data);
    console.log(getUserToken);
    dom1.classList.add('display-none');
    dom2.classList.remove('display-none');
  })["catch"](function (error) {
    console.log(error);
    console.log(getUserToken);
  });
}

if (likeListArea) {
  addToLikesGet();
}

var likesData = [];

function addToLikesGet() {
  axios.get("".concat(api_Url, "/600/users/").concat(getUserId, "/likes?_expand=sight"), {
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
} //渲染我的收藏列表


function renderAdminLikeList(dom, data) {
  var likeStr = '';

  if (data.length > 0) {
    data.forEach(function (el) {
      var id = el.id;
      var _el$sight = el.sight,
          title = _el$sight.title,
          imgUrl = _el$sight.imgUrl,
          description = _el$sight.description;
      likeStr += "<div class=\"card my-4 d-flex flex-row likePerCard\">\n    <img src=\"".concat(imgUrl, "\" class=\"card-img-top\" alt=\"\">\n    <div class=\"card-body\">\n      <h5 class=\"card-title\">").concat(title, "</h5>\n      <p class=\"card-text\">").concat(description, "</p>\n      <span class=\"text-success\">&#10003;\u5DF2\u6536\u85CF</span><button href=\"#\" class=\"btn btn-warning text-white ms-4 deleteLikes\" data-id=\"").concat(id, "\">\u53D6\u6D88\u6536\u85CF</button>\n    </div>\n  </div>");
      dom.innerHTML = likeStr;
    });
    var deleteLikes = document.querySelectorAll('.deleteLikes');
    deleteLikes.forEach(function (el) {
      el.addEventListener('click', function (e) {
        var deleteId = e.target.getAttribute('data-id');
        axios["delete"]("".concat(api_Url, "/600/likes/").concat(deleteId), {
          headers: {
            "authorization": "Bearer ".concat(getUserToken)
          }
        }).then(function (response) {
          console.log(response.data);
          alert('成功取消收藏！');
          selfRefresh();
        })["catch"](function (error) {
          console.log(error);
        });
      });
    });
  } else {
    dom.innerHTML = "<h3 class=\"text-secondary\">\u76EE\u524D\u7121\u4EFB\u4F55\u6536\u85CF</h3>";
  }
} //後台
//渲染已上傳景點列表


function removeSight(id) {
  axios["delete"]("".concat(api_Url, "/600/sights/").concat(id), {
    headers: {
      "authorization": "Bearer ".concat(getUserToken)
    }
  }).then(function (response) {
    console.log(response.data);
    alert('刪除成功！');
    location.href = '/myAdmin.html';
  })["catch"](function (error) {
    console.log(error);
  });
}

function renderSightAtAdmin(dom, data) {
  var sightListStr = '';

  if (data.length > 0) {
    data.forEach(function (el) {
      var title = el.title,
          description = el.description,
          imgUrl = el.imgUrl,
          id = el.id;
      sightListStr += "<div class=\"card my-4 d-flex flex-row likePerCard\">\n    <a href=\"/editSight.html?id=".concat(id, "\" class=\"btn btn-danger text-white ms-4 editSight\" data-id=\"").concat(id, "\"><span>&#9999;</span><br>\u7DE8<br>\u8F2F</a>\n    <a href=\"#\" class=\"btn btn-secondary text-white ms-4 deleteSight\" data-id=\"").concat(id, "\"><span>&#9999;</span><br>\u522A<br>\u9664</a>\n    <div class=\"card-body\">\n        <h5 class=\"card-title\">").concat(title, "</h5>\n        <p class=\"card-text\">").concat(description, "</p>          \n      </div>\n    <img src=\"").concat(imgUrl, "\" class=\"card-img-top\" alt=\"\">\n  </div>");
      dom.innerHTML = sightListStr;
    });
    var sightRemoving = document.querySelectorAll('.deleteSight');
    sightRemoving.forEach(function (el) {
      el.addEventListener('click', function (e) {
        var removeSightId = e.target.getAttribute('data-id');
        console.log('到底');
        removeSight(removeSightId);
      });
    });
  } else {
    dom.innerHTML = "<h3 class=\"text-secondary\">\u76EE\u524D\u7121\u4EFB\u4F55\u5DF2\u4E0A\u50B3\u666F\u9EDE\u8CC7\u6599</h3>";
  }
} //delete: http://localhost:3005/600/sights/5
//get所有sight列表
//http://localhost:3005/600/users/1/sights


function getSightAtAdmin() {
  axios.get("".concat(api_Url, "/600/users/").concat(getUserId, "/sights"), {
    headers: {
      "authorization": "Bearer ".concat(getUserToken)
    }
  }).then(function (response) {
    console.log(response.data);
    sightData = response.data;
    renderSightAtAdmin(manageSightList, sightData);
  })["catch"](function (error) {
    console.log(error); //alert('資料庫異常');
  });
}

if (manageSightList) {
  getSightAtAdmin();
} //新增景點
//http://localhost:3005/600/users/1/sights


function addSightPost(obj) {
  axios.post("".concat(api_Url, "/600/users/").concat(getUserId, "/sights"), obj, {
    headers: {
      "authorization": "Bearer ".concat(getUserToken)
    }
  }).then(function (response) {
    console.log(response.data);
    alert('新增景點成功！');
    location.href = '/myAdmin.html';
  })["catch"](function (error) {
    console.log(error);
  });
}

editInput(); //編輯/新增景點的輸入 組obj

function editInput() {
  if (addToSightBtn && !sightId) {
    patchSightBtn.classList.add('display-none');
    addToSightBtn.addEventListener('click', function (e) {
      var obj = {};
      obj.title = sightTitle.value;
      obj.description = sightDescription.value;
      obj.imgUrl = sightImgUrl.value;
      obj.blogUrl = sightBlogUrl.value;
      obj.userId = getUserId;
      console.log(obj);
      addSightPost(obj);
    });
  }
}

var currentSightData = []; //編輯已輸入的景點

function defaultInput() {
  if (sightTitle && sightId) {
    axios.get("".concat(api_Url, "/600/users/1/sights?id=").concat(sightId), {
      headers: {
        "authorization": "Bearer ".concat(getUserToken)
      }
    }).then(function (response) {
      currentSightData = response.data;
      console.log(currentSightData);
      sightTitle.value = currentSightData[0].title;
      sightDescription.value = currentSightData[0].description;
      sightImgUrl.value = currentSightData[0].imgUrl;
      sightBlogUrl.value = currentSightData[0].blogUrl;
      addToSightBtn.classList.add('display-none');
      patchSightBtn.addEventListener('click', function (e) {
        //patch
        var obj = {};
        obj.title = sightTitle.value;
        obj.description = sightDescription.value;
        obj.imgUrl = sightImgUrl.value;
        obj.blogUrl = sightBlogUrl.value;
        currentSightPatch(obj);
      });
    })["catch"](function (error) {
      console.log(error);
    });
  }
}

defaultInput();

function currentSightPatch(obj) {
  axios.patch("".concat(api_Url, "/600/sights/").concat(getUserId), obj, {
    headers: {
      "authorization": "Bearer ".concat(getUserToken)
    }
  }).then(function (response) {
    console.log(response.data);
    alert('修改成功！');
    location.href = '/myAdmin.html';
  })["catch"](function (error) {
    console.log(error);
  });
}
//# sourceMappingURL=all.js.map
