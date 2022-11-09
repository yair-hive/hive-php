import SelectionArea from "../lib/viselect.esm.js"

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