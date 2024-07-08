<template>
    <div class="container">
        <div class="section">
            <h1 class="is-size-2 has-text-centered has-text-primary">Pokemon's List</h1>
        </div>
        <div class="columns ml-1" style="width: 76%;">
            <div class="column">
                <b-field label="Search By Name">
                    <b-input placeholder="Search by name..."
                    v-model="filterName" 
                    icon="magnify"
                    @input="filterPokemons()"/>
                </b-field>
            </div>
            <div class="column">
                <b-field label="Filter By Experience">
                    <b-input 
                        type="number" 
                        placeholder="Min exp" 
                        v-model="experience.min"
                    />
                    <b-input 
                        type="number" 
                        placeholder="Max exp" 
                        class="ml-2"
                        v-model="experience.max"
                    />
                    <b-button 
                        type="is-primary" 
                        class="ml-2" 
                        label="Apply filter" 
                        @click="filterByExp()"
                    />
                </b-field>
            </div>
        </div>
        <div class="box">
            <b-table
                :data="pokemons"
                ref="table"
                narrowed
                stripped
                hoverable
                paginated
                :per-page="itemsPerPage"
                :current-page="currentPage"
                :loading="loading"
                :default-sort-method="'asc'"
                sort-icon-size="is-small"
                default-sort="name"
                detailed
                :show-detail-icon=false
                detail-key="name"
                @details-open="(row) => { showToast(row); row.show = true; }"
                @details-close="(row) => { row.show = false; }">

                <b-table-column field="name" label="Name" sortable>
                    <template #default="{ row }">
                        {{ row.name }}
                    </template>
                </b-table-column>

                <b-table-column field="experience" label="Base Experience" sortable>
                    <template #default="{ row }">
                        {{ row.experience }}
                    </template>
                </b-table-column>

                <b-table-column field="image" label="Image">
                    <template #default="{ row }">
                        <img width="50" :src="row.image" :alt="row.name" />
                    </template>
                </b-table-column>

                <b-table-column field="action" label="Action" >
                    <template v-slot="props">
                        <b-button 
                            type="is-primary" 
                            outlined 
                            @click="props.toggleDetails(props.row)"
                            > 
                            {{ props.row.show ? 'Hide Details' : 'Show Details' }} 
                        </b-button>
                    </template>
                </b-table-column>

                <template #detail="props">  
                    <PokemonDetail
                    :image="props.row.image"
                    :name="props.row.name"
                    :height="props.row.height"
                    :weight="props.row.weight"
                    :ability="getAbilities(props.row.ability)"
                    :type="getTypes(props.row.type)"
                    :experience="props.row.experience"
                    />
                </template>
            </b-table>
            
        </div>
    </div> 
</template>
<script>

import PokemonDetail from '@/components/pokemon-detail.vue';

export default {
    name: 'PokemonList',
    components: {
        PokemonDetail
    },
    data(){
        return{
            currentPage: 1,
            itemsPerPage: 5,
            isEmpty: false,
            show: true,
            filterName: '',
            experience: {
                min: null,
                max: null
            }
        }
    },
    computed: { 
        pokemons(){
            return this.$store.getters.getPokemons;
        },
        loading(){
            return this.$store.getters.getLoading;
        },
        error(){
            return this.$store.getters.getError;
        }
    },
    watch: {
        currentPage(page) {
            this.$buefy.toast.open({
                message: `Displaying page ${page}`,
                type: 'is-primary'
            })
        },
        pokemons(pokemon){
            if(pokemon.length == 0){
                this.isEmpty = true;
            }
            else{
                this.isEmpty = false;
            }

        },
        error(error){
            if(error){
                this.$buefy.toast.open({
                    message: 'Something went wrong!',
                    type: 'is-danger',
                })
            }
        }
    },
    methods: {
        getAbilities(abilities){
            return abilities.toString().replace(/,/g, ', ');
        },
        getTypes(types){
            return types.toString().replace(/,/g, ', ');
        },
        showToast(row){
            this.$buefy.toast.open({
                message: `Showing ${row.name}`, 
                type: 'is-primary',
                duration: '3000'
            })
        },     
        filterPokemons(){
            this.$store.dispatch('fetchFilterPokemons', this.filterName);
        },
        filterByExp(){
            this.$store.dispatch('fetchFilterByExp', this.experience);
        }
    },
    created(){
        this.$store.dispatch('fetchPokemons');
    }
}
</script>
<style scoped>

</style>