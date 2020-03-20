import {CONFIG} from "@/js/config";

export class ContactUs {
  constructor(model, ui) {
    this._model = model;
    this.ui = ui;
    this.initForm();

  }

  initForm() {
    const form = CONFIG.elements.formContactUs;
    const button = form.querySelector('[type="submit"]');
    const email = form.querySelector('[type="email"]');
    const phones = form.querySelectorAll('[type="tel"]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log('submit');
    });
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

}
