import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";
import {slugify} from "transliteration";

const compiledTemplate = require('./template.handlebars');

export class Ui extends EventEmitter {
  constructor(model, elements, router) {
    super();
    this._model = model;
    this._elements = elements;
    this.router = router;
    this.templateScript = compiledTemplate;
    this.initNavBtn();
    this.initCatBtn();
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

    this._model.on('productsLoaded', data => this.renderProductsToDisplay(data));

    this.on('pageChange', (page) => {
      this.hideAll();
      console.log('pageChange');
      $(this._elements.nav2).children().slice(1).remove();
      this.renderPath[page]();
    });

  }

  // output block
  displayCatalogPage() {
    console.log('1');
    this._elements.nav2Home.after(this.createHtmlForBreadcrump('Каталог'));
    this._elements.catalogPage.classList.remove(CONFIG.dNone);
    this._elements.navBtnCatalog.classList.add(CONFIG.active);
  }

  displayHomePage() {
    this._elements.homePage.classList.remove(CONFIG.dNone);
  }
  displayErrorPage() {
    this._elements.nav2Home.after(this.createHtmlForBreadcrump('Указанная страница не найдена'));
    this._elements.errorPage.classList.remove(CONFIG.dNone);
  }
  displayHowToBuyPage() {
    this._elements.nav2Home.after(this.createHtmlForBreadcrump('Как купить'));
    this._elements.howToBuyPage.classList.remove(CONFIG.dNone);
    this._elements.navBtnHowToBuy.classList.add(CONFIG.active);
  }
  displayDeliveryPage() {
    this._elements.nav2Home.after(this.createHtmlForBreadcrump('Доставка'));
    this._elements.deliveryPage.classList.remove(CONFIG.dNone);
    this._elements.navBtnDelivery.classList.add(CONFIG.active);
  }
  displayPaymentPage() {
    this._elements.nav2Home.after(this.createHtmlForBreadcrump('Доставка'));
    this._elements.deliveryPage.classList.remove(CONFIG.dNone);
    this._elements.navBtnDelivery.classList.add(CONFIG.active);
  }
  displayContactPage() {
    this._elements.nav2Home.after(this.createHtmlForBreadcrump('Контакты'));
    this._elements.contactPage.classList.remove(CONFIG.dNone);
    this._elements.navBtnContact.classList.add(CONFIG.active);
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
  // initialization block
  initCatBtn() {
    this._elements.catBtnHome.addEventListener('click', (event) => {
      this.emit('catClick', '');
    });
    this._elements.catBtn.addEventListener('click', (event) => {
      if (event.target !== this._elements.catBtn && event.target !== this._elements.catBtnHome) {
        this.emit('catClick', event.target.innerText);
      }
    });
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
  // rendering templates
  renderProductsToDisplay(data) {
    // compile with handlebars
    this._elements.productsPlace.innerHTML = this.templateScript(data)
  }
}

