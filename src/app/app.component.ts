import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { timer, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, map, withLatestFrom, filter, takeWhile, tap, exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public seconds$ = new BehaviorSubject<number>(0);
  
  private onStop$ = new Subject<boolean>();
  private onStart$ = new Subject<boolean>();

  ngOnInit(): void {
    this.initTimer();
  }

  public onStart(): void {
    this.onStart$.next();
  }

  public onStop(): void {
    this.onStop$.next();
  }

  public onReset(): void {
    this.onStop$.next();
    this.seconds$.next(0);
  }

  private initTimer(): void {
    this.onStart$
    .pipe(
      withLatestFrom(this.seconds$),
      exhaustMap(([, lastTime]) => timer(0, 1000)
        .pipe(
          map(v => v + lastTime),
          takeUntil(this.onStop$),
        ),
      ),
    )
  .subscribe(v => this.seconds$.next(v));
  }

}
