export default class NotificationMessage {
    static activeNotification;
  
    constructor(message, {
      duration = 2000,
      type = 'success',
    } = {}) {
  
      clearTimeout(NotificationMessage.timeoutId);
  
      if (NotificationMessage.activeNotification) { // null
        NotificationMessage.activeNotification.remove();
      }
  
      this.message = message;
      this.durationInSeconds = (duration / 1000) + 's';
      this.type = type;
      this.duration = duration;
  
      this.render();
    }
  
    get template() {
      return `<div class="notification ${this.type}" style="--value:${this.durationInSeconds}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">Notification</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>`;
    }
  
    render() {
      const element = document.createElement('div');
  
      element.innerHTML = this.template;
  
      this.element = element.firstElementChild;
  
      NotificationMessage.activeNotification = this.element;
    }
  
    show(parent) {
      const root = parent || document.body;
  
      root.append(this.element);
  
      NotificationMessage.timeoutId = setTimeout(() => {
        this.remove();
      }, this.duration);
    }
  
    remove() {
      this.element.remove();
      NotificationMessage.activeNotification = null;
    }
  
    destroy() {
      this.remove();
    }
  }
  
  
  