import {CONFIG} from "@/js/config";

export class ContactUs {
  constructor(model, ui) {
    this._model = model;
    this.ui = ui;
    this.initForm();
    this.contactUs = {};

  }

  initForm() {
    const form = CONFIG.elements.formContactUs;
    const button = form.querySelector('[type="submit"]');
    const buttonClear = CONFIG.elements.clearContactUsBtn;
    const email = form.querySelector('[type="email"]');
    const phones = form.querySelectorAll('[type="tel"]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.ui.changeBtnSendState(true, button);
      this.collectData();

      // this.resetForm(form);
    });
    buttonClear.addEventListener('click', () => this.resetForm(form));
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
    button.addEventListener('mouseenter', () => form.classList.add('was-validated'));
    button.addEventListener('mouseleave', () => form.classList.remove('was-validated'));
    button.addEventListener('pointerenter', () => form.classList.add('was-validated'));
    button.addEventListener('pointerleave', () => form.classList.remove('was-validated'));
  }

  resetForm(form) {
    form.reset();
    form.dispatchEvent(new Event('keyup'));
  }

  collectData() {
    const form = CONFIG.elements.formContactUs;
    const name = form.querySelector('[type="text"]').value;
    const email = form.querySelector('[type="email"]').value;
    let phone = '';
    form.querySelectorAll('[type="tel"]').forEach(e => phone += e.value);
    phone = '+' + phone.replace(/\D/g, '');
    const text = form.querySelector('textarea').value;
    const date = new Date().toJSON();

    this.contactUs = { name, email, phone, text, date, };
    this.contactUs.readed = false;
    this.contactUs.answered = false;
    this.contactUs.showed = true;
    console.dir(this.contactUs);
  }

}
