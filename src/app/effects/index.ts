import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { QuoteEffect } from "./quote.effect";

@NgModule({
    imports: [
        EffectsModule.forRoot([QuoteEffect])
    ],
    exports: [],
    declarations: [],
    providers: []
})
export class AppEffectsModule {

}