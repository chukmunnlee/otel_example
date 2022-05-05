import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {firstValueFrom} from "rxjs";

@Injectable()
export class PoetryService {

	constructor(private http: HttpClient) { }

	search(author: string): Promise<string[]> {
		const params = new HttpParams().set('author', author)
		return firstValueFrom(
			this.http.get<string[]>(`/search`, { params })
		)
	}
}
