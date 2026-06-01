import { Component, inject, signal } from '@angular/core';
import { ProductsTableComponent } from "../../../products/components/products-table-component/products-table-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../products/services/products.service';
import { PaginationService } from '../../../shared/services/pagination';
import { PaginationComponent } from "../../../shared/components/pagination-component/pagination-component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.html',
  styleUrl: './products-admin-page.css',
})
export class ProductsAdminPage {

  private readonly productsService = inject(ProductService);

  paginationService = inject(PaginationService);

  productPerPage = signal(10);

  productResource = rxResource({
    params: () => ({page: this.paginationService.currentPage() -1, limit:this.productPerPage()}),
    stream: ({params}) => {
      return this.productsService.getProducts({
        offset: params.page * 9,
        limit:params.limit
      });
    }
  })
}
