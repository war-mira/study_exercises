export default class SortableTable {
    element;
    subElements = {}


    constructor(headerTitle, {
        data = {}
    } = {}) {
        
        this.headerTitle = headerTitle
        this.productList = data
        
        this.render();
    }

    get headerTemplate(){
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headerTitle.map(item=>{
                    return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">${item.title}</div>`
                }).join('')}
            </div>`
    }

    get bodyTemplate(){
        return `
            <div data-element="body" class="sortable-table__body">
                ${this.productList.map(item=>{
                    return this.getProductRow(item)
                }).join('')}
            </div>`
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
        this.wrapper = document.createElement('div')
        this.wrapper.classList.add('sortable-table')
        this.wrapper.innerHTML = this.headerTemplate + this.bodyTemplate

        const element = this.wrapper;

        this.element = element;
        this.subElements = this.getSubElements(element);
    }

    sort(field, value){
        const sorterData = [...this.productList]
        const sortType = (this.headerTitle.find(column =>
            column.id === field
        )).sortType
        const direction = value === 'asc' ? 1 : -1

        function makeSorting() {
            return sorterData.sort((a, b) => {
              switch (sortType) {
                case "string":
                    return direction * a[field].localeCompare(b[field], 'ru')
                case "number": 
                    return direction * (a[field] - b[field]);
                default: 
                    return direction * (a[field] - b[field])
                }
            });
        }
        this.productList = makeSorting()
        this.subElements.body.innerHTML = this.productList.map(item=>{
            return this.getProductRow(item)
        }).join('')
    }
    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}

