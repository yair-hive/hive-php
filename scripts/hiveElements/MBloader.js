export default class {
    loader = document.createElement('div')
    loaderContainer = document.createElement('div')
    constructor(){
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        var main_bord = document.getElementById('mainBord')
        var perent = main_bord.getBoundingClientRect()
        $(this.loaderContainer) .css({
            'position': 'absolute',
            'width': perent.width,
            'height': perent.height, 
            'top': perent.top,
            'left': perent.left,
            'margin': 0,
            'padding': 0,
            'backgroundColor' : 'rgb(67, 167, 167)'
        })
        this.loader.setAttribute('id', "MBloader")
        this.loaderContainer.setAttribute('id', "MBloader-container")
        document.body.insertBefore(this.loader, document.body.children[0])
        document.body.insertBefore(this.loaderContainer, document.body.children[0])
        this.loader.style.display = 'none'
        this.loaderContainer.style.display = 'none'
    }
    start(){
        this.loader.style.display = 'block'
        this.loaderContainer.style.display = 'block'
    }
    stop(){
        this.loader.style.display = 'none'
        this.loaderContainer.style.display = 'none'
    }
}