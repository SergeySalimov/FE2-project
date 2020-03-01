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

    this._model.on('ProductsLoaded', data => this.renderProductsToDisplay(data));

  }

  renderProductsToDisplay(data) {
    // compile with handlebars
    this._elements.productsPlace.innerHTML = this.templateScript(data)
  }

  initNavBtn() {
    this._elements.navBtnCatalog.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navCatalogClick', '/catalog');
    });
    this._elements.navBtnHowToBuy.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navCatalogClick', '/how-to-buy');
    });
    this._elements.navBtnDelivery.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navCatalogClick', '/delivery');
    });
    this._elements.navBtnPayment.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navCatalogClick', '/payment');
    });
    this._elements.navBtnContact.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navCatalogClick', '/contact');
    });
  }

  initCatalog() {

  }

  renderPage(page) {
    this.hideAll();
    switch (page) {
      case 'catalog': {
        this._elements.catalogPage.classList.remove(CONFIG.dNone);
        break;
      }
      case 'how-to-buy': {
        this._elements.howToBuyPage.classList.remove(CONFIG.dNone);
        break;
      }
      case 'delivery': {
        this._elements.deliveryPage.classList.remove(CONFIG.dNone);
        break;
      }
      case 'payment': {
        this._elements.paymentPage.classList.remove(CONFIG.dNone);
        break;
      }
      case 'contact': {
        this._elements.contactPage.classList.remove(CONFIG.dNone);
        break;
      }
      default: {
        this._elements.errorPage.classList.remove(CONFIG.dNone);
      }
    }
  }

  renderHome() {
    this.hideAll();
    this._elements.homePage.classList.remove(CONFIG.dNone);
  }

  render404() {
    window.history.pushState(null, null, '/404');
    this._router.render(decodeURI(window.location.pathname));
  }

  renderErrorPage() {
    this.hideAll();
    this._elements.errorPage.classList.remove(CONFIG.dNone);
  }

  hideAll() {
    this._elements.homePage.classList.add(CONFIG.dNone);
    this._elements.catalogPage.classList.add(CONFIG.dNone);
    this._elements.howToBuyPage.classList.add(CONFIG.dNone);
    this._elements.deliveryPage.classList.add(CONFIG.dNone);
    this._elements.paymentPage.classList.add(CONFIG.dNone);
    this._elements.contactPage.classList.add(CONFIG.dNone);
  }
}

// this.productsPlace = document.getElementById(CONFIG.productPlaceId);
// this.homePage = document.getElementById(CONFIG.homePageId);
// this.errorPage = document.getElementById(CONFIG.errorPageId);
// this.howToBuyPage = document.getElementById(CONFIG.howToBuyPageId);
// this.catalogPage = document.getElementById(CONFIG.catalogPageId);
// this.deliveryPage = document.getElementById(CONFIG.deliveryPageId);
// this.paymentPage = document.getElementById(CONFIG.paymentPageId);
// this.contactPage = document.getElementById(CONFIG.contactPageId);
// this.navBtnCatalog = document.querySelector(CONFIG.btnNavCatalog);
// this.navBtnHowToBuy = document.querySelector(CONFIG.btnNavHowToBuy);
// this.navBtnDelivery = document.querySelector(CONFIG.btnNavDelivey);
// this.navBtnPayment = document.querySelector(CONFIG.btnNavPayment);
// this.navBtnContact = document.querySelector(CONFIG.btnNavContact);
