import { addMBloader, addPopUp } from "./elements.js"
import api from './api/api.js'

addMBloader()
addPopUp()

api.user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})