"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.OrderPlacedPage = void 0;
var core_1 = require("@angular/core");
var interfaces = require("@spundan-clients/bookz-interfaces");
var environment_1 = require("src/environments/environment");
var OrderPlacedPage = /** @class */ (function () {
    function OrderPlacedPage(router, cartService, cartState, navCtrl, loadingService, toast, alertController, payService, platform, sharedService, ngZone, routeService) {
        this.router = router;
        this.cartService = cartService;
        this.cartState = cartState;
        this.navCtrl = navCtrl;
        this.loadingService = loadingService;
        this.toast = toast;
        this.alertController = alertController;
        this.payService = payService;
        this.platform = platform;
        this.sharedService = sharedService;
        this.ngZone = ngZone;
        this.routeService = routeService;
        this.isLoading = false;
        this.isPayment = false;
        // let url1: string[] = this.router.url.split('/');
        // this.platform.backButton.subscribeWithPriority(99999, () => {
        //     if (this.router.url === '/tab/order-placed/'+ url1[3]) {
        //     }
        // });
    }
    OrderPlacedPage.prototype.ngOnInit = function () {
        this.getUserInfo();
        this.imageApi = environment_1.environment.thumbApi;
        if (history.state.order) {
            this.orderData = history.state.order;
        }
    };
    OrderPlacedPage.prototype.ionViewWillEnter = function () {
        this.loadingService.display(false);
    };
    OrderPlacedPage.prototype.getUserInfo = function () {
        var _this = this;
        this.sharedService.getUserInfo().subscribe(function (res) {
            _this.userData = res.DATA;
            if (history.state.isRetry) {
                _this.retry();
            }
        });
    };
    OrderPlacedPage.prototype.ionViewDidEnter = function () { };
    OrderPlacedPage.prototype.back = function () {
        // this.navCtrl
        //     .navigateRoot('/tab/dashboard', {
        //         animationDirection: 'forward',
        //     })
        //     .catch();
        // localStorage.removeItem('orderData');
        this.routeService.navigateToBack('ionic');
    };
    OrderPlacedPage.prototype.retry = function () {
        this.razorpayId = this.orderData.retryId;
        this.razorPayStatus = this.orderData.status;
        this.payment();
    };
    OrderPlacedPage.prototype.payNow = function () {
        var _this = this;
        this.loadingService.display(true);
        var params = {
            orderId: this.orderData.orderId,
            totalAmount: this.orderData.totalAmount
        };
        this.payService.createOrder(params).subscribe(function (res) {
            if (res) {
                _this.cartState.setCartState(0);
                _this.razorPayData = res.DATA;
                _this.razorpayId = res.DATA.razorpayId;
                _this.razorPayStatus = res.DATA.razorpayStatus;
                if (_this.razorPayStatus === 'created') {
                    _this.payment();
                }
            }
        }, function (error) {
            _this.loadingService.display(false);
            _this.presentAlert('Something went wrong!')["catch"]();
        });
    };
    OrderPlacedPage.prototype.payment = function () {
        var _this = this;
        this.loadingService.display(false);
        var options = {
            description: 'Payment for Bookzey',
            image: 'https://s3.ap-south-1.amazonaws.com/images.bookz.in/logo/bookzey.png',
            currency: 'INR',
            key: environment_1.environment.razorPayKey,
            order_id: this.razorpayId,
            name: this.userData.firstName + ' ' + this.userData.lastName ||
                'Guest',
            prefill: {
                name: this.userData.firstName + ' ' + this.userData.lastName ||
                    // tslint:disable-next-line: strict-boolean-expressions
                    'Guest',
                // tslint:disable-next-line: strict-boolean-expressions
                email: this.userData.email || '',
                // tslint:disable-next-line: strict-boolean-expressions
                contact: this.userData.phoneNo || ''
            },
            theme: {
                color: '#E03F45'
            }
        };
        var successCallback = function (success) {
            _this.paymentVerify(success);
        };
        var cancelCallback = function (error) {
            // alert(error.description + ' (Error ' + error.code + ')');
            _this.presentAlert('Payment Cancel')["catch"]();
        };
        var failedCallback = function (failed) {
            _this.presentAlert('Something went wrong!')["catch"]();
        };
        RazorpayCheckout.on('payment.success', successCallback);
        RazorpayCheckout.on('payment.cancel', cancelCallback);
        RazorpayCheckout.on('payment.failed', failedCallback);
        RazorpayCheckout.open(options);
    };
    OrderPlacedPage.prototype.presentAlert = function (msg) {
        return __awaiter(this, void 0, Promise, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            message: msg,
                            buttons: ['Ok']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderPlacedPage.prototype.paymentVerify = function (success) {
        var _this = this;
        this.loadingService.display(true);
        var orderId = success.razorpay_order_id;
        var signature = success.razorpay_signature;
        var razorpay_payment_id = success.razorpay_payment_id;
        var params = {
            razorpay_order_id: success.razorpay_order_id,
            razorpay_signature: success.razorpay_signature,
            razorpay_payment_id: success.razorpay_payment_id
        };
        if (signature.length > 0) {
            this.payService.capturePayment(params).subscribe(function (res) {
                _this.loadingService.display(false);
                if (res['DATA'].status ===
                    interfaces.IOrderStatus.AwaitingFulfillment ||
                    res['DATA'].status === interfaces.IOrderStatus.Delivered) {
                    _this.presentAlert('Payment successful')["catch"]();
                    localStorage.setItem('orderData', JSON.stringify(res.DATA));
                    _this.cartState.setCartState(0);
                    _this.ngZone.run(function () {
                        _this.orderData = res.DATA;
                    });
                }
                else {
                    _this.presentAlert('Payment Failed!')["catch"]();
                }
            }, function (error) {
                _this.loadingService.display(false);
                _this.presentAlert('Something went wrong!')["catch"]();
            });
        }
    };
    OrderPlacedPage.prototype.trackOrder = function () {
        this.router
            .navigateByUrl('/tab/my-order-details/' + Math.random(), {
            state: { order: this.orderData.uuid }
        })["catch"]();
    };
    OrderPlacedPage = __decorate([
        core_1.Component({
            selector: 'app-order-placed',
            templateUrl: './order-placed.page.html',
            styleUrls: ['./order-placed.page.scss']
        })
    ], OrderPlacedPage);
    return OrderPlacedPage;
}());
exports.OrderPlacedPage = OrderPlacedPage;
