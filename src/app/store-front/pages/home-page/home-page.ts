import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from "../../components/product-card-component/product-card-component";
import { ProductService } from '../../../products/services/products.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

  private readonly productsService = inject(ProductService);

  productResource = rxResource({
    params: () => ({}),
    stream: () => {
      return this.productsService.getProducts({});
    }
  })
}
