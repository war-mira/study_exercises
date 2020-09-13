export default class RangePicker {
    element;
    subElement = {}
    selectingFrom = true
    

    formatDate(date, lang){
        return new Intl.DateTimeFormat(lang).format(date)
    }

    constructor({
        from = new Date(),
        to = new Date(),
        locale = 'ru',
        selected = {
            from: new Date(),
            to: new Date()
        }
        
    } = {}){
        this.from = from
        this.to = to
        this.selected = {from, to}
        this.locale = locale
        this.currentMonth = this.from;

        this.render()
    }

    get template(){
        return `
            <div class="rangepicker__input" data-element="input">
                <span data-element="from">${this.formatDate(this.from, this.locale)}</span> -
                <span data-element="to">${this.formatDate(this.to, this.locale)}</span>
            </div>
            <div class="rangepicker__selector" data-element="selector"></div>`
    }

    render(){
        const element = document.createElement('div')
        element.classList.add('rangepicker')
        element.innerHTML = this.template

        this.element = element
        this.subElement = this.getSubElements(this.element)

        this.initEventListeners()
    }

    initEventListeners(){
        const {input, selector} = this.subElement

        document.addEventListener('click', (e => this.close(e)))
        input.addEventListener('click', () => this.openCalendar())
        selector.addEventListener('click', e => this.changeMonth(e))
        selector.addEventListener('click', e => this.changeData(e.target));
    }

    changeMonth(event){
        if (event.target.classList.contains('rangepicker__selector-control-left')) {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
            this.subElement.selector.innerHTML = `${this.createCalendar(this.currentMonth)}`;
        }
        if (event.target.classList.contains('rangepicker__selector-control-right')) {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
            this.subElement.selector.innerHTML = `${this.createCalendar(this.currentMonth)}`;
        }
    }

    close(event){
        if (event.target.classList.contains('rangepicker__selector-control-left') || event.target.classList.contains('rangepicker__selector-control-right')) return;
        if (!event.target.closest('.rangepicker')) {
            this.element.classList.remove('rangepicker_open');
        }
    }

    openCalendar(target){
        this.element.classList.add('rangepicker_open');
        const selector = this.element.querySelector('.rangepicker__selector')

        this.wrapper = this.createCalendar(this.from)
        selector.innerHTML = this.wrapper
    }

    createCalendar(from){
        const nextMonth = new Date(from.getFullYear(), from.getMonth() + 1)

        return `
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            <div class="rangepicker__calendar">${this.getMonthTemplate(from)}</div>
            <div class="rangepicker__calendar">${this.getMonthTemplate(nextMonth)}</div>
        `
    }

    getMonthTemplate(date){
        const monthName = date.toLocaleString(this.locale, {month: 'long'});

        return`
            <div class="rangepicker__month-indicator">
                <time datetime="${monthName}">${monthName}</time>
            </div>
            <div class="rangepicker__day-of-week">
                ${this.getWeekDays().map(item=>{
                    return `<div>${item}</div>`
                }).join('')}
            </div>
            <div class="rangepicker__date-grid">
                ${this.getDays(date)}
            </div>
        `
    }

    getWeekDays(){
        const baseDate = new Date(Date.UTC(2020, 0, 6));
        const weekDays = [];
        for(let i = 0; i < 7; i++){       
            weekDays.push(baseDate.toLocaleDateString(this.locale, { weekday: 'short' }));
            baseDate.setDate(baseDate.getDate() + 1);       
        }
        return weekDays;
    }

    getDays(date){
        const formattedDate = new Date(date)
        const daysInMonth = new Date(formattedDate.getFullYear(), formattedDate.getMonth() + 1, 0).getDate();

        const firstDayIndex = (day) => day === 0 ? 7 : day

        formattedDate.setDate(1)

        let template = `
            <button type="button" class="rangepicker__cell ${this.checkPeriod(formattedDate)}" 
                data-value="${formattedDate.toISOString()}" 
                style="--start-from: ${firstDayIndex(formattedDate.getDay())}">
                ${formattedDate.getDate()}
            </button>
        `
        //2 is second day of month for counter
        for(let i = 2; i <= daysInMonth; i++){
            formattedDate.setDate(i)
            template += `
                <button type="button" class="rangepicker__cell ${this.checkPeriod(formattedDate)}" 
                    data-value="${formattedDate.toISOString()}">
                    ${formattedDate.getDate()}
                </button>
            `
        }

        return template
    }

    checkPeriod(data){
        const currentDate = new Date(data).toISOString()
        const from = new Date(this.from).toISOString()
        const to = new Date(this.to).toISOString()
        
        if(currentDate === from){
            return `rangepicker__selected-from`
        }
        if(currentDate === to){
            return `rangepicker__selected-to`
        }
        if((data > this.from) && (data<this.to)){
            return`rangepicker__selected-between`
        }
        return ''
    }

    changeData(target){
        if (!target.classList.contains('rangepicker__cell')) {
            return
        }
        const { value } = target.dataset
        const dateValue = new Date(value);

        if (this.selectingFrom) {
            this.cleanHighlights()

            this.selected = {
              from: dateValue,
              to: null
            };
            this.from = dateValue
            this.selectingFrom = false;
          } else {
            if (dateValue > this.selected.from) {
              this.selected.to = dateValue;
              this.to = dateValue
            } else {
              this.selected.to = this.selected.from;
              this.selected.from = dateValue;
            }
            this.refreshInput()
            this.selectingFrom = true;
            this.subElement.selector.innerHTML = `${this.createCalendar(this.selected.from)}`;
          }

          if (this.selected.from && this.selected.to) {
            this.dispatchEvent();
          }

    }

    cleanHighlights(){
        this.element.querySelectorAll('.rangepicker__cell').forEach(item => {
            item.classList.remove('rangepicker__selected-between', 'rangepicker__selected-from', 'rangepicker__selected-to')
        })
    }

    dispatchEvent(){
        this.element.dispatchEvent(new CustomEvent('date-select', {
            bubbles: true,
            detail: this.selected
        }));
    }

    refreshInput() {
        this.subElement.input.innerHTML = `
            <span data-element="from">${this.formatDate(this.from, this.locale)}</span> -
            <span data-element="to">${this.formatDate(this.to, this.locale)}</span>
        `;
    }

    getSubElements(element){
        const elements = element.querySelectorAll('[data-element]')

        return [...elements].reduce((accum, subElement) => {
            accum[subElement.dataset.element] = subElement;

            return accum;
        }, {})
    }

    remove() {
        this.element.remove()
        document.removeEventListener('click', this.onDocumentClick, true)
    }

    destroy(){
        this.remove();
        this.element = null;
        this.subElements = {};
        this.selectingFrom = true;
        this.selected = {
          from: new Date(),
          to: new Date()
        };
    
        return this;
    }
}
