import {CONFIG} from "@/js/config";

export class Auth {
  constructor(model, ui) {
    this.model = model;
    this.ui = ui;

    this.regsForm = CONFIG.elements.registrForm;
    this.authForm = CONFIG.elements.autorizForm;
    this.authBtnSubmit = this.authForm.querySelector('[type="submit"]');
    this.regsBtnSubmit = this.regsForm.querySelector('[type="submit"]');
    this.init();
    this.initRegistr();
    this.initAuth();
  }

  init() {
    const authBtn = CONFIG.elements.authBtn;
    const regBtn = CONFIG.elements.regBtn;
    const name = CONFIG.elements.registrationPage.querySelector('.card-title');
    authBtn.addEventListener('click', () => {
      if (!authBtn.classList.contains(CONFIG.active)) {
        authBtn.classList.add(CONFIG.active);
        regBtn.classList.remove(CONFIG.active);
        this.ui.currentScrollY = window.scrollY;
        name.innerText = 'Авторизация';
        this.authForm.classList.remove(CONFIG.dNone);
        this.regsForm.classList.add(CONFIG.dNone);
        window.scrollTo(0, this.ui.currentScrollY);
      }
    });
    regBtn.addEventListener('click', () => {
      if (!regBtn.classList.contains(CONFIG.active)) {
        authBtn.classList.remove(CONFIG.active);
        regBtn.classList.add(CONFIG.active);
        this.ui.currentScrollY = window.scrollY;
        name.innerText = 'Регистрация';
        this.authForm.classList.add(CONFIG.dNone);
        this.regsForm.classList.remove(CONFIG.dNone);
        window.scrollTo(0, this.ui.currentScrollY);
      }
    });
  }

  initRegistr() {
    const regisFormClear = this.regsForm.querySelector('[type="button"]');

    // Registration form
    this.regsForm.addEventListener('submit', evt => {
      evt.preventDefault();
      this.ui.changeBtnSendState(true, this.regsBtnSubmit);
      let arr = this.collectDataFromForm(this.regsForm);
      let phone = this.ui.getPhoneFromForm(this.regsForm);
      let data = `${arr[1]}|${phone}`;
      // this.regsWithEmailAndPassword(arr[0], arr[4], data);
      this.signWithEmailAndPassword(arr[0], arr[4], false, data)
          .then(() => {
            this.ui.changeBtnSendState(false, this.regsBtnSubmit);
            this.resetForm(this.regsForm);
          });
    });
    regisFormClear.addEventListener('click', () => this.resetForm(this.regsForm));
    this.ui.formChanging(this.regsForm, CONFIG.formAuthBtnOptions, true);
    this.ui.formValidate(this.regsForm);
  }

  initAuth() {
    const recovery = this.authForm.querySelector('[type="checkbox"]');
    const pswAuth = this.authForm.querySelector('[type="password"]');
    const authFormClear = this.authForm.querySelector('[type="button"]');

    recovery.checked = false;
    //Authorization Form
    this.authForm.addEventListener('submit', evt => {
      evt.preventDefault();
      this.ui.changeBtnSendState(true, this.authBtnSubmit);
      let arr = this.collectDataFromForm();
      if (recovery.checked) {
        this.sendPasswordResetEmail(arr[0])
            .then(() => {
              this.ui.changeBtnSendState(false, this.authBtnSubmit);
              this.authForm.querySelector('[type="password"]').disabled = false;
              this.resetForm();
            });

      } else {
        this.signWithEmailAndPassword(arr[0], arr[1])
            .then(() => {
              this.ui.changeBtnSendState(false, this.authBtnSubmit);
              this.resetForm();
            });
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
    // this.ui.formValidate(this.authForm);
  }

  resetForm(form = this.authForm) {
    form.reset();
    form.dispatchEvent(new Event('keyup'));
  }

  collectDataFromForm(form = CONFIG.elements.autorizForm) {
    let dataArr = [];
    form.querySelectorAll('input').forEach(e => e.type === 'checkbox' ? dataArr.push(e.checked) : dataArr.push(e.value));
    return dataArr;
  }

  signWithEmailAndPassword(email, password, auth = true, displayName) {
    return fetch(auth ? CONFIG.authUrl + CONFIG.apiKey : CONFIG.regsUrl + CONFIG.apiKey, {
      method: 'POST',
      body: JSON.stringify(auth ?
          {email, password, returnSecureToken: true}
          : {email, password, displayName, returnSecureToken: true}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
        .then(data => {
          console.log(data);
          console.log(data.error);
          if (data.error) {
            this.addAlert(CONFIG.alerts.authRegError, data.error.message, auth, 3000);
          }
          if (data.idToken) {
            this.addAlert(CONFIG.alerts.authSuccess, '', auth, 2000);
            console.log(data.idToken);
            this.ui.emit('login', data);
          }
        })
        .catch(data => {
          // console.log(data.error.message);
        });
  }

  sendPasswordResetEmail(email) {
    return fetch(CONFIG.recvUrl + CONFIG.apiKey, {
      method: 'POST',
      body: JSON.stringify({
        email,
        'requestType': 'PASSWORD_RESET'}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
        .then(data => {
          console.log(data);
          console.log(data.error);
          if (data.error) {
            this.addAlert(CONFIG.alerts.authRegError, data.error.message, true, 3000);
          }
          if (data.email) {
            this.addAlert(CONFIG.alerts.recvSuccess, '', true, 5000);
          }
        })
        .catch(data => {
          // console.log(data.error.message);
        });
  }

  addAlert(data, text, auth = true, time = 0) {
    const alert = document.createElement('div');
    alert.innerHTML = data;
    if (!!text) {
      const txt = document.createTextNode(text);
      alert.firstElementChild.prepend(txt);
    }
    auth ? CONFIG.elements.authAlertPlace.append(alert) : CONFIG.elements.registrAlertPlace.append(alert);
    if (!!time) this.closeAlert(time);
  }

  closeAlert(time) {
    window.setTimeout(() => {
      $('.alert').alert('close');
    }, time);
  }
}
