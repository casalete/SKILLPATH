import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';
import { selectRouteParam } from 'src/app/store/router/selectors';
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
    // data: any = [
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
    links: { source: String; target: String; importance: Number }[];
    constructor(private store: Store, private postEntityService: PostEntityService) {}

    ngOnInit(): void {
        this.store
            .select(selectRouteParam('id'))
            .pipe(take(1))
            .subscribe((routeParam) => {
                // const queryParams: QueryParams = {
                //     postName: routeParam,
                // };
                // console.log(queryParams);
                // this.postEntityService.getWithQuery(queryParams);
                this.postId = routeParam;
                this.postEntityService.collection$
                    .pipe(
                        take(1),
                        tap((posts) => {
                            this.post = posts.entities[this.postId];
                            this.links = this.post?.links.map((link) => [link.source, link.target, link.importance]);
                            console.log(this.links);
                        }),
                    )
                    .subscribe();
            });
        // setTimeout(this.swapData, 5000);
    }

    truncated(index: number) {
        this.showMoreButton = index === null;
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
