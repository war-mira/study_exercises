import FetchJson from './utils/fetch-json.js'
export default class ColumnChart {
    element;
    subElements = {};
    chartHeight = 50;
    api = 'https://course-js.javascript.ru';
  
    constructor({
        data = [],
        url = '',
        range = {
            from: new Date('2020-04-11'),
            to: new Date('2020-05-06')
        },
        label = '',
        link = '',
        formatHeading = data => `$${data}`

    } = {}) {
        this.data = data
        this.url = url
        this.range = range
        this.label = label
        this.link = link
        this.formatHeading = formatHeading
  
        this.render();
        this.uploadData()
    }
  
    getColumnBody(data) {
      const maxValue = Math.max(...data);
  
      return data
      .map(item => {
        const scale = this.chartHeight / maxValue;
        const percent = (item / maxValue * 100).toFixed(0);
  
        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
    }
  
    getLink() {
      return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
    }
  
    get template() {
      return `
        <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            Total ${this.label}
            ${this.getLink()}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
              ${this.value}
            </div>
            <div data-element="body" class="column-chart__chart">
              ${this.getColumnBody(this.data)}
            </div>
          </div>
        </div>
      `;
    }

    async uploadData(){
        const response = await FetchJson(`${this.api}/${this.url}?${this.formattedDate()}`)
        
        this.data = Object.values(response)
        this.label = this.getChartSum(this.data)

        this.updateChart(this.data, this.label)
    }

    updateChart(data, label){
        this.element.classList.remove('column-chart_loading');

        this.subElements.header.innerHTML = label, this.getLink()
        this.subElements.body.innerHTML = this.getColumnBody(data);
    }

    getChartSum(response){
        return response.reduce((sum, current) => sum + current, 0);
    }

    formattedDate() {
        const from = this.range.from
        const to = this.range.to
        const range = {
            from: this.parseDate(from),
            to: this.parseDate(to)
        }
        return new URLSearchParams(range).toString()
    }

    parseDate(d){
        return [d.getFullYear(), d.getMonth()+1, d.getDate()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('-');
    }

    render() {
      const element = document.createElement('div');
  
      element.innerHTML = this.template;
  
      this.element = element.firstElementChild;
  
      if (this.data.length) {
        this.element.classList.remove('column-chart_loading');
      }
  
      this.subElements = this.getSubElements(this.element);
    }
  
    getSubElements(element) {
      const elements = element.querySelectorAll('[data-element]');
  
      return [...elements].reduce((accum, subElement) => {
        accum[subElement.dataset.element] = subElement;
  
        return accum;
      }, {});
    }
  
    update(from, to) {
       this.range.from = from
       this.range.to = to

       return this.uploadData()
    }
  
    remove () {
      this.element.remove();
    }
  
    destroy() {
      this.remove();
      this.subElements = {};
    }
  }
  