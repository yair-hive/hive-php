class HiveClass{
    constructor(){
        this.isZoomed = false
        this.setZoomed = this.setZoomed.bind(this)
    }
    setZoomed(states){
        this.isZoomed = states
    }
}

export default new HiveClass()