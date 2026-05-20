import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginRegisterComponent } from './login-register.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginRegisterComponent', () => {
  let component: LoginRegisterComponent;
  let fixture: ComponentFixture<LoginRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginRegisterComponent, // ✅ standalone component
        HttpClientTestingModule // ✅ mock HTTP
      ],
      providers: [
        provideRouter([]) // ✅ mock router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
