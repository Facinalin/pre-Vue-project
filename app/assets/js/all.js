const loginEmail = document.querySelector('.loginEmail');
const loginPSW = document.querySelector('.loginPSW');
const signUpEmail = document.querySelector('.signUpEmail');
const signUpPSW = document.querySelector('.signUpPSW');
const signUpBtn = document.querySelector('.signUpBtn');
const loginBtn = document.querySelector('.loginBtn');
const api_Url = 'http://localhost:3005/';
const getUserId = localStorage.getItem('userId');
const getUserToken = localStorage.getItem('user1hrToken');
const logSignPanel = document.querySelector('.logSignPanel');
const logOutBtn = document.querySelector('.logOutBtn');
const toAdmin = document.querySelector('.toAdmin');
const sightListArea = document.querySelector('.sightListArea');
const sightId = location.href.split("=")[1];
const likeListArea = document.querySelector('.likeListArea'); //後台收藏
const perSightArticle = document.querySelector('.perSightArticle');

function checkLoggedIn(){
  return getUserId && getUserToken? true : false;
}

function signUp(){
  if(signUpEmail && signUpBtn && signUpPSW){
    signUpBtn.addEventListener('click', (e) =>{
      let emailVal = signUpEmail.value;
      let pswVal = signUpPSW.value;
      let obj ={};
      obj.email = emailVal;
      obj.password = pswVal;
      signUpPost(obj);
      alert('註冊成功！');
    })
  }
}

function signUpPost(obj){
  axios.post(`${api_Url}register`,obj)
  .then(function(response){
  console.log(response.data);
  })
  .catch(function(error){
    console.log(error);
  })
}

let token = '';
let id = '';
function loginPost(obj){
  axios.post(`${api_Url}login`,obj,)
  .then(function(response){
  console.log(response.data);
  token = response.data.accessToken;
  id = response.data.user.id;
  localStorage.setItem('user1hrToken',token);
  localStorage.setItem('userId',id);
  loginEmail.value = "";
  loginPSW.value = "";
  alert('登入成功');
  location.href = '/index.html';
  })
  .catch(function(error){
    console.log(error);
    alert('帳號或密碼不存在，請重新輸入');
  })
}

function login(){
  if(loginEmail && loginPSW && loginBtn){
    loginBtn.addEventListener('click', (e) =>{
     let emailVal = loginEmail.value;
     let pswVal = loginPSW.value;
     let obj ={};
     obj.email = emailVal;
     obj.password = pswVal;
     loginPost(obj);
     })
  }
}

function logInChange(){
  if(getUserId&&getUserToken){
    logSignPanel.textContent = '';
    toAdmin.classList.remove('display-none');
  }
}

function logOut(){
  if(logOutBtn){
    logOutBtn.addEventListener('click', (e) =>{
      console.log('有點到');
      localStorage.clear();
      setTimeout(() => {
        window.location.replace('/'); //導回首頁
      }, 300);
})
}
}

function logOutChange(){
  if(!getUserId&&!getUserToken){
    logOutBtn.classList.add('display-none');
  }
}

signUp();
login();
logInChange();
logOut();
logOutChange();
adminChange();

function adminChange(){
  if(likeListArea){
    toAdmin.classList.add('display-none');
  }
}

//以上登入註冊區

if(sightListArea){
  getSightList();
}

let sightData = [];
function getSightList(){
  axios.get(`${api_Url}sights`)
  .then(response =>{
    console.log(response.data);
    sightData = response.data;
    renderSightList(sightListArea,sightData);
  })
  .catch(error =>{
    console.log(error);
    //alert('資料庫異常');
  })
}
//首頁渲染產品列表
function renderSightList(dom,data){
   let str ='';
   data.forEach(el =>{
    const {title, imgUrl, description, id} = el;
    if(data.length>0){
      str+=`<div class="col-lg-3 card my-4 mx-3" style="width: 18rem;">
      <img src="${imgUrl}" class="card-img-top" alt="">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <a href="/article.html?id=${id}" class="btn btn-primary text-white">看更多資訊...</a>
      </div>
    </div>`;
    }else{
      return '';
    }
    dom.innerHTML = str;
   })
}

//單頁article get
if(perSightArticle){
  getPerSight();
}
let perSightData = {};
function getPerSight(){
  axios.get(`${api_Url}sights/${sightId}`)
  .then(response =>{
    console.log(response.data);
    perSightData = response.data;
    console.log(perSightArticle);
    renderPerSight(perSightArticle,perSightData);
  })
  .catch(err =>{
    console.log(err);
  })
}
//渲染單頁景點文章
function renderPerSight(dom,data){
    const {title, imgUrl, description, blogUrl, id} = data;
    dom.innerHTML =`<div class="d-flex flex-column align-items-center">
    <img src="${imgUrl}" class="article-img" alt="">
    <div class="card-body-article">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${description}</p>
      <div class="btnArea d-flex justify-content-between">
      <a target="_blank" href="${blogUrl}" class="btn btn-secondary text-white mt-4 me-8">點我看參考部落格文章！</a>
      <button class="btn btn-info text-white mt-4 ms-8 addToLike" data-id="${id}">♡ 收藏</button>
      <button class="disabled btn btn-success text-white mt-4 ms-8 alreadyInLike" data-id="${id}">&#10003;已收藏</button>
    </div>
    </div>
  </div>`;

  const addToLike = document.querySelector('.addToLike');
  const alreadyInLike = document.querySelector('.alreadyInLike');
  if(true){

  }
  let likesData = [];

  if(checkLoggedIn())
  {axios.get(`${api_Url}600/users/${getUserId}/likes?_expand=sight`,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then(response =>{
   likesData = response.data;
   console.log(likesData);
   console.log(sightId);
   let indicate = likesData.filter(el =>{return el.sightId == sightId});
   console.log(indicate);
   if(indicate.length!=0){
    addToLike.classList.add('display-none');
   }else{
    alreadyInLike.classList.add('display-none');
   }

  })
  .catch(error =>{
    console.log(error);
  });
  }else{
    addToLike.classList.add('display-none');
    alreadyInLike.classList.add('display-none');
  }
  console.log(addToLike);
  addToLike.addEventListener('click', (e) =>{
    e.preventDefault();
    console.log(e.target);
  })
 //收藏功能記得加到這，總
}

//收藏功能
//監聽收藏按鈕

function addToLikePost(){
  axios.post(`${api_Url}600/likes`,{})
  .then(response =>{
  
  })
  .catch(error =>{
    console.log(error);
  });
}

addToLikesGet();
let likesData = [];
function addToLikesGet(){
  axios.get(`${api_Url}600/users/${getUserId}/likes?_expand=sight`,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then(response =>{
  console.log(response.data);
  likesData = response.data;
  renderAdminLikeList(likeListArea,likesData);
  })
  .catch(error =>{
    console.log(error);
  });
}


//渲染後台收藏列表
function renderAdminLikeList(dom,data){
   let likeStr = '';
   data.forEach(el =>{
    const {title, imgUrl, description, id} = el.sight;
    likeStr += `<div class="card my-4 d-flex flex-row likePerCard">
    <img src="${imgUrl}" class="card-img-top" alt="">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${description}</p>
      <span class="text-success">&#10003;已收藏</span><a href="/article.html" class="btn btn-warning text-white ms-4" data-id="${id}">取消收藏</a>
    </div>
  </div>`;
    dom.innerHTML = likeStr;
   })
}


//判定已收藏/未收藏



