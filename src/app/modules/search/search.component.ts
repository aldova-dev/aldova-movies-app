import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MovieApiService } from 'src/app/services/movie/movie-api-service.service'
import { StarService } from 'src/app/services/star/star.service'
import { Title, Meta } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { Card } from 'src/app/models/card.model'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    private movieService: MovieApiService,
    public starService: StarService,
    private title: Title,
    private meta: Meta,
    private router: ActivatedRoute) {

    this.title.setTitle('Search movies - Aldova')
    this.meta.updateTag({ name: 'description', content: 'search here movies like avatar,war etc' })
  }

  searchResult: Card[] = []
  getParamId: string = ''
  movieResult: Card[] = []
  key: string = 'favoritesMovies'
  tooltipText: string = 'Add to Favorites'

  searchForm = new FormGroup({
    'movieName': new FormControl(this.getParamId)
  })

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id')
    if (id !== null) {
      this.getParamId = id
      this.searchForm.get('movieName')?.setValue(id);
    }
    this.submitForm()
  }

  submitForm() {
    let searchTerm = this.searchForm.get('movieName')!.value;
    if (searchTerm === null || undefined) {
      searchTerm = ''
    }

    this.movieService.getSearchMovie(searchTerm).subscribe({
      next: (result) => {
        this.searchResult = [...this.movieResult, ...result]
      }
    })
  }

  saveToFavorites(data: Card) {
    let storedData: Card[] = JSON.parse(localStorage.getItem(this.key) || '[]')

    if (!storedData.some((item) => item.id === data.id)) {
      storedData.push(data)
      localStorage.setItem(this.key, JSON.stringify(storedData))
    } else {
      storedData = storedData.filter((item) => item.id !== data.id)
      localStorage.setItem(this.key, JSON.stringify(storedData))
    }
  }

  isInFavorites(data: Card): boolean {
    let storedData: Card[] = JSON.parse(localStorage.getItem(this.key) || '[]')
    if (storedData.some((item) => item.id === data.id)) {
      this.tooltipText = 'Remove from Favorites'
      return true
    } else {
      this.tooltipText = 'Add to Favorites'
      return false
    }
  }
}
