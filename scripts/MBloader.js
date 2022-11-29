export default class {
    add(){
        var loader = document.createElement('div')
        var loaderContainer = document.createElement('div')
        var main_bord = document.getElementById('mainBord')
        var perent = main_bord.getBoundingClientRect()
        $(loaderContainer) .css({
            'position': 'absolute',
            'width': perent.width,
            'height': perent.height, 
            'top': perent.top,
            'left': perent.left,
            'margin': 0,
            'padding': 0,
            'backgroundColor' : 'rgb(67, 167, 167)'
        })
        loader.setAttribute('id', "MBloader")
        loaderContainer.setAttribute('id', "MBloader-container")
        document.body.insertBefore(loader, document.body.children[0])
        document.body.insertBefore(loaderContainer, document.body.children[0])
        loader.style.display = 'none'
        loaderContainer.style.display = 'none'
    }
    start(){
        document.getElementById('MBloader').style.display = 'block'
        document.getElementById('MBloader-container').style.display = 'block'
    }
    stop(){
        document.getElementById('MBloader').style.display = 'none'
        document.getElementById('MBloader-container').style.display = 'none'
    }
}