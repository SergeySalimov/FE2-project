import {CONFIG} from "@/js/config";

export class Buttons {
  constructor(model, ui) {
    this._model = model;
    this.ui = ui;
    this.initButtons();
  }

  initButtons(time = 3000) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 250) {
        $(CONFIG.scrollUp).addClass('show');
        if (window.scrollY > 350 && this._model.current === 'catalog') {
          $(CONFIG.scrollUpNav).addClass('show');
        }
      } else {
        $(CONFIG.scrollUp).removeClass('show');
        $(CONFIG.scrollUpNav).removeClass('show');
      }
    });
    $(CONFIG.scrollUp).on('click', () => {
      $('html, body').animate({ scrollTop: 0 }, 1500);
    });
    $(CONFIG.scrollUpNav).on('click', () => {
      const destination = $('.nav2').offset().top - 65;
      $('html, body').animate({ scrollTop: destination }, 1500);
    });
  }
}
