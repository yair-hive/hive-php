import { user } from "./api/user.js"
import { addMBloader } from "./elements.js"

addMBloader()

user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})