<template>
    <div class="container">
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img width="100%" height="100%" contain :src="image"/>
                </p>
            </figure>
            <div class="media-content is-align-left">
                <div class="content">
                    <p> <strong> Name: </strong> {{ name }} </p>
                    <p> <strong> Height: </strong> {{ height }}</p>
                    <p> <strong> Weight: </strong> {{ weight }}</p>
                    <p> <strong> Type(s): </strong> {{ type }}</p>
                    <p> <strong> Abilities: </strong> {{ ability }}</p>
                    <p> <strong> Base Experience: </strong> {{ experience }}</p>
                </div>
            </div>
        </article>
    </div>
</template>
<script>
export default {
    name: 'PokemonDetail',
    props: {
        image: String,
        name: String,
        height: Number,
        weight: Number,
        ability: String,
        type: String,
        experience: String
    }
}
</script>

<style scoped>

</style>