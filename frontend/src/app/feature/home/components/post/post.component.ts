import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, skipWhile, switchMap, take, tap } from 'rxjs/operators';
import { Post } from 'src/app/core/Models/Post';
import { ProfileData } from 'src/app/core/Models/ProfileData';
import { voteCommentStart, votePostStart } from 'src/app/store/post/actions';
import { selectRouteParam } from 'src/app/store/router/selectors';
import { SubSink } from 'subsink';
import { PostEntityService } from '../../../../store/ngrx-data/post/post-entity.service';
import { selectProfileData } from '../../../../store/profile/selectors';
import { followUserStart, followUserSuccess } from '../../../../store/profile/actions';

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
    profileData$: Observable<ProfileData>;

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
    }

    ngOnInit(): void {
        this.profileData$ = this.store.select(selectProfileData);
        this.initializePage();

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
        // setTimeout(this.swapData, 5000);
    }

    truncated(index: number) {
        this.showMoreButton = index === null;
    }

    upVoteComment(event: any): void {
        this.store.dispatch(voteCommentStart({ voteType: 'UP', commentId: event.id, postId: this.postId }));
        // this.postEntityService.clearCache();
        // this.initializePage();
    }

    followAuthor(): void {
        this.store.dispatch(followUserStart({ user: this.post.author }));
    }

    upVotePost(): void {
        this.store.dispatch(votePostStart({ voteType: 'UP', postId: this.post.name }));
    }

    downVoteComment(event: any): void {
        this.store.dispatch(voteCommentStart({ voteType: 'DOWN', commentId: event.id, postId: this.postId }));
        // this.postEntityService.clearCache();
        // this.initializePage();
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
