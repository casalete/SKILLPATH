import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultDataServiceConfig, EntityDataModule, EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { TopicDataService } from './topic/topic-data.service';
import { TopicEntityService } from './topic/topic-entity.service';
import { Topic } from 'src/app/core/Models/Topic';
import { PostDataService } from './post/post-data.service';
import { Post } from 'src/app/core/Models/Post';
import { PostEntityService } from './post/post-entity.service';
import { defaultDataServiceConfig } from 'src/app/core/services/ngrxDataServiceConfig';

const entityMetadata: EntityMetadataMap = {
    Topic: { selectId: selectTopicId, noChangeTracking: true },
    Post: { selectId: selectPostId, noChangeTracking: true },
};
export function selectTopicId(a: Topic): string {
    return a.name;
}

export function selectPostId(a: Post): string {
    return a.name;
}

@NgModule({
    declarations: [],
    imports: [CommonModule, EntityDataModule.forRoot({ entityMetadata })],
    providers: [
        TopicDataService,
        TopicEntityService,
        PostDataService,
        PostEntityService,
        { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig },
    ],
})
export class NgrxDataModule {
    constructor(
        private eds: EntityDefinitionService,
        private entityDataService: EntityDataService,
        private topicDataService: TopicDataService,
        private postDataService: PostDataService,
    ) {
        this.eds.registerMetadataMap(entityMetadata);

        this.entityDataService.registerServices({
            Topic: this.topicDataService,
            Post: this.postDataService,
        });
    }
}
