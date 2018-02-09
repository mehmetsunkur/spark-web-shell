import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SparkWebShellShellConsoleModule } from './shell-console/shell-console.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        SparkWebShellShellConsoleModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SparkWebShellEntityModule {}
