import { create_selection, DragToScroll } from "./scripts.js"
import { user } from "./api/user.js"
import "./lib/jquery.min.js"
import { add_loader, add_MBloader } from "./elements.js"

add_loader()
add_MBloader()
export const selection = create_selection()
export const dragToScroll = new DragToScroll()
selection.disable()

user.get()
.then((respons) => {
    if(respons.msg === 'all ok'){
        document.getElementById('user_element').innerText = respons.user_name
    }
})