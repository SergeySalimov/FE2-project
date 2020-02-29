import {Router} from "@/js/router";
import {Ui} from "@/js/ui";
import {CONFIG} from "@/js/config";

export class App {
  constructor() {
    this.allProducts = [];
    this.productsToDisplay = [];
    this.router = new Router();
    this.ui = new Ui(this.router);
    this.init();
  }

  init() {
    fetch(`${CONFIG.api}/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.allProducts = data;
          this.initProducts(data);
          this.ui.generateProductsToDisplay(this.productsToDisplay);
          this.initRouter();
          // this.ui.generateArticles(data);
          // this.ui.initNavBtn();
          // this.router.render(decodeURI(window.location.pathname));
          // this.ui.initBack();
        });
  }

  initProducts(data) {
    for (const item of data) {
      if (item.subitems) {
        this.initProducts(item.content);
      } else {
        item.content.forEach((obj) => this.productsToDisplay.push(obj));
      }
    }
  }

  initRouter() {
  }

}
