import { loginForm, openPopUp } from "../elements.js"

location.replace('http://localhost/hive-php/html/maps.html')

document.getElementById('user_element').addEventListener('click', ()=>{
    openPopUp('התחבר', loginForm())
})