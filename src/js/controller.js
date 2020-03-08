import {CONFIG} from "@/js/config";

export class Controller {
  constructor(model, ui, router) {
    this._model = model;
    this._ui = ui;
    this.router = router;
    this.initRouter();

    this._ui.on('navClick', url => this.onNavigationClick(url));
    this._ui.on('catClick', url => this.onCatalogClick(url));
    // this._model.on('productsLoaded', () => this.initCatalogRoutes())
    this._ui.on('serverWorkStart', (arr) => {
      if (this._model._loginUser) {
        this.onUserLogin(arr);
      } else {
        this.onUserRegistration(arr)
      }
    });
    this._ui.on('pswdRecovery', email => this.onPswRecovery(email));
  }

  onPswRecovery(email) {
    this._ui.showRecoveryToast();
    this._ui.deepResetForm();
  }

  onUserLogin(arrData) {
    const email = arrData[0];
    const www = this._model.strToBit(arrData[1]);
    this._model._curUser = { email, www, };
    this._model.getUsers();
  }

  onlyNumbers(str) {
    return parseInt(str.replace(/\D+/g, ''), 10);
  }

  onUserRegistration(arrData) {
    const email = arrData[0];
    const name = arrData[1];
    const phone = `+${this.onlyNumbers(arrData[2])} ${this.onlyNumbers(arrData[3])}`;
    const www = this._model.strToBit(arrData[4]);
    const news = arrData[5];

    console.log(phone);
    const _user = { email, name, phone, www, news, };

    this._model.saveNewUser(_user);
  }

  onCatalogClick(url) {
    const newCatalogState = url;
    if (newCatalogState !== this._model.catalogState) {
      this._model.catalogState = newCatalogState;
      window.history.pushState(null, null, newCatalogState);
      this.router.render('catalog');
    }
  }

  onNavigationClick(url) {
    // console.log(url);
    const newState = url.split('/')[1];
    if (newState !== this._model.current) {
      this._model.current = newState;
      if (newState === 'catalog') {
        window.history.pushState(null, null, this._model.catalogState);
      } else {
        window.history.pushState(null, null, url);
      }
      this.router.render(newState);
    }
  }

  initRouter() {
    console.log('Router initialization');
    this.router.addRoute('', this._ui.emit.bind(this._ui, 'pageChange', ''));
    this.router.addRoute('404', this._ui.emit.bind(this._ui, 'pageChange', '404'));
    this.router.addRoute('catalog', this._ui.emit.bind(this._ui, 'pageChange', 'catalog'));
    this.router.addRoute('how-to-buy', this._ui.emit.bind(this._ui, 'pageChange', 'how-to-buy'));
    this.router.addRoute('delivery', this._ui.emit.bind(this._ui, 'pageChange', 'delivery'));
    this.router.addRoute('payment', this._ui.emit.bind(this._ui, 'pageChange', 'payment'));
    this.router.addRoute('contact', this._ui.emit.bind(this._ui, 'pageChange', 'contact'));
  }

  initCatalogRoutes() {
    console.log('Catalog router initialization');
    const catalogRoutes = this._model.catalogRoutes;
    for (const catPrd in catalogRoutes) {
      if (catPrd !== '') {
        this.router.addRoute(catPrd, this._ui.emit.bind(this._ui, 'catalogChange', catalogRoutes[catPrd]))
      }
    }
  }

}
