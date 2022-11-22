<template>
  <v-row class="pb-0 mb-n4">
    <v-col cols="1" class="pb-0 mb-n4">
      <v-avatar>
        <v-img :src="getChampionAvatar(map[`blue_${field}_pick`])" />
      </v-avatar>
    </v-col>
    <v-col cols="1" class="pb-0 mb-n4">
      <v-text-field solo light label="K" v-model="map[`blue_${field}_kills`]" />
    </v-col>
    <v-col cols="1" class="pb-0 mb-n4">
      <v-text-field solo light label="D" v-model="map[`blue_${field}_deaths`]" />
    </v-col>
    <v-col cols="1" class="pb-0 mb-n4">
      <v-text-field solo light label="A" v-model="map[`blue_${field}_assists`]" />
    </v-col>
    <v-col cols="3" class="pb-0 mb-n4">
      <v-text-field solo light label="Dano aplicado" v-model="map[`blue_${field}_dmg_dealt`]" />
    </v-col>
    <v-col cols="3" class="pb-0 mb-n4">
      <v-text-field solo light label="Dano sofrido" v-model="map[`blue_${field}_dmg_taken`]" />
    </v-col>
    <v-col cols="2" class="pb-0 mb-n4">
      <v-text-field solo light label="Total Gold" v-model="map[`blue_${field}_total_gold`]" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    map: Object,
    label: String,
    field: String,
    champions: Array,
    side: String
  },
  watch: { 
    'map': function(val) {this.$mount(); this.$forceUpdate();}
  },
  data () {
    return {
      isLoading: false,
      seachChampion: null
    }
  },
  methods: {
    getChampionAvatar(championId) {
      const champion = this.champions.filter(c => c.id == championId);
      if (champion.length === 0)
        return
      return require(`@/assets/${champion[0].name}.png`);
    },
    championChanged(val) {
      this.$emit('change', {id: val, field: this.field});
      this.$forceUpdate();
      this.$mount();
    },
    getImg(champion) {
      return require(`@/assets/${champion}.png`);
    },
  }
}
</script>

<style>

</style>