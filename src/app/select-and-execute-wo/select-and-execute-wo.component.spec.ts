import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAndExecuteWOComponent } from './select-and-execute-wo.component';

describe('SelectAndExecuteWOComponent', () => {
  let component: SelectAndExecuteWOComponent;
  let fixture: ComponentFixture<SelectAndExecuteWOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectAndExecuteWOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectAndExecuteWOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
