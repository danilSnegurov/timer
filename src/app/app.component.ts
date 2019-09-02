import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { timer, BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { takeUntil, map, withLatestFrom, filter, exhaustMap, debounceTime, buffer } from 'rxjs/operators';

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

  @ViewChild("onWait")
  waitButton: ElementRef;

  ngOnInit(): void {
    this.initTimer();
    const mouse$ = fromEvent(this.waitButton._elementRef.nativeElement, 'click');
    const buff$ = mouse$.pipe(
      debounceTime(300),
    )
    const click$ = mouse$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    )
    
    click$.subscribe(() => {
      this.onStop$.next();
    })
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
