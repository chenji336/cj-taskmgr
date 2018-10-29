import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { QuoteEffect } from "./quote.effect";
import { AuthEffects } from "./auth.effect";
import { ProjectEffect } from "./project.effect";
import { TaskListEffects } from "./task-list.effect";

@NgModule({
    imports: [
        EffectsModule.forRoot([
            QuoteEffect, 
            AuthEffects,
            ProjectEffect,
            TaskListEffects,
        ])
    ],
    exports: [],
    declarations: [],
    providers: []
})
export class AppEffectsModule {

}