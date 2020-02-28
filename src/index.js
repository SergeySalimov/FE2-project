// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@css/style.scss';
import '@assets/img/oak-sm.png';
import '@assets/img/cart2-sm.png';
import '@assets/img/sunlight-forest-nature.jpg';
import '@assets/img/opera_2019-12-04_21-59-08.png';
import '@assets/img/images.png';
import '@assets/img/products/cones-of-alder.jpg';

import {Router} from "@/js/router";
import {CONFIG} from "@/js/config";
import {Ui} from "@/js/ui";
// import jquery-ui library
// import "../node_modules/jquery-ui/themes/base/all.css";
// import "../node_modules/jquery-ui/themes/base/theme.css";
// import 'jquery-ui/ui/widgets/dialog';
// import 'jquery-ui/ui/widgets/button';
// import 'jquery-ui/ui/widgets/tabs';

class App {
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
          console.log(this.productsToDisplay);
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

const app = new App();

