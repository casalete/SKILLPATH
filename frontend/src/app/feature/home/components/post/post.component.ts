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
    radioModel: string;

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
                this.post = ps[0];
                this.links = this.post?.links.map((link) => [link.source, link.target, link.importance]);
            });
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
        if (this.radioModel !== undefined) {
            this.postEntityService
                .addComment({ postId: this.postId, content: this.comment, voteType: this.radioModel })
                .pipe(take(1))
                .subscribe(() => {
                    setTimeout(() => {
                        this.postEntityService.getByKey(this.postId);
                    }, 300);
                });
        } else {
            this.postEntityService
                .addComment({ postId: this.postId, content: this.comment })
                .pipe(take(1))
                .subscribe(() => {
                    setTimeout(() => {
                        this.postEntityService.getByKey(this.postId);
                    }, 300);
                });
        }
    }
}
