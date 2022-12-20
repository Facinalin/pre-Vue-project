const loginEmail = document.querySelector('.loginEmail');
const loginPSW = document.querySelector('.loginPSW');
const signUpEmail = document.querySelector('.signUpEmail');
const signUpPSW = document.querySelector('.signUpPSW');
const signUpBtn = document.querySelector('.signUpBtn');
const loginBtn = document.querySelector('.loginBtn');
const api_Url = 'https://pre-vue-json-server-auth.vercel.app';
const getUserId = localStorage.getItem('userId');
const getUserToken = localStorage.getItem('user1hrToken');
const getUserAdmin = localStorage.getItem('admin');
const logSignPanel = document.querySelector('.logSignPanel');
const logOutBtn = document.querySelector('.logOutBtn');
const toAdmin = document.querySelector('.toAdmin');
const myLikesList = document.querySelector('.myLikesList');
const sightListArea = document.querySelector('.sightListArea');
const sightId = location.href.split("=")[1];
const likeListArea = document.querySelector('.likeListArea'); 
const perSightArticle = document.querySelector('.perSightArticle');
const manageSightList = document.querySelector('.manageSightList');
const addToSightBtn = document.querySelector('.addToSightBtn');
const sightTitle = document.querySelector('#sightTitle');
const sightDescription = document.querySelector('#sightDescription');
const sightImgUrl = document.querySelector('#sightImgUrl');
const sightBlogUrl = document.querySelector('#sightBlogUrl');
const patchSightBtn = document.querySelector('.patchSightBtn');

function selfRefresh(){
  window.location.replace(location.href);
}

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
  axios.post(`${api_Url}/register`,obj)
  .then(function(response){
  console.log(response.data);
  })
  .catch(function(error){
    console.log(error);
  })
}

let token = '';
let id = '';
let admin = '';
function loginPost(obj){
  axios.post(`${api_Url}/login`,obj,)
  .then(function(response){
  console.log(response.data);
  token = response.data.accessToken;
  id = response.data.user.id;
  admin = response.data.user.isAdmin;
  localStorage.setItem('user1hrToken',token);
  localStorage.setItem('userId',id);
  localStorage.setItem('admin',admin);
  loginEmail.value = "";
  loginPSW.value = "";
  alert('登入成功');
  if(admin === true){
    location.href = './myAdmin.html';
  }else{
    location.href = './index.html';
  }
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
    myLikesList.classList.remove('display-none');
  }
}

function logOut(){
  if(logOutBtn){
    logOutBtn.addEventListener('click', (e) =>{
      console.log('有點到');
      localStorage.clear();
      setTimeout(() => {
        location.href = './index.html'; //導回首頁
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


myAdminChange();
//這邊不懂
function myAdminChange(){
  if(getUserAdmin==="true"){
    console.log('有吃到');
    toAdmin.classList.remove('display-none');
  }
}
console.log(toAdmin);
console.log(getUserAdmin);


function adminChange(){
  if(likeListArea){
    myLikesList.classList.add('display-none');
  }
}

//以上登入註冊區

if(sightListArea){
  getSightList();
}

let sightData = [];
function getSightList(){
  axios.get(`${api_Url}/sights`)
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
        <a href="./article.html?id=${id}" class="btn btn-primary text-white">看更多資訊...</a>
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
  axios.get(`${api_Url}/sights/${sightId}`)
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
  {axios.get(`${api_Url}/600/users/${getUserId}/likes?_expand=sight`,{
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
   if(indicate.length===0){
    console.log('未收藏過')
    alreadyInLike.classList.add('display-none');
    
   }else{
    console.log('收藏過了')
    addToLike.classList.add('display-none');
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
    let sightId = e.target.getAttribute('data-id');
    let obj = {};
    obj.sightId = sightId;
    addToLikePost(obj,addToLike,alreadyInLike);
  })
 //收藏功能記得加到這，總
}

//收藏功能
//監聽收藏按鈕

function addToLikePost(obj,dom1,dom2){
  axios.post(`${api_Url}/600/users/${getUserId}/likes`,obj,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then(response =>{
  console.log(response.data);
  console.log(getUserToken);
  dom1.classList.add('display-none');
  dom2.classList.remove('display-none');
  })
  .catch(error =>{
    console.log(error);
    console.log(getUserToken);
  });
}

if(likeListArea){
  addToLikesGet();
}

let likesData = [];
function addToLikesGet(){
  axios.get(`${api_Url}/600/users/${getUserId}/likes?_expand=sight`,{
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


//渲染我的收藏列表
function renderAdminLikeList(dom,data){
   let likeStr = '';
   if(data.length>0){
   data.forEach(el =>{
    const {id} = el;
    const {title, imgUrl, description} = el.sight;
    likeStr += `<div class="card my-4 d-flex flex-row likePerCard">
    <img src="${imgUrl}" class="card-img-top" alt="">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${description}</p>
      <span class="text-success">&#10003;已收藏</span><button href="#" class="btn btn-warning text-white ms-4 deleteLikes" data-id="${id}">取消收藏</button>
    </div>
  </div>`;
    dom.innerHTML = likeStr;
   })

   const deleteLikes = document.querySelectorAll('.deleteLikes');
   deleteLikes.forEach(el => {
   el.addEventListener('click', (e) =>{
    let deleteId = e.target.getAttribute('data-id');
   
    axios.delete(`${api_Url}/600/likes/${deleteId}`,{
      headers:{
        "authorization": `Bearer ${getUserToken}`
      }
    })
    .then(response =>{
      console.log(response.data);
      alert('成功取消收藏！');
      selfRefresh();
    })
    .catch(error =>{
      console.log(error);
    })
   })

  })
}else{
  dom.innerHTML = `<h3 class="text-secondary">目前無任何收藏</h3>`;
}
}
//後台
//渲染已上傳景點列表

function removeSight(id){
  axios.delete(`${api_Url}/600/sights/${id}`,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then(response =>{
    console.log(response.data);
    alert('刪除成功！');
    location.href = './myAdmin.html';
  })
  .catch(error => {
    console.log(error);
  })
}

function renderSightAtAdmin(dom,data){
  let sightListStr = '';
  if(data.length>0){
  data.forEach(el =>{
    const {title,description,imgUrl,id} = el;
    sightListStr += `<div class="card my-4 d-flex flex-row likePerCard">
    <a href="./editSight.html?id=${id}" class="btn btn-danger text-white ms-4 editSight" data-id="${id}"><span>&#9999;</span><br>編<br>輯</a>
    <a href="#" class="btn btn-secondary text-white ms-4 deleteSight" data-id="${id}"><span>&#9999;</span><br>刪<br>除</a>
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>          
      </div>
    <img src="${imgUrl}" class="card-img-top" alt="">
  </div>`;
  dom.innerHTML = sightListStr;
  })
  const sightRemoving = document.querySelectorAll('.deleteSight');
  sightRemoving.forEach(el =>{
    el.addEventListener('click', (e) =>{
      let removeSightId = e.target.getAttribute('data-id');
      console.log('到底');
      removeSight(removeSightId);
    });
  })
  
}else{
  dom.innerHTML = `<h3 class="text-secondary">目前無任何已上傳景點資料</h3>`;
}
}
//delete: http://localhost:3005/600/sights/5
//get所有sight列表


//http://localhost:3005/600/users/1/sights
function getSightAtAdmin(){
  axios.get(`${api_Url}/600/users/${getUserId}/sights`,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then(response =>{
    console.log(response.data);
    sightData = response.data;
    renderSightAtAdmin(manageSightList,sightData);
  })
  .catch(error =>{
    console.log(error);
    //alert('資料庫異常');
  })
}

if(manageSightList){
  getSightAtAdmin();
}

//新增景點
//http://localhost:3005/600/users/1/sights
function addSightPost(obj){
  axios.post(`${api_Url}/600/users/${getUserId}/sights`,obj,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then(response =>{
  console.log(response.data);
  alert('新增景點成功！');
  location.href = './myAdmin.html';
  })
  .catch(error =>{
    console.log(error);
  });
}

editInput();

//編輯/新增景點的輸入 組obj
function editInput(){
if(addToSightBtn && !sightId){
  patchSightBtn.classList.add('display-none');
  addToSightBtn.addEventListener('click',(e) =>{
    let obj = {};
    obj.title = sightTitle.value;
    obj.description = sightDescription.value;
    obj.imgUrl = sightImgUrl.value;
    obj.blogUrl = sightBlogUrl.value;
    obj.userId = getUserId;
    console.log(obj);
    addSightPost(obj);
  })
}
}

let currentSightData = [];
//編輯已輸入的景點
function defaultInput(){
  if(sightTitle && sightId){
  axios.get(`${api_Url}/600/users/1/sights?id=${sightId}`,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then(response =>{
  currentSightData = response.data;
  console.log(currentSightData);
  sightTitle.value = currentSightData[0].title;
  sightDescription.value = currentSightData[0].description;
  sightImgUrl.value = currentSightData[0].imgUrl;
  sightBlogUrl.value = currentSightData[0].blogUrl;
  addToSightBtn.classList.add('display-none');
  patchSightBtn.addEventListener('click', (e) =>{
    //patch
    let obj = {};
    obj.title = sightTitle.value;
    obj.description = sightDescription.value;
    obj.imgUrl = sightImgUrl.value;
    obj.blogUrl = sightBlogUrl.value;
  currentSightPatch(obj);
  })
  })
  .catch(error =>{
  console.log(error);
  })
  }
}

defaultInput();

function currentSightPatch(obj){
  axios.patch(`${api_Url}/600/sights/${getUserId}`,obj,{
    headers:{
      "authorization": `Bearer ${getUserToken}`
    }
  })
  .then((response)=>{
    console.log(response.data);
    alert('修改成功！');
    location.href = './myAdmin.html';
  })
  .catch((error)=>{
    console.log(error);
  })
}
















