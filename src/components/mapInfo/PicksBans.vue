<template>
  <v-container fluid>
    <!-- {{map}} -->
    <v-row>
      <v-col cols="6">
        <v-card color="blue darken-2" dark outlined>
           <v-card-title style="display: flex; justify-content: center">
            {{[teams.team1, teams.team2].filter(t => t.id === map.blue_side)[0].name}}
          </v-card-title>
          <v-divider />
          <v-card-title>
            <v-row>
              <v-col cols="6">
                Bans
              </v-col>
              <v-col cols="6">
                Picks
              </v-col>
            </v-row>
          </v-card-title>
         <v-card-text>
            <v-row>
              <v-col cols="6">
                <champion-field side="blue" :map="map" label="Ban 1" field="blue_ban_1" :champions="champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_baron_player)" field="blue_pick_1" :champions="bluePick1Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" label="Ban 2" field="blue_ban_2" :champions="blueBan2Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_jungle_player)" field="blue_pick_2" :champions="bluePick2Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" label="Ban 3" field="blue_ban_3" :champions="blueBan3Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_mid_player)" field="blue_pick_3" :champions="bluePick3Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" label="Ban 4" field="blue_ban_4" :champions="blueBan4Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_dragon_player)" field="blue_pick_4" :champions="bluePick4Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" label="Ban 5" field="blue_ban_5" :champions="blueBan5Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_sup_player)" field="blue_pick_5" :champions="bluePick5Champions" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card color="red darken-2" dark outlined>
          <v-card-title style="display: flex; justify-content: center">
            {{[teams.team1, teams.team2].filter(t => t.id === map.red_side)[0].name}}
          </v-card-title>
          <v-divider />
          <v-card-title>
            <v-row>
              <v-col cols="6" style="display: flex; justify-content: flex-end">
                Picks
              </v-col>
              <v-col cols="6" style="display: flex; justify-content: flex-end">
                Bans
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <champion-field side="red" :map="map" :label="getPlayerName(map.red_side, map.red_baron_player)" field="red_pick_1" :champions="redPick1Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" label="Ban 1" field="red_ban_1" :champions="redBan1Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" :label="getPlayerName(map.red_side, map.red_jungle_player)" field="red_pick_2" :champions="redPick2Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" label="Ban 2" field="red_ban_2" :champions="redBan2Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" :label="getPlayerName(map.red_side, map.red_mid_player)" field="red_pick_3" :champions="redPick3Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" label="Ban 3" field="red_ban_3" :champions="redBan3Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" :label="getPlayerName(map.red_side, map.red_dragon_player)" field="red_pick_4" :champions="redPick4Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" label="Ban 4" field="red_ban_4" :champions="redBan4Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" :label="getPlayerName(map.red_side, map.red_sup_player)" field="red_pick_5" :champions="redPick5Champions" />
              </v-col>
              <v-col cols="6">
                <champion-field side="red" :map="map" label="Ban 5" field="red_ban_5" :champions="redBan5Champions" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import ChampionField from '@/components/mapInfo/ChampionField'
  export default {
    name: 'Matchups',
    props: {
      map: Object,
      teams: Object,
      champions: Array
    },
    components: {
      ChampionField
    },
    created () {
    },
    computed: {
      redBan1Champions() {   return this.champions.filter(c => c.id !== this.map.blue_ban_1); },
      blueBan2Champions() {  return this.redBan1Champions.filter(c => c.id !== this.map.red_ban_1); },
      redBan2Champions() {   return this.blueBan2Champions.filter(c => c.id !== this.map.blue_ban_2); },
      blueBan3Champions() {  return this.redBan2Champions.filter(c => c.id !== this.map.red_ban_2); },
      redBan3Champions() {   return this.blueBan3Champions.filter(c => c.id !== this.map.blue_ban_3); },
      bluePick1Champions() { return this.redBan3Champions.filter(c => c.id !== this.map.red_ban_3); },
      redPick1Champions() {  return this.bluePick1Champions.filter(c => c.id !== this.map.blue_pick_1); },
      redPick2Champions() {  return this.redPick1Champions.filter(c => c.id !== this.map.red_pick_1); },
      bluePick2Champions() { return this.redPick2Champions.filter(c => c.id !== this.map.red_pick_2); },
      bluePick3Champions() { return this.bluePick2Champions.filter(c => c.id !== this.map.blue_pick_2); },
      redPick3Champions() {  return this.bluePick3Champions.filter(c => c.id !== this.map.blue_pick_3); },
      redBan4Champions() {   return this.redPick3Champions.filter(c => c.id !== this.map.red_pick_3); },
      blueBan4Champions() {  return this.redBan4Champions.filter(c => c.id !== this.map.red_ban_4); },
      redBan5Champions() {   return this.blueBan4Champions.filter(c => c.id !== this.map.blue_ban_4); },
      blueBan5Champions() {  return this.redBan5Champions.filter(c => c.id !== this.map.red_ban_5); },
      redPick4Champions() {  return this.blueBan5Champions.filter(c => c.id !== this.map.blue_ban_5); },
      bluePick4Champions() { return this.redPick4Champions.filter(c => c.id !== this.map.red_pick_4); },
      bluePick5Champions() { return this.bluePick4Champions.filter(c => c.id !== this.map.blue_pick_4); },
      redPick5Champions() {  return this.bluePick5Champions.filter(c => c.id !== this.map.blue_pick_5); },
    },
    watch: {
      'map.blue_pick_1': function(val) { this.map.blue_baron_pick = val; },
      'map.blue_pick_2': function(val) { this.map.blue_jungle_pick = val; },
      'map.blue_pick_3': function(val) { this.map.blue_mid_pick = val; },
      'map.blue_pick_4': function(val) { this.map.blue_dragon_pick = val; },
      'map.blue_pick_5': function(val) { this.map.blue_sup_pick = val; },
      'map.red_pick_1': function(val) { this.map.red_baron_pick = val; },
      'map.red_pick_2': function(val) { this.map.red_jungle_pick = val; },
      'map.red_pick_3': function(val) { this.map.red_mid_pick = val; },
      'map.red_pick_4': function(val) { this.map.red_dragon_pick = val; },
      'map.red_pick_5': function(val) { this.map.red_sup_pick = val; },
    },
    data() {
      return {
        teamsList: [this.teams.team1, this.teams.team2],
        blueSidePlayers: [],
        redSidePlayers: [],
      }
    },
    methods: {
      getImg(champion) {
        return require(`@/assets/${champion}.png`);
      },
      getPlayerName(teamId, playerId) {
        if (this.teams.team1.id == teamId)
          return this.teams.team1.players.filter(p => p.id === playerId)[0].nickname;
        else
          return this.teams.team2.players.filter(p => p.id === playerId)[0].nickname;
      }
    }
  }
</script>
