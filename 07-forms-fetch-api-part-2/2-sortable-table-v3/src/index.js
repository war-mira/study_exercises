import FetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';
export default class SortableTable {
    element;
    subElements = {};
    headersConfig = [];
    data = [];
    api = 'https://course-js.javascript.ru';

    onSortClick = event => {
        const column = event.target.closest('[data-sortable="true"]');
        const toggleOrder = order => {
          const orders = {
            asc: 'desc',
            desc: 'asc'
          };
    
          return orders[order];
        };
    
        if (column) {
            const { id, order } = column.dataset;
            this.queryParams._sort = id
            this.queryParams._order = order

            const arrow = column.querySelector('.sortable-table__sort-arrow');
        
            column.dataset.order = order === 'asc' ? 'desc' : 'asc';
        
            if (!arrow) {
                column.append(this.subElements.arrow);
            }
        
            this.getProductList()
        }
      };
  
    constructor(headersConfig, {
        url = '',
        data = []
    } = {}) {
      this.headersConfig = headersConfig;
      this.url = url
      this.data = data
      this.queryParams = {
          _sort: 'title',
          _order: 'asc',
          _start: 0,
          _end: 30
      }
  
      this.init()
    }

    init(){
        this.render()
        this.getProductList()
        this.initListeners()
    }
  
    getTableHeader() {
      return `<div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}</div>`;
    }
  
    getHeaderRow({id, title, sortable}) {
      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
          ${this.getHeaderSortingArrow()}
        </div>
      `;
    }
  
    getHeaderSortingArrow() {
      return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
    }
  
    getTableBody(data) {
      return `
        <div data-element="body" class="sortable-table__body">
          ${this.getTableRows(data)}
        </div>`;
    }
  
    getTableRows(data) {
      return data.map(item => `
        <div class="sortable-table__row">
          ${this.getTableRow(item, data)}
        </div>`
      ).join('');
    }
  
    getTableRow(item) {
      const cells = this.headersConfig.map(({id, template}) => {
        return {
          id,
          template
        };
      });
  
      return cells.map(({id, template}) => {
        return template
          ? template(item[id])
          : `<div class="sortable-table__cell">${item[id]}</div>`;
      }).join('');
    }
  
    getTable(data) {
      return `
        <div class="sortable-table">
          ${this.getTableHeader()}
          ${this.getTableBody(data)}
        </div>`;
    }

    initListeners(){
        this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    }

    async getProductList(){
        this.element.classList.add('sortable-table_loading')

        const query = new URLSearchParams(this.queryParams).toString()
        const response = await FetchJson(`${this.api}/${this.url}?${query}`)
       
        this.updateTable(response)
    }

    updateTable(data){
        this.element.classList.remove('sortable-table_loading')
        this.subElements.body.innerHTML = this.getTableRows(data);
    }
  
    render() {
      const wrapper = document.createElement('div');
  
      wrapper.innerHTML = this.getTable(this.data);
  
      const element = wrapper.firstElementChild;
  
      this.element = element;
      this.subElements = this.getSubElements(element);
      
      this.setDefaultSort(this.queryParams._sort, this.queryParams._order)
    }

    setDefaultSort(field, order) {
      const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
      const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
  
      // NOTE: Remove sorting arrow from other columns
      allColumns.forEach(column => {
        column.dataset.order = '';
      });
  
      currentColumn.dataset.order = order;
    }
  
    getSubElements(element) {
      const elements = element.querySelectorAll('[data-element]');
  
      return [...elements].reduce((accum, subElement) => {
        accum[subElement.dataset.element] = subElement;
  
        return accum;
      }, {});
    }
  
    remove() {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      this.subElements = {};
    }
  }
  