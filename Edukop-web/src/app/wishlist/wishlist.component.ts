import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import * as interfaces from "@spundan-clients/bookz-interfaces";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { CartProduct } from "../model/cart.model";
import { IProduct } from "../model/product.model";
import { CartService } from "../services/cart.service";
import { WishlistService } from "../services/wishlist.service";
import { CartStateService } from "../shared/states/cart.state";
import { WishlistProduct } from "./model/wishlist.model";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.scss"],
})
export class WishlistComponent implements OnInit {
  rate: number = 3;
  wishList: WishlistProduct[] = [];
  cartProducts: CartProduct[] = [];
  productList: interfaces.ICartProduct[] = [];
  imageApi: string = "";
  cartBadge!: number;

  constructor(
    public wishlistService: WishlistService,
    public cartService: CartService,
    public cartStateService: CartStateService,
    public toastService: ToastrService,
    private spinner: NgxSpinnerService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.imageApi = environment.thumbApi;
    this.getWishList();
    this.getCarts();
  }

  viewDetail(event: Event, productId: string) {
    event.stopPropagation();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(productId),
        filter: JSON.stringify('productById?uuid='+productId),
        type: JSON.stringify('Product')
      }
    }
    
    this.router.navigate([`/product-detail/${Math.random()}`], navigationExtras);
  }

  calculateOfferPercentage(mrp: number, sellingPrice: number): string | number {
    return sellingPrice > mrp
      ? 0
      : (((mrp - sellingPrice) / mrp) * 100).toFixed();
  }


  addWishList(event: Event, uuid: string): void {
    event.stopPropagation();
    const product: interfaces.IWishlistProduct[] = [];
    product.push({ productUUID: uuid });

    const wishListParams: interfaces.IWishlist = {
      products: product,
    };
    this.wishlistService.addWishList(wishListParams).subscribe((res) => {
      if (res) {
        this.toastService.success("Product is removed from wishlist");
        this.wishList = [];
        this.getWishList();
      }
    });
  }

  getWishList(): void {
    this.spinner.show();
    this.wishlistService.getWishList().subscribe(
      (res) => {
        if (res) {
          if (res.DATA) {
            for(let i in res.DATA.products) {
              this.wishList.push(res.DATA.products[i]);
            }
          }
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getCarts(): void {
    this.cartProducts = [];
    this.spinner.show();
    this.cartService.getCart().subscribe(
      (res) => {
        if (res.DATA) {
          this.productList = res.DATA.products as interfaces.ICartProduct[];
          this.cartStateService.setCartState(this.productList.length);
          this.cartBadge = res.DATA.products?.length as number;
          
          if (res.DATA.products) {
            res.DATA.products.map((p: interfaces.ICartProduct, i: number) => {
              const cart = {
                productUUID: p.productUUID,
                quantity: p.quantity,
                product: p.product,
                vendorDetail: p.vendorDetail,
                vendorProduct: p.inventory,
                vendorId: p.vendorId,
              } as CartProduct;
              this.cartProducts.push(cart);
            });
          }
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  addToCart(event: Event, product: IProduct) {
    event.stopPropagation();
    this.cartProducts = [];

    const productDetails: interfaces.ICartProduct = {
      productUUID: product.uuid,
      quantity: 1,
      sellingPrice: product.sellingprice,
      mrp: product.mrp,
      vendorId: product.vendorId,
    };
    
    this.cartProducts.push(productDetails as any);
    this.addCart();
  }

  addCart() {
    this.spinner.show();
    const cartProductArray: interfaces.ICartProduct[] = [];
    let cart: interfaces.ICart;

    this.cartProducts.forEach((product) => {
      const prodt: interfaces.ICartProduct = {
        mrp: product.mrp,
        productUUID: product.productUUID,
        quantity: product.quantity,
        sellingPrice: product.sellingPrice,
        vendorId: product.vendorId,
      };
      cartProductArray.push(prodt);
    });

    cart = {
      products: cartProductArray,
    };

    this.cartService.addCart(cart).subscribe(
      (res) => {
        if (res) {
          this.cartStateService.setCartState(this.cartBadge++);
          this.getCarts();
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  isInCart(uuid: string): boolean {
    const inCart = this.cartProducts.find((item, index) => item.productUUID === uuid);
    if(inCart) {
      return true;
    } else {
      return false;
    }
  }
  
}
