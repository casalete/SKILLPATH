import { ApplicationRef, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-sankey-google',
    templateUrl: './sankey-google.component.html',
    styleUrls: ['./sankey-google.component.scss'],
})
export class SankeyGoogleComponent implements OnInit, OnChanges {
    title = '';
    type = 'Sankey';

    @Input() data: any;
    columnNames: any;
    options = {
        height: 500,
        width: 1000,
        sankey: {
            node: {
                nodePadding: 80,
                colors: ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'],
                label: {
                    fontName: 'Times-Roman',
                    fontSize: 12,
                    color: '#000',
                    bold: true,
                    italic: false,
                },
                interactivity: true,
                width: 10,
            },
            link: {
                colorMode: 'source',

                color: {
                    stroke: 'black',
                    strokeWidth: 0.3,
                    fillOpacity: 0.8,
                },
                // colors: ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'],
            },
        },
    };
    width = 1000;
    height = 1200;

    constructor() {}

    ngOnInit(): void {
        // this.data = [
        //     ['Mathematics', 'ML', 2],
        //     ['Algorithms', 'ML', 1],
        //     ['Statistics', 'ML', 2],
        //     ['Probabilities', 'ML', 1],
        //     ['Probabilities', 'Statistics', 2],
        //     ['Mathematics', 'Probabilities', 2],
        //     ['Mathematics', 'Optics', 2],
        //     ['Optics', 'CV', 1],
        //     ['Algorithms', 'CV', 1],
        //     ['ML', 'CV', 3],
        // ];
        this.columnNames = ['From', 'To', 'Weight'];
    }

    ngOnChanges(): void {
        // console.log('test');
    }
}
