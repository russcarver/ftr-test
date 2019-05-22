import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { noop } from 'rxjs';
import { AppComponent } from './app.component';
import Spy = jasmine.Spy;

describe('AppComponent', () => {
  let app: AppComponent;

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
      app = fixture.debugElement.componentInstance;
      expect(app).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    it('should clean up the refresh timer ', () => {
      const stopSpy: Spy = spyOn((<any>app), 'stopRefreshTimer');
      app.ngOnDestroy();
      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('startTimer', () => {
    it('should reset the variables and start the timer', () => {
      const startSpy: Spy = spyOn((<any>app), 'startRefreshTimer');
      app.startTimer();
      expect(app.showDoneMessage).toBeFalsy();
      expect(app.summary).toBe('');
      expect((<any>app).userInputs).toEqual({});
      expect(app.started).toBeTruthy();
      expect(app.running).toBeTruthy();
      expect(startSpy).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('should resume', () => {
      app.running = false;
      app.summary = 'foobar';
      const startSpy: Spy = spyOn((<any>app), 'startRefreshTimer');
      const stopSpy: Spy = spyOn((<any>app), 'stopRefreshTimer');
      app.pause();
      expect(app.running).toBeTruthy();
      expect(app.showFib).toBeFalsy();
      expect(app.pauseButtonText).toBe('Halt');
      expect(stopSpy).not.toHaveBeenCalled();
      expect(app.summary).toBe('foobar');
      expect(startSpy).toHaveBeenCalled();
    });

    it('should halt', () => {
      app.running = true;
      const startSpy: Spy = spyOn((<any>app), 'startRefreshTimer');
      const stopSpy: Spy = spyOn((<any>app), 'stopRefreshTimer');
      app.pause();
      expect(app.running).toBeFalsy();
      expect(app.showFib).toBeFalsy();
      expect(app.pauseButtonText).toBe('Resume');
      expect(stopSpy).toHaveBeenCalled();
      expect(app.summary).toBe('');
      expect(startSpy).not.toHaveBeenCalled();
    });
  });

  describe('quit', () => {
    it('should stop the timer', () => {
      app.started = true;
      app.showFib = true;
      const stopSpy: Spy = spyOn((<any>app), 'stopRefreshTimer');
      const updateSpy: Spy = spyOn((<any>app), 'updateSummary');
      app.quit();
      expect(app.started).toBeFalsy();
      expect(app.showFib).toBeFalsy();
      expect(app.showDoneMessage).toBeTruthy();
      expect(stopSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('clearFib', () => {
    it('should clear the fibonacci label', () => {
      app.showFib = true;
      app.clearFib();
      expect(app.showFib).toBeFalsy();
    });
  });

  describe('addInput', () => {
    let fibSpy: Spy;

    beforeEach(() => {
      app.userInput = {
        nativeElement: {
          value: '1'
        }
      };
      (<any>app).userInputs = {};
      fibSpy = spyOn((<any>app), 'isFibonacci').and.callThrough();
    });

    it('should reset the error', () => {
      app.error = 'Error';
      (<any>app).addInput();
      expect(app.error).toBeUndefined();
    });

    it('should reset user input when done', () => {
      app.error = 'Error';
      (<any>app).addInput();
      expect(app.userInput.nativeElement.value).toBe('');
    });

    it('should create an error when the interval value is not a number', () => {
      app.userInput.nativeElement.value = 'a';
      (<any>app).addInput();
      expect(app.error).toBe('Value must be greater than zero');
      expect(fibSpy).not.toHaveBeenCalled();
      expect(app.showFib).toBeFalsy();
    });

    it('should create an error when the interval value is less than zero', () => {
      app.userInput.nativeElement.value = '-1';
      (<any>app).addInput();
      expect(app.error).toBe('Value must be greater than zero');
      expect(fibSpy).not.toHaveBeenCalled();
      expect(app.showFib).toBeFalsy();
    });

    it('should create an error when the interval value is zero', () => {
      app.userInput.nativeElement.value = '0';
      (<any>app).addInput();
      expect(app.error).toBe('Value must be greater than zero');
      expect(fibSpy).not.toHaveBeenCalled();
      expect(app.showFib).toBeFalsy();
    });

    it('should enable the FIB label when the interval value is a Fibonacci number', () => {
      app.userInput.nativeElement.value = '1';
      (<any>app).addInput();
      expect(fibSpy).toHaveBeenCalled();
      expect(app.showFib).toBeTruthy();
    });

    it('should not enable the FIB label when the interval value is not a Fibonacci number', () => {
      app.userInput.nativeElement.value = '4';
      (<any>app).addInput();
      expect(fibSpy).toHaveBeenCalled();
      expect(app.showFib).toBeFalsy();
    });

    it('should set the hash map value to 1 when it has never been set', () => {
      app.userInput.nativeElement.value = '5';
      (<any>app).addInput();
      expect((<any>app).userInputs[5]).toBe(1);
    });

    it('should increment the hash map value when it is already in the map', () => {
      app.userInput.nativeElement.value = '5';
      (<any>app).addInput();
      expect((<any>app).userInputs[5]).toBe(1);
      app.userInput.nativeElement.value = '5';
      (<any>app).addInput();
      expect((<any>app).userInputs[5]).toBe(2);
    });
  });

  describe('isFibonacci', () => {
    it('should return true for Fibonacci numbers', () => {
      expect((<any>app).isFibonacci(0)).toBeTruthy();
      expect((<any>app).isFibonacci(1)).toBeTruthy();
      expect((<any>app).isFibonacci(2)).toBeTruthy();
      expect((<any>app).isFibonacci(3)).toBeTruthy();
      expect((<any>app).isFibonacci(5)).toBeTruthy();
      expect((<any>app).isFibonacci(8)).toBeTruthy();
      expect((<any>app).isFibonacci(13)).toBeTruthy();
      expect((<any>app).isFibonacci(21)).toBeTruthy();
      expect((<any>app).isFibonacci(34)).toBeTruthy();
      expect((<any>app).isFibonacci(55)).toBeTruthy();
    });

    it('should return false for non-Fibonacci numbers', () => {
      expect((<any>app).isFibonacci(4)).toBeFalsy();
      expect((<any>app).isFibonacci(6)).toBeFalsy();
      expect((<any>app).isFibonacci(7)).toBeFalsy();
      expect((<any>app).isFibonacci(9)).toBeFalsy();
      expect((<any>app).isFibonacci(10)).toBeFalsy();
      expect((<any>app).isFibonacci(11)).toBeFalsy();
      expect((<any>app).isFibonacci(14)).toBeFalsy();
      expect((<any>app).isFibonacci(15)).toBeFalsy();
      expect((<any>app).isFibonacci(16)).toBeFalsy();
      expect((<any>app).isFibonacci(17)).toBeFalsy();
    });
  });

  describe('updateSummary', () => {
    it('should create the summary when there is only one input', () => {
      app.summary = 'foobar';
      (<any>app).userInputs = {};
      (<any>app).userInputs[1] = 2;
      (<any>app).updateSummary();
      expect(app.summary).toBe('1:2');
    });

    it('should create the summary when there is more than one input', () => {
      app.summary = 'foobar';
      (<any>app).userInputs = {};
      (<any>app).userInputs[1] = 2;
      (<any>app).userInputs[5] = 1;
      (<any>app).updateSummary();
      expect(app.summary).toBe('5:1, 1:2');
    });

    it('should sort the inputs in reverse order by key', () => {
      app.summary = 'foobar';
      (<any>app).userInputs = {};
      (<any>app).userInputs[12] = 1;
      (<any>app).userInputs[1] = 2;
      (<any>app).userInputs[27] = 3;
      (<any>app).userInputs[5] = 1;
      (<any>app).updateSummary();
      expect(app.summary).toBe('27:3, 12:1, 5:1, 1:2');
    });
  });

  describe('startRefreshTimer', () => {
    it('should start the refresh timer', () => {
      (<any>app).refreshTimer = undefined;
      const stopSpy: Spy = spyOn((<any>app), 'stopRefreshTimer');
      (<any>app).startRefreshTimer();
      expect(stopSpy).toHaveBeenCalled();
      expect((<any>app).refreshTimer).toBeDefined();
    });
  });

  describe('stopRefreshTimer', () => {
    it('should stop the refresh timer if it exists', () => {
      (<any>app).refreshTimer = {
        unsubscribe: noop
      };
      const unsubscribeSpy: Spy = spyOn((<any>app).refreshTimer, 'unsubscribe');
      (<any>app).stopRefreshTimer();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
