import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductService } from '../../../products/services/products.service';
import { ProductCardComponent } from '../../components/product-card-component/product-card-component';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.html',
  styleUrl: './gender-page.css',
})
export class GenderPage {

  route = inject(ActivatedRoute);

  private readonly productsService = inject(ProductService);

  gender = toSignal(
      this.route.params.pipe(map(({gender})=> gender)
      )
  )
  productResource = rxResource({
    params: () => ({gender:this.gender()}),
    stream: ({params}) => {
      return this.productsService.getProducts({
        gender:params.gender
      });
    }
  })




}
