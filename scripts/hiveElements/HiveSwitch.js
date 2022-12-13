function hiveSwitchChenge(element, active){
    active = active.replace(' ', '_')
    var childrenLength = element.children.length  -1
    for(let i = 0; i < (childrenLength+1); i++){
        element.children[i].classList.remove('active')
    }
    element.querySelector('#'+active).classList.add('active')
}
function hiveSwitchMove(itemsList, active){
    var length = itemsList.length -1
    var activeIndex = itemsList.indexOf(active.replace(' ', '_'))
    var i
    if(activeIndex == length) i = 0
    else i = activeIndex+1
    return itemsList[i]
}
export default function(options, callback){
    var active = options.active
    var itemsList = []
    var element = document.getElementById(options.element_id)
    var childrenLength = element.children.length  -1
    element.children[0].classList.add('hive-switch-l')
    element.children[childrenLength].classList.add('hive-switch-r')
    for(let i = 1; i < childrenLength; i++){
        element.children[i].classList.add('hive-switch-m')
    }
    element.querySelector('#'+active).classList.add('active')
    for(let i = 0; i < (childrenLength+1); i++){
        var corrent = element.children[i]
        itemsList.push(corrent.getAttribute('id'))
        corrent.classList.add('hive-button')
        corrent.addEventListener('click', (e)=>{
            active = e.target.getAttribute('id').replace('_', ' ')
            hiveSwitchChenge(element, active)
            callback(active)
        })
    }
    document.addEventListener('keydown', (e)=>{
        if(e.ctrlKey || e.metaKey){
            for(let key of options.keys){
                if(e.key == key){
                    active = hiveSwitchMove(itemsList, active).replace('_', ' ')
                    hiveSwitchChenge(element, active)
                    callback(active)
                }
            }
        }
    })
}