import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule
      ]
    }).compileComponents();
  }));

  describe('constructor', () => {
    it('should create the app', () => {
      const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
      const app: AppComponent = fixture.debugElement.componentInstance;
      expect(app).toBeDefined();
    });
  });

  describe('startTimer', () => {
    it('should ', () => {
    });
  });

  describe('pause', () => {
    it('should ', () => {
    });
  });

  describe('quit', () => {
    it('should ', () => {
    });
  });

  describe('clearFib', () => {
    it('should ', () => {
    });
  });

  describe('addInput', () => {
    it('should ', () => {
    });
  });

  describe('isFibonacci', () => {
    it('should ', () => {
    });
  });

  describe('updateSummary', () => {
    it('should ', () => {
    });
  });

  describe('startRefreshTimer', () => {
    it('should ', () => {
    });
  });

  describe('stopRefreshTimer', () => {
    it('should ', () => {
    });
  });
});
