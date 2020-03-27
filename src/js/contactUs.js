import {CONFIG} from "@/js/config";

export class ContactUs {
  constructor(model, ui) {
    this._model = model;
    this.ui = ui;
    this.initForm();
    this.currentMessage = {};
    this.allMessageFromLocalStore = this.getMessagesFormLocalStorage();
  }

  initForm() {
    const form = CONFIG.elements.formContactUs;
    const button = form.querySelector('[type="submit"]');
    const buttonClear = CONFIG.elements.clearContactUsBtn;
    const email = form.querySelector('[type="email"]');
    const phones = form.querySelectorAll('[type="tel"]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.currentMessage = this.collectData();
      this.sendContactUsFormtoServer(this.currentMessage, button);
    });
    buttonClear.addEventListener('click', () => this.resetForm());
    this.ui.formChanging(form, CONFIG.formContactUsBtnOptions);
    form.addEventListener('input', () => {
      const phoneState = !!(phones[0].value) && !!(phones[1].value);
      if (email.checkValidity()) {
        phones.forEach(e => e.required = false);
        email.required = !phoneState;
      } else {
        if (phoneState) {
          email.required = false;
        } else {
          email.required = true;
          phones.forEach(e => e.required = true);
        }
      }
    });
    this.ui.formValidate();
  }

  addAlert(data) {
    const div = document.createElement('div');
    div.innerHTML = data;
    CONFIG.elements.contactUsAlertPlace.append(div);
  }

  sendContactUsFormtoServer(data, button) {
    this.ui.changeBtnSendState(true, button);
    fetch(`${CONFIG.api}/messages.json`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
        .then(id => {
          this.ui.changeBtnSendState(false, button);
          this.resetForm();
          this.currentMessage.id = id.name;
          this.addToLocalStorage(this.currentMessage);
          this.currentMessage = {};
          this.addAlert(CONFIG.alerts.contactUsSended);
          this.ui.closeAlert(3000, 'send-contact-us-success');
          if (!this._model.curUser) this.addAlert(CONFIG.alerts.contactUsNoAuth);
        })
  }

  addToLocalStorage(newMessage) {
    this.allMessageFromLocalStore = this.getMessagesFormLocalStorage();
    this.allMessageFromLocalStore.push(newMessage);
    localStorage.setItem(CONFIG.localStorageMessageID, JSON.stringify(this.allMessageFromLocalStore));
  }

  getMessagesFormLocalStorage() {
    return JSON.parse(localStorage.getItem(CONFIG.localStorageMessageID) || '[]');
  }

  resetForm(form = CONFIG.elements.formContactUs) {
    if (this._model.curUser) {
      form.querySelector('textarea').value = '';
    } else {
      form.reset();
    }
    form.dispatchEvent(new Event('keyup'));
  }

  collectData() {
    const form = CONFIG.elements.formContactUs;
    const name = form.querySelector('[type="text"]').value;
    const email = form.querySelector('[type="email"]').value;
    const phone = this.ui.getPhoneFromForm(form);
    const text = form.querySelector('textarea').value;
    const date = new Date().toJSON();
    return { name, email, phone, text, date,
      'readed': false,
      'answered': false,
      'showed': true,
    };
  }

}
