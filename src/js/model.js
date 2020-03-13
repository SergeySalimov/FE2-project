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
    this.basketCount = Number(0);
    // loaded from server
    // this.catalogRoutes = {};
    // this.catalogNames = {};
    // this.getDataCatalogRoutesFromServer();
    // this.getDataCatalogNamesFromServer();
    this.init();
    this.current = decodeURI(window.location.pathname).split('/')[1];

    this.catalogState = '/catalog';
    this.catalogRoutes = {};
    this.catalogNames = {};


    this.on('usersLoaded', users => this._loginUser ? this.checkUserLogin(users) : this.checkUserRegistration(users));
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
    console.log(data);
    for (const item of data) {
      if (item.subitems) {
        console.log(item.subitems);
        this.clearBasketInAllProducts(item.content);
      } else {
        item.content.forEach(obj => obj.inBasket = false);
      }
    }
  }

  checkEmail(users) {
    return users.filter(obj => obj.email === this._curUser.email);
  }

  checkUserRegistration(users) {
    let usersArr = this.checkEmail(users);
    !usersArr.length ? this.saveNewUser(this._curUser) : this.emit('serverWorkEnd', ['error', 'regist', 0]);
  }

  checkUserLogin(users) {
    let usersArr = this.checkEmail(users);
    if (usersArr.length) {
      if (this.bitToString(this._curUser.www) === this.bitToString(usersArr[0].www)) {
        // user logged
        this._curUser = {
          email: usersArr[0].email,
          name: usersArr[0].name,
          phone: usersArr[0].phone,
        };
        this.emit('serverWorkEnd', ['success', 'login', 0]);
        this._noAuth = false;
        this.emit('autorization');
      } else {
        this._curUser = {};
        this.emit('serverWorkEnd', ['error', 'login', 1]);
      }

    } else {
      this._curUser = {};
      this.emit('serverWorkEnd', ['error', 'login', 0]);
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
      let binary = Number(bin);
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

  saveNewUser(_user) {
    console.log('Save new USER.....');
    fetch(`${CONFIG.api}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_user)
    })
        .then((res) => res.json())
        .then((data) => {
          delete this._curUser.www;
          delete this._curUser.news;
          console.log(this._curUser);
          this.emit('serverWorkEnd', ['success', 'regist', 1]);
          this._noAuth = false;
          this.emit('autorization')

        })
        .catch((error) => {
          this.emit('serverWorkEnd', ['error', 'regist', 1, error]);
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
          console.dir(data);

          // this data is loaded now from server !!!!!
          // ??? unused
          this.productsToDisplay = this.initProducts(this.allProducts);
          this.catalogRoutes['/catalog'] = this.productsToDisplay;
          this.catalogNames[''] = '/catalog';
          this.addCatalogRoutes(this.allProducts);
          this.addCatalogNames(this.allProducts);

          // sending routes to DB
          // this.sendDataToServer('catalogRoutes', this.catalogRoutes);
          // this.sendDataToServer('catalogNames', this.catalogNames);

          // console.dir(this.catalogNames);
          // console.dir(this.catalogRoutes);

          this.firstPageRender();
        });
  }

  sendDataToServer(field, data) {
    fetch(`${CONFIG.api}/${field}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then((data) => {
          console.log('SEND TO SERVER > data:' + data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }

  getDataCatalogRoutesFromServer() {
    fetch(`${CONFIG.api}/catalogRoutes`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.catalogRoutes = data;
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }

  getDataCatalogNamesFromServer() {
    fetch(`${CONFIG.api}/catalogNames`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.catalogNames = data;
        })
        .catch((error) => {
          console.error('Error:', error);
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
  //
  // initTooltip(on = true) {
  //   !!on ? $(() => $('[data-toggle="tooltip"]').tooltip()) : $(() => $('[data-toggle="tooltip"]').tooltip('dispose'));
  // }

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
