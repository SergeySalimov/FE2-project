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
    this._loginUser = true;
    this._curUser = {};
    this.init();
    this.current = decodeURI(window.location.pathname).split('/')[1];
    this.catalogState = '/catalog';
    this.catalogRoutes = {};
    this.catalogNames = {};
    this.on('usersLoaded', (users) => {
      if (this._loginUser) {
        this.checkUserLogin(users);
      } else {

      }
    });
  }

  checkUserLogin(users) {
    console.log(this._curUser.email);
    let usersArr = users.filter(obj => obj.email == this._curUser.email);
    console.log(usersArr);
    if (usersArr.length) {
      if (this.bitToString(this._curUser.www) == this.bitToString(usersArr[0].www)) {
        this._curUser = {
          email: usersArr[0].email,
          name: usersArr[0].name,
          phone: usersArr[0].phone,
        };
        this._noAuth = false;
        this.emit('serverWorkEnd', ['success', 'login', 0]);
      } else {
        this._curUser = {};
        this.emit('serverWorkEnd', ['error', 'login', 2]);
      }

    } else {
      this._curUser = {};
      this.emit('serverWorkEnd', ['error', 'login', 1]);
    }
  }

  strToBit(str) {
    let bit = '';
    let newStr = str;
    for (let i = 0; i < newStr.length; i++) {
      bit += newStr[i].charCodeAt(0).toString(2) + ' ';
    }
    return bit.trim();
  }

  bitToString(bit) {
    let newStr = '';
    bit.split(' ').forEach(bin => {
      let binary = new Number(bin);
      newStr += String.fromCharCode(parseInt(binary, 2))
    });
    return newStr;
  }

  getUsers() {
    fetch(`${CONFIG.api}/users`, {
      headers: {
        'Content-type': 'application/json',
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.emit('usersLoaded', data)
        })
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
          this.emit('newUserSaved', data);

        })
        .catch((error) => {
          this.emit('newUserSaveError', error);
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
