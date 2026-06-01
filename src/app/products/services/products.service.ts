import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Gender, Product, ProductResponse } from "../interfaces/product.interface";
import { Observable, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";


const baseUrl = environment.baseUrl;

interface Options{
  limit?: number;
  offset?:number;
  gender?:string;
}

const emptyProduct:Product={
  id: "new",
  title: "",
  price: 0,
  description: "",
  slug: "",
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  images: [],
  tags: [],
  user: []
}

@Injectable({providedIn:"root"})
export class ProductService{

  private readonly http = inject(HttpClient);

  getProducts(options:Options):Observable<ProductResponse>{

    const {limit=9,offset=0,gender=""}  = options;

    return this.http.get<ProductResponse>(`${baseUrl}/products`,{
      params:{
        limit:limit,
        offset:offset,
        gender:gender
      }
    })
  }


  getProductByIdSlug(idSlug:string):Observable<Product>{
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`);
  }

  getProductById(id:string):Observable<Product>{
    if(id === "new"){
      return of(emptyProduct);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`);
  }

  updateProduct(productLike:Partial<Product>, id:string):Observable<Product>{
    return this.http.patch<Product>(`${baseUrl}/products/${id}`,{
      productLike
    })
  }


  crearProducto(productLike:Partial<Product>):Observable<Product>{
    return this.http.post<Product>(`${baseUrl}/products`,productLike);
  }
}
