<template>
  <v-container fluid>
    <!-- {{map}} -->
    <v-row>
      <v-col cols="4" offset="2">
        <v-card color="blue" dark outlined>
           <v-card-title style="display: flex; justify-content: center">
            {{[teams.team1, teams.team2].filter(t => t.id === map.blue_side)[0].name}}
          </v-card-title>
          <v-divider />
         <v-card-text>
            <v-row>
              <v-col cols="12">
                <champion-field @change="championChanged" side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_baron_player)" field="blue_baron_pick" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_jungle_player)" field="blue_jungle_pick" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_mid_player)" field="blue_mid_pick" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_dragon_player)" field="blue_dragon_pick" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_sup_player)" field="blue_sup_pick" :champions="blueChampions" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="red" dark outlined>
          <v-card-title style="display: flex; justify-content: center">
            {{[teams.team1, teams.team2].filter(t => t.id === map.red_side)[0].name}}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <champion-field @change="championChanged" side="red" :map="map" :label="getPlayerName(map.red_side, map.red_baron_player)" field="red_baron_pick" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="red" :map="map" :label="getPlayerName(map.red_side, map.red_jungle_player)" field="red_jungle_pick" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="red" :map="map" :label="getPlayerName(map.red_side, map.red_mid_player)" field="red_mid_pick" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="red" :map="map" :label="getPlayerName(map.red_side, map.red_dragon_player)" field="red_dragon_pick" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <champion-field @change="championChanged" side="red" :map="map" :label="getPlayerName(map.red_side, map.red_sup_player)" field="red_sup_pick" :champions="redChampions" />
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
    watch: {
    },
    computed: {
      blueChampions() {
        return this.champions.filter(c => 
          c.id === this.map.blue_pick_1 || 
          c.id === this.map.blue_pick_2 || 
          c.id === this.map.blue_pick_3 || 
          c.id === this.map.blue_pick_4 || 
          c.id === this.map.blue_pick_5
        );
      },
      redChampions() {
        return this.champions.filter(c => 
          c.id === this.map.red_pick_1 || 
          c.id === this.map.red_pick_2 || 
          c.id === this.map.red_pick_3 || 
          c.id === this.map.red_pick_4 || 
          c.id === this.map.red_pick_5
        );
      }
    },
    data() {
      return {
        teamsList: [this.teams.team1, this.teams.team2],
        blueSidePlayers: [],
        redSidePlayers: [],
      }
    },
    methods: {
      championChanged(arg) {
        // if (arg.field.indexOf('blue') > -1) {
        //   const blueFields = ['blue_baron_pick', 'blue_jungle_pick', 'blue_mid_pick', 'blue_dragon_pick', 'blue_sup_pick'].filter(f => f !== arg.field);
        //   for (let field in blueFields) {
        //     if (this.map[blueFields[field]] === arg.id) {
        //       this.map[blueFields[field]] = this.blueChampions.filter(c => c.id !== arg.id && c.id && c.id !== this.map.blue_baron_pick && c.id !== this.map.blue_jungle_pick && c.id !== this.map.blue_mid_pick && c.id !== this.map.blue_dragon_pick && c.id !== this.map.blue_sup_pick)[0].id;
        //       this.$forceUpdate();
        //       this.$mount();
        //     }
        //   }
        // } else {
        //   const redFields = ['red_baron_pick', 'red_jungle_pick', 'red_mid_pick', 'red_dragon_pick', 'red_sup_pick'].filter(f => f !== arg.field);
        //   for (field in redFields) {
        //     if (this.map[redFields[field]] === arg.id) {
        //       this.map[redFields[field]] = this.redChampions.filter(c => c.id !== arg.id && c.id && c.id !== this.map.red_baron_pick && c.id !== this.map.red_jungle_pick && c.id !== this.map.red_mid_pick && c.id !== this.map.red_dragon_pick && c.id !== this.map.red_sup_pick)[0].id;
        //       this.$forceUpdate();
        //       this.$mount();
        //     }
        //   }
        // }
      },
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
