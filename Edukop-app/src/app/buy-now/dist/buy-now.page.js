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
exports.BuyNowPage = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var interfaces = require("@spundan-clients/bookz-interfaces");
var environment_1 = require("src/environments/environment");
var BuyNowPage = /** @class */ (function () {
    function BuyNowPage(router, navCtrl, orderSummaryService, activateRoute, addressService, loadingService, toast, alertController, payService, sharedService, cartService, cartState, routeService) {
        this.router = router;
        this.navCtrl = navCtrl;
        this.orderSummaryService = orderSummaryService;
        this.activateRoute = activateRoute;
        this.addressService = addressService;
        this.loadingService = loadingService;
        this.toast = toast;
        this.alertController = alertController;
        this.payService = payService;
        this.sharedService = sharedService;
        this.cartService = cartService;
        this.cartState = cartState;
        this.routeService = routeService;
        this.productList = [];
        this.isLoading = true;
        this.selectedArray = [];
        this.productSum = 0;
        this.isGroupProduct = true;
        this.isExitCount = 1;
        this.sellingpriceSum = 0;
        this.mrpSum = 0;
        this.additionalValue = ['more'];
        this.quantityArray = [];
        this.type = 'buyNow';
    }
    BuyNowPage.prototype.ngOnInit = function () {
        var _this = this;
        this.loadingService.display(true);
        this.activateRoute.data.subscribe(function (a) {
            if (!_this.orderList) {
                var uuid_1;
                var order = JSON.parse(localStorage.getItem('guest-order'));
                if (order) {
                    _this.cartService.placeOrder(order).subscribe(function (res) {
                        // localStorage.setItem('uuid', res.DATA.uuid);
                        uuid_1 = res.DATA.uuid;
                        _this.getOrderData(uuid_1);
                    });
                }
                else {
                    uuid_1 = localStorage.getItem('uuid');
                    _this.getOrderData(uuid_1);
                }
                _this.getUserInfo();
            }
            else {
                _this.loadingService.display(false);
            }
        });
        // this.newGetOrder();
    };
    // newGetOrder(): void {
    //     if (!this.orderList) {
    //         let uuid: string;
    //         const order = JSON.parse(localStorage.getItem('guest-order'));
    //         if (order) {
    //             this.cartService.placeOrder(order).subscribe(res => {
    //                 // localStorage.setItem('uuid', res.DATA.uuid);
    //                 uuid = res.DATA.uuid;
    //                 this.getOrderData(uuid);
    //             });
    //         } else {
    //             uuid = localStorage.getItem('uuid');
    //             this.getOrderData(uuid);
    //         }
    //         this.getUserInfo();
    //     } else {
    //         // this.loadingService.display(false);
    //     }
    //     // ORDER DATA
    //     // this.orderSummaryService
    //     // .addAddressOnOrder(this.orderList, true)
    //     // .subscribe(res => {
    //     //     // this.loadingService.display(true);
    //     //     this.getOrderById(res.DATA.uuid);
    //     // });
    // }
    BuyNowPage.prototype.ionViewWillEnter = function () {
        // if (history.state.couponBuynow) {
        //      = history.state.couponBuynow?.applied_coupon;
        //     this.orderList = history.state.couponBuynow;
        //     this.payPage('');
        // }
    };
    BuyNowPage.prototype.ionViewWillLeave = function () {
        localStorage.removeItem('guest-order');
    };
    BuyNowPage.prototype.openCoupon = function () {
        this.router
            .navigateByUrl('/tab/coupons/' + this.orderList.uuid, {
            state: {
                order: this.orderList,
                type: this.type
            },
            replaceUrl: true
        })["catch"]();
        localStorage.setItem('coupons-back', '');
    };
    // private getOrderData(id: string): void {
    //     this.route = localStorage.getItem('route');
    //     this.imageApi = environment.imageApi;
    //     console.log(history.state);
    //     const uuid: string = history.state?.uid;
    //     if (uuid !== undefined && uuid !== null) {
    //         // tslint:disable-next-line: no-shadowed-variable
    //         this.addressService
    //             .getAddressById(uuid)
    //             // tslint:disable-next-line: no-shadowed-variable
    //             .subscribe(res => {
    //                 this.myAddress = res.DATA;
    //                 this.getOrderById(id);
    //                 /// this.loadingDismiss();
    //             });
    //     } else {
    //         // tslint:disable-next-line: no-shadowed-variable
    //         this.addressService.getDefaultAddress().subscribe(res => {
    //             this.myAddress = res.DATA;
    //             this.getOrderById(id);
    //         });
    //     }
    // }
    BuyNowPage.prototype.getOrderData = function (id) {
        var _this = this;
        var _a;
        this.route = localStorage.getItem('route');
        this.imageApi = environment_1.environment.imageApi;
        console.log(history.state);
        var uuid = (_a = history.state) === null || _a === void 0 ? void 0 : _a.uid;
        if (uuid !== undefined && uuid !== null) {
            // tslint:disable-next-line: no-shadowed-variable
            this.addressService
                .getAddressById(uuid)
                // tslint:disable-next-line: no-shadowed-variable
                .subscribe(function (res) {
                _this.myAddress = res.DATA;
                _this.getOrderById(id);
                /// this.loadingDismiss();
            });
        }
        else {
            // tslint:disable-next-line: no-shadowed-variable
            this.addressService.getDefaultAddress().subscribe(function (res) {
                _this.myAddress = res.DATA;
                _this.getOrderById(id);
            });
        }
    };
    BuyNowPage.prototype.getUserInfo = function () {
        var _this = this;
        this.sharedService.getUserInfo().subscribe(function (res) {
            _this.userData = res.DATA;
        });
    };
    BuyNowPage.prototype.addGST = function () {
        this.ionContent.scrollToBottom(500);
        this.gstAdd = true;
    };
    BuyNowPage.prototype.onChangeQuantity = function (value, product, i) {
        if (value > 0 && value !== 'more') {
            this.selectedArray.forEach(function (a) {
                if (a.productUUID === product.uuid) {
                    a.quantity = Number(value);
                }
            });
            this.payPage('');
            this.calculatePrice();
        }
        else {
            this.quantityModal(i)["catch"]();
        }
        //  this.calculatePrice();
    };
    BuyNowPage.prototype.calculatePrice = function () {
        var _this = this;
        this.mrpSum = 0;
        this.sellingpriceSum = 0;
        this.productSum = 0;
        this.selectedArray.map(function (a) {
            _this.mrpSum += a.mrp * a.quantity;
            _this.sellingpriceSum += a.sellingprice * a.quantity;
        });
    };
    BuyNowPage.prototype.calculateTotalAmount = function (quantity, sp) {
        return sp * quantity;
    };
    // getOrder(): void {
    //   this.orderSummaryService.getOrder().subscribe((res: any) => {
    //     this.orderList = res.DATA as Order[];
    //     this.productList = res.DATA.products;
    //     // this.totalAmount =
    //   });
    // }
    BuyNowPage.prototype.getOrderById = function (uuid) {
        var _this = this;
        this.orderSummaryService.getOrderById(uuid).subscribe(function (res) {
            var _a, _b, _c;
            _this.orderList = res.DATA;
            _this.history =
                ((_a = res.DATA) === null || _a === void 0 ? void 0 : _a.applied_coupon) === undefined
                    ? _this.history
                    : (_b = res.DATA) === null || _b === void 0 ? void 0 : _b.applied_coupon;
            // this.sellingpriceSum = res.DATA.totalAmount + 40;
            _this.productList = res.DATA.products;
            _this.formAsproduct = res.DATA.products[0].product.isDigital;
            _this.productList.map(function (p, i) {
                var cart = {
                    productUUID: p.productUUID,
                    quantity: p.quantity,
                    mrp: p.product.mrp,
                    sellingprice: p.sellingPrice
                };
                _this.additionalValue[i] = p.quantity;
                _this.quantityArrayMethod(i);
                _this.selectedArray.push(cart);
            });
            _this.calculatePrice();
            _this.orderList.address = (_c = _this.myAddress) === null || _c === void 0 ? void 0 : _c.uuid;
            _this.loadingService.display(false);
            _this.isLoading = false;
            // this.orderSummaryService
            // .addAddressOnOrder(this.orderList, true)
            // .subscribe(res => {
            //     // this.loadingService.display(true);
            //     this.getOrderById(res.DATA.uuid);
            // });
        }, function (error) {
            _this.loadingService.display(false);
        });
    };
    BuyNowPage.prototype.calculateOfferPercentage = function (mrp, sellingPrice) {
        return sellingPrice > mrp
            ? 0
            : (((mrp - sellingPrice) / mrp) * 100).toFixed();
    };
    BuyNowPage.prototype.quantityModal = function (i) {
        return __awaiter(this, void 0, Promise, function () {
            var isError, alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isError = false;
                        return [4 /*yield*/, this.alertController.create({
                                cssClass: 'my-custom-class',
                                header: 'Enter Quantity',
                                inputs: [
                                    {
                                        name: 'quantity',
                                        type: 'number',
                                        placeholder: 'Quantity',
                                        min: 1,
                                        value: 1,
                                        disabled: isError
                                    },
                                ],
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function () {
                                            _this.productList[i].quantity = 1;
                                        }
                                    },
                                    {
                                        text: 'Apply',
                                        role: 'apply',
                                        cssClass: 'secondary',
                                        handler: function (value) {
                                            if (value.quantity < 1) {
                                                _this.toast
                                                    .showToast("Quantity can't be less than 1", 'end')["catch"]();
                                                _this.productList[i].quantity = 1;
                                            }
                                            else {
                                                var inputValue_1 = Number(value.quantity);
                                                if (value.quantity > 10) {
                                                    _this.toast
                                                        .showToast("We're sorry! Only 10 unit(s) allowed in each order", 'end')["catch"]();
                                                    inputValue_1 = 10;
                                                }
                                                _this.additionalValue[i] = inputValue_1.toString();
                                                _this.selectedArray.forEach(function (a) {
                                                    if (a.productUUID ===
                                                        _this.productList[i].productUUID) {
                                                        a.quantity = inputValue_1;
                                                    }
                                                });
                                                _this.productList[i].quantity = inputValue_1;
                                                _this.payPage('');
                                                _this.quantityArrayMethod(i);
                                                _this.calculatePrice();
                                                // this.addCart("update");
                                            }
                                        }
                                    },
                                ]
                            })];
                    case 1:
                        alert = _a.sent();
                        alert.present()["catch"]();
                        return [2 /*return*/];
                }
            });
        });
    };
    BuyNowPage.prototype.quantityArrayMethod = function (j) {
        this.quantityArray[j] = [0];
        var a = [];
        var arrayLength = Number(this.additionalValue[j]) >= 5
            ? Number(this.additionalValue[j])
            : 5;
        for (var i = 1; i <= arrayLength; i++) {
            a.push(i);
        }
        this.quantityArray[j] = a;
    };
    BuyNowPage.prototype.addGstInfo = function (organizations, gstNos) {
        Object.assign(this.orderList, {
            organization: organizations,
            gstNo: gstNos
        });
        this.toast
            .showToast("GST Info Submited", 'end')["catch"]();
    };
    BuyNowPage.prototype.payPage = function (action) {
        var _this = this;
        var isAddress = action === 'pay' ? true : false;
        if (action === 'pay') {
            if (!this.myAddress) {
                this.router
                    .navigate(['/tab/change-address', 'buy-now'], {
                    replaceUrl: true
                })["catch"]();
                // this.toast.showToast(
                //     'Please first select a default address.',
                //     'end'
                // );
                return;
            }
        }
        this.orderSummaryService
            .addAddressOnOrder(this.orderList, isAddress)
            .subscribe(function (res) {
            _this.loadingService.display(true);
            _this.getOrderById(res.DATA.uuid);
            // this.orderSummaryService.getOrderById().the
            if (action === 'pay') {
                _this.payNow();
                // this.router.navigateByUrl("/pay", {
                //   state: {
                //     amount: this.sellingpriceSum,
                //     orderUUID: this.orderList.uuid,
                //   },
                // });
            }
        });
    };
    BuyNowPage.prototype.addAddress = function () {
        this.router.navigateByUrl('/tab/change-address/16')["catch"]();
    };
    BuyNowPage.prototype.payNow = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var shippingAmount = this.history
            ? this.history.couponCode === 'FREESHIPPING' &&
                this.history.couponStatus === 'SUCCESS'
            : false;
        var shippingCheck = ((_a = this.orderList) === null || _a === void 0 ? void 0 : _a.shipping_amount) ? true : false;
        var route = localStorage.getItem('payment-route');
        var params = {
            // totalAmount: (this.orderList.totalAmount + 40) * 100,
            totalAmount: this.history
                ? (((_b = this.history) === null || _b === void 0 ? void 0 : _b.effectiveAmount) +
                    (shippingAmount
                        ? 0
                        : shippingCheck
                            ? (_c = this.orderList) === null || _c === void 0 ? void 0 : _c.shipping_amount : this.orderList.shipping_amount)) *
                    100
                : (this.orderList.totalAmount +
                    (shippingAmount
                        ? 0
                        : shippingCheck
                            ? (_d = this.orderList) === null || _d === void 0 ? void 0 : _d.shipping_amount : this.orderList.shipping_amount)) *
                    100,
            orderId: this.orderList.uuid
        };
        this.payService.createOrder(params).subscribe(function (res) {
            if (res) {
                if (route === '/cart') {
                    _this.cartState.setCartState(0);
                }
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
    BuyNowPage.prototype.payment = function () {
        var _this = this;
        // this.loadingService.display(false);
        var options = {
            description: 'Payment for Bookzey',
            image: 'https://s3.ap-south-1.amazonaws.com/images.bookz.in/logo/bookzey.png',
            currency: 'INR',
            key: environment_1.environment.razorPayKey,
            order_id: this.razorpayId,
            amount: (this.sellingpriceSum + this.orderList.shipping_amount) * 100,
            name: this.userData.firstName
                ? this.userData.firstName + ' ' + this.userData.lastName
                : 'Guest',
            prefill: {
                name: this.userData.firstName + ' ' + this.userData.lastName ||
                    // tslint:disable-next-line: strict-boolean-expressions
                    'Guest',
                // tslint:disable-next-line: strict-boolean-expressions
                email: this.userData.email || '',
                contact: this.userData.phoneNo ? this.userData.phoneNo : ''
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
            _this.ngOnInit();
        };
        // const failedCallback = failed => {
        //     this.presentAlert('Something went wrong!').catch();
        // };
        RazorpayCheckout.on('payment.success', successCallback);
        RazorpayCheckout.on('payment.cancel', cancelCallback);
        //   RazorpayCheckout.on('payment.failed', failedCallback);
        RazorpayCheckout.open(options);
    };
    BuyNowPage.prototype.presentAlert = function (msg) {
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
    BuyNowPage.prototype.paymentVerify = function (success) {
        var _this = this;
        var route = localStorage.getItem('payment-route');
        this.loadingService.display(true);
        var orderId = success.razorpay_order_id;
        var signature = success.razorpay_signature;
        var razorpay_payment_id = success.razorpay_payment_id;
        var params = {
            razorpay_order_id: success.razorpay_order_id,
            razorpay_signature: success.razorpay_signature,
            razorpay_payment_id: success.razorpay_payment_id
        };
        if (signature) {
            this.payService.capturePayment(params).subscribe(function (res) {
                // this.loadingService.display(false);
                if (res['DATA'].status ===
                    interfaces.IOrderStatus.AwaitingFulfillment ||
                    res['DATA'].status === interfaces.IOrderStatus.Delivered) {
                    _this.presentAlert('Payment successful')["catch"]();
                    if (route === '/cart') {
                        _this.cartState.setCartState(0);
                    }
                    // this.router.navigateByUrl("/order-placed");
                    _this.router
                        .navigateByUrl('/tab/order-placed/' + res['DATA'].uuid, {
                        state: {
                            order: res['DATA']
                        }
                    })["catch"]();
                    // this.cartService.paymentOrder(this.orderList.uuid).subscribe((res: any) => {
                    //   if (res) {
                    //     //this.presentToast();
                    //   }
                    // });
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
    BuyNowPage.prototype.goback = function () {
        // this.navCtrl.navigateBack(this.route).catch();
        // localStorage.removeItem('guest-order');
        this.routeService.navigateToBack('ionic');
    };
    BuyNowPage.prototype.removeCoupon = function (orderUUID) {
        var _this = this;
        this.orderSummaryService.removeCoupon(orderUUID).subscribe(function (result) {
            _this.history = null;
            _this.getOrderById(orderUUID);
        }, function (error) {
            _this.loadingService.display(false);
            _this.presentAlert('Something went wrong!')["catch"]();
        });
    };
    __decorate([
        core_1.ViewChild(angular_1.IonContent)
    ], BuyNowPage.prototype, "ionContent");
    BuyNowPage = __decorate([
        core_1.Component({
            selector: 'app-buy-now',
            templateUrl: './buy-now.page.html',
            styleUrls: ['./buy-now.page.scss']
        })
    ], BuyNowPage);
    return BuyNowPage;
}());
exports.BuyNowPage = BuyNowPage;
