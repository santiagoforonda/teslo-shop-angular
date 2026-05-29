import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from "../../components/product-card-component/product-card-component";
import { ProductService } from '../../../products/services/products.service';
import { PaginationComponent } from "../../../shared/components/pagination-component/pagination-component";
import { PaginationService } from '../../../shared/services/pagination';


@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

  private readonly productsService = inject(ProductService);

paginationService = inject(PaginationService);

  productResource = rxResource({
    params: () => ({page: this.paginationService.currentPage() -1}),
    stream: ({params}) => {
      return this.productsService.getProducts({
        offset: params.page * 9
      });
    }
  })
}
