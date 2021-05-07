import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdbTableDirective } from 'ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/Models/Post';
import { Topic } from 'src/app/core/Models/Topic';
import { TopicEntityService } from 'src/app/store/ngrx-data/topic/topic-entity.service';
import { SubSink } from 'subsink';
import { PostEntityService } from '../../../../store/ngrx-data/post/post-entity.service';
import { QueryParams } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { selectRouteParam, selectRouteParams } from 'src/app/store/router/selectors';
import { skipWhile, switchMap, take } from 'rxjs/operators';

@Component({
    selector: 'app-topic',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit, OnDestroy {
    constructor(private topicEntityService: TopicEntityService, private router: Router, private postEntityService: PostEntityService, private store: Store) {}
    subs = new SubSink();
    topics$: Observable<Topic[]>;
    posts: Post[] = [];

    @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
    elements: any = [];
    // headElements = ['Topic', 'Post Count', 'Last', 'Handle'];
    headElements = ['Author', 'Post Name', 'Description', 'Score'];
    searchText: string = '';
    previous: string;

    @HostListener('input') oninput() {
        this.searchItems();
    }

    ngOnInit() {
        // this.topicEntityService.getAll();
        this.store
            .select(selectRouteParam('id'))
            .pipe(take(1))
            .subscribe((routeParam) => {
                const queryParams: QueryParams = {
                    mainTopic: routeParam,
                };
                this.postEntityService.getWithQuery(queryParams);
            });

        this.subs.sink = this.postEntityService.loading$
            .pipe(
                skipWhile((loading) => loading === true),
                switchMap(() => this.postEntityService.entities$),
            )
            .subscribe((ps: Post[]) => {
                this.posts = ps;
            });
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

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}

//   onTopicSelected(i) {
//       this.topicEntityService.updateOneInCache({ ...this.topics[i], selected: true });
//       this.router.navigate(['/topic']);
//   }
