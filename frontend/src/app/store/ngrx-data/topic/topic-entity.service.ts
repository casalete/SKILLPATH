import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Topic } from 'src/app/core/Models/Topic';
@Injectable()
export class TopicEntityService extends EntityCollectionServiceBase<Topic> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Topic', serviceElementsFactory);
    }
}
