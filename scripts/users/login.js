import api from '../api/api.js'

document.getElementById('login_button').addEventListener('click', ()=>{
    var user_form = document.getElementById('user_form')
    var user_form_data = new FormData(user_form)
    const formDataObj = {};
    user_form_data.forEach((value, key) => (formDataObj[key] = value));
    api.user.login(formDataObj)
    .then(json => alert(json.msg))
})
document.getElementById('sginup_button').addEventListener('click', ()=>{
    var user_form = document.getElementById('user_form')
    var user_form_data = new FormData(user_form)
    const formDataObj = {};
    user_form_data.forEach((value, key) => (formDataObj[key] = value));
    api.user.sginup(formDataObj)
    .then(json => alert(json.msg))
})
document.getElementById('logout_button').addEventListener('click', ()=>{api.user.logout().then(json => alert(json.msg))})