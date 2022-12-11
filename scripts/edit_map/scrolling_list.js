export default class {
    correntItemIndex = -1
    listLength = 0
    listElement
    constructor(parent){
        this.listElement = document.createElement('ul')
        parent.append(this.listElement)
        this.parent = parent
        this.onArrowDown = this.onArrowDown.bind(this)
        this.onArrowUp = this.onArrowUp.bind(this)
        this.roll = this.roll.bind(this)
        this.rollUp = this.rollUp.bind(this)
        this.rollDown = this.rollDown.bind(this)
        document.addEventListener('keydown', function(event){
            if(event.keyCode == 38){
                this.onArrowUp()
            }
            if(event.keyCode == 40){
                this.onArrowDown()
            }
        }.bind(this))
    }
    addItems = function(items){
        for(let item of items){
            this.listElement.append(item)
        }
        this.listLength = this.listElement.children.length
    }
    rollUp = function(){
        if(this.correntItemIndex < 0) this.correntItemIndex = 0
        if(this.correntItemIndex == 0) return
        this.correntItemIndex--
        this.roll()
        if(this.correntItemIndex - 1 >= 0) {
            this.nextItem = this.listElement.childNodes[this.correntItemIndex - 1]
            this.nextItemHeight = this.nextItem.getBoundingClientRect().height + 1
        }
    }
    rollDown = function(){
        if(this.correntItemIndex == -1) this.listElement.scrollTop = 0
        if(this.correntItemIndex == this.listLength - 1) return
        this.correntItemIndex++
        this.roll()
        this.correntItem = this.listElement.childNodes[this.correntItemIndex]
        if(this.correntItemIndex + 1 < this.listLength) {
            this.nextItem = this.listElement.childNodes[this.correntItemIndex + 1]
            this.nextItemHeight = this.nextItem.getBoundingClientRect().height + 1
        } 
    }
    roll = function(){
        this.correntItem = this.listElement.childNodes[this.correntItemIndex]
        this.dropDownBounding = this.listElement.getBoundingClientRect()
        this.correntItemBounding = this.correntItem.getBoundingClientRect()
        for(let i = 0; i < this.listLength; i++){
            var e = this.listElement.children[i]
            e.style.backgroundColor = 'rgb(202, 248, 248)'
        }
        this.correntItem.style.backgroundColor = '#4f90f275'
    }
    onArrowUp = function(){
        if(this.listLength > 0){
            this.rollUp()
            var dropDownTop = this.dropDownBounding.top + (this.correntItemBounding.height + 15)
            if(this.correntItemBounding.bottom < dropDownTop) this.listElement.scrollTop = this.listElement.scrollTop - this.nextItemHeight 
        }
    }
    onArrowDown = function(){ 
        if(this.listLength > 0){
            this.rollDown()   
            var dropDownBottom = this.dropDownBounding.bottom - (this.correntItemBounding.height + 15)
            if(this.correntItemBounding.top > dropDownBottom) this.listElement.scrollTop = this.listElement.scrollTop + this.nextItemHeight 
        }
    }
}