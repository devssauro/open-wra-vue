<template>
  <v-autocomplete
    @change="championChanged"
    v-model="map[field]"
    :items="champions"
    :loading="isLoading"
    :search-input.sync="seachChampion"
    hide-details
    hide-selected
    item-text="name"
    item-value="id"
    :label="label"
    :solo="solo"
    :outlined="!solo">
    <template v-slot:no-data>
    <v-list-item>
      <v-list-item-title>
        Digite o nome do 
        <strong>Campeão</strong>
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
        <v-img :src="getImg(item.name)" />
      </v-avatar>
      <span class="headline" v-text="item.name" />
    </v-chip>
    </template>
    <template v-slot:item="{ item }">
    <v-list-item-avatar>
        <v-img :src="getImg(item.name)" />
    </v-list-item-avatar>
    <v-list-item-content>
        <v-list-item-title v-text="item.name"></v-list-item-title>
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
    champions: Array,
    side: String,
    solo: {
      type: Boolean,
      default: true
    }
  },
  watch: { 
    'map': function(val) {this.$mount(); this.$forceUpdate();}
  },
  created() {
  },
  data () {
    return {
      isLoading: false,
      seachChampion: null
    }
  },
  methods: {
    championChanged(val) {
      this.$emit('change', val);
      this.$forceUpdate();
      this.$mount();
    },
    getImg(champion) {
      if (champion)
        return require(`@/assets/${champion}.png`);
      return;
    },
  }
}
</script>

<style>

</style>