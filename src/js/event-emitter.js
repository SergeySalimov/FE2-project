export class EventEmitter {
  constructor() {
    this._events = {
    };
  }

  on(event, listener) {
    (this._events[event] || (this._events[event] = [])).push(listener);
  }

  emit(event, arg1, arg2) {
    (this._events[event] || []).forEach(listener => listener(arg1, arg2));
  }
}

