import {EventEmitter} from "@/js/event-emitter";
import {CONFIG} from "@/js/config";

export class Auth extends EventEmitter {
  constructor(model, ui) {
    super();
    this.model = model;
    this.ui = ui;
    this.authForm = CONFIG.elements.autorizForm;
    this.authBtnSubmit = this.authForm.querySelector('[type="submit"]');

    this.initAuth();
  }

  initAuth() {
    const recovery = this.authForm.querySelector('[type="checkbox"]');
    const emailAuth = this.authForm.querySelector('[type="email"]');
    const pswAuth = this.authForm.querySelector('[type="password"]');
    const authFormClear = this.authForm.querySelector('[type="button"]');

    recovery.checked = false;
    //Authorization Form
    this.authForm.addEventListener('submit', evt => {
      evt.preventDefault();
      this.ui.changeBtnSendState(true, this.authBtnSubmit);
      let arr = Auth.collectDataFromForm();
      if (recovery.checked) {

      } else {
        this.authWithEmailAndPassword(arr[0], arr[1]);
      }

      // recovery.checked ? console.log('recovery') : console.log('submit');
    });
    recovery.addEventListener('click', () => {
      pswAuth.disabled = recovery.checked;
      this.authForm.dispatchEvent(new Event('keyup'));
    });
    authFormClear.addEventListener('click', () => {
      this.resetForm();
      pswAuth.disabled = recovery.checked;
    });
    this.ui.formChanging(this.authForm, CONFIG.formAuthBtnOptions);
  }

  resetForm(form = CONFIG.elements.autorizForm) {
    form.reset();
    form.dispatchEvent(new Event('keyup'));
  }

  static collectDataFromForm(form = CONFIG.elements.autorizForm) {
    let dataArr = [];
    form.querySelectorAll('input').forEach(e => e.type === 'checkbox' ? dataArr.push(e.checked) : dataArr.push(e.value));
    return dataArr;
  }

  authWithEmailAndPassword(email, password) {
    return fetch(CONFIG.authUrl + CONFIG.apiKey, {
      method: 'POST',
      body: JSON.stringify({
        email, password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
        .then(data => {
          console.log(data);
          this.ui.changeBtnSendState(false, this.authBtnSubmit);
          this.resetForm();
        })
        .catch(data => {

        });
  }


}
