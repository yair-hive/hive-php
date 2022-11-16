import SelectionArea from "./lib/viselect.esm.js"
import "./lib/jquery.min.js"

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
export const convert_seats = (selected)=>{
    var selectedArray = []
    selected.forEach(element => {
        selectedArray.push(element.classList)
    });
    return selectedArray.join(' *|* ')
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
let scale = 1
export const zoom = (event)=>{
    if(event.ctrlKey || event.metaKey){
        const map_container = document.querySelector('.map_container')
        event.preventDefault();
        
        scale += event.deltaY * -0.0005;
        
        // Restrict scale
        scale = Math.min(Math.max(.125, scale), 4);
        
        // Apply scale transform
        map_container.style.transform = `scale(${scale})`;
    }
}
export class DragToScroll {
    constructor(){
        this.mouseDownHandler = this.mouseDownHandler.bind(this)
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        this.mouseUpHandler = this.mouseMoveHandler.bind(this)
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
        document.removeEventListener('mouseup', this.mouseUpHandler);
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