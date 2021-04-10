import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MdbTableDirective } from 'ng-uikit-pro-standard';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    constructor() {}

    @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
    elements: any = [];
    headElements = ['ID', 'First', 'Last', 'Handle'];
    searchText: string = '';
    previous: string;

    @HostListener('input') oninput() {
        this.searchItems();
    }

    ngOnInit() {
        for (let i = 1; i <= 10; i++) {
            this.elements.push({
                id: i.toString(),
                first: 'Wpis ' + i,
                last: 'Last ' + i,
                handle: 'Handle ' + i,
            });
        }
        this.mdbTable.setDataSource(this.elements);
        this.previous = this.mdbTable.getDataSource();
    }

    searchItems() {
        const prev = this.mdbTable.getDataSource();
        if (!this.searchText) {
            this.mdbTable.setDataSource(this.previous);
            this.elements = this.mdbTable.getDataSource();
        }
        if (this.searchText) {
            this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
            this.mdbTable.setDataSource(prev);
        }
    }
}
