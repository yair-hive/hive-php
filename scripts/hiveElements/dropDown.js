export default class {
    status = 'close'
    drop_element = document.createElement('div')
    constructor(parent){
        this.drop_element.classList.add('drop_down')
        this.drop_element.style.display = 'none'
        parent.append(this.drop_element)
        this.offsetCalculate = this.offsetCalculate.bind(this)
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
    }
    open = function(box){
        this.box = box
        this.status = 'open'
        this.drop_element.style.display = 'block'
        this.offsetCalculate()
        document.getElementById('mainBord').addEventListener('scroll', this.offsetCalculate)
        window.addEventListener('resize', this.offsetCalculate)  
        this.onOpen()
    }
    close = function(){
        this.status = 'close'
        document.getElementById('mainBord').removeEventListener('scroll', this.offsetCalculate)
        window.removeEventListener('resize', this.offsetCalculate)  
        this.drop_element.style.display = 'none'
        this.onClose()
    }
    offsetCalculate = function(){
        var parent = this.box.getBoundingClientRect()
        var parent_width = this.box.offsetWidth
        var list_width_over = 60
        var list_width_over_d = list_width_over / 2
        var drop_down_top = parent.bottom
        var drop_down_width = parent_width + list_width_over
        var drop_down_left = parent.left - list_width_over_d 
        this.drop_element.style.position = 'absolute'
        this.drop_element.style.width = drop_down_width+'px'
        this.drop_element.style.top = drop_down_top+'px'
        this.drop_element.style.left = drop_down_left+'px'
        this.drop_element.style.overflow = 'auto'
    }
    onOpen(){}
    onClose(){}
}