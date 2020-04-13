import {EventEmitter} from "@/js/event-emitter";
import {CONFIG} from "@/js/config";

export class Messages extends EventEmitter{
  constructor(ui, contactUs, model) {
    super();
    this.ui = ui;
    this.contactUs = contactUs;
    this.model = model;
    this.allMessages = [];
    this.allMsgsInLocalStorage = this.contactUs.allMessageFromLocalStore;
    this.currMsgs = {};
    this.init();

  }

  init() {
    // this.loadAllMessages();

    console.log(this.allMsgsInLocalStorage[0]);

    this.displayPage(this.model._admin);
  }

  displayPage(isAdmin) {
    const msgsUserBtn = CONFIG.elements.msgsUserData.querySelectorAll('button');
    const msgsUserdata = CONFIG.elements.msgsUserData.querySelectorAll('span');
    const phone = document.createTextNode(isAdmin ? this.model.currUser.phone :this.allMsgsInLocalStorage[0].phone);
    const email = document.createTextNode(isAdmin ? this.model.currUser.email :this.allMsgsInLocalStorage[0].email);
    msgsUserdata[0].append(phone);
    msgsUserdata[1].append(email);
    console.log(phone);
    console.log(email);
    if (isAdmin) {
      CONFIG.elements.msgsSort.classList.remove(CONFIG.dNone);
      CONFIG.elements.newMsgsBtn.classList.add(CONFIG.dNone);
      msgsUserBtn.forEach(e => e.classList.remove(CONFIG.dNone));
      //
      // const txt = document.createTextNode(text);
      // alert.firstElementChild.prepend(txt);
      // msgsUserdata[0].append = this.currMsgs.phone;
      // msgsUserdata[1].innerText = this.currMsgs.email;


    } else {
      CONFIG.elements.msgsSort.classList.add(CONFIG.dNone);
      CONFIG.elements.newMsgsBtn.classList.remove(CONFIG.dNone);
      msgsUserBtn.forEach(e => e.classList.add(CONFIG.dNone));

      // msgsUserdata[0].append(this.model.currUser.phone);
      // msgsUserdata[1].append(this.model.currUser.email);
    }
  }

  loadAllMessages() {
    fetch(`${CONFIG.api}/messages.json`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
        .then(messages => {
          this.model._admin ? this.allMessages = messages : this.filterMessages(messages);
          // ToDo delete messages from localStorage
          // localStorage.removeItem(CONFIG.localStorageMessageID);
        })
        .catch(err => {
          console.log(err);
          this.allMessages = this.allMsgsInLocalStorage;
        })
  }

  filterMessages(messages, email = this.model.currUser.email, phone = this.model.currUser.phone) {
    for (const key in messages) {
        if (messages[key].email === email || messages[key].phone === phone) this.allMessages.push(messages[key])
    }
  }

  renderMessages() {

  }
}
