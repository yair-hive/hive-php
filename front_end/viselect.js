const selection = new SelectionArea({
    selectables: [".cell"],
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

function get_seat_string(map_id){
    var selected = selection.getSelection()
    var selectedArray = []
    selected.forEach(element => {
        selectedArray.push(element.classList)
    });
    var selectedString = selectedArray.join(' *|* ')
    $.ajax({
        type: "POST", 
        url: "api.php",
        data: "action=add_seats&map_id="+map_id+"&seat_list="+selectedString,
        success: function(msg){
            alert(msg)
        }
    });
}
