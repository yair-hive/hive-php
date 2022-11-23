class HiveMap{
    constructor(){
        this.selectables = 'cells'
        this.setSelectables = this.setSelectables.bind(this)
    }
    setSelectables(name){
        this.selectables = name
    }
}
class HiveClass{
    constructor(){
        this.isZoomed = false
        this.setZoomed = this.setZoomed.bind(this)
    }
    setZoomed(states){
        this.isZoomed = states
    }
    map = new HiveMap()
}

export default new HiveClass()