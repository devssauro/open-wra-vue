<template>
  <v-container fluid>
    <!-- {{map}} -->
    <v-row>
      <v-col cols="12">
        <v-card outlined>
          <v-card-title>
            Resultado final
          </v-card-title>
          <v-card-title>
            <v-row>
              <v-col cols="3">
                <v-text-field outlined v-model="map.patch" label="Patch" />
              </v-col>
              <v-col cols="3">
                <v-text-field outlined v-model="map.length" label="Duração" />
              </v-col>
              <v-col cols="3">
                <v-select 
                  v-model="map.winner"
                  :items="[teams.team1, teams.team2]"
                  item-text="name"
                  item-value="id"
                  label="Vencedor"
                  outlined
                  @change="changeWinnerSide"/>
              </v-col>
              <v-col cols="3">
                <v-text-field readonly
                  v-model="map.winner_side"
                  label="Lado Vencedor"
                  outlined/>
              </v-col>
              <v-col class="py-0" cols="12">
                <v-text-field dense
                  v-model="map.vod_link"
                  label="Link do VOD"
                  outlined/>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card color="blue" dark outlined>
           <v-card-title style="display: flex; justify-content: center">
            {{[teams.team1, teams.team2].filter(t => t.id === map.blue_side)[0].name}}
          </v-card-title>
          <v-divider />
         <v-card-text>
            <v-row>
              <v-col cols="11" offset="1">
                <v-text-field v-model="map.blue_turrets_destroyed" label="Torres destruídas" solo light/>
              </v-col>
              <v-col cols="12">
                <final-stats-blue side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_baron_player)" field="baron" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-blue side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_jungle_player)" field="jungle" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-blue side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_mid_player)" field="mid" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-blue side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_dragon_player)" field="dragon" :champions="blueChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-blue side="blue" :map="map" :label="getPlayerName(map.blue_side, map.blue_sup_player)" field="sup" :champions="blueChampions" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card color="red" dark outlined>
          <v-card-title style="display: flex; justify-content: center">
            {{[teams.team1, teams.team2].filter(t => t.id === map.red_side)[0].name}}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="11">
                <v-text-field v-model="map.red_turrets_destroyed" label="Torres destruídas" solo light/>
              </v-col>
              <v-col cols="12">
                <final-stats-red side="red" :map="map" :label="getPlayerName(map.red_side, map.red_baron_player)" field="baron" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-red side="red" :map="map" :label="getPlayerName(map.red_side, map.red_jungle_player)" field="jungle" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-red side="red" :map="map" :label="getPlayerName(map.red_side, map.red_mid_player)" field="mid" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-red side="red" :map="map" :label="getPlayerName(map.red_side, map.red_dragon_player)" field="dragon" :champions="redChampions" />
              </v-col>
              <v-col cols="12">
                <final-stats-red side="red" :map="map" :label="getPlayerName(map.red_side, map.red_sup_player)" field="sup" :champions="redChampions" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-btn block color="green" dark depressed @click="save">
          Salvar
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import ChampionField from '@/components/mapInfo/ChampionField'
  import FinalStatsBlue from '@/components/mapInfo/FinalStatsBlue'
  import FinalStatsRed from '@/components/mapInfo/FinalStatsRed'
  export default {
    name: 'Matchups',
    props: {
      map: Object,
      teams: Object,
      champions: Array
    },
    components: {
      FinalStatsBlue,
      FinalStatsRed,
    },
    created () {
    },
    watch: {
    },
    computed: {
      blueChampions() {
        return this.champions.filter(c => c.id === this.map.blue_baron_pick || c.id === this.map.blue_jungle_pick || c.id === this.map.blue_mid_pick || c.id === this.map.blue_dragon_pick || c.id === this.map.blue_sup_pick);
      },
      redChampions() {
        return this.champions.filter(c => c.id === this.map.red_baron_pick || c.id === this.map.red_jungle_pick || c.id === this.map.red_mid_pick || c.id === this.map.red_dragon_pick || c.id === this.map.red_sup_pick);
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
      changeWinnerSide(val) {
        this.map.winner_side = this.map.blue_side === val ? 'blue' : 'red';
      },
      getImg(champion) {
        return require(`@/assets/${champion}.png`);
      },
      save() {
        this.$emit('save', true);
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
