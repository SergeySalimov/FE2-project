export class Controller {
  constructor(model, ui, router) {
    this._model = model;
    this._ui = ui;
    this.router = router;
    this.initRouter();

    this._ui.on('navClick', url => this.onNavigationClick(url));

  }

  onNavigationClick(url) {
    window.history.pushState(null, null, url);
    const newState = url.split('/')[1];
    // const currentState = this._model.current;
    // this._model.emit('changeState', newState, currentState);
    // this._model.current = newState;
    this.router.render(newState);
  }

  initRouter() {
    console.log('Router initialization');
    this.router.addRoute('', this._ui.renderHomePage.bind(this._ui, ''));
    this.router.addRoute('404', this._ui.renderErrorPage.bind(this._ui));
    this.router.addRoute('catalog', this._ui.renderPage.bind(this._ui, 'catalog'));
    this.router.addRoute('how-to-buy', this._ui.renderPage.bind(this._ui, 'how-to-buy'));
    this.router.addRoute('delivery', this._ui.renderPage.bind(this._ui, 'delivery'));
    this.router.addRoute('payment', this._ui.renderPage.bind(this._ui, 'payment'));
    this.router.addRoute('contact', this._ui.renderPage.bind(this._ui, 'contact'));
  }

}
