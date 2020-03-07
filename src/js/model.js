import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";
import {slugify} from "transliteration";

export class Model extends EventEmitter {
  constructor(router) {
    super();
    this.router = router;
    this.allProducts = [];
    this.productsToDisplay = [];
    this._noAuth = true;
    this.init();
    this.current = decodeURI(window.location.pathname).split('/')[1];
    this.catalogState = '/catalog';
    this.catalogRoutes = {};
    this.catalogNames = {};
  }

  checkUserLogin(arr) {
    console.log(arr);
  }

  saveNewUser(_arr) {
    console.log(_arr);
    console.log('Save new USER.....');
    fetch(`${CONFIG.api}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_arr)
    })
        .then((res) => res.json())
        .then((data) => {
          console.log('Success:', data);

        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }

  init() {
    console.log('init');
    fetch(`${CONFIG.api}/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.allProducts = data;
          this.productsToDisplay = this.initProducts(this.allProducts);
          this.catalogRoutes['/catalog'] = this.productsToDisplay;
          this.catalogNames[''] = '/catalog';
          this.addCatalogRoutes(this.allProducts);
          this.addCatalogNames(this.allProducts);
          this.emit('productsLoaded', this.productsToDisplay);
          // console.log(this.catalogRoutes);
          // console.log(this.catalogNames);
          const curPage = decodeURI(window.location.pathname).split('/')[1];
          this.router.render(curPage);
          // popup for basket
          this.initTooltip(this._noAuth);
          this.current = curPage;

          // $('#exampleModal').modal();
        });
  }

  initTooltip(on = true) {
    if (on) {
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    } else {
      $(function () {
        $('[data-toggle="tooltip"]').tooltip('disable')
      })
    }
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
        routes = `${routes}/${slugify(item.name)}`;
        this.catalogRoutes[`/catalog${routes}`] = this.initProducts(item.content);

        this.addCatalogRoutes(item.content, routes)
      } else {

        this.catalogRoutes[`/catalog${routes}/${slugify(item.name)}`] = item.content;
      }
    }
  }

  addCatalogNames(data, addedRoutes = '') {
    for (const item of data) {
      let routes = addedRoutes;
      if (item.subitems) {
        routes = `${routes}/${slugify(item.name)}`;
        this.catalogNames[item.name] = `/catalog${routes}`;
        this.addCatalogNames(item.content, routes)
      } else {
        this.catalogNames[item.name] = `/catalog${routes}/${slugify(item.name)}`;
      }
    }
  }

  addCatalogBreadcrum(data) {
    for (const item of data) {
      let routes = addedRoutes;
      if (item.subitems) {
        routes = `${routes}/${slugify(item.name)}`;
        this.catalogNames[item.name] = `/catalog${routes}`;
        this.addCatalogNames(item.content, routes)
      } else {
        this.catalogNames[item.name] = `/catalog${routes}/${slugify(item.name)}`;
      }
    }

  }

}
