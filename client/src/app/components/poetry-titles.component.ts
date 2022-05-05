import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PoetryService} from '../poetry.service';

@Component({
  selector: 'app-poetry-titles',
  templateUrl: './poetry-titles.component.html',
  styleUrls: ['./poetry-titles.component.css']
})
export class PoetryTitlesComponent implements OnInit {

	author = ""
	titles: string[] = []
	error = false
	reason = ""

	constructor(private activatedRoute: ActivatedRoute, private router: Router
		, private poetrySvc: PoetryService) { }

	ngOnInit(): void { 
		this.author = this.activatedRoute.snapshot.params['author']

		if (!this.author)  {
			this.router.navigate(['/'])
			return 
		}

		this.poetrySvc.search(this.author)
			.then(result => {
				this.titles = result
				console.info(">>> this.titles = ", this.titles)
			})
			.catch(msg => {
				this.error = true
				this.reason = msg.reason
			})
	}

}
