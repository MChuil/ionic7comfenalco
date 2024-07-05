import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Pokemon } from '../model/pokemon';


const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private nextUrl: string;

  constructor() {
    this.nextUrl = `${url}pokemon?limit=20&offset=0`;
  }

  getPokemons(){
    const options = {
      url: this.nextUrl,
      headers: {},
      params: {},
    };
    return CapacitorHttp.get(options).then(async(response) =>{
        let pokemons: Pokemon[] = [];

        if(response.data){
          const results = response.data.results
          this.nextUrl = response.data.next

          const promises : Promise<HttpResponse>[] = [];

          for (let index = 0; index < results.length; index++) {
              const pokemon = results[index];
              const urlPokemon = pokemon.url;

              const options = {
                url: results[index].url,
                headers: {},
                params: {},
              }
              promises.push(CapacitorHttp.get(options))
          }

          await Promise.all(promises).then(response =>{
            for(const resp of response){
              let dataPokemon = resp.data;
              const  objetoPokemon =  new Pokemon()
              objetoPokemon.id = dataPokemon.order
              objetoPokemon.name = dataPokemon.name
              objetoPokemon.type1 = dataPokemon.types[0].type.name
              if(dataPokemon.types[1]){
                objetoPokemon.type2 = dataPokemon.types[1].type.name
              }
              objetoPokemon.sprite = dataPokemon.sprites.front_default  //imagen
              objetoPokemon.height= dataPokemon.height / 10
              objetoPokemon.weight=  dataPokemon.weight / 10
              objetoPokemon.stats = dataPokemon.stats
              objetoPokemon.abilities = dataPokemon.abilities.filter(ab => !ab.is_hidden).map(ab => ab.ability.name)
              const hiddenAbility = dataPokemon.abilities.filter(ab => ab.is_hidden)
              // if(hiddenAbility){
              //   objetoPokemon.hiddenAbility = hiddenAbility.ability.name
              // }
              pokemons.push(objetoPokemon);
            }
          })
        }
        return pokemons;
    })
    return null;
  }

}
