import {slugify} from "transliteration";

export class Controller {
  constructor(model, ui, router) {
    this._model = model;
    this._ui = ui;
    this.router = router;
    this.initRouter();

    this._ui.on('navClick', url => this.onNavigationClick(url));
    this._ui.on('catClick', (url, product) => this.onCatalogClick(url, product));
    this._model.on('productsLoaded', () => this.initCatalogRoutes())
  }

  onCatalogClick(product) {
    const newCatalogState = this._model.catalogNames[product];

    console.log('new state: ' + newCatalogState);
    // window.history.pushState(null, null, `/catalog/`);
    // this.router.render(newCatalogState);

    // console.log(newCatalogState);
    // console.log('catClick' + product);
    // console.log(url + '  ' + product);
    // const url2 = '/catalog/plody/shishki';
    // const newState = '/' + url2.split('/').slice(2).join('/');
    // console.log(newState);
    // window.history.pushState(null, null, `/catalog/${slugify(product)}`);
    // const allProducts = this._model.allProducts;

  }

  onNavigationClick(url) {
    const newState = url.split('/')[1];
    if (newState !== this._model.current) {
      this._model.current = newState;
      if (newState === 'catalog' && this._model.catalog !== '') url += '/' + this._model.catalogState;
      window.history.pushState(null, null, url);
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
    // console.log(this._model.catalogRoutes);
    const catalogRoutes = this._model.catalogRoutes;
    console.log((typeof catalogRoutes));
    // for (const item of catalogRoutes) {
    //   console.log(item);
    // }
    this.router.addRoute('catalog/plody', () => console.log('plody'))
  }

}
