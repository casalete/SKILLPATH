import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDataModule, EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { TopicDataService } from './topic/topic-data.service';
import { TopicEntityService } from './topic/topic-entity.service';
import { Topic } from 'src/app/core/Models/Topic';

const entityMetadata: EntityMetadataMap = {
    Topic: { selectId: selectTopicId, noChangeTracking: true },
};
export function selectTopicId(a: Topic): string {
    return a.name;
}

@NgModule({
    declarations: [],
    imports: [CommonModule, EntityDataModule.forRoot({ entityMetadata })],
    providers: [TopicDataService, TopicEntityService],
})
export class NgrxDataModule {
    constructor(private eds: EntityDefinitionService, private entityDataService: EntityDataService, private topicDataService: TopicDataService) {
        this.eds.registerMetadataMap(entityMetadata);

        this.entityDataService.registerServices({
            Topic: this.topicDataService,
        });
    }
}
