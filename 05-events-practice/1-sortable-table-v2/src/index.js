export default class SortableTable {
    element;
    subElements = {}

    constructor(headerTitle, {
        data = {},
        sorted = {
            id: 'title',
            order: 'asc'
        }
    } = {}) {
        
        this.headerTitle = headerTitle
        this.productList = data
        this.sortField = sorted.id
        this.sortDirection = sorted.order
        
        this.render();
    }

    initListeners(){
        this.sortListening()
    }

    get headerTemplate(){
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headerTitle.map(item=>{
                    return `<div class="sortable-table__cell" data-id="${item.id}" 
                                data-sortable="${item.sortable}" ${this.setDefaultDirection(item)}> 
                                <span>${item.title}</span>
                                ${this.getSortArrow(item)}
                            </div>`
                }).join('')}
            </div>`
    }

    get bodyTemplate(){
        this.sort(this.sortField, this.sortDirection, false)

        return `
            <div data-element="body" class="sortable-table__body">
                ${this.productList.map(item=>{
                    return this.getProductRow(item)
                }).join('')}
            </div>`
    }
    setDefaultDirection(item){
        let defaultDirection = ''
        if(item.id === this.sortField){
            return `data-order="${this.sortDirection}"`
        }
        return defaultDirection
    }
    getSortArrow(item){
        return `<span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>`
        }
    getSubElements(element) {
        return {
            header: element.querySelector('.sortable-table__header'),
            body: element.querySelector('.sortable-table__body'),
        }
    }
    getProductRow (item){
        const template = this.headerTitle.map((el) => {
            if (el.template){
              return el.template(item[el.id]);
            }
            return `<div class="sortable-table__cell">${item[el.id]}</div>`
          }).join('');
      
          return `<div class="sortable-table__row">${template}</div>`
    }

    render(){
        this.element = document.createElement('div')
        this.element.classList.add('sortable-table')
        this.element.innerHTML = this.headerTemplate + this.bodyTemplate

        this.subElements = this.getSubElements(this.element);

        this.initListeners()
    }

    sortListening(){
        this.subElements.header.querySelectorAll(`.sortable-table__cell[data-sortable="true"]`).forEach(item =>{

            item.addEventListener('click', e => {
                const field = item.getAttribute('data-id')
                const currentOrder = item.getAttribute('data-order')
                const order = currentOrder === 'asc' ? 'desc' : 'asc'

                this.sort(field, order, true)

                item.dataset.order = order
            })
        })
    }

    sort(field, value, status){
        this.productList = this.makeSorting(field, value)

        if(status){
            const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
            const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

            allColumns.forEach(column => {
                column.dataset.order = '';
            });
        
            currentColumn.dataset.order = value;

            this.subElements.body.innerHTML = this.productList.map(item=>{
                return this.getProductRow(item)
            }).join('')
        }
    }

    makeSorting(field, value){
        const sorterData = [...this.productList]
        const column = this.headerTitle.find(item => item.id === field);
        const {sortType, customSorting} = column;
        const direction = value === 'asc' ? 1 : -1

        return sorterData.sort((a, b) => {
            switch (sortType) {
            case "string":
                return direction * a[field].localeCompare(b[field], 'ru')
            case "number": 
                return direction * (a[field] - b[field])
            case 'custom':
                return direction * customSorting(a, b);
            default: 
                return direction * (a[field] - b[field])
            }
        });
    }


    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        this.subElements = {};
    }
}

