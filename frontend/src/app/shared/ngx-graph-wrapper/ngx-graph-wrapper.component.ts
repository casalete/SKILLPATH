import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-ngx-graph-wrapper',
    templateUrl: './ngx-graph-wrapper.component.html',
    styleUrls: ['./ngx-graph-wrapper.component.scss'],
})
export class NgxGraphWrapperComponent implements OnInit {
    center$: Subject<boolean> = new Subject();
    zoomToFit$: Subject<boolean> = new Subject();
    panToNode$: Subject<number> = new Subject();

    constructor() {}

    ngOnInit(): void {}

    centerGraph() {
        this.center$.next(true);
    }
    fitGraph() {
        this.zoomToFit$.next(true);
    }

    panToNode() {
        this.panToNode$.next(1);
    }

    ngAfterViewInit(): void {
        // this.centerGraph();
        // this.fitGraph();
        // this.panToNode();
    }
}
