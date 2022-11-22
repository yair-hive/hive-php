import { user } from "./api/user.js"
import "./lib/jquery.min.js"
document.getElementById('login_button').addEventListener('click', ()=>{user.login().then(json => alert(json.msg))})
document.getElementById('sginup_button').addEventListener('click', ()=>{user.sginup().then(json => alert(json.msg))})
document.getElementById('logout_button').addEventListener('click', ()=>{user.logout().then(json => alert(json.msg))})