import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCarouelComponent } from "../../../products/components/product-carouel-component/product-carouel-component";



@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [ProductCarouelComponent],
  templateUrl: './product-page.html',
  styleUrls: ['./product-page.css'],
})
export class ProductPage {

  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductService);

  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    params: () => ({ idSlug: this.productIdSlug }),
    stream: ({ params }) => this.productService.getProductByIdSlug(params.idSlug)
  })






}
