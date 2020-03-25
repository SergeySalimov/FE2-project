export const CONFIG = {
  // api: 'https://my-json-server.typicode.com/SergeySalimov/FE2-project',
  // api: 'http://localhost:3007',
  api: 'https://forestdecor-base.firebaseio.com',
  apiKey: 'AIzaSyDGOUqNfJvgfjSnC4Ltil6yZofKlqvyI88',
  authUrl: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
  defaultCatalogState: '/catalog/plody',
  localStorageMessageID: 'userMessagesId',
  dNone: 'd-none',
  active: 'active',
  navBar: '#navbar9',
  productClck: 'entire-product',
  // bskClck: 'basket-click',
  // bskClck2: 'basket-click2',
  // basketModal: '#basket-modal',
  // noAutoriz: 'no-autoriz',
  // forRgs: '.for-registration',
  // toast: '.toast',
  scrollUp: '.scroll-up-top',
  scrollUpNav: '.scroll-up-nav',
  scrollContactUs: '.scroll-down-contact-us',
  phoneCall: '.phone-number',
  phoneNumber: '+375 29 123-45-67',
  // modalAuthRegID: '#registration',
  // recoveryToast: '.toast.recovery-send',
  // basketSendToast: '.toast.send-basket',
  // basketClearToast: '.toast.clear-basket',
  // loginError1Toast: '.toast.autorization-error',
  // loginError2Toast: '.toast.autorization2-error',
  // loginSuccesToast: '.toast.autorization-succes',
  // registrSuccesToast: '.toast.registration-succes',
  // registrErrorToast: '.toast.registration-error',
  // registr2ErrorToast: '.toast.registration2-error',
  contactUsSendedClass: '.send-contact-us-success',
  contactUsNoAuthClass: '.send-contact-us-no-auth',
  formContactUsBtnOptions: {
    'classForValid': 'btn btn-dark w-50',
    'classForNoValid': 'btn btn-danger w-50',
  },
  formAuthBtnOptions: {
    'classForValid': 'btn btn-success mt-3',
    'classForNoValid': 'btn btn-danger mt-3',
  },

  elements: {
    productsPlace: document.getElementById('product-place'),
    homePage: document.getElementById('home'),
    errorPage: document.getElementById('error-page'),
    howToBuyPage: document.getElementById('how-to-buy'),
    registrationPage: document.getElementById('registration-page'),
    catalogPage: document.getElementById('catalog'),
    deliveryPage: document.getElementById('delivery'),
    paymentPage: document.getElementById('payment'),
    contactPage: document.getElementById('contact'),
    contactUsAll: document.getElementById('contact-us-all'),
    navBtnCatalog: document.querySelector('.btn-nav-catalog'),
    navBtnRegistration: document.querySelector('.btn-nav-registration'),
    navBtnHowToBuy: document.querySelector('.btn-nav-how-to-buy'),
    navBtnMessages: document.querySelector('.btn-nav-messages'),
    navBtnDelivery: document.querySelector('.btn-nav-delivery'),
    navBtnPayment: document.querySelector('.btn-nav-payment'),
    navBtnContact: document.querySelector('.btn-nav-contact'),
    nav2: document.getElementById('nav2'),
    nav2Home: document.getElementById('nav2-home'),
    errorBack: document.getElementById('error-to-home'),
    catBtn: document.getElementById('catalog-navigation'),
    catBtnHome: document.getElementById('btn-catalog'),
    // authRegForm: document.getElementById('auth-reg-form'),
    // clearBtnForm: document.getElementById('clear-btn'),
    // submitBtnForm: document.getElementById('submit-btn'),
    // authBtn: document.getElementById('auth-btn'),
    // regBtn: document.getElementById('reg-btn'),
    // subscribeCheckBox: document.getElementById('subscribe'),
    // recoveryPswCheckBox: document.getElementById('recovery-pswd'),
    // recoveryPsw: document.querySelector('.recovery-pswd'),
    // cabinetLink: document.querySelector('.cabinet'),
    // basket: document.querySelector('.basket'),
    // basketCount: document.querySelector('.basket-count'),
    // basketRenderPlace: document.querySelector('#basket-render-place'),
    // basketItemCount: document.querySelector('#basket-item-number'),
    // basketBtnClear: document.querySelector('#clear-basket'),
    // basketBtnSend: document.querySelector('#send-basket'),
    scrollUp: document.querySelector('.scroll-up'),
    formContactUs: document.querySelector('#contact-us'),
    clearContactUsBtn: document.querySelector('#clear-contact-us'),
    contactUsAlertPlace: document.querySelector('.place-for-alert'),
    registrAlertPlace: document.querySelector('.place-for-alert-registr'),
    authAlertPlace: document.querySelector('.place-for-alert-auth'),
    autorizForm: document.querySelector('.autorization-form'),
  },
  alerts: {
    contactUsSended: `
    <div class="alert alert-success alert-dismissible send-contact-us-success show fade" role="alert">
      Ваши сообщение было отправлено. Мы свяжемся с вами в ближайшее время.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
     </div>`,
    contactUsNoAuth: `
    <div class="alert alert-info alert-dismissible send-contact-us-no-auth show fade" role="alert">
      Если вы хотите видеть свои сообщения и наши ответы здесь, авторизируйтесь пожалуйста.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
     </div>`,
    authError: `
    <div class="alert alert-danger alert-dismissible show fade" role="alert">      
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
     </div>`,
    authSuccess: `
    <div class="alert alert-success alert-dismissible show fade" role="alert">
       Вы успешно авторизировались.      
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
     </div>`,
  },

};
