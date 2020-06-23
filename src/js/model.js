import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";

export class Model extends EventEmitter {
  constructor(router) {
    super();
    this.router = router;
    this.allProducts = [];
    this.productsToDisplay = [];
    this._token = '';
    this._admin = false;
    this.curUser = ['Sergey', '+375292817312','salimov_s@tut.by'];
    this.currUser = {
      'name': 'Sergey',
      'phone': '+375292817312',
      'email': 'salimov_s@tut.by',
    };

    // this.basketCount = Number(0);
    this.catalogRoutes = {};
    this.catalogNames = {};

    this.init();
    this.current = decodeURI(window.location.pathname).split('/')[1];
    this.catalogState = null;
  }

  toogleBasketInAllProducts(data, unique) {
    for (const item of data) {
      if (item.subitems) {
        this.toogleBasketInAllProducts(item.content, unique);
      } else {
        let count = this.basketCount;
        item.content.some(function(obj) {
          let isFind = obj.uniqueId === unique;
          if (isFind) {
            obj.inBasket = !obj.inBasket;
            obj.inBasket ? count++ : count--;
          }
          return isFind
        });
        this.basketCount = count;
      }
    }
  }

  clearBasketInAllProducts(data) {
    for (const item of data) {
      if (item.subitems) {
        this.clearBasketInAllProducts(item.content);
      } else {
        item.content.forEach(obj => obj.inBasket = false);
      }
    }
  }

  init() {
    console.log('init');
    fetch(`${CONFIG.api}/products.json`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then(res => res.json())
        .then(data => {
          this.allProducts = data;
          console.dir(data);
          this.productsToDisplay = this.initProducts(this.allProducts);
          this.catalogRoutes['/catalog'] = this.productsToDisplay;
          this.catalogNames[''] = '/catalog';

          console.log(this.catalogNames);

          this.addCatalogRoutes(this.allProducts);
          this.addCatalogNames(this.allProducts);

          this.firstPageRender();
        });
  }

  firstPageRender() {
    let path = localStorage.getItem('path');
    if (path) {
      localStorage.removeItem('path');
      window.history.pushState(null, null, path);
      this.router.render(decodeURI(window.location.pathname).split('/')[1]);
      this.current = path;
    } else {
      const curPage = decodeURI(window.location.pathname).split('/')[1];
      this.router.render(curPage);
      this.current = curPage;
    }
  }

  initTooltip(on = true) {
    !!on ? $(() => $('[data-toggle="tooltip"]').tooltip()) : $(() => $('[data-toggle="tooltip"]').tooltip('dispose'));
  }

  initProducts(data) {
    let productsAccumulate = [];
    for (const item of data) {
      if (item.subitems) {
        productsAccumulate = this.initProducts(item.content);
      } else {
        item.content.forEach((obj) => productsAccumulate.push(obj));
      }
    }
    return productsAccumulate;
  }

  addCatalogRoutes(data, addedRoutes = '') {
    for (const item of data) {
      let routes = addedRoutes;
      if (item.subitems) {
        routes = `${routes}/${item.transName}`;
        this.catalogRoutes[`/catalog${routes}`] = this.initProducts(item.content);

        this.addCatalogRoutes(item.content, routes)
      } else {
        this.catalogRoutes[`/catalog${routes}/${item.transName}`] = item.content;
      }
    }
  }

  addCatalogNames(data, addedRoutes = '') {
    for (const item of data) {
      let routes = addedRoutes;
      if (item.subitems) {
        routes = `${routes}/${item.transName}`;
        this.catalogNames[item.name] = `/catalog${routes}`;
        this.addCatalogNames(item.content, routes)
      } else {
        this.catalogNames[item.name] = `/catalog${routes}/${item.transName}`;
      }
    }
  }

  //
  // addCatalogBreadcrum(data) {
  //   for (const item of data) {
  //     let routes = addedRoutes;
  //     if (item.subitems) {
  //       routes = `${routes}/${slugify(item.name)}`;
  //       this.catalogNames[item.name] = `/catalog${routes}`;
  //       this.addCatalogNames(item.content, routes)
  //     } else {
  //       this.catalogNames[item.name] = `/catalog${routes}/${slugify(item.name)}`;
  //     }
  //   }
  //
  // }

}
