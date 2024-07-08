import { Model } from "@vuex-orm/core";

export default class Pokemon extends Model {
    static entity = 'pokemon';
    static fields(){
        return{
            name: this.string(''),
            image: this.string(''),
            height: this.string(''),
            weight: this.string(''),
            ability: this.attr([]),
            experience: this.number(0),
            type: this.attr([]),
            show: this.boolean(false)
        }
    }
}