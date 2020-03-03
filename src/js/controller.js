import {slugify} from "transliteration";

export class Controller {
  constructor(model, ui, router) {
    this._model = model;
    this._ui = ui;
    this.router = router;
    this.initRouter();

    this._ui.on('navClick', url => this.onNavigationClick(url));
    this._ui.on('catClick', product => this.onCatalogClick(product));
  }

  onCatalogClick(product) {
    console.log(product);
    console.log(slugify(product));
    window.history.pushState(null, null, `/catalog/${slugify(product)}`);
    const allProducts = this._model.allProducts;

  }

  onNavigationClick(url) {
    const newState = url.split('/')[1];
    if (newState !== this._model.current) {
      this._model.current = newState;
      window.history.pushState(null, null, url);
      this.router.render(newState);
    }
  }

  initRouter() {
    console.log('Router initialization');
    this.router.addRoute('', this._ui.emit.bind(this._ui, 'pageChange', ''));
    this.router.addRoute('404', this._ui.emit.bind(this._ui, 'pageChange', '404'));
    // this.router.addRoute('catalog', this._ui.renderPage.bind(this._ui, 'catalog'));
    this.router.addRoute('catalog', this._ui.emit.bind(this._ui, 'pageChange', 'catalog'));
    this.router.addRoute('how-to-buy', this._ui.emit.bind(this._ui, 'pageChange', 'how-to-buy'));
    this.router.addRoute('delivery', this._ui.emit.bind(this._ui, 'pageChange', 'delivery'));
    this.router.addRoute('payment', this._ui.emit.bind(this._ui, 'pageChange', 'payment'));
    this.router.addRoute('contact', this._ui.emit.bind(this._ui, 'pageChange', 'contact'));
  }

}
