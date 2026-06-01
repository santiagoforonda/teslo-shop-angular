import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarouelComponent } from '../../../../products/components/product-carouel-component/product-carouel-component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label-component/form-error-label-component";
import { ProductService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details-component',
  imports: [ProductCarouelComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details-component.html',
  styleUrl: './product-details-component.css',
})
export class ProductDetailsComponent implements OnInit{


  product = input.required<Product>();
  productService = inject(ProductService);
  fb=inject(FormBuilder);
  router=inject(Router);
  wasSave = signal(false);
  tempImages = signal<string[]>([]);
  imageFileList:FileList|undefined = undefined;
  imagesToCarousel = computed(()=>{
    const currentProductImages = [...this.product().images,...this.tempImages()]

    return currentProductImages;
  })

  productForm = this.fb.group({
    title:["",Validators.required],
    description:["",Validators.required],
    slug:["",[Validators.required,Validators.pattern(FormUtils.slugPattern)]],
    price:[0,[Validators.required,Validators.min(0)]],
    stock:[0,[Validators.required,Validators.min(0)]],
    sizes:[[""]],
    images:[[]],
    tags:[""],
    gender:["men",[Validators.required,Validators.pattern(/men|women|kid|unisex/)]]
  })

  sizes = ["XS","S","M","L","XL","XXL"];


   async onSubmit(){
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if(!isValid) return;

    const formValue = this.productForm.value;
    const productLike:Partial<Product> = {
      ...(formValue as any),
      tags:formValue.tags?.toLowerCase().split(",").map(tag => tag.trim()) ?? [],
    };

    if(this.product().id === "new"){
      const producto = await firstValueFrom(
        this.productService.crearProducto(productLike, this.imageFileList)
      )

      this.router.navigate(["/admin/products", producto.id]);
    }else{


      const producto = await firstValueFrom(
        this.productService.updateProduct(productLike,this.product().id, this.imageFileList)
      )

      this.router.navigate(["/admin/products",producto.id]);
    }

    this.wasSave.set(true);
    setTimeout(()=>{
this.wasSave.set(false);
    },3000)
  }

  setFormValue(formLike:Partial<Product>){
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({tags:formLike.tags?.join(",")});
  }

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  onSizeClicked(size:string){
    const currentSizes =this.productForm.value.sizes ?? [];

    if(currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size),1);
    }else{
      currentSizes.push(size);
    }

    this.productForm.patchValue({sizes:currentSizes});
  }

  onFileCahnged(event:Event){
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList=fileList ?? undefined;
    const imageUrls = Array.from(fileList ?? []).map((file)=>
      URL.createObjectURL(file)
    )

    this.tempImages.set(imageUrls);


  }
}
