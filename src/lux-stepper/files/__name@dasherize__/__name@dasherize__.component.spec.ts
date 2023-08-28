import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LuxActionModule, LuxCommonModule, LuxIconModule, LuxLayoutModule } from '@ihk-gfi/lux-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('<%= classify(name) %>Component', () => {
  let component: <%= classify(name) %>Component;
  let fixture: ComponentFixture<<%= classify(name) %>Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ <%= classify(name) %>Component ],
      imports: [
        BrowserTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule, LuxLayoutModule, LuxCommonModule, LuxIconModule, LuxActionModule
      ]
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
