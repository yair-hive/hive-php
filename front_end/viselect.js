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


