export default class DoubleSlider {
    element;
    subElement = {};

    constructor({
        min = 100,
        max = 200,
        formatValue = value => '$' + value,
        selected = {
            from: min,
            to: max
        }
      } = {}) {
        this.min = min;
        this.max = max;
        this.formatValue = formatValue
        this.selected = selected

        this.render();
    }

    onMouseMove = e => {
        e.preventDefault();

        const { left: innerLeft, right: innerRight, width } = this.subElement.inner.getBoundingClientRect();

        if (this.target === this.subElement.thumbLeft){
            let newLeft = (e.clientX - innerLeft + this.shiftX) / width;

            if (newLeft < 0) {
              newLeft = 0;
            }
            newLeft *= 100;
            let right = parseFloat(this.subElement.thumbRight.style.right);
      
            if (newLeft + right > 100) {
              newLeft = 100 - right;
            }
      
            this.target.style.left = this.subElement.progress.style.left = newLeft + '%';
            this.subElement.from.innerHTML = this.formatValue(this.getValue().from);
        }else{
            let newRight = (innerRight - e.clientX - this.shiftX) / width;

            if (newRight < 0) {
              newRight = 0;
            }
            newRight *= 100;
      
            let left = parseFloat(this.subElement.thumbLeft.style.left);
      
            if (left + newRight > 100) {
              newRight = 100 - left;
            }
            this.target.style.right = this.subElement.progress.style.right = newRight + '%';
            this.subElement.to.innerHTML = this.formatValue(this.getValue().to);
        }
    }

    onMouseUp = () => {
        this.removeListeners()

        this.element.dispatchEvent(new CustomEvent('range-select', {
            detail: this.getValue(),
            bubbles: true
        }));
    }

    get rangeTemplate(){
        const { from, to } = this.selected

        return `
            <div class="range-slider">
                <span data-element="from">${this.formatValue(from)}</span>
                <div data-element="inner" class="range-slider__inner">
                    <span data-element="progress" class="range-slider__progress" style="${this.getProgressStyle(from, to)}"></span>
                    <span data-element="thumbLeft" class="range-slider__thumb-left" style="${this.getLeftThumbStyle(from, to)}"></span>
                    <span data-element="thumbRight" class="range-slider__thumb-right" style="${this.getRightThumbStyle(from, to)}"></span>
                </div>
                <span data-element="to">${this.formatValue(to)}</span>
            </div>`
    }

    render(){
        const element = document.createElement('div')
        element.innerHTML = this.rangeTemplate
    
        this.element = element.firstElementChild
        this.subElement = this.getSubElements(element)

        this.initListeners()
    }

    listenThumbEvent(e){
        this.target = e.target
        e.preventDefault()

        const {left, right} = this.target.getBoundingClientRect()

        if(this.target.dataset.element === 'thumbLeft'){
            this.shiftX = right - e.clientX
        }else if(this.target.dataset.element === 'thumbRight'){
            this.shiftX = left - e.clientX;
        }else{
            return
        }

        document.addEventListener('pointermove', this.onMouseMove);
        document.addEventListener('pointerup', this.onMouseUp);
    }
    initListeners(){
        //console.log(this.subElement)
        this.subElement.thumbLeft.addEventListener('pointerdown', e => this.listenThumbEvent(e))
        this.subElement.thumbRight.addEventListener('pointerdown', e => this.listenThumbEvent(e))
    }

    getProgressStyle(from, to){
        return `
            left:${(from - this.min) / (this.max - this.min) * 100}%;
            right:${100 - (to - this.min) / (this.max - this.min) * 100}%;
        `
    }

    getLeftThumbStyle(from, to){
        return `left:${(from - this.min) / (this.max - this.min) * 100}%`
    }

    getRightThumbStyle(from, to){
        return `right:${100 - (to - this.min) / (this.max - this.min) * 100}%`
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
          return accum;
        }, {});
    }

    getValue() {
        const rangeTotal = this.max - this.min;
        const { left } = this.subElement.thumbLeft.style;
        const { right } = this.subElement.thumbRight.style;

        const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
        const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);

        return { from, to };
    }
    remove() {
        this.element.remove()
    }

    removeListeners () {
        document.removeEventListener('pointerup', this.onMouseUp);
        document.removeEventListener('pointermove', this.onMouseMove);
    }

    destroy() {
        this.remove();
        this.removeListeners();
    }
}
