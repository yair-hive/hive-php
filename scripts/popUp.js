export default class {
    body
    test = 'sfsgs'
    constructor(title, body){
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
        this.body = body
        var blur = document.getElementById('blur')
        if(blur) blur.remove()
        var blur = document.createElement('div')
        var popUp = document.createElement('div')
        var popUpHead = document.createElement('div')
        var popUpBody = document.createElement('div')
        popUpBody.append(body)
        popUpHead.append(title)
        popUpBody.setAttribute('id', 'popUpBody')
        popUpBody.classList.add('popUpBody')
        popUpHead.classList.add('popUpHead')
        popUpHead.setAttribute('id', 'popUpHead')
        popUpHead.addEventListener('click', this.close)
        blur.setAttribute('id', 'blur')
        blur.classList.add('blur')
        popUp.setAttribute('id', 'popUp')
        popUp.classList.add('popUp')
        popUp.append(popUpHead)
        popUp.append(popUpBody)
        blur.append(popUp)
        document.body.append(blur)
        blur.style.display = 'none'
    }
    open = function(body, callback){
        var popUpBody = document.getElementById('popUpBody')
        popUpBody.innerHTML = ''
        popUpBody.append(body)
        document.getElementById('blur').style.display = 'block'
        callback()
    }
    close = function(){
        document.getElementById('blur').style.display = 'none'
        this.onClose()
    }
    onClose(){}
}