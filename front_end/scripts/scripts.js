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