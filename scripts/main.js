import { create_selection, DragToScroll } from "./scripts.js"
import { user } from "./api/user.js"
import "./lib/jquery.min.js"

export const selection = create_selection()
export const dragToScroll = new DragToScroll()
selection.disable()

user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})
