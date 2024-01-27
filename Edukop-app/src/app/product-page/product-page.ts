import {
  Component,
  ComponentFactoryResolver,
  NgZone,
  OnInit,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import {
  AlertController,
  IonContent,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from "@ionic/angular";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { UUID } from "angular2-uuid";
import { environment } from "src/environments/environment";
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions,
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { AuthService } from "../auth/services/auth.service";
import { Cart, CartProduct } from "../cart/model/cart.model";
import { CartService } from "../cart/services/cart-service";
import { SearchModalComponent } from "../search-modal/search-modal.component";
import { LoaderService } from "../shared/loader/loader.service";
import { RouteService } from "../shared/services/router.service";
import { SharedService } from "../shared/services/shared.service";
import { ToastService } from "../shared/services/toast.service";
import { CartStateService } from "../shared/state/cart.state";
import { ProductStateService } from "../shared/state/product.state";
import { WishlistService } from "../wishlist/service/wishlist.service";
import { RecentProductService } from "./service/recent-product.service";
import { IAttributeValues } from "@spundan-clients/bookz-interfaces";
import { Observable } from "rxjs";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { IGProduct, IGroupProduct } from "../models/IGproduct.model";
import { IProduct } from "../models/IProduct.model";

export interface SearchDataModel {
  uuid: string;
  sub_uuid: string;
}
export interface AttributesVariants {
  attributeName: string;
  attributeUUID?: string;
  uuid: string;
  variants: AttributesChildVariants[];
}

export interface AttributesChildVariants {
  attributeKey: string;
  uuid: string;
  attributeValue: string;
}

interface IonChecboxEvent {
  detail: {
    checked: boolean;
  };
}
export interface WishlistData {
  uuid: string;
  action: string;
}
export interface attributeAndValues {
  attributeId: string;
  attributeValue: IAttributeValues;
  variantProduct?: IProduct;
}
export interface VariantAndMainProduct {
  mainProduct: interfaces.IProduct;
  variants: interfaces.IVariantProduct[];
}
declare var require: any;

@Component({
  selector: "app-product-page",
  templateUrl: "./product-page.html",
  styleUrls: ["./product-page.scss"],
})
export class BookSetPage implements OnInit {
  uuid: string;
  subuuid: string;
  // params: navigateState;
  Suggestedproduct: interfaces.IProduct[] = [];
  quantityArray: number[][] = [];
  gProduct: IProduct;
  productList: any[] = [];
  selectedArray: interfaces.ICartProduct[] = [];
  productArray: interfaces.ICartProduct[] = [];
  isGrouped: boolean = false;
  isGroupProduct: boolean = true;
  productSum: number = 0;
  imageUrl: string;
  cartBadge: number;
  state: string;
  noData: boolean = false;
  recentProducts: interfaces.IProduct;
  pageNumber: number = 1;
  gProductSet: number = 1;
  cartProduct: interfaces.ICartProduct[] = [];
  isExitCount: number = 1;
  readMore: boolean = false;
  readMoreShort: boolean = false;
  attributes: interfaces.IAttribute[] = [];
  ab: interfaces.IAttribute[] = [];
  iconActive: boolean;
  wishListData: interfaces.IWishlist;
  imageApi: string;
  wishlistProductIds: string[] = [];
  additionalValue: string[] = ["more"];
  event: IonChecboxEvent;
  openVendor: boolean = false;
  vendorInfo: Array<interfaces.IVendorsListOfProduct>;
  userId: string = localStorage.getItem("userId");
  // tslint:disable-next-line: no-any
  selectVendorProduct: any;
  // tslint:disable-next-line: no-any
  unsubscibe: any;
  cartState: number = 0;
  isDataLoaded: boolean = false;
  wishList: WishlistData[] = [];
  // tslint:disable-next-line: no-any
  historyState: any;
  faq: interfaces.IFAQ;
  totalSellingPrice: number;
  rateUUID: string;
  averageRate: interfaces.IRatingResponse;
  // test: any;
  // id: any;
  // sorted_id: any;
  // tslint:disable-next-line: no-any
  sorted: any;
  isGuest: boolean;
  // entryUrl: any;
  isVariantProduct: boolean = false;

  commonAttributeProducts: interfaces.IProduct[] = [];

  attributesToShowForVariant: {
    attributeName: string;
    attribute_Id: string;
    attributeValues: attributeAndValues[];
  }[] = [];

  constructor(
    public modelController: ModalController,
    private navCtrl: NavController,
    public router: Router,
    private sharedService: SharedService,
    public cartService: CartService,
    public toastController: ToastController,
    public loadingService: LoaderService,
    public modalController: ModalController,
    public cartStateService: CartStateService,
    public recentProductsService: RecentProductService,
    public wishlistService: WishlistService,
    public toastService: ToastService,
    public alertController: AlertController,
    public routeService: RouteService,
    public platform: Platform,
    public auth: AuthService,
    public productStateService: ProductStateService,
    public ngZone: NgZone,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener
  ) {
    this.loadingService.display(true);
  }

  ngOnInit(): void {
    this.cartStateService.getCartState().subscribe((val) => {
      this.cartBadge = val;
      // this.getCarts();
    });
    this.historyState = history.state;
    if (this.historyState.type === "Product") {
      this.getVendors(this.historyState.uuid);
    } else if (this.historyState.product) {
      this.getVendors(this.historyState.product.uuid);
    }
    // this.getProductbyId(this.gProduct.categories);
    this.imageApi = environment.imageApi;
    this.getWishList();
  }

  ionViewDidEnter(): void {
    // this.getRating(this.uuid || history?.state?.product?.uuid);
    //    this.getCarts();
  }

  private productState(): void {
    if (this.historyState.type === "Product") {
      let searchData;
      searchData = {
        uuid: this.uuid,
        subuuid: this.subuuid,
      };
      this.sectionProduct(this.historyState.filter);
      // this.getProductAttributes(this.historyState.uuid);

      this.getproductList(searchData);
    } else {
      if (this.historyState.product) {
        this.isDataLoaded = true;
        // this.params = history.state.params;
        this.gProduct = this.historyState.product;
        console.log(this.gProduct);
        this.getVariantAndMainProduct(
          (this.gProduct as interfaces.IVariantProduct)?.isVariant
            ? (this.gProduct as interfaces.IVariantProduct).mainProductId
            : this.gProduct.uuid
        );
        if (this.historyState.product) {
          this.uuid = this.historyState.product.uuid;
        } else {
          this.uuid = this.historyState.uuid;
        }
        this.subuuid = this.historyState.sub_uuid;
        let searchData: SearchDataModel;
        searchData = {
          // uuid: this.uuid,
          uuid: this.historyState.uuid,
          sub_uuid: this.subuuid,
        };
        this.getproductList(searchData);
        this.getProduct(this.gProduct.uuid);
        this.getProductAttributes();
        // this.getProductAttributes(this.gProduct.uuid);
        // this.getfaq(this.uuid);
        // this.loadingDismiss();
        // this.imageUrl = environment.imageApi + this.gProduct.images;
        //  this.state = history.state.state;
      } else {
        this.navCtrl.navigateRoot("/tab/dashboard").catch();
      }
    }
    // this.getRating(this.uuid);
  }

  vendorOption(): void {
    this.openVendor = true;
  }

  vendorOptionClose(): void {
    this.openVendor = false;
  }

  getVendors(productUUID: string): void {
    this.sharedService.getVendor(productUUID).subscribe(
      (response) => {
        this.vendorInfo = response.DATA;
        this.setVendor(productUUID);
      },
      (error) => {
        this.setVendor(productUUID);
      }
    );
  }

  private setVendor(productUUID: string): void {
    this.uuid = this.historyState.uuid;
    this.subuuid = this.historyState.sub_uuid;
    this.productState();
    this.getCarts();
    this.getfaq(this.uuid);
    this.getRating(this.uuid);
  }

  ionViewWillEnter(): void {
    const route = localStorage.getItem("back-route");
    if (route === "/product-page") {
      // this.addWishList(this.wishList[0]?.uuid, this.wishList[0]?.action);
    }
    this.isGuest = this.auth.currentGuestUserValue;
  }

  getRating(uuid: string): void {
    this.sharedService.getRating(uuid).subscribe(
      (res) => {
        this.averageRate = res.DATA;
        this.sorted = this.averageRate.ratings.sort((a, b) => {
          return b._id - a._id;
        });
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  getAttributeAndValue(
    product: interfaces.IProduct,
    singleSelectAttributesInMain: interfaces.IAttribute[]
  ): attributeAndValues[] {
    return product.attributes
      .filter((a) =>
        singleSelectAttributesInMain.some(
          (ssa) => ssa.attributeUUID === a.attribute_Id
        )
      )
      .map((filterAttributes) => {
        const detail = product.attributeDetails.find(
          (aD) => aD.attributeUUID === filterAttributes.attribute_Id
        );
        return {
          attributeId: filterAttributes.attribute_Id,
          attributeValue: detail.attributeValues.find((aV) =>
            filterAttributes.attribute_value_Id.includes(aV.attributeValue)
          ),
        };
      });
  }

  getVariantAndMainProduct(uuid: string): void {
    const variants: any[] = [];
    this.attributesToShowForVariant = [];
    this.sharedService.getVariantProducts(uuid).subscribe(async (res) => {
      if (res.DATA.variants && res.DATA.variants.length > 0) {
        const variantCombinations: {
          productId: IProduct;
          isMain: boolean;
          attributes: {
            attributeId: string;
            attributeValue: IAttributeValues;
          }[];
        }[] = [];
        const singleSelectAttributesInMain =
          res.DATA.mainProduct.attributeDetails.filter(
            (aD) => aD.attributeType == "Single-select"
          );
        variantCombinations.push({
          productId: res.DATA.mainProduct as any,
          isMain: true,
          attributes: this.getAttributeAndValue(
            res.DATA.mainProduct,
            singleSelectAttributesInMain
          ),
        });

        res.DATA.variants.forEach((variant) => {
          variantCombinations.push({
            productId: variant as any,
            isMain: false,
            attributes: this.getAttributeAndValue(
              variant,
              singleSelectAttributesInMain
            ),
          });
        });

        const allAttributes: attributeAndValues[] = [];
        variantCombinations.forEach((vC) => {
          vC.attributes.forEach((vca) => {
            if (
              allAttributes.find(
                (aa) =>
                  aa.attributeId === vca.attributeId &&
                  aa.attributeValue.attributeValue ===
                    vca.attributeValue.attributeValue
              ) == null
            ) {
              allAttributes.push({
                attributeId: vca.attributeId,
                attributeValue: vca.attributeValue,
                variantProduct: vC.productId,
              });
            }
          });
        });

        const group = allAttributes.reduce<attributeAndValues>((r, a) => {
          r[a.attributeId] = [...(r[a.attributeId] || []), a];
          return r;
        }, {} as attributeAndValues);

        Object.keys(group).forEach((key) => {
          if ((group[key] as []).length > 1) {
            // removed if there's only single value
            this.attributesToShowForVariant.push({
              attributeName: singleSelectAttributesInMain.find(
                (a) => a.attributeUUID === key
              ).attributeName,
              attribute_Id: key,
              attributeValues: group[key],
            });
          }
        });
        return;
      }
    });
  }

  onAttributeClick(product: IProduct, content: IonContent): void {
    this.loadingService.display(true);
    const event: IonChecboxEvent = {
      detail: { checked: true },
    };
    this.gProduct = product;
    this.isGrouped = product.is_grouped;
    this.productList = [];
    this.selectedArray = [];
    this.sharedService.getVendor(product.uuid).subscribe(
      (response) => {
        this.vendorInfo = response.DATA;
        this.selectVendorProduct = this.vendorInfo[0];
        this.selectProduct(event, product);
        this.variantProductAttributes();
        this.uuid = product.uuid;
        this.getCarts();
      },
      (error) => {
        this.loadingService.display(false);
      }
    );
    content.scrollToTop().catch();
  }

  ifAttributeExists(
    attributeId: string,
    attributeValue: IAttributeValues
  ): boolean {
    return !this.gProduct.attributes.find((a) =>
      a.attribute_value_Id.includes(attributeValue.attributeValue)
    );
  }

  rateProduct(): void {
    this.router
      .navigateByUrl("/tab/review/" + Math.random(), {
        state: {
          product: this.gProduct,
          isOrder: false,
        },
      })
      .catch();
  }

  openPDf(path: string): void {
    console.log(JSON.parse(localStorage.getItem("currentUser")));
    const mime = require("mime");
    console.log(path);
    this.userId = localStorage.getItem("userId");
    const storagePath =
      this.file.externalApplicationStorageDirectory + "files/";
    const userPath =
      storagePath +
      "bookzeycache/Users/" +
      this.userId +
      "/" +
      this.gProduct.uuid +
      "/";
    if (this.isGuest) {
      const url1 = this.router.url.split("/");
      this.router.navigateByUrl("/tab/pdf-previewer/" + Math.random());
      localStorage.setItem("guest-route", "/tab/product-page/" + url1[3]);
      return;
    }
    // this.loadingService.display(true);
    const url = environment.Api + `/productPDF?pdfPath=${path}`;
    var fileTransfer = new FileTransfer().create();
    // var uri = this.contractData.signeddocumentURL[index];
    console.log(url, "url", this.gProduct.uuid, "this.gProduct.uuid");
    let options: FileUploadOptions = {
      headers: {
        authtoken: JSON.parse(localStorage.getItem("currentUser")),
      },
    };
    fileTransfer
      .download(
        url,
        (this.file.externalRootDirectory || this.file.dataDirectory) +
          "/Download/edukop/" +
          path,
        true,
        options
      )
      .then(() => {
        console.log(this.file);
        this.fileOpener
          .showOpenWithDialog(
            (this.file.externalRootDirectory || this.file.dataDirectory) +
              "/Download/edukop/" +
              path,
            mime.getType(path)
          )
          .then(() =>
            this.toastService.showToast(
              "Document Download in to Download Folder",
              "start"
            )
          )
          .catch((e) => this.toastService.showToast(e, "start"));
      });
    // this.file
    //   .checkFile(userPath, this.gProduct.uuid).then(files => {
    //     if (files) {
    //       console.log(files, "files")
    //       this.file
    //         .readAsArrayBuffer(userPath, this.gProduct.uuid)
    //         .then(res => {
    //           console.log(res)
    //           this.loadingService.display(false);
    //           this.router.navigateByUrl(
    //             '/tab/pdf-previewer/' + Math.random(),
    //             {
    //               state: {
    //                 data: this.gProduct,
    //                 path: res,
    //               },
    //             }
    //           );
    //         })
    //         .catch(er => {
    //           console.log(er)
    //           this.loadingService.display(false);
    //         });
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err, "err")
    //     this.downloadFileToLocal(url);
    //   });
  }

  getPdfPath(path: string): void {
    this.sharedService.openPDF(path).subscribe(
      (res) => {
        // this.entryUrl = res
        this.router.navigateByUrl("/tab/pdf-previewer/" + Math.random(), {
          state: {
            path: res,
          },
        });
      },
      (error) => {}
    );
  }

  downloadFileToLocal(url: string): void {
    this.userId = localStorage.getItem("userId");
    const storagePath =
      this.file.externalApplicationStorageDirectory + "files/";
    const userPath =
      storagePath +
      "bookzeycache/Users/" +
      this.userId +
      "/" +
      this.gProduct.uuid +
      "/";
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer
      .download(url, userPath + this.gProduct.uuid, false, {
        headers: {
          authtoken: this.auth.currentUserValue,
        },
      })
      .then(
        (entry) => {
          this.file.writeFile(
            userPath,
            this.gProduct.uuid + ".name",
            this.gProduct.name
          );
          if (this.gProduct.images.length > 0) {
            this.file.writeFile(
              userPath,
              this.gProduct.uuid + ".thumb",
              this.gProduct.images[0]
            );
          }
          this.file
            .readAsArrayBuffer(userPath, this.gProduct.uuid)
            .then((res) => {
              this.loadingService.display(false);
              this.router.navigateByUrl("/tab/pdf-previewer/" + Math.random(), {
                state: {
                  data: this.gProduct,
                  path: res,
                },
              });
            })
            .catch((er) => {
              this.loadingService.display(false);
            });
        },
        (error) => {
          console.error(error);
          this.loadingService.display(false);
        }
      );
  }

  suggestedProductPage(
    product: interfaces.IProduct,
    content: IonContent,
    action: string
  ): void {
    //  this.gProduct = product;
    this.router.navigateByUrl("/tab/product-page/" + Math.random(), {
      state: {
        params: this.historyState.params,
        uuid: this.historyState.uuid,
        sub_uuid: this.historyState.sub_uuid,
        product,
        isGrouped: product.is_grouped,
        state: this.state ? this.state : this.historyState,
      },
      replaceUrl: true,
    });
    // this.onReset();
    this.ngOnInit();
    // this.gProduct = product;
    // this.productList = [];
    // this.isGrouped = product.is_grouped;
    // this.getProductAttributes(product.uuid);
    // this.calculatePrice();
    // content.scrollToTop().catch();
    // setTimeout(() => {
    //     this.loadingService.display(false);
    // }, 1000);
  }

  allFaq(): void {
    this.router
      .navigateByUrl("/tab/faq/" + Math.random(), {
        state: { pUUID: this.uuid },
      })
      .catch();
  }

  getproductList(searchData: SearchDataModel): void {
    const paginate: interfaces.IPaginate = {
      pageSize: 10,
      pageIndex: 1,
    };
    this.sharedService.search(searchData, paginate).subscribe((response) => {
      this.Suggestedproduct = response?.DATA ? response.DATA.docs : [];
      // this.isDataLoaded = true;
    });
  }

  addWishList(uuids: string, actions: string): void {
    this.loadingService.display(true);
    this.iconActive = true;
    const products = [];
    products.push({ productUUID: uuids });
    const wishlistParams = {
      products,
    };
    if (this.auth.currentGuestUserValue) {
      this.loadingService.display(false);
      this.wishList.push({ uuid: uuids, action: actions });
      this.router.navigateByUrl("/tab/wishlist/" + Math.random()).catch();
      localStorage.setItem("back-route", "/product-page");
      return;
    }
    this.wishlistService.addWishList(wishlistParams).subscribe((res) => {
      if (res) {
        if (actions === "add") {
          this.toastService
            .showToast("Product is added to wishlist", "end")
            .catch();
        } else if (actions === "remove") {
          this.toastService
            .showToast("Product is removed from wishlist", "end")
            .catch();
        }
        this.getWishList();
        this.loadingService.display(false);
      }
    });
  }

  readmore(): void {
    this.readMore = true;
  }

  readmoreShort(): void {
    this.readMoreShort = true;
  }

  readless(): void {
    this.readMore = false;
  }

  readlessShort(): void {
    this.readMoreShort = false;
  }

  getWishList(): void {
    this.wishlistService.getWishList().subscribe((res) => {
      if (res.DATA) {
        this.wishListData = res.DATA;

        this.wishlistProductIds = this.wishListData.products.map(
          (e) => e.productUUID
        );
      } else {
        this.wishlistProductIds = [];
      }
    });
  }

  isWishListed(uuid: string): boolean {
    if (this.wishlistProductIds.includes(uuid)) {
      return true;
    } else {
      return false;
    }
  }

  async presentAlertPrompt(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Enter Quantity",
      inputs: [
        {
          name: "qty",
          type: "number",
          placeholder: "Quantity",
        },
      ],
    });
  }

  private sectionProduct(filter: string): void {
    this.loadingService.display(true);
    this.sharedService.getCategoryData(filter).subscribe(
      (res) => {
        const event: IonChecboxEvent = {
          detail: { checked: true },
        };
        res = res as IProduct;
        this.gProduct = res as IProduct;
        this.isDataLoaded = true;
        this.getVariantAndMainProduct(
          (this.gProduct as interfaces.IVariantProduct)?.isVariant
            ? (this.gProduct as interfaces.IVariantProduct).mainProductId
            : this.gProduct.uuid
        );
        if (res === null) {
          this.toastService.showToast("No Data Found", "end").catch();
          this.navCtrl.back();
          this.loadingService.display(false);
          return;
        }
        // this.imageUrl = environment.imageApi + this.gProduct.images;
        this.isGrouped = res.is_grouped;
        if (this.isGrouped === true) {
          res = res;
          this.gProduct = res as any;
          this.productList = (res as IGroupProduct).products;

          // this.productList.push(res.products);
          this.productList.map((a, i) => {
            a.product.qunatity = a.quantity;
            this.selectProduct(event, a.product);
            this.quantityArrayMethod(i);
          });
        } else {
          const a: IGroupProduct[] = [];
          a.push(res as IGroupProduct);
          this.productList = a;
          this.selectProduct(event, a[0]);
          this.quantityArrayMethod(0);
        }
        this.getProductAttributes();
      },
      (error) => {
        this.loadingService.display(false);
      }
    );
  }

  calculateOfferPercentage(mrp: number, sellingPrice: number): string | number {
    return sellingPrice > mrp
      ? 0
      : (((mrp - sellingPrice) / mrp) * 100).toFixed();
  }

  getCarts(): void {
    this.cartProduct = [];
    let cartProductArray: interfaces.ICartProduct[] = [];
    // this.presentLoading();
    this.cartService.getCart().subscribe((res) => {
      if (res.DATA !== undefined && res.DATA !== null) {
        this.cartProduct = [];
        // this.cartBadge = res.DATA.products.length;
        cartProductArray = res.DATA.products;
        if (!this.isGrouped || !this.isGroupProduct) {
          for (let i = 0; i < res.DATA.products.length; i++) {
            if (cartProductArray[i].productUUID !== this.uuid) {
              this.cartProduct = [];
            } else {
              return (this.cartProduct = cartProductArray);
            }
          }
        } else {
          for (let i = 0; i < res.DATA.products.length; i++) {
            if (cartProductArray[i].productUUID !== this.uuid) {
              this.cartProduct = [];
            } else {
              return (this.cartProduct = cartProductArray);
            }
          }
        }
      }
    });
  }

  async presentModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: SearchModalComponent,
      componentProps: { redirectFrom: "product-page" },
      cssClass: "my-custom-class",
      backdropDismiss: true,
    });
    modal.onDidDismiss().then((data: any) => {
      if (data["data"].product) {
        const product = data["data"].product;
        this.router
          .navigateByUrl("/tab/product-page/" + Math.random(), {
            state: {
              filter: "productById?uuid=" + product.uuid,
              type: "Product",
              uuid: product.uuid,
            },
          })
          .catch();
      }
    });
    return modal.present();
  }

  onChangeQuantity(event: any, uuid: string, i: number): void {
    if (event.target.value > 0 && event.target.value !== "more") {
      this.selectedArray.forEach((a) => {
        if (a.productUUID === uuid) {
          this.gProductSet = Number(event.target.value);
          a.quantity = Number(event.target.value);
        }
      });
      this.calculatePrice();
    } else {
      this.quantityModal(i).catch();
    }
  }

  async quantityModal(i: number): Promise<void> {
    this.productList = this.productList;
    const isError = false;

    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Enter Quantity",
      inputs: [
        {
          name: "quantity",
          type: "number",
          placeholder: "Quantity",
          min: 1,
          value: 1,
          disabled: isError,
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            (this.productList as interfaces.IGProduct[])[i].quantity = 1;
            this.selectedArray[i].quantity = 1;
          },
        },
        {
          text: "Apply",
          role: "apply",
          cssClass: "secondary",
          handler: (value) => {
            if (value.quantity < 1) {
              this.toastService
                .showToast("Quantity can't be less than 1", "end")
                .catch();
              (this.productList as interfaces.IGProduct[])[i].quantity = 1;
              this.selectedArray[i].quantity = 1;
            } else {
              let inputValue = Number(value.quantity);
              this.gProductSet = Number(value.quantity);

              if (value.quantity > 10) {
                this.toastService
                  .showToast(
                    "We're sorry! Only 10 unit(s) allowed in each order",
                    "end"
                  )
                  .catch();
                // this.gProductSet = 10;
                inputValue = 10;
                this.gProductSet = 10;
              }

              this.additionalValue[i] = inputValue.toString();

              this.selectedArray.forEach((a) => {
                if (
                  a.productUUID ===
                  (this.productList as interfaces.IGProduct[])[i].uuid
                ) {
                  a.quantity = inputValue;
                  a.quantity = this.gProductSet;
                }
              });
              (this.productList as interfaces.IGProduct[])[i].quantity =
                inputValue;
              this.quantityArrayMethod(i);
              this.calculatePrice();
              // this.addCart();
            }
          },
        },
      ],
    });
    alert.present().catch();
  }

  toggleChange(): void {
    this.selectedArray = [];
    this.onReset();
    this.getCarts();
  }

  onReset(): void {
    const event: IonChecboxEvent = {
      detail: { checked: true },
    };
    // this.productList.forEach((a) => {
    //   a.quantity = 1;
    // });
    this.productList.forEach((product) => {
      product.product.quantity = product.quantity;
      this.selectProduct(event, product.product);
    });
    this.calculatePrice();
  }

  isChecked(product: interfaces.IProduct, i: number): boolean {
    return this.selectedArray.some((val) => val.productUUID === product.uuid);
  }

  selectProduct(event: any, product: interfaces.IProduct | any): void {
    // this.vendorInfo = this.vendorInfo?.sort((a, b) => a.sellingPrize - b.sellingPrize);
    let productDetails: interfaces.ICartProduct;
    this.selectVendorProduct = this.vendorInfo ? this.vendorInfo[0] : "";
    if (event.detail.checked === true) {
      if (!this.isGrouped) {
        productDetails = {
          productUUID: product.uuid,
          quantity: product.quantity || 1,
          mrp: this.selectVendorProduct?.mrp,
          sellingPrice: this.selectVendorProduct?.sellingPrice,
          vendorId: this.selectVendorProduct?.vendorId,
        };
      } else {
        productDetails = {
          productUUID: product.uuid,
          quantity: product.quantity || 1,
          mrp: product.mrp,
          sellingPrice: product.sellingprice,
          vendorId: this.selectVendorProduct.vendorId,
        };
      }
      this.selectedArray.push(productDetails);
      this.calculatePrice();
    } else {
      const index = this.selectedArray.findIndex((p) => {
        return p.productUUID === product.uuid;
      });
      this.selectedArray.splice(index, 1);
      this.calculatePrice();
    }
    // this.isDataLoaded = true;
    this.loadingService.display(false);
  }

  calculatePrice(): void {
    this.productSum = 0;
    this.totalSellingPrice = 0;
    if (!this.isGroupProduct) {
      this.selectedArray.map((a) => {
        this.totalSellingPrice += a.sellingPrice * a.quantity;
        this.productSum += a.mrp * a.quantity;
      });
    } else {
      this.selectedArray.map((a) => {
        this.totalSellingPrice += a.sellingPrice * a.quantity;
        this.productSum += a.mrp * a.quantity;
      });
    }
  }

  selectVendor(vendor: interfaces.IVendorsListOfProduct): void {
    this.selectVendorProduct = vendor;
    if (!this.isGroupProduct) {
      this.selectedArray.map((a) => {
        (a.productUUID = this.selectVendorProduct.productUUID),
          (a.mrp = vendor.mrp);
        a.sellingPrice = vendor.sellingPrice;
      });
    } else {
      this.selectedArray.map((a) => {
        (a.productUUID = this.selectVendorProduct.productUUID),
          (a.mrp = vendor.mrp);
        a.sellingPrice = vendor.sellingPrice;
      });
      //  this.gProduct.sellingprice = this.gProductSet * vendor.sellingPrice;
    }
    this.uuid = this.selectVendorProduct.productUUID;
    this.getVariantAndMainProduct(this.uuid);
    this.getCarts();
    this.calculatePrice();
  }

  quantityArrayMethod(j: number): void {
    this.quantityArray[j] = [0];
    const a: number[] = [];
    const arrayLength =
      Number(this.additionalValue[j]) >= 50
        ? Number(this.additionalValue[j])
        : 50;
    for (let i = 1; i <= arrayLength; i++) {
      a.push(i);
    }
    this.quantityArray[j] = a;
  }

  getProduct(productUUID: string): void {
    this.loadingService.display(true);
    this.sharedService.getProductById(productUUID).subscribe(
      (res) => {
        const event: IonChecboxEvent = {
          detail: { checked: true },
        };

        this.isGrouped = res.is_grouped;
        if (this.isGrouped) {
          this.productList = (res as interfaces.IGroupProduct).products;
          this.productList.map((a, i) => {
            a.product.quantity = a.quantity;
            this.selectProduct(event, a.product);
            this.quantityArrayMethod(i);
          });
          // this.productList.push(res.products);
        } else {
          this.productList.push(res as interfaces.IProduct);
          this.selectProduct(event, res);
          this.quantityArrayMethod(0);
        }

        this.loadingService.display(false);
      },
      (error) => {
        this.loadingService.display(false);
      }
    );
  }

  buyNowPage(): void {
    const cartProductArray: interfaces.ICartProduct[] = [];
    let cart: interfaces.IOrder;

    if (this.isGroupProduct) {
      const prodt: interfaces.ICartProduct = {
        productUUID: this.gProduct.uuid,
        quantity: this.gProductSet,
        product: this.gProduct,
        vendorId: this.selectVendorProduct.vendorId,
      };
      if (this.gProductSet < 1) {
        this.toastService
          .showToast("Quantity can't be less than 1", "end")
          .catch();
        return;
      }
      cartProductArray.push(prodt);
    } else {
      this.selectedArray.forEach((product) => {
        console.log(product,'222')
        const prodt: interfaces.ICartProduct = {
          productUUID: product.productUUID,
          quantity: product.quantity,
          // product: this.product.,

          // sellingPrice: product.mrp,
          vendorId: this.selectVendorProduct.vendorId,
        };
        cartProductArray.push(prodt);
      });
    }

    cart = {
      uuid: UUID.UUID(),
      products: cartProductArray,
      totalAmount: this.productSum,
      isCart: false,
    };

    if (this.auth.currentGuestUserValue !== undefined) {
      localStorage.removeItem("uuid");
      localStorage.setItem("guest-order", JSON.stringify(cart));
      localStorage.setItem("guest-route", "/tab/buy-now/" + Math.random());
      localStorage.setItem("route", "/product-page");
      this.router.navigate(["/tab/buy-now/" + Math.random()]).catch();
      return;
    }

    this.cartService.placeOrder(cart).subscribe((res) => {
      localStorage.setItem("payment-route", "/tab/buy-now/" + Math.random());
      localStorage.removeItem("uuid");
      localStorage.setItem("uuid", res.DATA.uuid);
      localStorage.setItem("route", "/product-page");
      this.router.navigate(["/tab/buy-now/" + Math.random()]).catch();
    });
  }

  addCart(): void {
    if (this.cartProduct.length && this.isGroupProduct) {
      this.router.navigateByUrl("/tab/cart/" + Math.random());
      return;
    }
    const cartProductArray: interfaces.ICartProduct[] = [];
    let cart: any;
    if (this.isGroupProduct && this.isGrouped) {
      cart = {
        productUUID: this.gProduct.uuid,
        quantity: 1,
        vendorId: this.selectVendorProduct.vendorId,
      };
      // this.selectedArray.forEach(product => {
      //     cart = {
      //         productUUID: product.productUUID,
      //         quantity: product.quantity,
      //         vendorId: this.selectVendorProduct.vendorId,
      //     };
      // });
      if (this.gProductSet < 1) {
        this.toastService
          .showToast("Quantity can't be less than 1", "end")
          .catch();
        return;
      }
      cartProductArray.push(cart);
      this.presentToast().catch();
    } else {
      this.selectedArray.forEach((product) => {
        const prodt: interfaces.ICartProduct = {
          productUUID: product.productUUID,
          quantity: product.quantity,
          vendorId: this.selectVendorProduct.vendorId,
        };
        cartProductArray.push(prodt);
      });
      this.presentToast().catch();
    }

    cart = {
      products: cartProductArray,
      // totalAmount: this.productSum,
    };
    if (this.auth.currentGuestUserValue !== undefined) {
      localStorage.setItem("guest-cart", JSON.stringify(cart));
      localStorage.setItem("guest-route", "/tab/cart/" + Math.random());
    }
    this.cartService.addCart(cart).subscribe(
      (res) => {
        if (res) {
          this.cartBadge = this.cartBadge + 1;
          this.cartStateService.setCartState(this.cartBadge);
          this.getCarts();
          this.loadingService.display(false);
        }

        // this.router.navigateByUrl("/cart");
      },
      (error) => {
        this.loadingService.display(false);
      }
    );
  }

  dismissModal(): void {
    this.modelController
      .dismiss({
        dismissed: true,
      })
      .catch();
  }

  goback(): void {
    // this.navCtrl.back();
    this.routeService.navigateToBack("ionic");
    // const route = localStorage.getItem('back-route');
    // if (route) {
    //     route === '/product-page'
    //         ? this.navCtrl.navigateBack('/tab/dashboard').catch()
    //         : this.navCtrl.navigateBack(route).catch();
    //     localStorage.removeItem('back-route');
    // } else if (this.state !== undefined) {
    //     localStorage.setItem('state', JSON.stringify(this.state));
    //     this.navCtrl.back();
    //     // tslint:disable-next-line: strict-boolean-conditions
    // } else {
    //     this.navCtrl.back();
    // }
    // localStorage.setItem('history-back', '/product-page');
    // // tslint:disable-next-line: strict-boolean-conditions
    // if (this.productState) {
    //     this.productStateService.setProductState(undefined);
    // }
  }

  async presentToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: "Product added to cart",

      duration: 2000,
      buttons: [
        {
          side: "end",
          text: "Go To Cart",
          handler: () => {
            this.cart();
          },
        },
      ],
    });
    toast.present().catch();
  }

  cart(): void {
    const route = localStorage.getItem("last-route");
    if (route !== "/cart") {
      localStorage.setItem("route", "/product-page");
      localStorage.setItem("cart-back", "/product-page");
    }
    this.router.navigateByUrl("/tab/cart/" + Math.random()).catch();
  }

  openAllCategory(): void {
    this.navCtrl.navigateRoot("/tab/all-categories").catch();
  }

  getMainProductAttributes(cb): void {
    this.sharedService
      .getProductAttributes(
        (this.gProduct as interfaces.IVariantProduct).mainProductId
      )
      .subscribe(
        (res) => {
          this.attributes = res.DATA;
          this.ab = res.DATA;
          cb();
        },
        (error) => {
          //   this.loadingService.display(false);
        }
      );
  }

  productAttributes(
    uuid: string
  ): Observable<interfaces.IResponseGet<interfaces.IAttribute[]>> {
    return this.sharedService.getProductAttributes(uuid);
  }

  variantProductAttributes(): void {
    this.productAttributes(this.gProduct.uuid).subscribe((response) => {
      response.DATA.forEach((attribute) => {
        const index = this.attributes.findIndex(
          (att) => att.attributeUUID === attribute.attributeUUID
        );
        if (index === -1) {
          this.attributes.push(attribute);
        } else {
          this.attributes[index] = attribute;
        }
      });
    });
  }

  getProductAttributes(): void {
    if ((this.gProduct as interfaces.IVariantProduct).isVariant) {
      this.getMainProductAttributes(() => {
        this.variantProductAttributes();
      });
    } else {
      this.productAttributes(this.gProduct.uuid).subscribe(
        (res) => {
          this.attributes = res.DATA;
          this.ab = res.DATA;
        },
        (error) => {
          //   this.loadingService.display(false);
        }
      );
    }
  }

  getfaq(fuuid: string): void {
    this.sharedService.getFaq(fuuid).subscribe((res) => {
      this.faq = res;
    });
  }
}
