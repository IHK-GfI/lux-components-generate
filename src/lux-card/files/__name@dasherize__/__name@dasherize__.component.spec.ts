import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';
import { LuxActionModule, LuxCommonModule, LuxIconModule, LuxLayoutModule } from '@ihk-gfi/lux-components';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('<%= classify(name) %>Component', () => {
  let component: <%= classify(name) %>Component;
  let fixture: ComponentFixture<<%= classify(name) %>Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ <%= classify(name) %>Component ],
      imports: [HttpClientTestingModule, LuxLayoutModule, LuxCommonModule, LuxIconModule, LuxActionModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(<%= classify(name) %>Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
