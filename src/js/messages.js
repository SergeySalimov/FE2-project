import {EventEmitter} from "@/js/event-emitter";

export class Messages extends EventEmitter{
  constructor(ui, contactUs) {
    super();
    this.ui = ui;
    this.contactUs = contactUs;
    this.allMessages = [];
    this.allMsgsCurr = this.contactUs.allMessageFromLocalStore;
    this.init();

  }

  init() {
    console.log(this.allMsgsCurr);

  }
}
