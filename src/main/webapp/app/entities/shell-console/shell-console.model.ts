import { BaseEntity } from './../../shared';

export class ShellConsole implements BaseEntity {
    constructor(
        public id?: number,
        public command?: string,
    ) {
    }
}
