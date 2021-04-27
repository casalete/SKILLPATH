import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdbTableDirective } from 'ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import { Post } from 'src/app/core/Models/Post';
import { Topic } from 'src/app/core/Models/Topic';
import { TopicEntityService } from 'src/app/store/ngrx-data/topic/topic-entity.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-topic',
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit, OnDestroy {
    constructor(private topicEntityService: TopicEntityService, private router: Router) {}
    subs = new SubSink();
    topics$: Observable<Topic[]>;
    posts: Post[] = [
        {
            name: 'Full Stack 2020',
            score: 2522,
            author: 'Serghei Mizil',
        },
        {
            name: 'Full Stack 2020',
            score: 2522,
            author: 'Serghei Mizil',
        },
        {
            name: 'Full Stack 2020',
            score: 2522,
            author: 'Serghei Mizil',
        },
        {
            name: 'Full Stack 2020',
            score: 2522,
            author: 'Serghei Mizil',
        },
    ];

    @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
    elements: any = [];
    // headElements = ['Topic', 'Post Count', 'Last', 'Handle'];
    headElements = ['Author', 'Post Name', 'Score'];
    searchText: string = '';
    previous: string;

    @HostListener('input') oninput() {
        this.searchItems();
    }

    ngOnInit() {
        // this.topicEntityService.getAll();
        [];
        for (let i = 1; i <= 8; i++) {
            this.elements.push({
                id: i.toString(),
                first: 'Wpis ' + i,
                last: 'Last ' + i,
                handle: 'Handle ' + i,
            });
        }
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

    ngOnDestroy(): void {}
}

//   onTopicSelected(i) {
//       this.topicEntityService.updateOneInCache({ ...this.topics[i], selected: true });
//       this.router.navigate(['/topic']);
//   }
