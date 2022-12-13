import api from '../api/api.js'
document.getElementById('login_button').addEventListener('click', ()=>{api.user.login().then(json => alert(json.msg))})
document.getElementById('sginup_button').addEventListener('click', ()=>{api.user.sginup().then(json => alert(json.msg))})
document.getElementById('logout_button').addEventListener('click', ()=>{api.user.logout().then(json => alert(json.msg))})