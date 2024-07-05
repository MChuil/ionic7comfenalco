import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { Pokemon } from 'src/app/model/pokemon';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  public pokemons: Pokemon[];

  constructor(public pokemonService: PokemonService, private loadingCtrl: LoadingController,  private navParams: NavParams, private navCtrl: NavController) { 
    this.pokemons = [];
  }

  ngOnInit() {
    this.morePokemon()
  }

  async morePokemon($event = null){
    const promise = this.pokemonService.getPokemons();
    if(promise){
      
      let loading = null;
      if(!$event){
        loading =  await this.loadingCtrl.create({
          message: 'Cargando...'
        });
        await loading.present();
      }

      promise.then((result: Pokemon[])=>{
            // console.log(result)
            this.pokemons = this.pokemons.concat(result)
            if($event){
              $event.target.complete();
            }
            if(loading){
              loading.dismiss(); //cerramos el loading
            }
      }).catch( (err)=>{
        if($event){
          $event.target.complete();
        }

        if(loading){
          loading.dismiss(); //cerramos el loading
        }
      })
    }

  }


  details(pokemon: Pokemon){
    this.navParams.data["pokemon"] = pokemon
    this.navCtrl.navigateForward('detail')
  }

}
