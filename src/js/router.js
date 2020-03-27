export class Router {
  constructor() {
    this.routes = {
      '404': () => console.log('Nothing found'),
    };

    window.addEventListener('popstate', () => {
      const temp = decodeURI(window.location.pathname).split('/')[1];
      this.render(temp);
    });
  }

  addRoute(route, action) {
    this.routes[route] = action;
  }

  delRoute(route) {
    delete this.routes[route];
  }

  render(temp) {
    // const temp = url.split('/')[1];
    this.routes[temp] ? this.routes[temp]() : this.routes['404']();
  }
}
