import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, skipWhile, switchMap, take, tap } from 'rxjs/operators';
import { Post } from 'src/app/core/Models/Post';
import { voteComment } from 'src/app/store/profile/actions';
import { selectRouteParam } from 'src/app/store/router/selectors';
import { SubSink } from 'subsink';
import { PostEntityService } from '../../../../store/ngrx-data/post/post-entity.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
    showMore: boolean;
    showMoreButton: any;
    postId: string;
    post: any;
    comment: string;
    subs = new SubSink();

    links: { source: String; target: String; importance: Number }[];
    constructor(private store: Store, private postEntityService: PostEntityService) {}

    initializePage(): void {
        this.store
            .select(selectRouteParam('id'))
            .pipe(take(1))
            .subscribe((routeParam) => {
                this.postId = routeParam;
                this.postEntityService.getByKey(this.postId);
            });
        this.subs.sink = this.postEntityService.loading$
            .pipe(
                skipWhile((loading) => loading === true),
                switchMap(() => this.postEntityService.entities$),
                filter((entities) => {
                    return entities.length !== 0;
                }),
                map((entities) => entities.filter((entity) => entity._id === this.postId)),
            )
            .subscribe((ps: any) => {
                console.log('pe loading de postEntity');
                this.post = ps[0];
                this.links = this.post?.links.map((link) => [link.source, link.target, link.importance]);
            });
    }

    ngOnInit(): void {
        this.initializePage();
        // setTimeout(this.swapData, 5000);
    }

    truncated(index: number) {
        this.showMoreButton = index === null;
    }

    upVoteComment(event: any): void {
        console.log({ voteType: 'UP', commentId: event.id });
        this.store.dispatch(voteComment({ voteType: 'UP', commentId: event.id }));
        this.postEntityService.clearCache();
        this.initializePage();
    }

    downVoteComment(event: any): void {
        console.log({ voteType: 'DOWN', commentId: event.id });
        this.store.dispatch(voteComment({ voteType: 'DOWN', commentId: event.id }));
        this.postEntityService.clearCache();
        this.initializePage();
    }

    onSubmit(): void {
        console.log(this.comment);
        this.postEntityService
            .addComment({ postId: this.postId, content: this.comment })
            .pipe(take(1))
            .subscribe(() => {
                setTimeout(() => {
                    this.postEntityService.getByKey(this.postId);
                    console.log('subscribe la onsubmit');
                }, 1000);
            });
    }

    swapData(): void {
        // this.data$.next([
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
        // ]);
        // this.data = 'test';
    }
}
