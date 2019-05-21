import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @ViewChild('userInput') public userInput: ElementRef;

  public error: string;
  public frequency: number = 0;
  public pauseButtonText: string = 'Halt';
  public running: boolean = false;
  public showDoneMessage: boolean = false;
  public showFib: boolean = false;
  public started: boolean = false;
  public summary: string = '';

  private refreshTimer: Subscription;
  private userInputs: Object = {}; // Hash

  public ngOnDestroy(): void {
    this.stopRefreshTimer();
  }

  public startTimer(): void {
    this.showDoneMessage = false;
    this.summary = '';
    this.userInputs = {};
    this.started = true;
    this.running = true;
    this.startRefreshTimer();
  }

  public pause(): void {
    this.running = !this.running;
    this.showFib = false;
    this.pauseButtonText = this.running ? 'Halt' : 'Resume';
    if (this.pauseButtonText === 'Resume') {
      this.stopRefreshTimer();
      this.summary = '';
    } else {
      this.startRefreshTimer();
    }
  }

  public quit(): void {
    this.started = false;
    this.showFib = false;
    this.stopRefreshTimer();
    this.updateSummary();
    this.showDoneMessage = true;
  }

  public clearFib(): void {
    this.showFib = false;
  }

  private addInput(): void {
    this.error = undefined;
    this.showFib = false;
    const value: number = parseInt(this.userInput.nativeElement.value, 10);
    if (isNaN(value) || value <= 0) {
      this.error = 'Value must be greater than zero';
      return;
    }

    if (this.isFibonacci(value)) {
      this.showFib = true;
    }

    const count: number = this.userInputs[`${value}`];
    if (count) {
      this.userInputs[`${value}`] = count + 1;
    } else {
      this.userInputs[`${value}`] = 1;
    }
    this.userInput.nativeElement.value = '';
  }

  private isFibonacci(num: number): boolean {
    const root5: number = Math.sqrt(5);
    const phi: number = (root5 + 1) / 2;
    const idx: number = Math.floor(Math.log(num * root5) / Math.log(phi) + 0.5);
    const u: number = Math.floor(Math.pow(phi, idx) / root5 + 0.5);
    return (u === num);
  }

  private updateSummary(): void {
    this.summary = '';
    const arr: string[] = [];

    for (const key in this.userInputs) {
      arr.push(key);
    }
    for (let i: number = arr.length - 1; i >= 0; i--) {
      this.summary += `${arr[i]}:${this.userInputs[arr[i]]}, `;
    }

    if (this.summary.length > 0) {
      this.summary = this.summary.substr(0, this.summary.length - 2);
    }
  }

  private startRefreshTimer(): void {
    this.stopRefreshTimer();
    this.refreshTimer = interval(this.frequency * 1000).subscribe(() => {
      this.updateSummary();
    });
  }

  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
  }

}
