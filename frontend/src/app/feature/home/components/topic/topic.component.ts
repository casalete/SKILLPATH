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
import { votePostStart } from 'src/app/store/post/actions';
import { followTopicStart } from 'src/app/store/profile/actions';

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
    headElements = ['Author', 'Post Name', 'Description', 'Score', 'Details'];
    searchText: string = '';
    previous: string;
    mainTopicName: string;
    mainTopic: Topic;
    queryParams: QueryParams;
    nodes: Array<{ id: string; label: string }> = [];
    links: Array<{ id: string; source: string; target: string }> = [];

    @HostListener('input') oninput() {
        this.searchItems();
    }

    ngOnInit() {
        this.store
            .select(selectRouteParam('id'))
            .pipe(take(1))
            .subscribe((routeParam) => {
                this.queryParams = {
                    mainTopic: routeParam,
                };
                this.mainTopicName = routeParam;
                this.topicEntityService.getByKey(this.mainTopicName);
                this.postEntityService.getWithQuery(this.queryParams);
            });

        this.subs.sink = this.postEntityService.loading$
            .pipe(
                skipWhile((loading) => loading === true),
                switchMap(() => this.postEntityService.entities$),
            )
            .subscribe((ps: Post[]) => {
                this.posts = ps;
                this.elements = this.posts;
                this.mdbTable.setDataSource(this.elements);
                this.previous = this.mdbTable.getDataSource();
            });

        this.subs.sink = this.topicEntityService.loading$
            .pipe(
                skipWhile((loading) => loading === true),
                switchMap(() => this.topicEntityService.entities$),
            )
            .subscribe((topics: Topic[]) => {
                this.mainTopic = topics.filter((topic) => topic.name === this.mainTopicName)[0];
                this.nodes = [
                    { id: '0', label: this.mainTopicName },
                    ...this.mainTopic.suggestedTopics.map((suggestedTopic, index) => ({ id: (index + 1).toString(), label: suggestedTopic })),
                ];
                this.links = this.mainTopic.suggestedTopics.map((suggestedTopic, index) => ({
                    id: suggestedTopic,
                    source: '0',
                    target: (index + 1).toString(),
                }));
            });
    }

    searchItems() {
        const prev = this.mdbTable.getDataSource();
        if (!this.searchText) {
            this.mdbTable.setDataSource(this.previous);
            this.elements = this.mdbTable.getDataSource();
        }
        if (this.searchText) {
            this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['name', 'description', 'content', 'authorDisplayName']);
            this.mdbTable.setDataSource(prev);
        }
    }

    followTopic(): void {
        this.store.dispatch(followTopicStart({ topic: this.mainTopic.name }));
    }

    upVotePost(event: any): void {
        console.log({ voteType: 'UP', postId: event.name });
        this.store.dispatch(votePostStart({ voteType: 'UP', postId: event.name, queryParams: this.queryParams }));
    }

    downVotePost(event: any): void {
        console.log({ voteType: 'DOWN', postId: event.name });
        this.store.dispatch(votePostStart({ voteType: 'DOWN', postId: event.name, queryParams: this.queryParams }));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
