export class Controller {
  constructor(model, ui, router) {
    this._model = model;
    this._ui = ui;
    this.router = router;
    this.initRouter();

    this._ui.on('navCatalogClick', url => this.onNavigationClick(url));

  }

  onNavigationClick(url) {
    window.history.pushState(null, null, url);
    this.router.render(decodeURI(window.location.pathname));
  }

  initRouter() {
    console.log('Router initialization');
    this.router.addRoute('', this._ui.renderHome.bind(this._ui));
    this.router.addRoute('404', this._ui.renderErrorPage.bind(this._ui));
    this.router.addRoute('catalog', this._ui.renderPage.bind(this._ui, 'catalog'));
    this.router.addRoute('how-to-buy', this._ui.renderPage.bind(this._ui, 'how-to-buy'));
    this.router.addRoute('delivery', this._ui.renderPage.bind(this._ui, 'delivery'));
    this.router.addRoute('payment', this._ui.renderPage.bind(this._ui, 'payment'));
    this.router.addRoute('contact', this._ui.renderPage.bind(this._ui, 'contact'));
  }


}
