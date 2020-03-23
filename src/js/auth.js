import {EventEmitter} from "@/js/event-emitter";

export class Auth extends EventEmitter{
  constructor(model, ui) {
    super();
    this.model = model;
    this.ui = ui;
    this.init();
  }

  init() {

  }


}
