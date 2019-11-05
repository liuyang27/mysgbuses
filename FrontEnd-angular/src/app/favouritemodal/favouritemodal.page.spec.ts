import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritemodalPage } from './favouritemodal.page';

describe('FavouritemodalPage', () => {
  let component: FavouritemodalPage;
  let fixture: ComponentFixture<FavouritemodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouritemodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritemodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
