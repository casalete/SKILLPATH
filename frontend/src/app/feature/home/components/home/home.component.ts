import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MdbTableDirective } from 'ng-uikit-pro-standard';
import { SubSink } from 'subsink';
import { TopicEntityService } from '../../../../store/ngrx-data/topic/topic-entity.service';
import { Topic } from 'src/app/core/Models/Topic';
import { Observable } from 'rxjs';
import { skipWhile, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    constructor(private topicEntityService: TopicEntityService, private router: Router) {}
    subs = new SubSink();
    topics$: Observable<Topic[]>;
    topics: Topic[] = [];

    @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
    elements: any = [];
    // headElements = ['Topic', 'Post Count', 'Last', 'Handle'];
    headElements = ['Topic', 'Post Count'];
    searchText: string = '';
    previous: string;

    @HostListener('input') oninput() {
        this.searchItems();
    }

    ngOnInit() {
        this.topicEntityService.getAll();
        for (let i = 1; i <= 8; i++) {
            this.elements.push({
                id: i.toString(),
                first: 'Wpis ' + i,
                last: 'Last ' + i,
                handle: 'Handle ' + i,
            });
        }

        this.subs.sink = this.topicEntityService.loading$
            .pipe(
                skipWhile((loading) => loading === true),
                switchMap(() => this.topicEntityService.entities$),
            )
            .subscribe((ts: Topic[]) => {
                this.topics = ts;
            });
    }

    // ngAfterViewInit(): void {
    //     // this.mdbTable.setDataSource(this.topics);
    //     // this.previous = this.mdbTable.getDataSource();
    // }

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

    onTopicSelected(i) {
        this.topicEntityService.updateOneInCache({ ...this.topics[i], selected: true });
        this.router.navigate(['/topic']);
    }

    ngOnDestroy(): void {}
}
