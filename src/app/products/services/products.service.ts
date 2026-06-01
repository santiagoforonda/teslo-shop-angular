import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Gender, Product, ProductResponse } from "../interfaces/product.interface";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
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

  updateProduct(productLike:Partial<Product>, id:string,imageFileList?:FileList):Observable<Product>{

    const currentImages = productLike.images ?? [];

    return this.upLoadImages(imageFileList).pipe(
        map(imageNames =>({
          ...productLike,
          images:[...currentImages,...imageNames]
        })),
        switchMap((updatedProduct)=>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike))
    )
    /*return this.http.patch<Product>(`${baseUrl}/products/${id}`,{
      productLike
    })*/
  }


  crearProducto(productLike:Partial<Product>, imageFileList?:FileList):Observable<Product>{
    return this.http.post<Product>(`${baseUrl}/products`,productLike);
  }

  upLoadImages(images?:FileList):Observable<string[]>{
    if(!images){
      return of([]);
    }

    const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

    return forkJoin(uploadObservables);

  }

  uploadImage(iamge:File):Observable<string>{
    const formData = new FormData();
    formData.append("file",iamge);

    return this.http.post<{fileName:string}>(`${baseUrl}/files/product`,formData).pipe(
      map(resp => resp.fileName)
    );
  }
}
