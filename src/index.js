// bootstrap & css
import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '@css/style.scss';
// import images
import '@assets/img/oak-sm.png';
import '@assets/img/cart2-sm.png';
import '@assets/img/sunlight-forest-nature.jpg';
import '@assets/img/wall.jpg';
// import '@assets/img/footer.jpg';
import '@assets/img/products/cones-of-alder.jpg';
import '@assets/img/products/fir-cones.jpg';
import '@assets/img/products/pine-cones.jpg';
import '@assets/img/products/hop-cones.jpg';
import '@assets/img/products/zhyoludi.jpg';
import '@assets/img/products/cashtany.jpg';
import '@assets/img/products/cherjomuha.jpg';
import '@assets/img/products/buzina.jpg';
import '@assets/img/products/mozhzhevel.jpg';
import '@assets/img/products/shalfej.jpg';
import '@assets/img/products/mint.jpg';
import '@assets/img/products/dushitsa.jpg';
import '@assets/img/products/melissa.jpg';
import '@assets/img/products/chistotel.jpg';
import '@assets/img/products/lavanda.jpg';
import '@assets/img/products/zveroboj.jpg';
import '@assets/img/products/polyn.jpg';
import '@assets/img/products/tysiachelistnik.jpg';
import '@assets/img/products/pizhma.jpg';
import '@assets/img/products/ivan.jpg';
import '@assets/img/products/strugka-lipa.jpg';
import '@assets/img/products/strugka-osina.jpg';
import '@assets/img/products/strugka-elka.jpg';
import '@assets/img/products/strugka-olha.jpg';
import '@assets/img/products/strugka-sosna.jpg';
import '@assets/img/products/torc-dub.jpg';
import '@assets/img/products/torc-yasen.jpg';
import '@assets/img/products/torc-bereza.jpg';
import '@assets/img/products/torc-akacia.jpg';
import '@assets/img/products/torc-viaz.jpg';
import '@assets/img/products/sfagnum.jpg';
import '@assets/img/products/yagel.jpg';
import '@assets/img/products/chaga.jpg';
import '@assets/img/products/kapa.jpg';
import '@assets/img/products/suvel.jpg';
// import JS
import {Model} from "@/js/model";
import {Ui} from "@/js/ui";
import {CONFIG} from "@/js/config";
import {Router} from "@/js/router";
import {Controller} from "@/js/controller";
//
// import '@popperjs/core';
// import { transliterate as tr, slugify } from 'transliteration';
import 'transliteration';
// MVC model
document.addEventListener('DOMContentLoaded', () => {
  const router = new Router();
  const model = new Model(router);
  const ui = new Ui(model, router);
  const controller = new Controller(model, ui, router);
});
