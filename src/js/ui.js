import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";

const compiledTemplate = require('./template.handlebars');

export class Ui extends EventEmitter {
  constructor(model, router) {
    super();
    this._model = model;
    this.router = router;
    this.templateScript = compiledTemplate;
    this.initNavBtn();
    this.initCatBtn();
    this.initModalRegistration();
    this.initCatalog();
    // display routes functions
    this.renderPath = {
      '': this.displayHomePage.bind(this),
      '404': this.displayErrorPage.bind(this),
      'catalog': this.displayCatalogPage.bind(this),
      'how-to-buy': this.displayHowToBuyPage.bind(this),
      'delivery': this.displayDeliveryPage.bind(this),
      'payment': this.displayPaymentPage.bind(this),
      'contact': this.displayContactPage.bind(this),
    };
    // broadcast block
    this._model.on('productsLoaded', data => this.renderProductsToDisplay(data));
    this.on('pageChange', (page) => {
      this.hideAll();
      $(CONFIG.elements.nav2).children().slice(1).remove();
      this.renderPath[page]();
      this._model.initTooltip();
      this._model.initTooltip(this._model._noAuth);
      this.renderBasketCount();
    });
    this._model.on('serverWorkEnd', response => this.formAfterServerWork(response));
    this._model.on('autorization', () => this.autorizedState());
  }

  renderBasketCount() {
    CONFIG.elements.basketCount.innerText = this._model.basketCount;
  }

  //ToDO Сделать обработку на event 'prdClk'
  initCatalog() {
    CONFIG.elements.productsPlace.addEventListener('click', (event) => {
      event.preventDefault();
      let parent1 = event.target.parentNode;
      let parent2 = event.target.parentNode.parentNode;
      if (parent1.classList.contains(CONFIG.productClck) || parent2.classList.contains(CONFIG.productClck)) {
        if (event.target.classList.contains(CONFIG.bskClck)) {
          this.emit('basketPrdClk', event.target.dataset.idprd, event.target);
        } else {
          let id = parent1.dataset.id || parent2.dataset.id;
          this.emit('prdClk', id);
        }
      }
    });
  }

  autorizedState() {
    // perehod v avtorizovanoe sostoyanie
    console.log('AUTORIZATE......');
    this.hideFormModal();
    this._model.initTooltip(false);
    this.changeUiOnAutState();
    console.log(this._model.allProducts);
  }

  changeUiOnAutState() {
    CONFIG.elements.cabinetLink.children[0].className = 'icon-user';
    CONFIG.elements.cabinetLink.children[0].innerHTML = `
        <a href="#" data-toggle="modal" data-target="#registration">${this._model._curUser.name}</a>`;
    CONFIG.elements.basket.classList.remove(CONFIG.noAutoriz);
  }

  hideFormModal(time = 2000) {
    window.setTimeout(() => {
      $(CONFIG.modalAuthRegID).modal('hide');
    }, time);
  }

  formAfterServerWork(res) {
    this.deepResetForm();
    this.toastShow(res);
  }

  toastShow(res) {
    if (res[0] === 'error') {
      // error branch
      if (res[1] === 'login') {
        // login errors 0 => error1 & 1 => error2 only
        !res[2] ? $(CONFIG.loginError1Toast).toast('show') : $(CONFIG.loginError2Toast).toast('show');
      } else {
        // registration errors 0 => error1 & 1 => error2 only
        !res[2] ? $(CONFIG.registrErrorToast).toast('show') : $(CONFIG.registr2ErrorToast).toast('show');
      }
    } else {
      // success branch
      if (res[1] === 'login') {
        //succes login
        $(CONFIG.loginSuccesToast).toast('show');
      } else {
        //succes registration
        $(CONFIG.registrSuccesToast).toast('show');
      }
    }
  }

  changeBtnFormState(on = true) {
    if (on) {
      CONFIG.elements.authRegForm.querySelector('[type="submit"]').className = 'btn btn-success mt-3';
      $('[data-toggle="tooltip"]').tooltip('disable');
    } else {
      CONFIG.elements.authRegForm.querySelector('[type="submit"]').className = 'btn btn-danger mt-3';
      $('[data-toggle="tooltip"]').tooltip('enable');
    }
  }

  changeRecoveryPswdState(el = CONFIG.elements.authRegForm.querySelector('[type="password"]'),
                          state = CONFIG.elements.recoveryPswCheckBox.checked) {
    if (state) {
      el.required = false;
      el.parentElement.classList.add(CONFIG.dNone)
    } else {
      el.required = true;
      el.parentElement.classList.remove(CONFIG.dNone)
    }
    this.changeBtnFormState(CONFIG.elements.authRegForm.checkValidity());
  }

  formAuthRegChanging() {
    CONFIG.elements.authRegForm.addEventListener('keyup', (event) => {
      if (!this._model._loginUser) this.validatePswd();
      this.changeBtnFormState(CONFIG.elements.authRegForm.checkValidity());
    });
    // for touchscreen
    CONFIG.elements.authRegForm.addEventListener('touchend', (event) => {
      if (!this._model._loginUser) this.validatePswd();
      this.changeBtnFormState(CONFIG.elements.authRegForm.checkValidity());
    });
  }

  validatePswd() {
    const _pswd = [];
    const pswdInput = CONFIG.elements.authRegForm.querySelectorAll('[type="password"]');
    pswdInput.forEach(e => _pswd.push(e.value));
    if (_pswd[0] !== _pswd[1] && _pswd[0] !== '') {
      pswdInput[1].setCustomValidity('Пароли должны совпадать!');
    } else {
      pswdInput[1].setCustomValidity('');
    }

  }

  initModalRegistration() {
    $(CONFIG.toast).toast();
    this.initAuthRegClick();
    this.formAuthRegChanging();
    this.formListener();
    this.basketListener();
  }

  basketListener() {
    CONFIG.elements.basket.addEventListener('click', (event) => {
      event.preventDefault();
      $(CONFIG.basketModal).modal({ show: true });

      if (!this._model._noAuth) {
        // only if autorized
      }
    });
  }

  showRecoveryToast() {
    $(CONFIG.recoveryToast).toast('show');
  }

  emitEventOnForm() {
    let _formData = [];
    this.changeBtnSendState();
    CONFIG.elements.authRegForm.querySelectorAll('input').forEach(e => _formData.push(e.value));
    if (!this._model._loginUser) {
      _formData.splice(5);
      _formData.push(CONFIG.elements.subscribeCheckBox.checked);
      this.emit('serverWorkStart', _formData);
    } else {
      _formData.splice(1, 3);
      _formData.splice(2);
      !!CONFIG.elements.recoveryPswCheckBox.checked ? this.emit('pswdRecovery', _formData[0]) : this.emit('serverWorkStart', _formData);
    }
  }

  formListener() {
    CONFIG.elements.clearBtnForm.addEventListener('click', (event) => {
      event.preventDefault();
      this.resetForm();
    });
    CONFIG.elements.authRegForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.emitEventOnForm();
    });
    CONFIG.elements.recoveryPswCheckBox.addEventListener('change', () => {
      this.changeRecoveryPswdState();
    })
  }

  changeBtnSendState(send = true) {
    const el = CONFIG.elements.submitBtnForm;
    if (send) {
      el.disabled = true;
      el.children[0].classList.remove(CONFIG.dNone)
    } else {
      el.disabled = false;
      el.children[0].classList.add(CONFIG.dNone)
    }
  }

  resetForm() {
    CONFIG.elements.authRegForm.reset();
    this.changeRecoveryPswdState();
    this.changeBtnFormState(false);
  }

  deepResetForm() {
    this.changeBtnSendState(false);
    this.resetForm();
  }

  toogleAuthRegForm(auth = true) {
    this.resetForm();
    if (auth) {
      this._model._loginUser = true;
      CONFIG.elements.authRegForm.querySelectorAll(CONFIG.forRgs).forEach(e => e.classList.add(CONFIG.dNone));
      CONFIG.elements.authRegForm.querySelector('[type="text"]').required = false;
      CONFIG.elements.authRegForm.querySelectorAll('[type="password"]')[1].required = false;
      CONFIG.elements.authBtn.classList.add(CONFIG.active);
      CONFIG.elements.regBtn.classList.remove(CONFIG.active);
      CONFIG.elements.recoveryPsw.classList.remove(CONFIG.dNone);
    } else {
      this._model._loginUser = false;
      CONFIG.elements.authRegForm.querySelectorAll(CONFIG.forRgs).forEach(e => e.classList.remove(CONFIG.dNone));
      CONFIG.elements.authRegForm.querySelector('[type="text"]').required = true;
      CONFIG.elements.authRegForm.querySelectorAll('[type="password"]')[1].required = true;
      CONFIG.elements.authBtn.classList.remove(CONFIG.active);
      CONFIG.elements.regBtn.classList.add(CONFIG.active);
      CONFIG.elements.recoveryPsw.classList.add(CONFIG.dNone);
    }
  }

  initAuthRegClick() {
    CONFIG.elements.authBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (!CONFIG.elements.authBtn.classList.contains(CONFIG.active)) {
        this.toogleAuthRegForm();
      }
    });
    CONFIG.elements.regBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (!CONFIG.elements.regBtn.classList.contains(CONFIG.active)) {
        this.toogleAuthRegForm(false);
      }
    });
  }

  isRouteOfCatalog(route) {
    return Object.keys(this._model.catalogRoutes).includes(route);
  }

  // output block
  displayCatalogPage() {
    const productToDisplay = window.location.pathname.trim();
    if (this.isRouteOfCatalog(productToDisplay)) {
      this.clearActiveCatalogNavigation();
      if (productToDisplay === '/catalog') {
        CONFIG.elements.catBtnHome.classList.add(CONFIG.active);
      } else {
        let name = '';
        for (const key in this._model.catalogNames) {
          if (this._model.catalogNames[key] === productToDisplay) name = key;
        }
        CONFIG.elements.catBtn.querySelectorAll('.list-group-item').forEach(e => {
          if (e.innerText === name) e.classList.add(CONFIG.active);
        });
      }
      // rerender Products
      this.renderProductsToDisplay(this._model.catalogRoutes[productToDisplay]);
      CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Каталог'));
      CONFIG.elements.catalogPage.classList.remove(CONFIG.dNone);
      CONFIG.elements.navBtnCatalog.classList.add(CONFIG.active);
    } else {
      this.render404()
    }
  }

  displayHomePage() {
    CONFIG.elements.homePage.classList.remove(CONFIG.dNone);
  }

  displayErrorPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Указанная страница не найдена'));
    CONFIG.elements.errorPage.classList.remove(CONFIG.dNone);
  }

  displayHowToBuyPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Как купить'));
    CONFIG.elements.howToBuyPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnHowToBuy.classList.add(CONFIG.active);
  }

  displayDeliveryPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Доставка'));
    CONFIG.elements.deliveryPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnDelivery.classList.add(CONFIG.active);
  }

  displayPaymentPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Оплата'));
    CONFIG.elements.paymentPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnPayment.classList.add(CONFIG.active);
  }

  displayContactPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Контакты'));
    CONFIG.elements.contactPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnContact.classList.add(CONFIG.active);
  }

  createHtmlForBreadcrump(description, active = true) {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    if (active) {
      li.classList.add(CONFIG.active);
      li.innerText = description;
    } else {
      li.innerHTML = `<a href="#">${description}</a>`;
    }
    return li;
  }

  hideAll() {
    CONFIG.elements.homePage.classList.add(CONFIG.dNone);
    CONFIG.elements.errorPage.classList.add(CONFIG.dNone);
    CONFIG.elements.catalogPage.classList.add(CONFIG.dNone);
    CONFIG.elements.howToBuyPage.classList.add(CONFIG.dNone);
    CONFIG.elements.deliveryPage.classList.add(CONFIG.dNone);
    CONFIG.elements.paymentPage.classList.add(CONFIG.dNone);
    CONFIG.elements.contactPage.classList.add(CONFIG.dNone);
    CONFIG.elements.navBtnCatalog.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnHowToBuy.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnDelivery.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnPayment.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnContact.classList.remove(CONFIG.active);
  }

  render404() {
    window.history.pushState(null, null, '/404');
    this.router.render(decodeURI(window.location.pathname));
  }

  // initialization block
  initCatBtn() {
    CONFIG.elements.catBtnHome.addEventListener('click', (event) => {
      this.emit('catClick', '/catalog');
    });
    CONFIG.elements.catBtn.addEventListener('click', (event) => {
      if (event.target !== CONFIG.elements.catBtn && event.target !== CONFIG.elements.catBtnHome) {
        this.emit('catClick', this._model.catalogNames[event.target.innerText]);
      }
    });
  }

  clearActiveCatalogNavigation() {
    CONFIG.elements.catBtn.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
  }

  initNavBtn() {
    CONFIG.elements.navBtnCatalog.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/catalog');
    });
    CONFIG.elements.navBtnHowToBuy.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/how-to-buy');
    });
    CONFIG.elements.navBtnDelivery.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/delivery');
    });
    CONFIG.elements.navBtnPayment.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/payment');
    });
    CONFIG.elements.navBtnContact.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/contact');
    });
    CONFIG.elements.nav2Home.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
    CONFIG.elements.errorBack.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
  }

  // rendering templates
  renderProductsToDisplay(data) {
    // compile with handlebars
    CONFIG.elements.productsPlace.innerHTML = this.templateScript(data);
  }
}

