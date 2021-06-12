import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-ngx-graph-wrapper',
    templateUrl: './ngx-graph-wrapper.component.html',
    styleUrls: ['./ngx-graph-wrapper.component.scss'],
})
export class NgxGraphWrapperComponent implements OnInit, OnChanges {
    center$: Subject<boolean> = new Subject();
    zoomToFit$: Subject<boolean> = new Subject();
    panToNode$: Subject<number> = new Subject();
    @Input() links: any = [];

    @Input() nodes: any = [];

    constructor() {}

    ngOnChanges(): void {
        console.log(this.links);
        console.log(this.nodes);
        this.fitGraph();
        this.centerGraph();
        this.panToNode();
    }

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
