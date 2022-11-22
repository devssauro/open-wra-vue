<template>
  <v-card>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in tabs" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <team-side v-if="teamsLoading" :map="map" :teams="teamsInfo" />
      </v-tab-item>
      <v-tab-item>
        <picks-bans :map="map" :teams="teamsInfo" :champions="champions" />
      </v-tab-item>
      <v-tab-item>
        <draft :map="map" :teams="teamsInfo" :champions="champions"/>
      </v-tab-item>
      <v-tab-item>
        <objectives :map="map" :teams="teamsInfo" />
      </v-tab-item>
      <v-tab-item>
        <final-stats @save="save" :map="map" :teams="teamsInfo" :champions="champions" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import axios from 'axios';
  import TeamSide from '@/components/mapInfo/TeamSide';
  import PicksBans from '@/components/mapInfo/PicksBans';
  import Draft from '@/components/mapInfo/Draft';
  import Objectives from '@/components/mapInfo/Objectives';
  import FinalStats from '@/components/mapInfo/FinalStats';
  export default {
    name: 'MapDialog',
    components: {
      TeamSide,
      PicksBans,
      Draft,
      Objectives,
      FinalStats
    },
    props: {
      matchup: Number,
      mapId: Number,
    },
    created () {
      console.log(this.matchup);
      this.getMap();
      this.getPlayers();
      this.getChampions();
    },
    computed: {
    },
    data() {
      return {
        teamsLoading: false,
        champions: [],
        tab: null,
        tabs: ['side', 'Picks & Bans', 'Champion Picks', 'Objectives', 'Map stats'],
        teamsInfo: {
          team1: {
            id: 1,
            name: 'team1',
            players: [
              {id: 1, nickname: 'Baron', 'role': 1},
              {id: 2, nickname: 'Jungle', 'role': 2},
              {id: 3, nickname: 'Mid', 'role': 3},
              {id: 4, nickname: 'Dragon', 'role': 4},
              {id: 5, nickname: 'Sup', 'role': 5},
            ]
          },
          team2: {
            id: 2,
            name: 'team2',
            players: [
              {id: 6, nickname: 'Baron', 'role': 6},
              {id: 7, nickname: 'Jungle', 'role': 7},
              {id: 8, nickname: 'Mid', 'role': 8},
              {id: 9, nickname: 'Dragon', 'role': 9},
              {id: 10, nickname: 'Sup', 'role': 10},
            ]
          }
        }, 
        teamsList: [],
        map: {
          blue_side: null,
          red_side: null,
          blue_baron_player: null,
          blue_jungle_player: null,
          blue_mid_player: null,
          blue_dragon_player: null,
          blue_sup_player: null,
          red_baron_player: null,
          red_jungle_player: null,
          red_mid_player: null,
          red_dragon_player: null,
          red_sup_player: null,
          patch: '3.4b',
        },
      }
    },
    methods: {
      getMap() {
        if (this.mapId !== null && this.mapId !== undefined) 
          axios.get(`/v1/matchup/${this.matchup}/map/${this.mapId}/edit`).then(res => {
            this.map = Object.assign({}, res.data);
          });
      },
      getPlayers() {
        axios.get(`/v1/matchup/${this.matchup}/teams`).then(res => {
          this.teamsInfo = Object.assign({}, res.data);
          this.teamsLoading = true;
        });
      },
      getChampions() {
        this.isLoading = true;
        axios.get('v1/champion').then(res => {
          this.champions = res.data.champions;
          this.isLoading = false;
        });
      },
      save(signal) {
        // console.log('MapDialog');
        if (this.mapId !== null && this.mapId !== undefined) 
          axios.put(`v1/matchup/${this.matchup}/map/${this.mapId}/edit`, this.map).then(res => {
            this.$emit('saved', true);
          });
        else
          axios.post(`v1/matchup/${this.matchup}/map`, this.map).then(res => {
            this.$emit('saved', true);
          });
      }
    }
  }
</script>
