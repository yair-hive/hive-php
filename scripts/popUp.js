export default class {
    blur = document.createElement('div')
    popUp = document.createElement('div')
    popUpHead = document.createElement('div')
    popUpBody = document.createElement('div')
    body
    test = 'sfffs'
    constructor(title, body){
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
        this.body = body
        var blur = document.getElementById('blur')
        if(blur) blur.remove()
        this.popUpBody.innerHTML = body
        this.popUpHead.append(title)
        this.popUpBody.setAttribute('id', 'popUpBody')
        this.popUpBody.classList.add('popUpBody')
        this.popUpHead.classList.add('popUpHead')
        this.popUpHead.setAttribute('id', 'popUpHead')
        this.popUpHead.addEventListener('click', this.close)
        this.blur.classList.add('blur')
        this.popUp.setAttribute('id', 'popUp')
        this.popUp.classList.add('popUp')
        this.popUp.append(this.popUpHead)
        this.popUp.append(this.popUpBody)
        this.blur.append(this.popUp)
        document.body.append(this.blur)
        this.blur.style.display = 'none'
    }
    open = function(){
        // if(this.popUpBody.innerHTML != this.body) this.popUpBody.innerHTML = this.body
        this.blur.style.display = 'block'
        this.onOpen(this)
    }
    close = function(){
        this.blur.style.display = 'none'
        this.onClose(this)
    }
    onClose(){}
    onOpen(){}
}