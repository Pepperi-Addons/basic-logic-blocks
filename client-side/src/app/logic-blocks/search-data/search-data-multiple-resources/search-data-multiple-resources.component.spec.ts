import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDataMultipleResourcesLogicBlockComponent } from './search-data-multiple-resources.component';

describe('SearchDataMultipleResourcesComponent', () => {
  let component: SearchDataMultipleResourcesLogicBlockComponent;
  let fixture: ComponentFixture<SearchDataMultipleResourcesLogicBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchDataMultipleResourcesLogicBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDataMultipleResourcesLogicBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
