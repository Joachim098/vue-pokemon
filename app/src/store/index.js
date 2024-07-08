import axios from 'axios';
import { createStore } from 'vuex'
import VuexORM from '@vuex-orm/core';
import Pokemon from '@/models/pokemon';

//creating instance of db
const db = new VuexORM.Database();
//registering pokemon model to db
db.register(Pokemon);

export default createStore({
  plugins: [VuexORM.install(db)],
  
  state: {
    filterPokemons: '',
    filterByExp: {},
    loading: false,
    error: null,
  },

  getters: {
    getPokemons: ((state) => {
      if(state.filterPokemons != ''){
        return Pokemon.query()
        .where('name', value => value.toLowerCase().includes(state.filterPokemons.toLowerCase()))
        .get();
      }
      else if(state.filterByExp.min && state.filterByExp.max){
        let min = parseInt(state.filterByExp.min);
        let max = parseInt(state.filterByExp.max);

        return Pokemon.query()
        .where('experience', value => value >= min && value <= max)
        .get();
      }
      else{
        return Pokemon.all();
      }
    }),
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  mutations: {
    setFilterPokemons(state, filter){
      state.filterPokemons = filter;
    },
    setFilterByExp(state, exp){
      state.filterByExp = exp;
    },
    setLoading(state, loading){
      state.loading = loading;
    },
    setError(state, error){
      state.error = error;
    }
  },

  actions: {
    async fetchPokemons({commit}){
      commit('setLoading', true);
      commit('setError', null);

      try{
        //fetching data from pokemon api
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const results = response.data.results;

        let pokemons = await Promise.all(
          results.map(async (pokemon) => {
            let pokemonData = await axios.get(pokemon.url);

            //Converting some fields into proper sentence case for better readability
            let name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
            let abilities = pokemonData.data.abilities.map(ab => ab.ability.name[0].toUpperCase() + ab.ability.name.slice(1))
            let types = pokemonData.data.types.map(tp => tp.type.name[0].toUpperCase() + tp.type.name.slice(1))

            return {
              name: name,
              image: pokemonData.data.sprites.front_default,
              height: pokemonData.data.height + ' m',
              weight: pokemonData.data.weight + ' kg',
              ability: abilities,
              experience: pokemonData.data.base_experience,
              type: types,
              show: false
            };
          })
        );
        Pokemon.insert({ data: pokemons })
        commit('setLoading', false);
      }
      catch(error){
        console.log(error);
        commit('setError', error);
        commit('setLoading', false);
      }
    },
    fetchFilterPokemons({commit}, filterPokemon){
      commit('setFilterPokemons', filterPokemon);
    },
    fetchFilterByExp({commit}, exp){
      console.log(exp);
      commit('setFilterByExp', exp);
    }
  },
  
  modules: {
  }
})
