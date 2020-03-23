import {CONFIG} from "@/js/config";

export class Basket {
  constructor() {

  }

  renderBasket() {
    const prdInBasket = this._model.initProducts(this._model.allProducts).filter(obj => obj.inBasket);
    CONFIG.elements.basketItemCount.innerText = this._model.basketCount;
    CONFIG.elements.basketRenderPlace.innerHTML = '';
    if (prdInBasket.length) {
      const ol = document.createElement('ol');
      prdInBasket.forEach(obj => {
        const li = document.createElement('li');
        li.innerText = obj.header;
        ol.append(li)
      });
      CONFIG.elements.basketRenderPlace.append(ol);
    } else {
      this.renderEmptyBasketDiv();
    }
  }
  // basket listener !!!! here change to fast access to basket
  basketListener() {
    CONFIG.elements.basket.addEventListener('click', (event) => {
      event.preventDefault();
      this.currentScrollY = window.scrollY;
      $(CONFIG.basketModal).modal({ show: true });
      this.renderBasket();
      // if (!this._model._noAuth) {
      // only if autorized
      // }
    });
    CONFIG.elements.basketBtnClear.addEventListener('click', (event) => {
      event.preventDefault();
      if (this._model.basketCount !== 0) {
        $(CONFIG.basketClearToast).toast('show');
        this.clearBasketUi();
        this.hideModal(CONFIG.basketModal);
      }
    });
    CONFIG.elements.basketBtnSend.addEventListener('click', (event) => {
      event.preventDefault();
      if (this._model.basketCount !== 0) {
        $(CONFIG.basketSendToast).toast('show');
        this.clearBasketUi();
        this.hideModal(CONFIG.basketModal);
      }
    });
  }
  clearBasketUi() {
    CONFIG.elements.basketRenderPlace.innerHTML = '';
    this.renderEmptyBasketDiv();
    CONFIG.elements.basketItemCount.innerText = '0';
    this._model.basketCount = 0;
    this._model.clearBasketInAllProducts(this._model.allProducts);

    this.renderBasketCount();
    if (this._model.current === 'catalog') {
      this.clearBreadCrumps();
      this.displayCatalogPage();
    }
  }
  renderEmptyBasketDiv() {
    const div = document.createElement('div');
    div.innerHTML = '<h4 class="alert text-center mt-5">Пусто</h4>';
    CONFIG.elements.basketRenderPlace.append(div);
  }
  renderBasketCount() {
    // CONFIG.elements.basketCount.innerText = this._model.basketCount;
  }
  basketChange(uniqueId) {
    this._ui.currentScrollY = window.scrollY;
    this._model.toogleBasketInAllProducts(this._model.allProducts, uniqueId);
    this._ui.renderBasketCount();
    this._ui.clearBreadCrumps();
    this._ui.displayCatalogPage();
  }

}
