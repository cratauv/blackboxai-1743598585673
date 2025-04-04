import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SearchCriteria, SearchResult } from '../models/search.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  advancedSearch(criteria: SearchCriteria): Observable<SearchResult[]> {
    return this.http.post<SearchResult[]>(`${this.apiUrl}/advanced`, criteria);
  }

  quickSearch(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.apiUrl}/quick?q=${query}`);
  }

  getSearchSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions?q=${query}`);
  }
}