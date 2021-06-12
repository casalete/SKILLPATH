import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LinksComponent } from 'ng-uikit-pro-standard';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { map, skipWhile, startWith, switchMap, take } from 'rxjs/operators';
import { Topic } from 'src/app/core/Models/Topic';
import { SubSink } from 'subsink';
import { TopicEntityService } from '../../../../store/ngrx-data/topic/topic-entity.service';
import { PostEntityService } from '../../../../store/ngrx-data/post/post-entity.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { selectRouteParam } from 'src/app/store/router/selectors';

@Component({
    selector: 'app-add-post',
    templateUrl: './add-post.component.html',
    styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit, OnDestroy {
    addPostForm: FormGroup;
    subs = new SubSink();
    topics: string[];
    options$ = new BehaviorSubject<{ value: string; label: string }[]>([]);
    links: { source: string; target: string; importance: number }[] = [];
    links$ = new BehaviorSubject<{ source: string; target: string; importance: number }[]>([]);
    postId: string;

    apiUrl = `${environment.apiUrl}`;

    postTopics: string[] = [];

    topicResults$: Observable<string[]>;
    // targetTopicResults$: Observable<string[]>;

    constructor(private fb: FormBuilder, private topicEntityService: TopicEntityService, private postEntityService: PostEntityService, private store: Store) {}

    ngOnInit(): void {
        this.store
            .select(selectRouteParam('id'))
            .pipe(take(1))
            .subscribe((routeParam) => {
                this.postId = routeParam;
            });

        this.subs.sink = this.topicEntityService.loading$
            .pipe(
                skipWhile((loading) => loading === true),
                switchMap(() => this.topicEntityService.entities$),
                map((topics) => topics.map((topic) => topic.name)),
            )
            .subscribe((ts: string[]) => {
                this.topics = ts;
            });
        this.topicEntityService.getAll();

        this.addPostForm = this.fb.group({
            name: ['', Validators.required],
            postTopic: ['', [Validators.required]],
            sourceTopic: ['', Validators.required],
            targetTopic: ['', Validators.required],
            importance: ['', Validators.required],
            content: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.topicResults$ = this.addPostForm.controls.postTopic.valueChanges.pipe(map((value: string) => this.filter(value)));
        // this.addPostForm.controls.sourceTopic.valueChanges.subscribe((test) => {
        //     console.log(test);
        // });
        // this.addPostForm.controls.targetTopic.valueChanges.subscribe((test) => {
        //     console.log(test);
        // });
    }

    filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.topics.filter((item: any) => item.toLowerCase().includes(filterValue));
    }

    addTopic() {
        if (!this.postTopics.find((pt) => pt === this.addPostForm.controls.postTopic.value)) {
            this.postTopics = [...this.postTopics, this.addPostForm.controls.postTopic.value];
            this.options$.next(
                this.postTopics.map((postTopic) => {
                    return { value: postTopic, label: postTopic };
                }),
            );
        }
    }

    createLink(): void {
        this.links = [
            ...this.links,
            {
                source: this.addPostForm.controls.sourceTopic.value as string,
                target: this.addPostForm.controls.targetTopic.value as string,
                importance: this.addPostForm.controls.importance.value as number,
            },
        ];

        this.links$.next(this.links);
    }
    ngOnDestroy(): void {}

    onSubmit(): void {
        console.log(this.addPostForm.controls.description.value);
        const post = {
            name: this.addPostForm.controls.name.value,
            postTopics: this.postTopics,
            links: this.links,
            description: this.addPostForm.controls.description.value,
            content: this.addPostForm.controls.content.value,
            mainTopic: this.postId,
        };
        console.log(post);
        this.postEntityService.add(post);

        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json',
        //     }),
        // };
        // this.http.post<any>(`${this.apiUrl}/posts`, post, httpOptions).subscribe();
    }
}
