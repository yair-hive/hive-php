import SelectionArea from "./lib/viselect.esm.js"
import "./lib/jquery.min.js"
import { selection } from "./main.js"

class dragClass {
    constructor(){
        this.mouseDownHandler = this.mouseDownHandler.bind(this)
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        this.mouseUpHandler = this.mouseUpHandler.bind(this)
        this.disable = this.disable.bind(this)
        this.enable = this.enable.bind(this)
    }
    ele = document.getElementById('mainBord');

    pos = { top: 0, left: 0, x: 0, y: 0 };

    mouseDownHandler(e) {
        this.ele.style.cursor = 'grabbing';
        this.ele.style.userSelect = 'none';

        this.pos = {
            left: this.ele.scrollLeft,
            top: this.ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
    };
    mouseMoveHandler(e) {
        // How far the mouse has been moved
        const dx = e.clientX - this.pos.x;
        const dy = e.clientY - this.pos.y;

        // Scroll the element
        this.ele.scrollTop = this.pos.top - dy;
        this.ele.scrollLeft = this.pos.left - dx;
    };
    mouseUpHandler() {
        this.ele.style.removeProperty('cursor');
        this.ele.style.removeProperty('user-select');
        document.removeEventListener('mousemove', this.mouseMoveHandler);
    };
    disable(){
        this.ele.removeEventListener('mousedown', this.mouseDownHandler);
        this.ele.style.removeProperty('cursor');
        this.ele.style.removeProperty('user-select');
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);
    }
    enable(){
        this.ele.addEventListener('mousedown', this.mouseDownHandler);        
    }
}
export const create_selection = ()=>{
    var selection = new SelectionArea({
        selectables: [".selectable"],
        boundaries: ["#mainBord"]
    })
    selection.on("start", ({ store, event }) => {
        if (!event.ctrlKey && !event.metaKey) {
            for (const el of store.stored) {
                el.classList.remove("selected");
            }
            selection.clearSelection();
        }
    })
    selection.on("move", ({ store: { changed: { added, removed } } }) => {
        for (const el of added) {
            el.classList.add("selected");
        }
        for (const el of removed) {
            el.classList.remove("selected");
        }
    })
    return selection
}
export const offsetCalculate = (box)=>{
    var parent = box.getBoundingClientRect()
    var parent_width = box.offsetWidth
    var parent_height = box.offsetHeight
    var list_width_over = 60
    var list_width_over_d = list_width_over / 2
    $('#name_box_input').css({
        'position': 'absolute',
        'width': parent_width, 
        'top':parent.top,
        'left': parent.left,
        'margin': 0,
        'padding': 0
    })
    $('#drop_down').css({
        'position': 'absolute',
        'width': parent_width + list_width_over, 
        'top':parent.top + parent_height,
        'left': parent.left - list_width_over_d,
        'overflow': 'auto'
    });
}
export const zoom = (id)=>{
    let scale = 1
    document.addEventListener("keydown", (event)=>{
        var drop_down = document.getElementById('drop_down')
        var name_box_input = document.getElementById('name_box_input')
        if(event.ctrlKey || event.metaKey){
            if(event.key === ' '){
                scale = 1
                document.getElementById('map').setAttribute('isZoomed', 'false')
                if(drop_down != null && name_box_input != null){
                    drop_down.style.display = 'block'
                    name_box_input.style.display = 'inline-block'
                }
                const map_container = document.querySelector('.map_container')
                map_container.style.transform = `scale(${scale})`;
            }
        }
    })
    document.getElementById(id).addEventListener('wheel', (event)=>{
        var drop_down = document.getElementById('drop_down')
        var name_box_input = document.getElementById('name_box_input')
        if(scale == 1){
            document.getElementById('map').setAttribute('isZoomed', 'false')
            if(drop_down != null && name_box_input != null){
                name_box_input.style.display = 'inline-block'
                drop_down.style.display = 'block'
            }
        }else{
            if(drop_down != null && name_box_input != null){
                drop_down.style.display = 'none'
                name_box_input.style.display = 'none'
            }
            document.getElementById('map').setAttribute('isZoomed', 'true')
        }
        if(event.ctrlKey || event.metaKey){
            const map_container = document.querySelector('.map_container')
            event.preventDefault();
            
            scale += event.deltaY * -0.0005;
            
            // Restrict scale
            scale = Math.min(Math.max(.125, scale), 4);
                
            // Apply scale transform
            map_container.style.transform = `scale(${scale})`;
        }
    })
}
export const DragToScroll = ()=>{
    return new dragClass()
}
export const sortTable = (td)=>{
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("names_table");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[td];
        y = rows[i + 1].getElementsByTagName("TD")[td];
        // Check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}
export const startMBLoader = ()=>{
    document.getElementById('MBloader').style.display = 'block'
    document.getElementById('MBloader-container').style.display = 'block'
}
export const stopMBLoader = ()=>{
    document.getElementById('MBloader').style.display = 'none'
    document.getElementById('MBloader-container').style.display = 'none'
}
export const respondToVisibility = (element, callback)=>{
    var options = {
      root: document.documentElement,
    };
  
    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        callback(entry.intersectionRatio > 0);
      });
    }, options);
  
    observer.observe(element);
}
export const clearSelection = ()=>{
    selection.clearSelection(); 
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"))
}