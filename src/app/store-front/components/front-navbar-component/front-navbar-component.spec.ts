import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontNavbarComponent } from './front-navbar-component';

describe('FrontNavbarComponent', () => {
  let component: FrontNavbarComponent;
  let fixture: ComponentFixture<FrontNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontNavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
