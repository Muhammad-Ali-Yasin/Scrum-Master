import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorySprintService {
  baseUrl: string = environment.ApiUrl;

  constructor(private httpClient: HttpClient) { }

  getStoryList(): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:3000/stories`);
  }

  getStory(id:any): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:3000/stories/${id}`);
  }

  CreateStory(data:any): Observable<any[]> {
    return this.httpClient.post<any[]>(`http://localhost:3000/stories`,data);
  }

  UpdateStory(data:any): Observable<any[]> {
    return this.httpClient.put<any[]>(`http://localhost:3000/stories/${data.id}`,data);
  }

  deleteStory(id:any): Observable<any[]> {
    return this.httpClient.delete<any[]>(`http://localhost:3000/stories/${id}`);
  }
}
