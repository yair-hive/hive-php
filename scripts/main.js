import { user } from "./api/user.js"
import { addMBloader } from "./elements.js"
import { create_selection, DragToScroll } from "./scripts.js"

addMBloader()
export const selection = create_selection()
export const dragToScroll = DragToScroll()
selection.disable()

user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})