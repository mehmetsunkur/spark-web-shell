import { BaseEntity } from './../../shared';

export class Shell implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
    ) {
    }
}
