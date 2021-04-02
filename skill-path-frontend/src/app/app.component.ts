import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';
import { selectRouteData } from './store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}

  navbar: boolean;
  subs = new SubSink();

  ngOnInit(): void {
    this.subs.sink = this.store
      .select(selectRouteData)
      .pipe(filter((data) => data?.layout !== undefined))
      .subscribe((data) => (this.navbar = data.layout.navbar));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
