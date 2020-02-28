const compiledTemplate = require('./template.handlebars');

export class Ui {
  constructor(router) {
    this.router = router;
    this.productsPlace = document.getElementById('product-place');
    this.templateScript = compiledTemplate;
  }

  generateProductsToDisplay(data) {
    // compile with handlebars
    this.productsPlace.innerHTML = this.templateScript(data)
  }
}
