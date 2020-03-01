import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";

const compiledTemplate = require('./template.handlebars');

export class Ui extends EventEmitter {
  constructor(model, elements, router) {
    super();
    this._model = model;
    this._elements = elements;
    this.router = router;
    this.templateScript = compiledTemplate;
    this.initNavBtn();
    this.hideAll();

    this._model.on('productsLoaded', data => this.renderProductsToDisplay(data));

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

  renderPage(page) {
    const currentPage = this._model.current;
    const newPage = page;
    if (currentPage !== newPage) {
      if (currentPage !== '') {
        this.switchOnOff(currentPage, false);
        $(this._elements.nav2).children().slice(1).remove();
      } else {
        this._elements.homePage.classList.add(CONFIG.dNone);
      }
      this.switchOnOff(page, true);
      this._model.current = newPage;
    }
  }

  switchOnOff(page, on = true) {
    switch (page) {
      case 'catalog': {
        if (on) {
          this._elements.nav2Home.after(this.createHtmlForBreadcrump('Каталог'));
          this._elements.catalogPage.classList.remove(CONFIG.dNone);
          this._elements.navBtnCatalog.classList.add(CONFIG.active);
        } else {
          this._elements.catalogPage.classList.add(CONFIG.dNone);
          this._elements.navBtnCatalog.classList.remove(CONFIG.active);
        }
        break;
      }
      case 'how-to-buy': {
        if (on) {
          this._elements.nav2Home.after(this.createHtmlForBreadcrump('Как купить'));
          this._elements.howToBuyPage.classList.remove(CONFIG.dNone);
          this._elements.navBtnHowToBuy.classList.add(CONFIG.active);
        } else {
          this._elements.howToBuyPage.classList.add(CONFIG.dNone);
          this._elements.navBtnHowToBuy.classList.remove(CONFIG.active);
        }
        break;
      }
      case 'delivery': {
        if (on) {
          this._elements.nav2Home.after(this.createHtmlForBreadcrump('Доставка'));
          this._elements.deliveryPage.classList.remove(CONFIG.dNone);
          this._elements.navBtnDelivery.classList.add(CONFIG.active);
        } else {
          this._elements.deliveryPage.classList.add(CONFIG.dNone);
          this._elements.navBtnDelivery.classList.remove(CONFIG.active);
        }
        break;
      }
      case 'payment': {
        if (on) {
          this._elements.nav2Home.after(this.createHtmlForBreadcrump('Оплата'));
          this._elements.paymentPage.classList.remove(CONFIG.dNone);
          this._elements.navBtnPayment.classList.add(CONFIG.active);
        } else {
          this._elements.paymentPage.classList.add(CONFIG.dNone);
          this._elements.navBtnPayment.classList.remove(CONFIG.active);
        }
        break;
      }
      case 'contact': {
        if (on) {
          this._elements.nav2Home.after(this.createHtmlForBreadcrump('Контакты'));
          this._elements.contactPage.classList.remove(CONFIG.dNone);
          this._elements.navBtnContact.classList.add(CONFIG.active);
        } else {
          this._elements.contactPage.classList.add(CONFIG.dNone);
          this._elements.navBtnContact.classList.remove(CONFIG.active);
        }
        break;
      }
      default: {
        this.hideAll();
        this._elements.errorPage.classList.remove(CONFIG.dNone);
      }
    }
  }

  renderProductsToDisplay(data) {
    // compile with handlebars
    this._elements.productsPlace.innerHTML = this.templateScript(data)
  }

  initNavBtn() {
    this._elements.navBtnCatalog.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/catalog');
    });
    this._elements.navBtnHowToBuy.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/how-to-buy');
    });
    this._elements.navBtnDelivery.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/delivery');
    });
    this._elements.navBtnPayment.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/payment');
    });
    this._elements.navBtnContact.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/contact');
    });
    this._elements.nav2Home.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
    this._elements.errorBack.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
  }

  render404() {
    window.history.pushState(null, null, '/404');
    this.router.render(decodeURI(window.location.pathname));
  }

  renderErrorPage() {
    const currentPage = this._model.current;
    if (currentPage !== '404') {
      this._elements.nav2Home.after(this.createHtmlForBreadcrump('Указанная страница не найдена'));
      this.hideAll();
      this._elements.errorPage.classList.remove(CONFIG.dNone);
      this._model.current = '404';
    }
  }

  renderHomePage() {
    const currentPage = this._model.current;
    if (currentPage !== '') {
      this.hideAll();
      $(this._elements.nav2).children().slice(1).remove();
      this._elements.homePage.classList.remove(CONFIG.dNone);
      this._model.current = '';
    }
  }

  hideAll() {
    this._elements.homePage.classList.add(CONFIG.dNone);
    this._elements.errorPage.classList.add(CONFIG.dNone);
    this._elements.catalogPage.classList.add(CONFIG.dNone);
    this._elements.howToBuyPage.classList.add(CONFIG.dNone);
    this._elements.deliveryPage.classList.add(CONFIG.dNone);
    this._elements.paymentPage.classList.add(CONFIG.dNone);
    this._elements.contactPage.classList.add(CONFIG.dNone);
    this._elements.navBtnCatalog.classList.remove(CONFIG.active);
    this._elements.navBtnHowToBuy.classList.remove(CONFIG.active);
    this._elements.navBtnDelivery.classList.remove(CONFIG.active);
    this._elements.navBtnPayment.classList.remove(CONFIG.active);
    this._elements.navBtnContact.classList.remove(CONFIG.active);
  }
}
