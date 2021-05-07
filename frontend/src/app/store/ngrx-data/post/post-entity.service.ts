import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Post } from 'src/app/core/Models/Post';
@Injectable()
export class PostEntityService extends EntityCollectionServiceBase<Post> {
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
        super('Post', serviceElementsFactory);
    }
}
