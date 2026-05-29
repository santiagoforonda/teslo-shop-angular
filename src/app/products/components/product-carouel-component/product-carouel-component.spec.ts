import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCarouelComponent } from './product-carouel-component';

describe('ProductCarouelComponent', () => {
  let component: ProductCarouelComponent;
  let fixture: ComponentFixture<ProductCarouelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCarouelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCarouelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
