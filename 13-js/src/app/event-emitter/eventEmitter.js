class EventEmitter {
    constructor() {
      this.events = {};
    }
  
    on(event, listener) {
        console.log(
            "%c eventEmitter+on",
            "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
            "this.events",
            this.events,
            "\n event",
            event,
            "\n listener",
            listener,
            "this.events[event]",
            this.events[event]
        );
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
  
    off(event, listenerToRemove) {
        console.log(
            "%c eventEmitter+off",
            "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
            "event",
            event,
            "listenerToRemove",
            listenerToRemove,
        );
      if (!this.events[event]) return;
      this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }
  
    emit(event, payload) {
        console.log(
            "%c eventEmitter+emit",
            "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
            "event",
            event,
            "payload",
            payload,
        );
      if (this.events[event]) {
        this.events[event].forEach(listener => listener(payload));
      }
    }
  }
  
  // 匯出單例模式的 eventEmitter
  export const eventEmitter = new EventEmitter();
  