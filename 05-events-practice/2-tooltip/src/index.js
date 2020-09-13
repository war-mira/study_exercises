class Tooltip {
    element;

    constructor() {
        this.tooltipText = 'This is tooltip'
        this.coords = {}
    }

    initialize(){
        this.initOver()
        this.initOut()
    }

    initOver(){
        document.onpointerover = (e) =>{
            let target = e.target

            if(!target.dataset.tooltip){
                return
            }

            this.tooltipText = target.dataset.tooltip
            this.coords.left = e.clientX
            this.coords.top = e.clientY
            
            this.render()
        }
    }
    initOut(){
        document.onpointerout = (e) => {
            this.remove()
        };
    }

    render(){
        if(!this.element){
            this.element = document.createElement('div')
        }
        this.element.innerHTML = this.tooltipText
        this.element.classList.add('tooltip')
        this.element.style.left = this.coords.left + 'px';
        this.element.style.top = this.coords.top + 'px'
        document.body.append(this.element)
    }
    
    get createTooltip(){
        return `<div class='tooltip'>${this.tooltipText}</div>`
    }

    remove() {
        if(this.element){
            this.element.remove()
        }
    }

    destroy() {
        this.remove();
    }
}

const tooltip = new Tooltip();

export default tooltip;
