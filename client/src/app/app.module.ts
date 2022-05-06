import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes  } from '@angular/router'

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { PoetryTitlesComponent } from './components/poetry-titles.component';
import {PoetryService} from './poetry.service';
import {TracingService} from './tracing.service';

const appRoutes: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'author/:author', component: PoetryTitlesComponent },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PoetryTitlesComponent
  ],
  imports: [
    BrowserModule,
	  FormsModule, ReactiveFormsModule,
	  HttpClientModule, 
	  RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [ PoetryService, TracingService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

	constructor(private traceSvc: TracingService) {
		console.info('>>> in constructor')
		this.traceSvc.configure()
	}
}
