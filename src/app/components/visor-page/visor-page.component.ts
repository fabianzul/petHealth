import { Component, OnInit } from '@angular/core';
import { moveIn } from 'src/router.animations';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { petRealTime } from 'src/app/models/pet';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-visor-page',
  templateUrl: './visor-page.component.html',
  styleUrls: ['./visor-page.component.scss'],
  animations: [moveIn()]
})
export class VisorPageComponent implements OnInit {

  public subPetRealTime: ISubscription;
  public PetsRealTimeObject: petRealTime[];
  isLoading = true;
  public nopet: boolean = false;

  constructor(private router: Router,private petService: PetService) { }

  ngOnInit() {
    setTimeout(() => {

      this.subPetRealTime = this.petService.getPetsRealTime().subscribe(changes => {
        if (changes !== null) {
          this.PetsRealTimeObject = changes;
          if((this.PetsRealTimeObject.length)<=0){
            console.log('No marmitas');
            this.nopet = true;
          }
          this.nopet = false;
        } else {
          console.log('No marmitas');
          this.nopet = true;
        }
        this.isLoading = false;
      });
    },1000);
  }

  ngOnDestroy() {
    this.subPetRealTime? this.subPetRealTime.unsubscribe(): null
  }

  public route(page){
    this.router.navigate([page]);
  }


}
