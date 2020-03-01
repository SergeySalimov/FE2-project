import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";

export class Model extends EventEmitter {
  constructor(router) {
    super();
    this.router = router;
    this.allProducts = [];
    this.productsToDisplay = [];
    this.init();
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
          this.initProducts(this.allProducts);
          this.emit('ProductsLoaded', this.productsToDisplay);
          this.router.render(decodeURI(window.location.pathname));
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
}
