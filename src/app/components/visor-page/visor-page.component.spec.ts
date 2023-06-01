import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorPageComponent } from './visor-page.component';

describe('VisorPageComponent', () => {
  let component: VisorPageComponent;
  let fixture: ComponentFixture<VisorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
