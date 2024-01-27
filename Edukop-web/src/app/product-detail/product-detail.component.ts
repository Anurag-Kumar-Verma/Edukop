import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProductReviewFormComponent } from '../forms/product-review-form/product-review-form.component';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { IAttributeValues } from '@spundan-clients/bookz-interfaces';
import { SharedService } from '../shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from '../services/cart.service';
import { environment } from 'src/environments/environment';
import { IAttribute, IProduct, IVariantProduct } from '../model/product.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { CartStateService } from '../shared/states/cart.state';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { WishlistService } from '../services/wishlist.service';
import { IAddOrder, IOrder } from '../model/IOrder.model';
import { UUID } from 'angular2-uuid';
import { CartAddProduct, CartProduct } from '../model/cart.model';
import { ICoupon } from '../model/ICoupon.model';


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
  variantProduct?: interfaces.IProduct;
}

export interface VariantAndMainProduct {
  mainProduct: interfaces.IProduct;
  variants: interfaces.IVariantProduct[];
}

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  productSum: number = 0;
  showCart: boolean = false;
  productType: string = "";
  uuid: string = "";
  subuuid: string = "";
  productId: string = "";
  vendorInfo!: Array<interfaces.IVendorInventory>;
  Suggestedproduct: any[] = [];
  quantityArray: number[][] = [];
  additionalValue: string[] = ["more"];
  gProduct!: IProduct;
  productList: any[] = [];
  selectedArray: interfaces.ICartProduct[] = [];
  cartProduct: interfaces.ICartProduct[] = [];
  attributes: IAttribute[] = [];
  wishListData!: interfaces.IWishlist;
  wishlistProductIds: string[] = [];
  wishList: WishlistData[] = [];
  faqList: interfaces.IQNA[] = [];
  pageNumber: number = 1;
  gProductSet: number = 1;
  cartBadge!: number;
  totalSellingPrice!: number;
  readMore: boolean = false;
  readMoreShort: boolean = false;
  isGroupProduct: boolean = true;
  isGrouped: boolean = false;
  isInCart: boolean = false;
  imageApi: string = "";
  selectVendorProduct: any;
  searchData!: SearchDataModel;
  filter: string = "";
  averageRate!: interfaces.IRatingResponse;
  sortedRating: any;
  isVariantProduct: boolean = false;

  commonAttributeProducts: IProduct[] = [];
  attributesToShowForVariant: {
    attributeName: string;
    attribute_Id: string;
    attributeValues: IAttributeValues[];
  }[] = [];
  activatedImage: number = 0;
  sliderTimer: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    public cartService: CartService,
    private spinner: NgxSpinnerService,
    public toaster: ToastrService,
    public authService: AuthService,
    public cartStateService: CartStateService,
    public wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.activatedImage = 0;
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.productId = JSON.parse(params?.["product"]);
        if (JSON.parse(params?.["filter"]) != null) {
          this.filter = JSON.parse(params?.["filter"]);
        }
        if (JSON.parse(params?.["type"]) != null) {
          this.productType = JSON.parse(params?.["type"]);
        }
        this.getVender(this.productId);
      }
    });
    this.imageApi = environment.imageApi;
    this.getWishList();
  }

  getVender(productUUID: string): void {
    this.spinner.show();

    this.setVendor(productUUID);
    this.sharedService.getVendor(productUUID).subscribe(
      (response) => {
        this.vendorInfo = response.DATA;
        this.selectVendorProduct = this.vendorInfo[0];
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getproductList(searchData: SearchDataModel): void {
    const paginate: interfaces.IPaginate = {
      pageSize: 10,
      pageIndex: 1,
    };
    this.Suggestedproduct = [];

    this.sharedService.search(searchData, paginate).subscribe((response) => {
      if (response.DATA.docs.length) {
        for (let i = 0; i < response.DATA.docs.length; i++) {
          this.Suggestedproduct.push(response.DATA.docs[i]);
        }
      }
    });
  }

  setVendor(productUUID: string): void {
    this.uuid = productUUID;
    this.productState();
    this.getCarts();
    // this.getfaq(this.uuid);
    this.getRating(productUUID);
  }

  productState(): void {
    // this.getProduct(this.productId);
    this.getFAQs(this.productId);

    // if(this.productType == 'Product'){
    this.sectionProduct(this.filter);
    // }

    let searchData: SearchDataModel;

    searchData = {
      uuid: this.productId,
      sub_uuid: this.subuuid,
    };

    this.getproductList(searchData);
  }

  getProduct(productUUID: string): void {
    this.spinner.show();
    this.sharedService.getProductById(productUUID).subscribe(
      (res) => {
        console.log(res.images?.length)
        if (res.images?.length == 0) {
          if (res.mainProductId) {
            this.sharedService.getProductById(res.mainProductId).subscribe((e: any) => {
              if (e.images)
                res.images = e.images;
            })
          }
        }
        this.gProduct = res as IProduct;
        this.selectedArray = [];

        this.productList = [];
        this.isGrouped = this.gProduct.is_grouped;

        if (this.isGrouped) {
          this.productList = this.gProduct.products;
          let list = this.productList;
          list.map((a: any, i: number) => {
            a.product.quantity = a.quantity
            this.selectProduct(true, a.product);
            this.quantityArrayMethod(i);
          });
        } else {
          this.selectProduct(true, this.gProduct);
          this.quantityArrayMethod(0);
        }

        // if(this.gProduct.isDigital == false){
        //   this.getProductAttributes();
        // }

        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getFAQs(uuid: string) {
    this.spinner.show();
    this.sharedService.getFaq(uuid).subscribe(
      (res) => {
        if (res && res.faqs.length > 0) {
          for (let i in res.faqs) {
            this.faqList.push(res.faqs[i]);
          }

          if (this.faqList.length > 5) {
            this.faqList.length = 5;
          }
        }
        this.spinner.show();
      },
      (error) => {
        this.spinner.show();
      }
    );
  }

  calculateOfferPercentage(mrp: number, sellingPrice: number): string | number {
    return sellingPrice > mrp
      ? 0
      : (((mrp - sellingPrice) / mrp) * 100).toFixed();
  }

  getAttributeAndValue(
    product: IProduct,
    singleSelectAttributesInMain: IAttribute[]
  ): any[] {
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
        if (detail) {
          return {
            attributeId: filterAttributes.attribute_Id,
            attributeValue: detail.attributeValues.find((aV) =>
              filterAttributes.attribute_value_Id.includes(aV.attributeValue)
            ),
          };
        } else {
          return;
        }
      });
  }

  getRating(uuid: string): void {
    this.spinner.show();
    this.sharedService.getRating(uuid).subscribe(
      (res) => {
        this.averageRate = res.DATA;
        this.sortedRating = this.averageRate.ratings.sort((a, b) => {
          return b._id - a._id;
        });
        this.spinner.hide();
      },
      (error) => {
        this.averageRate = undefined as any;
        this.sortedRating = [];
        this.spinner.hide();
      }
    );
  }

  getCarts(): void {
    this.cartProduct = [];
    let cartProductArray: interfaces.ICartProduct[] = [];
    this.spinner.show();
    this.cartService.getCart().subscribe(
      (res) => {
        this.cartProduct = [];

        if (res.DATA) {
          this.getproductList(this.searchData);

          if (res.DATA.products) {
            for (let i in res.DATA.products) {
              cartProductArray.push(res.DATA.products[i]);
            }

            cartProductArray.filter((item, index) => {
              if (item.productUUID === this.productId) {
                this.isInCart = true;
              } else {
                this.isInCart = false;
              }
            });

            this.cartState();
          }
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  suggestedProductPage(uuid: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(uuid),
        filter: JSON.stringify("productById?uuid=" + uuid),
        type: JSON.stringify("Product"),
      },
    };

    // this.router.navigate([`/product-detail/${Math.random()}`], navigationExtras);
    // this.router.navigate(['/product-page/' + Math.random()], navigationExtras);
    let url2 = `/product-detail/${Math.random()}?product=%22${uuid}%22&filter=%22productById%3Fuuid%3D${uuid}%22&type=%22Product%22`;
    window.location.replace(url2);
    this.ngOnInit();
  }

  addCart(): void {
    if (this.cartProduct.length && this.isGroupProduct) {
      this.router.navigateByUrl("/my-cart");
      return;
    } else if (this.isInCart) {
      this.router.navigateByUrl("/my-cart");
    } else {
      const cartProductArray: interfaces.ICartProduct[] = [];
      let cart: any;
      if (this.isGroupProduct && this.isGrouped) {
        cart = {
          productUUID: this.gProduct.uuid,
          quantity: 1,
          vendorId: this.selectVendorProduct.vendorId,
        };

        if (this.gProductSet < 1) {
          this.toaster.error("Quantity can't be less than 1");
          return;
        }
        cartProductArray.push(cart);
        this.isInCart = true;
      } else {
        this.selectedArray.forEach((product) => {
          const prodt: interfaces.ICartProduct = {
            productUUID: product.productUUID,
            quantity: product.quantity,
            vendorId: this.selectVendorProduct.vendorId,
          };
          cartProductArray.push(prodt);
        });
        this.toaster.success(
          "Product added in the cart. Go can see it in cart."
        );
      }

      cart = {
        products: cartProductArray,
      };

      this.spinner.show();
      this.cartService.addCart(cart).subscribe(
        (res) => {
          if (res) {
            // console.log(this.cartBadge);
            // console.log(cartProductArray);
            this.cartBadge += cartProductArray.length;
            this.cartStateService.setCartState(this.cartBadge);
            // console.log(this.cartBadge);
            this.cartState();
            this.getCarts();
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cartState() {
    this.cartStateService.getCartState().subscribe((res) => {
      this.cartBadge = res;
    });
  }

  sectionProduct(filter: string): void {
    this.spinner.show();
    this.sharedService.getCategoryData(filter).subscribe(
      (res: any) => {
        res = res as IVariantProduct;
        if (res.images?.length == 0) {
          if (res.mainProductId) {
            this.sharedService.getProductById(res.mainProductId).subscribe((e: any) => {
              if (e.images)
                res.images = e.images;
            })
          }
        }

        this.activatedImage = 0;
        this.gProduct = res as IVariantProduct;
        if (this.gProduct.images.length > 1) {
          this.startSliderImage(this.gProduct.images);
        }
        this.getProductAttributes();

        if (res === null) {
          this.toaster.error("No Data Found");
          history.back();
          return;
        }
        this.isGrouped = res.is_grouped as any;
        if (this.isGrouped === true) {
          this.gProduct = res as IProduct;
          this.productList = this.gProduct.products;

          this.productList.map((a: any, i: number) => {
            a.product.quantity = a.quantity
            this.selectProduct(true, a.product);
            this.quantityArrayMethod(i);
          });
        } else {
          const a: any[] = [];
          a.push(res);
          this.productList = a;
          this.selectProduct(true, a[0]);
          this.quantityArrayMethod(0);
        }
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
  startSliderImage(arrayName: string[]) {
    clearInterval(this.sliderTimer);
    this.sliderTimer = setInterval(() => {
      this.activatedImage++;
      if (this.activatedImage === arrayName.length) {
        this.activatedImage = 0;
      }
    }, 9000);
  }

  changeSlide(action: string, arrayname: string[]) {
    clearInterval(this.sliderTimer);
    if (this.activatedImage < (arrayname.length)) {
      if (action === "prev") {
        if (this.activatedImage === 0) {
          this.activatedImage = arrayname.length - 1;
        } else {
          this.activatedImage -= 1
        }
      } else if (action === "next") {
        if (this.activatedImage === arrayname.length - 1) {
          this.activatedImage = 0;
        } else {
          this.activatedImage += 1;
        }
      }
      this.startSliderImage(arrayname);
    }
  }

  getProductAttributes(): void {
    this.attributes = [];
    if ((this.gProduct as any).isVariant) {
      this.getMainProductAttributes(() => {
        this.variantProductAttributes();
      });
    } else {
      this.sharedService.getProductAttributes(this.gProduct.uuid).subscribe(
        (res) => {
          for (let i = 0; i < res.DATA.length; i++) {
            this.attributes.push(res.DATA[i] as any);
          }
        },
        (error) => { }
      );
    }
  }

  getMainProductAttributes(cb: any): void {
    this.attributes = [];
    this.sharedService
      .getProductAttributes((this.gProduct as IVariantProduct).mainProductId)
      .subscribe(
        (res) => {
          for (let i = 0; i < res.DATA.length; i++) {
            this.attributes.push(res.DATA[i] as any);
          }
          cb();
        },
        (error) => { }
      );
  }

  variantProductAttributes(): void {
    this.sharedService
      .getProductAttributes(this.gProduct.uuid)
      .subscribe((response) => {
        response.DATA.forEach((attribute) => {
          const index = this.attributes.findIndex(
            (att) => att.attributeUUID === attribute.attributeUUID
          );
          if (index === -1) {
            this.attributes.push(attribute as any);
          } else {
            this.attributes[index] = attribute as any;
          }
        });
      });
  }

  selectProduct(event: boolean, product: IProduct | any): void {
    let productDetails: any;
    this.selectVendorProduct = this.vendorInfo ? this.vendorInfo[0] : "";
    if (event === true) {
      if (!this.isGrouped) {
        productDetails = {
          productUUID: product.uuid,
          quantity: product.quantity || 1,
          mrp: product.mrp,
          sellingPrice: product.sellingprice,
          vendorId: product.vendorId,
        };
      } else {
        productDetails = {
          productUUID: product.uuid,
          quantity: product.quantity || 1,
          mrp: product.mrp,
          sellingPrice: product.sellingprice,
          vendorId: product.vendorId,
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
  }

  isChecked(product: IProduct, i: number): boolean {
    return this.selectedArray.some((val) => val.productUUID === product.uuid);
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

  onChangeQuantity(value: number | string, uuid: string, i: number): void {
    if (value > 0 && value !== "more") {
      this.selectedArray.forEach((a) => {
        if (a.productUUID === uuid) {
          this.gProductSet = Number(value);
          a.quantity = Number(value);
        }
      });
      this.calculatePrice();
    } else {
      // this.quantityModal(i).catch();
    }
  }

  calculatePrice(): void {
    this.productSum = 0;
    this.totalSellingPrice = 0;
    this.selectedArray.map((a) => {
      if (a.sellingPrice && a.mrp) {
        this.totalSellingPrice += a.sellingPrice * a.quantity;
        this.productSum += a.mrp * a.quantity;
      }
    });
  }

  toggle(event: MatSlideToggleChange) {
    this.isGroupProduct = event.checked;
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

  addWishList(uuids: string, actions: string): void {
    this.spinner.show();
    const products = [];

    products.push({ productUUID: uuids });

    const wishlistParams = {
      products,
    };

    if (this.authService.currentGuestUserValue) {
      this.spinner.hide();
      this.wishList.push({ uuid: uuids, action: actions });
      this.router.navigateByUrl("/side/wishlist/" + Math.random()).catch();
      return;
    }

    this.wishlistService.addWishList(wishlistParams).subscribe((res) => {
      if (res) {
        if (actions === "add") {
          this.toaster.success("Product is added to wishlist");
        } else if (actions === "remove") {
          this.toaster.success("Product is removed from wishlist");
        }
        this.getWishList();
        this.spinner.hide();
      }
    });
  }

  cartBtn() {
    this.router.navigateByUrl("/my-cart");
  }
  allReviews() {
    this.router.navigateByUrl("/product-review");
  }
  rateProduct(product: IProduct): void {
    const dialogRef = this.dialog.open(ProductReviewFormComponent, {
      data: { product: product },
      width: "600px",
      panelClass: "write-review-modal",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status === "success") {
        this.getRating(this.gProduct.uuid);
      }
    });
  }

  showCartBtn() {
    this.showCart = true;
  }

  BuyNow() {
    this.spinner.show();
    const cartProductArray: CartAddProduct[] = [];
    let cart: IAddOrder;

    if (this.isGroupProduct) {
      const prodt: CartAddProduct = {
        productUUID: this.gProduct.uuid,
        quantity: this.gProductSet,
        product: this.gProduct,
        vendorId: this.selectVendorProduct.vendorId,
      };

      if (this.gProductSet < 1) {
        this.toaster.error("Quantity can't be less than 1");
        return;
      }

      cartProductArray.push(prodt);
    } else {
      this.selectedArray.forEach((product) => {
        const prodt: CartAddProduct = {
          productUUID: product.productUUID,
          quantity: product.quantity,
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
      totalMrp: null as any,
      discount: null as any,
      applied_coupon: {} as ICoupon,
    };

    this.cartService.placeOrder(cart).subscribe(
      (res) => {
        if (res.DATA != null) {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              orderId: JSON.stringify(res.DATA.uuid),
              previousRoute: JSON.stringify("productDetail"),
            },
          };

          this.router.navigate([`/buy-now`], navigationExtras);

          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  allFaqs() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        productId: JSON.stringify(this.productId),
      },
    };

    this.router.navigate([`/faqs/${this.productId}`]);
  }
}
