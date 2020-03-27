import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";
import {Buttons} from "@/js/buttons";
import {ContactUs} from "@/js/contactUs";
import {Auth} from "@/js/auth";
import {Messages} from "@/js/messages";

const compiledTemplate = require('./templates/template.handlebars');

export class Ui extends EventEmitter {
  constructor(model, router) {
    super();
    this._model = model;
    this.router = router;
    this.templateScript = compiledTemplate;
    // initialization block
    new Buttons(this._model, this);
    this.contactUs = new ContactUs(this._model, this);
    console.dir(this.contactUs);
    new Auth(this);
    // const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);
    // this.initPhoneNumber(CONFIG.phoneNumber);

    this.initNavBtn();
    this.initCatBtn();
    // this.initModalRegistration();
    this.initCatalog();
    this.currentScrollY = null;
    // display routes functions
    this.renderPath = {
      '': this.displayHomePage.bind(this),
      '404': this.displayErrorPage.bind(this),
      'catalog': this.displayCatalogPage.bind(this),
      'registration-or-autorization': this.displayRegistration.bind(this),
      'how-to-buy': this.displayHowToBuyPage.bind(this),
      'messages': this.displayMessagesPage.bind(this),
      'delivery': this.displayDeliveryPage.bind(this),
      'payment': this.displayPaymentPage.bind(this),
      'contact': this.displayContactPage.bind(this),
    };
    // broadcast block
    this._model.on('productsLoaded', data => this.renderProductsToDisplay(data));
    this.on('pageChange', page => this.onPageChange(page));
  }

  onPageChange(page) {
    this.hideAll();
    this.clearBreadCrumps();
    this.renderPath[page]();
    this._model.initTooltip();
  }

  clearBreadCrumps() {
    $(CONFIG.elements.nav2).children().slice(1).remove();
  }

  // ToDO move
  autorizedState() {
    // perehod v avtorizovanoe sostoyanie
    console.log('AUTORIZATE......');
    this.hideModal(CONFIG.modalAuthRegID);
    // this._model.initTooltip(false);
    this.changeUiOnAutState();
  }
  // ToDO move


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

  // ToDO move
  initModalRegistration() {
    $(CONFIG.toast).toast();
    this.basketListener();
  }

  hideModal(el, time = 2000) {
    window.setTimeout(() => {
      $(el).modal('hide');
    }, time);
  }

  // Form Auth work!!
  // ToDO move all
  showRecoveryToast() {
    $(CONFIG.recoveryToast).toast('show');
  }

  // working method!!
  changeBtnSendState(send = true, el = CONFIG.elements.submitBtnForm) {
    if (send) {
      el.disabled = true;
      el.children[0].classList.remove(CONFIG.dNone)
    } else {
      el.disabled = false;
      el.children[0].classList.add(CONFIG.dNone)
    }
  }
  validatePswd(form = CONFIG.elements.registrForm) {
    const _pswd = [];
    const pswdInput = form.querySelectorAll('[type="password"]');
    pswdInput.forEach(e => _pswd.push(e.value));
    if (_pswd[0] !== _pswd[1] && _pswd[0] !== '') {
      pswdInput[1].setCustomValidity('Пароли должны совпадать!');
    } else {
      pswdInput[1].setCustomValidity('');
    }
  }
  formValidate(form = CONFIG.elements.formContactUs) {
    const button = form.querySelector('[type="submit"]');
    button.addEventListener('mouseenter', () => form.classList.add('was-validated'));
    button.addEventListener('mouseleave', () => form.classList.remove('was-validated'));
    button.addEventListener('pointerenter', () => form.classList.add('was-validated'));
    button.addEventListener('pointerleave', () => form.classList.remove('was-validated'));
  }
  getPhoneFromForm(form) {
    let phone = '';
    form.querySelectorAll('[type="tel"]').forEach(e => phone += e.value);
    phone = '+' + phone.replace(/\D/g, '');
    return phone;
  }

  changeBtnSubmitState(form, isValid, btnOpt) {
    const button = form.querySelector('[type="submit"]');
    if (isValid) {
      button.className = btnOpt.classForValid;
    } else {
      button.className = btnOpt.classForNoValid;
    }
  }

  formChanging(form, btnOpt, registr = false) {
    form.addEventListener('keyup', (event) => {
      if (registr) this.validatePswd();
      this.changeBtnSubmitState(form, form.checkValidity(), btnOpt);
    });
    // for touchscreen
    form.addEventListener('touchend', (event) => {
      if (registr) this.validatePswd();
      this.changeBtnSubmitState(form, form.checkValidity(), btnOpt);
    });
  }

  isRouteOfCatalog(route) {
    return Object.keys(this._model.catalogRoutes).includes(route);
  }

  // output block
  //ToDO Разбить на функции, слишком сложно
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
      window.scrollTo(0, this.currentScrollY);
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
  displayMessagesPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Сообщения'));
    CONFIG.elements.contactUsAll.classList.add(CONFIG.dNone);
    CONFIG.elements.messagesPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnMessages.classList.add(CONFIG.active);
  }
  displayRegistration() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Регистрация или авторизация'));
    CONFIG.elements.contactUsAll.classList.add(CONFIG.dNone);
    CONFIG.elements.registrationPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnRegistration.classList.add(CONFIG.active);
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
    CONFIG.elements.messagesPage.classList.add(CONFIG.dNone);
    CONFIG.elements.deliveryPage.classList.add(CONFIG.dNone);
    CONFIG.elements.paymentPage.classList.add(CONFIG.dNone);
    CONFIG.elements.contactPage.classList.add(CONFIG.dNone);
    CONFIG.elements.registrationPage.classList.add(CONFIG.dNone);
    CONFIG.elements.navBtnCatalog.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnMessages.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnDelivery.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnPayment.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnContact.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnRegistration.classList.remove(CONFIG.active);
    // show contact us
    CONFIG.elements.contactUsAll.classList.remove(CONFIG.dNone);
  }

  render404() {
    window.history.pushState(null, null, '/404');
    this.router.render(decodeURI(window.location.pathname));
  }

  // initialization block
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
    CONFIG.elements.navBtnMessages.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/messages');
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
    CONFIG.elements.nav2HomeOak.addEventListener('click', (event) => {
      event.preventDefault();
      // this.emit('navClick', '/');
      this.underConstruction();
    });
    CONFIG.elements.nav2Home.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
    CONFIG.elements.errorBack.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
    CONFIG.elements.navBtnRegistration.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/registration-or-autorization');
    });
  }

  closeAlert(time, alertClass = '') {
    const alert = !!alertClass ? `.alert.${alertClass}` : '.alert';
    console.log(alert);
    window.setTimeout(() => {
      $(alert).alert('close');
    }, time);
  }

  // rendering templates
  renderProductsToDisplay(data) {
    // compile with handlebars
    CONFIG.elements.productsPlace.innerHTML = this.templateScript(data);
  }

  // change state login logout
  underConstruction(login = true) {
    $(CONFIG.globalModal).modal({ backdrop: 'static' });
    this.putUserDataOnPage(login);
    this.changeLogIcon(login);
    this.messagesShowHideinNavBar(login);
    this.messages = new Messages(this, this.contactUs);


    this.emit('navClick', '/contact');

    this.hideModal(CONFIG.globalModal, 1000);
  }

  messagesShowHideinNavBar(login) {
    if (login) {
      CONFIG.elements.navBtnMessages.classList.remove(CONFIG.dNone);
    } else {
      CONFIG.elements.navBtnMessages.classList.add(CONFIG.dNone);
    }
  }

  changeLogIcon(login) {
    if (login) {
      CONFIG.elements.navBtnRegistration.classList.add(CONFIG.dNone);
      CONFIG.elements.navBtnLogOut.classList.remove(CONFIG.dNone);
    } else {
      CONFIG.elements.navBtnRegistration.classList.remove(CONFIG.dNone);
      CONFIG.elements.navBtnLogOut.classList.add(CONFIG.dNone);
    }
  }

  putUserDataOnPage(login = true) {
    // header
    const nameInHeader = CONFIG.elements.nameInHeader;
    const formContactUs = CONFIG.elements.formContactUs.querySelectorAll('input');
    if (login) {
      nameInHeader.classList.remove(CONFIG.dNone);
      nameInHeader.children[0].children[0].innerText = this._model.curUser[0];
      formContactUs[0].value = this._model.curUser[0];
      formContactUs[1].value = this._model.curUser[2];
      formContactUs[2].value = this._model.curUser[1].slice(0,4);
      formContactUs[3].value = this.prettyPhone(this._model.curUser[1].slice(4));
    } else {
      nameInHeader.classList.add(CONFIG.dNone);
      nameInHeader.children[0].children[0].innerText = '';
      formContactUs.reset();
    }
  }

  prettyPhone(phone) {
    return phone.replace(/(\d{2})(\d{3})(\d{2})(\d{2,})/, '($1) $2-$3-$4')
  }

}

