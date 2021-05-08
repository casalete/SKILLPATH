import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, skipWhile, switchMap, take, tap } from 'rxjs/operators';
import { Post } from 'src/app/core/Models/Post';
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

    ngOnInit(): void {
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
                this.post = ps[0];
                this.links = this.post?.links.map((link) => [link.source, link.target, link.importance]);
            });
        // setTimeout(this.swapData, 5000);
    }

    truncated(index: number) {
        this.showMoreButton = index === null;
    }

    onSubmit(): void {
        console.log(this.comment);
        this.postEntityService
            .addComment({ postId: this.postId, content: this.comment })
            .pipe(take(1))
            .subscribe(() => this.postEntityService.getByKey(this.postId));
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
