import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location) {}

    hero: Hero | undefined

    ngOnInit(): void {
      this.getHero()
    }
  
    /**
     * getHero
     */
    public getHero(): void {
      const id = Number(this.route.snapshot.paramMap.get(`id`))
      this.heroService.getHero(id).subscribe((hero) => this.hero = hero)
    }


    /**
     * save
     */
    public save(): void {
      if (this.hero) {
        this.heroService.updateHero(this.hero).subscribe(
          () => this.goBack()
        )
      }
    }

    /**
     * goBack
     */
    public goBack(): void {
      this.location.back()
    }


}
