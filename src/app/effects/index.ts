import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { QuoteEffect } from "./quote.effect";
import { AuthEffects } from "./auth.effect";

@NgModule({
    imports: [
        EffectsModule.forRoot([QuoteEffect, AuthEffects])
    ],
    exports: [],
    declarations: [],
    providers: []
})
export class AppEffectsModule {

}