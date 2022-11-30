import { user } from "./api/user.js"
import { addMBloader, addPopUp } from "./elements.js"

addMBloader()
addPopUp()

user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})