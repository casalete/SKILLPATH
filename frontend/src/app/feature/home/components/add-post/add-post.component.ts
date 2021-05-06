import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LinksComponent } from 'ng-uikit-pro-standard';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { map, skipWhile, startWith, switchMap } from 'rxjs/operators';
import { Topic } from 'src/app/core/Models/Topic';
import { SubSink } from 'subsink';
import { TopicEntityService } from '../../../../store/ngrx-data/topic/topic-entity.service';
import { PostEntityService } from '../../../../store/ngrx-data/post/post-entity.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

    apiUrl = `${environment.apiUrl}`;

    // ['Mathematics', 'ML', 2],
    // [
    //     { value: '1', label: 'Option 1' },
    //     { value: '2', label: 'Option 2' },
    //     { value: '3', label: 'Option 3' },
    // ];

    postTopics: string[] = [];

    topicResults$: Observable<string[]>;
    // targetTopicResults$: Observable<string[]>;

    constructor(private fb: FormBuilder, private topicEntityService: TopicEntityService, private postEntityService: PostEntityService) {}

    ngOnInit(): void {
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
            description: [''],
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
        const post = {
            name: this.addPostForm.controls.name.value,
            postTopics: this.postTopics,
            links: this.links,
            description: this.addPostForm.controls.description.value,
            content: this.addPostForm.controls.content.value,
            mainTopic: 'Angular',
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
