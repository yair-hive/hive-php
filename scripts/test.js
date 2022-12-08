import api from "./api/api.js"
import hiveSwitch from "./hiveSwitch.js"

// function add_edit_switch(){
//     var mneu = document.getElementById('mneu')
//     var edit_ele = document.createElement('div')
//     edit_ele.setAttribute('id', 'edit')
//     edit_ele.textContent = 'edit'
//     var no_edit_ele = document.createElement('div')
//     no_edit_ele.setAttribute('id', 'no_edit')
//     no_edit_ele.textContent = 'no'
//     var edit_switch = document.createElement('div') 
//     edit_switch.classList.add('hive-switch')
//     edit_switch.append(edit_ele)
//     edit_switch.append(no_edit_ele)
//     mneu.append(edit_switch)
//     var hiveSwitchOptions = {
//         element_id: 'selecteblsSwitch', 
//         active: 'no_edit', 
//         keys: ['q', '/']
//     } 
//     hiveSwitch(hiveSwitchOptions, (active)=>{
//         var edit_eles = document.getElementById('edit_eles')
//         switch (active) {
//             case 'edit':
//                 edit_eles.style.display = 'block'
//                 break;
//             case 'no_edit':
//                 edit_eles.style.display = 'none'
//                 break;
//         }
//     })
// }
// add_edit_switch()