import { loginForm, openPopUp } from "../elements.js"

document.getElementById('user_element').addEventListener('click', ()=>{
    openPopUp('התחבר', loginForm())
})