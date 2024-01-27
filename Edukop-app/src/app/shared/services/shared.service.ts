import { HttpClient } from '@angular/common/http';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import * as interfaces from '@spundan-clients/bookz-interfaces';
import { ICoupon, IReview } from '@spundan-clients/bookz-interfaces';
import { Observable } from 'rxjs';
import { IComment } from 'src/app/models/IComment.model';
import { INews } from 'src/app/models/INews.model';
import { SearchModel } from 'src/app/product-list/product-list.page';
import { SearchDataModel } from 'src/app/product-page/product-page';

// import { Product, GroupProduct } from "../models/product.model";
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';

interface Schoolrelevent {
    DATA: {
        boardStandardData: { docs: [interfaces.IProduct] };
        standardData: { docs: [interfaces.IProduct] };
    };
}

interface Boardrelevent {
    DATA: { standardData: { docs: [interfaces.IProduct] } };
}

interface VariantAndMainProduct {
        mainProduct: interfaces.IProduct,
        variants: interfaces.IVariantProduct[]
}

@Injectable({
  providedIn: "root",
})
export class SharedService {
  constructor(private http: HttpClient, public auth: AuthService) {}

  search(
    params: SearchModel | SearchDataModel,
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IProduct[]>> {
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IProduct[]>
    >(
      environment.Api +
        `/search?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      params,
      {
        headers: this.auth.headers,
      }
    );
  }

  // loadPost(
  //     params: SearchModel | SearchDataModel,
  //     paginate: interfaces.IPaginate
  // ): Observable<interfaces.IResponsePaginationGet<interfaces.INews[]>> {
  //     return this.http.post<
  //         interfaces.IResponsePaginationGet<interfaces.INews[]>
  //     >(
  //         environment.Api +
  //             `/search?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
  //         params,
  //         {
  //             headers: this.auth.headers,
  //         }
  //     );
  // }

  getProductById(
    productUUID: string
  ): Observable<
    interfaces.IProduct | interfaces.IGroupProduct | interfaces.IVariantProduct
  > {
    return this.http.get<
      | interfaces.IProduct
      | interfaces.IGroupProduct
      | interfaces.IVariantProduct
    >(environment.Api + `/productById?uuid=${productUUID}`, {
      headers: this.auth.headers,
    });
  }

  getNews(
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<INews[]>> {
    return this.http.get<interfaces.IResponsePaginationGet<INews[]>>(
      environment.Api +
        `/news?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getLikeById(news_uuid) {
    return this.http.get<any>(
      environment.Api + `/likeId?news_uuid=${news_uuid}`,
      {
        headers: this.auth.headers,
      }
    );
  }
  getCommentCount(news_uuid) {
    return this.http.get<any>(
      environment.Api + `/commentId?news_uuid=${news_uuid}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  // getCommentCount(newsUUID
  // ): Observable<interfaces.IResponsePaginationGet<interfaces.IComment[]>> {
  //     return this.http.get<
  //         interfaces.IResponsePaginationGet<interfaces.IComment[]>
  //     >(
  //         environment.Api + `/commentId?news_uuid=${newsUUID}`,
  //         {
  //             headers: this.auth.headers,
  //         }
  //     );
  // }

  getComments(
    paginate: interfaces.IPaginate,
    newsUUID
  ): Observable<interfaces.IResponsePaginationGet<IComment[]>> {
    return this.http.get<interfaces.IResponsePaginationGet<IComment[]>>(
      environment.Api +
        `/comment?news_uuid=${newsUUID}&size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getLikes(
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<interfaces.ILike[]>> {
    return this.http.get<interfaces.IResponsePaginationGet<interfaces.ILike[]>>(
      environment.Api + "/like",
      {
        headers: this.auth.headers,
      }
    );
  }

  getSchoolById(schoolUUID: string): Observable<interfaces.ISchool> {
    return this.http.get<interfaces.ISchool>(
      environment.Api + `/schoolById?uuid=${schoolUUID}`,
      {
        headers: this.auth.headers,
      }
    );
  }
  getSchoolsByIds(
    schoolUUIDs: string[]
  ): Observable<interfaces.IResponsePaginationGet<interfaces.ISchool[]>> {
    const param = {
      uuids: schoolUUIDs,
    };
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.ISchool[]>
    >(environment.Api + `/schoolsByIds`, param, {
      headers: this.auth.headers,
    });
  }

  getProductByIds(
    productUUIDs: string[]
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IProduct>> {
    const param = {
      uuids: productUUIDs,
    };
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IProduct>
    >(environment.Api + `/productsByIds`, param, {
      headers: this.auth.headers,
    });
  }

  addComment(
    param
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IComment>> {
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IComment>
    >(environment.Api + "/comment", param, {
      headers: this.auth.headers,
    });
  }

  postLike(
    news_uuid
  ): Observable<interfaces.IResponsePaginationGet<interfaces.ILike>> {
    const param = {
      uuid: news_uuid,
    };
    return this.http.post<interfaces.IResponsePaginationGet<interfaces.ILike>>(
      environment.Api + "/like",
      param,
      {
        headers: this.auth.headers,
      }
    );
  }

  getCategoryData(
    filter: string
  ): Observable<
    | interfaces.IResponsePaginationGet<
        | interfaces.IBoard[]
        | interfaces.ISchool[]
        | interfaces.ICompetition[]
        | interfaces.IUniversity[]
        | interfaces.IProduct
        | interfaces.IProduct[]
      >
    | interfaces.IProduct
  > {
    return this.http.get<
      | interfaces.IResponsePaginationGet<
          | interfaces.IBoard[]
          | interfaces.ISchool[]
          | interfaces.ICompetition[]
          | interfaces.IUniversity[]
          | interfaces.IProduct
          | interfaces.IProduct[]
        >
      | interfaces.IProduct
    >(environment.Api + "/" + filter, {
      headers: this.auth.headers,
    });
  }

  // getCategoryProduct(filter: string, uuid: string): Observable<any> {
  //     return this.http
  //         .post(
  //             environment.Api + '/' + filter,
  //             { uuid },
  //             {
  //                 headers: this.auth.headers,
  //             }
  //         )
  //         ;
  // }

  searchByCategory(
    params: string
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IAttribute[]>> {
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IAttribute[]>
    >(environment.Api + `/searchByCategory`, params, {
      headers: this.auth.headers,
    });
  }

  searchProductByCategory(
    id: string,
    sortN: number,
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IProduct[]>> {
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IProduct[]>
    >(
      environment.Api +
        `/searchProductByCategory?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      {
        uuid: id,
        sort: sortN,
      },
      {
        headers: this.auth.headers,
      }
    );
  }

  searchProductByDiscount(
    filter: string,
    sortN: number,
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IProduct[]>> {
    return this.http.get<
      interfaces.IResponsePaginationGet<interfaces.IProduct[]>
    >(
      environment.Api +
        `/${filter}&size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      // {
      //     uuid: id,
      //     sort: sortN,
      // },
      {
        headers: this.auth.headers,
      }
    );
  }

  updateRating(rating: interfaces.IRating) {
    return this.http.put<interfaces.IRating>(
      environment.Api + "/editRating",
      rating,
      {
        headers: {
          authtoken: this.auth.currentUserValue,
        },
      }
    );
  }

  updateReview(rating: interfaces.IReview) {
    return this.http.put<interfaces.IReview>(
      environment.Api + "/updateReview",
      rating,
      {
        headers: {
          authtoken: this.auth.currentUserValue,
        },
      }
    );
  }
  addRating(review) {
    return this.http.post<interfaces.IRating>(
      environment.Api + `/postRating`,
      review,
      {
        headers: {
          authtoken: this.auth.currentUserValue,
        },
      }
    );
  }

  addReview(review) {
    return this.http.post<interfaces.IReview>(
      environment.Api + `/addReview`,
      review,
      {
        headers: {
          authtoken: this.auth.currentUserValue,
        },
      }
    );
  }

  addRequest(
    request: object
  ): Observable<interfaces.IResponseGet<interfaces.IRequestProduct>> {
    return this.http.post<interfaces.IResponseGet<interfaces.IRequestProduct>>(
      environment.Api + `/request`,
      request,
      {
        headers: {
          authtoken: this.auth.currentUserValue,
        },
      }
    );
  }
  uploadRequestImage(
    formData: FormData,
    uuid: string
  ): Observable<interfaces.IRequestProduct> {
    return this.http.put<interfaces.IRequestProduct>(
      environment.Api + `/request?uuid=${uuid}`,
      formData,
      {
        headers: this.auth.imageHeaders,
      }
    );
  }

  ProductCategoryFilter(
    params: SearchModel
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IAttribute[]>> {
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IAttribute[]>
    >(environment.Api + `/api/productSyncFilters`, params, {
      headers: this.auth.headers,
    });
  }

  // releventData(params:any){
  //   return this.http
  //   .post(environment.Api + `/api/relevantOfBoard`, params, {
  //     headers: this.auth.headers,
  //   })
  // }

  releventOfSchool(
    params: SearchModel,
    paginate: interfaces.IPaginate
  ): Observable<Schoolrelevent> {
    return this.http.post<Schoolrelevent>(
      environment.Api +
        `/api/relevantOfSchool?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      params,
      {
        headers: this.auth.headers,
      }
    );
  }

  releventOfExam(
    params: SearchModel,
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IProduct[]>> {
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IProduct[]>
    >(
      environment.Api +
        `/api/relevantOfExam?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      params,
      {
        headers: this.auth.headers,
      }
    );
  }

  releventOfBoard(
    params: SearchModel,
    paginate: interfaces.IPaginate
  ): Observable<Boardrelevent> {
    return this.http.post<Boardrelevent>(
      environment.Api +
        `/api/relevantOfBoard?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      params,
      {
        headers: this.auth.headers,
      }
    );
  }

  releventOfUniversity(
    params: SearchModel,
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IProduct[]>> {
    return this.http.post<
      interfaces.IResponsePaginationGet<interfaces.IProduct[]>
    >(
      environment.Api +
        `/api/relevantOfUniversity?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      params,
      {
        headers: this.auth.headers,
      }
    );
  }

  getRatingById(uuid: string): Observable<interfaces.IRating> {
    return this.http.get<interfaces.IRating>(
      environment.Api + `/getRatingById?product_uuid=${uuid}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getRating(
    rateUUID: string
  ): Observable<interfaces.IResponseGet<interfaces.IRatingResponse>> {
    return this.http.get<interfaces.IResponseGet<interfaces.IRatingResponse>>(
      environment.Api + `/averageRatingsOfProductV2?product_uuid=${rateUUID}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getProductAttributes(
    productUUID: string
  ): Observable<interfaces.IResponseGet<interfaces.IAttribute[]>> {
    return this.http.get<interfaces.IResponseGet<interfaces.IAttribute[]>>(
      environment.Api + `/attributesOfProduct?uuid=${productUUID}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getUserInfo(): Observable<interfaces.IResponseGet<interfaces.IUser>> {
    return this.http.get<interfaces.IResponseGet<interfaces.IUser>>(
      environment.Api + `/api/userInfo`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getSearchProducts(
    searchKeyword: string,
    isFilter: boolean,
    paginateValue: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<interfaces.IProduct[]>> {
    const params = {
      search_string: searchKeyword,
    };
    return this.http.get<
      interfaces.IResponsePaginationGet<interfaces.IProduct[]>
    >(
      environment.Api +
        `/searchProductByName?search_string=${searchKeyword}&size=${paginateValue.pageSize}&page=${paginateValue.pageIndex}&isFilter=${isFilter}`,
      {
        headers: this.auth.headers,
      }
    );
  }
  getStates(): Observable<string[]> {
    return this.http.get<string[]>(environment.Api + `/api/city-states`, {
      headers: this.auth.headers,
    });
  }
  getVendor(
    uuid: string
  ): Observable<
    interfaces.IResponseGet<Array<interfaces.IVendorsListOfProduct>>
  > {
    return this.http.get<
      interfaces.IResponseGet<Array<interfaces.IVendorsListOfProduct>>
    >(environment.Api + `/vendorsListOfProduct?uuid=${uuid}`, {
      headers: this.auth.headers,
    });
  }

  getCities(name: string): Observable<interfaces.ICityAndState[]> {
    return this.http.get<interfaces.ICityAndState[]>(
      environment.Api + `/api/city?state=${name}`,
      {
        headers: this.auth.headers,
      }
    );
  }
  getCouponsByPagination(
    paginate: interfaces.IPaginate
  ): Observable<interfaces.IResponsePaginationGet<ICoupon[]>> {
    return this.http.get<interfaces.IResponsePaginationGet<ICoupon[]>>(
      environment.Api +
        `/api/coupons?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
      {
        headers: this.auth.headers,
      }
    );
  }
  getFaq(productUUID: string): Observable<interfaces.IFAQ> {
    return this.http.get<interfaces.IFAQ>(
      environment.Api + `/faq?product_uuid=${productUUID}`,
      {
        headers: this.auth.headers,
      }
    );
  }
  getreviewById(uuid: string): Observable<interfaces.IReview> {
    return this.http.get<interfaces.IReview>(
      environment.Api + `/getReviewsOfProduct?product_uuid=${uuid}`,
      {
        headers: this.auth.headers,
      }
    );
  }
  //     paginate: interfaces.IPaginate
  // ): Observable<interfaces.IResponsePaginationGet<IReview[]>> {
  //     return this.http.get<interfaces.IResponsePaginationGet<IReview[]>>(
  //         environment.Api +
  //             `/getReviewsOfProduct?size=${paginate.pageSize}&page=${paginate.pageIndex}`,
  //         {
  //             headers: this.auth.headers,
  //         }
  //     );
  // }

  addQuery(param: interfaces.ISupport): Observable<interfaces.ISupport> {
    return this.http.post<interfaces.ISupport>(
      environment.Api + `/addQuery`,
      param,
      {
        headers: this.auth.headers,
      }
    );
  }

  openPDF(pdfPath: string) {
    return this.http.get(environment.Api + `/productPDF?pdfPath=${pdfPath}`, {
      headers: this.auth.imageHeaders,
      responseType: "arraybuffer",
    });
  }

  getVariantProducts(
    productUUID: string
  ): Observable<interfaces.IResponseGet<VariantAndMainProduct>> {
    return this.http.get<interfaces.IResponseGet<VariantAndMainProduct>>(
      environment.Api + `/api/variantProducts?mainProductId=${productUUID}`,
      {
        headers: this.auth.headers,
      }
    );
  }

  getPdf(enrollmentFormId: string, myEnrollmentId: string): Observable<Blob> {
    return this.http.get(
      environment.Api +
        `/api/enrollGenerate?enrollmentFormId=${enrollmentFormId}&myEnrollmentId=${myEnrollmentId}`,
      {
        responseType: "blob",
        headers: this.auth.headers,
      }
    );
  }

  forgotPassword(data: object): Observable<any> {
    return this.http.post<any>(environment.Api + `/api/forgotPassword`, data, {
      headers: this.auth.headers,
    });
  }
}
