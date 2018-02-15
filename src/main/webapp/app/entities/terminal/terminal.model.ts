import { BaseEntity } from './../../shared';

export class Terminal implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
    ) {
    }
}
