import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductService } from '../../../products/services/products.service';
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';
import { PaginationComponent } from '../../../shared/components/pagination-component/pagination-component';
import { PaginationService } from '../../../shared/services/pagination';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent,PaginationComponent],
  templateUrl: './gender-page.html',
  styleUrl: './gender-page.css',
})
export class GenderPage {

  route = inject(ActivatedRoute);

  paginationService = inject(PaginationService);

  private readonly productsService = inject(ProductService);

  gender = toSignal(
      this.route.params.pipe(map(({gender})=> gender)
      )
  )
  productResource = rxResource({
    params: () => ({gender:this.gender(), page: this.paginationService.currentPage()-1}),
    stream: ({params}) => {
      return this.productsService.getProducts({
        gender:params.gender,
        offset:params.page*9
      });
    }
  })




}
