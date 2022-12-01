import api from "../api/api.js"
import { loginForm, openPopUp, sghinupForm } from "../elements.js"

api.user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        var topBar = document.getElementById('topBar')
        var map_button = document.createElement('div')
        map_button.classList.add('hive-button')
        map_button.textContent = 'מפות'
        map_button.onclick = ()=> {location.href = "http://localhost/hive-php/html/maps.html"}
        topBar.append(map_button)
    }
})

document.getElementById('loginButton').addEventListener('click', ()=>{
    openPopUp('התחבר', loginForm())
})
document.getElementById('sghinupButton').addEventListener('click', ()=>{
    openPopUp('הירשם', sghinupForm())
})