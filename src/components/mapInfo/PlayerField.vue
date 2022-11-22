<template>
  <v-autocomplete
    @change="playerChanged"
    v-model="map[field]"
    :items="players"
    :loading="isLoading"
    :search-input.sync="seachPlayer"
    hide-details
    hide-selected
    item-text="nickname"
    item-value="id"
    :label="label"
    :solo="solo"
    :outlined="!solo">
    <template v-slot:no-data>
    <v-list-item>
      <v-list-item-title>
        Digite o nome do 
        <strong>Jogador</strong>
      </v-list-item-title>
    </v-list-item>
    </template>
    <template v-slot:selection="{ attr, on, item, selected }">
    <v-chip
      v-bind="attr" pill
      :input-value="selected"
      :color="side" label
      class="white--text"
      v-on="on">
      <v-avatar left tile>
        <v-icon>person</v-icon>
      </v-avatar>
      <span class="headline" v-text="item.nickname" />
    </v-chip>
    </template>
    <template v-slot:item="{ item }">
    <v-list-item-avatar>
      <v-icon>person</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-text="item.nickname"></v-list-item-title>
    </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    map: Object,
    label: String,
    field: String,
    players: Array,
    side: String,
    solo: {
      type: Boolean,
      default: true
    }
  },
  watch: { 
    'map': function(val) {this.$mount(); this.$forceUpdate();}
  },
  data () {
    return {
      isLoading: false,
      seachPlayer: null
    }
  },
  methods: {
    playerChanged(val) {
      this.$emit('change', val);
      this.$forceUpdate();
      this.$mount();
    },
    // getImg(player) {
    //   return require(`@/assets/${player}.png`);
    // },
  }
}
</script>

<style>

</style>