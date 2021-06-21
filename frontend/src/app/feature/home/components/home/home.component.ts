import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MdbTableDirective } from 'ng-uikit-pro-standard';
import { SubSink } from 'subsink';
import { TopicEntityService } from '../../../../store/ngrx-data/topic/topic-entity.service';
import { Topic } from 'src/app/core/Models/Topic';
import { Observable, Subject } from 'rxjs';
import { map, skipWhile, startWith, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SearchService } from 'src/app/core/services/searchService';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    constructor(private topicEntityService: TopicEntityService, private router: Router, private httpClient: HttpClient, private searchService: SearchService) {}
    subs = new SubSink();
    topics$: Observable<Topic[]>;
    topics: Topic[] = [];

    searchText = new Subject();

    results: Observable<any>;
    data: any = [];

    @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
    headElements = ['Topic', 'Post Count'];
    previous: string;

    ngOnInit() {
        this.topicEntityService.getAll();

        this.subs.sink = this.topicEntityService.loading$
            .pipe(
                skipWhile((loading) => loading === true),
                switchMap(() => this.topicEntityService.entities$),
            )
            .subscribe((ts: Topic[]) => {
                this.topics = ts;
            });

        this.searchService.searchTopicsAndPosts().subscribe((data: any) => {
            this.data = data;
            this.results = this.searchText.pipe(
                startWith(''),
                map((value: string) => this.filter(value)),
            );
        });
    }

    onItemSelected(event: any) {
        if (event.element.el.nativeElement.innerText.includes('Path')) {
            let foundItem;
            this.results.pipe(take(1)).subscribe((results) => {
                foundItem = results.filter((res) => res.name === event.text)[0];
            });
            const foundItemId = foundItem._id;
            this.router.navigate([`/post/${foundItemId}`]);
        }
        if (event.element.el.nativeElement.innerText.includes('Topic')) {
            this.router.navigate([`/topic/${event.text}`]);
        }
    }

    filter(value: string): string[] | undefined {
        const filterValue = value.toLowerCase();
        if (this.data) {
            return this.data['results'].filter((item: any) => {
                return item.name.toLowerCase().includes(filterValue);
            });
        }
    }

    onTopicSelected(i) {
        this.topicEntityService.updateOneInCache({ ...this.topics[i], selected: true });
        this.router.navigate(['/topic']);
    }

    ngOnDestroy(): void {}
}
