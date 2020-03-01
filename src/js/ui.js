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

    this._model.on('productsLoaded', data => this.renderProductsToDisplay(data));
    this._model.on('changeState', (cur, nw) => console.log(cur + '->' + nw));

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
  }

  renderPage(page) {
    this.hideAll();
    switch (page) {
      case '': {
        this._elements.homePage.classList.remove(CONFIG.dNone);
        break;
      }
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

  render404() {
    window.history.pushState(null, null, '/404');
    this.router.render(decodeURI(window.location.pathname));
  }

  renderErrorPage() {
    this.hideAll();
    this._elements.errorPage.classList.remove(CONFIG.dNone);
  }

  //ToDo rewrite it !!!!
  hideAll() {
    this._elements.homePage.classList.add(CONFIG.dNone);
    this._elements.catalogPage.classList.add(CONFIG.dNone);
    this._elements.howToBuyPage.classList.add(CONFIG.dNone);
    this._elements.deliveryPage.classList.add(CONFIG.dNone);
    this._elements.paymentPage.classList.add(CONFIG.dNone);
    this._elements.contactPage.classList.add(CONFIG.dNone);
  }
}
