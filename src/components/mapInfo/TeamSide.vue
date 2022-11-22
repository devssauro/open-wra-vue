<template>
  <v-container fluid>
    <v-row>
      <!-- {{map}} -->
      <v-col cols="4" offset="2">
        <v-card color="blue" dark outlined>
          <v-card-title>
            BLUE SIDE
          </v-card-title>
          <v-card-text>
            <v-select 
              v-model="map.blue_side"
              :items="[teams.team1, teams.team2]"
              item-text="name"
              item-value="id"
              label="Time"
              solo light/>
            <v-select 
              v-model="map.blue_baron_player"
              :items="blueSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Baron"
              solo light/>
            <v-select 
              v-model="map.blue_jungle_player"
              :items="blueSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Jungle"
              solo light/>
            <v-select 
              v-model="map.blue_mid_player"
              :items="blueSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Mid"
              solo light/>
            <v-select 
              v-model="map.blue_dragon_player"
              :items="blueSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Dragon"
              solo light/>
            <v-select 
              v-model="map.blue_sup_player"
              :items="blueSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Sup"
              solo light/>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="red" dark outlined>
          <v-card-title>
            RED SIDE
          </v-card-title>
          <v-card-text>
            <v-select 
              v-model="map.red_side"
              :items="[teams.team1, teams.team2]"
              item-text="name"
              item-value="id"
              label="Time"
              solo light/>
            <v-select 
              v-model="map.red_baron_player"
              :items="redSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Baron"
              solo light/>
            <v-select 
              v-model="map.red_jungle_player"
              :items="redSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Jungle"
              solo light/>
            <v-select 
              v-model="map.red_mid_player"
              :items="redSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Mid"
              solo light/>
            <v-select 
              v-model="map.red_dragon_player"
              :items="redSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Dragon"
              solo light/>
            <v-select 
              v-model="map.red_sup_player"
              :items="redSidePlayers"
              item-text="nickname"
              item-value="id"
              label="Sup"
              solo light/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'Matchups',
    props: {
      map: Object,
      teams: Object,
    },
    created () {
      if (this.teams.team1.id === this.map.blue_side) {
        this.blueSidePlayers = this.teams.team1.players;
        this.redSidePlayers = this.teams.team2.players;
      } else {
        this.blueSidePlayers = this.teams.team2.players;
        this.redSidePlayers = this.teams.team1.players;
      }
      },
    watch: {
      'map.blue_side': function (val) {
        if (this.teams.team1.id === val) {
          this.blueSidePlayers = this.teams.team1.players;
          this.redSidePlayers = this.teams.team2.players;
          this.map.red_side = this.teams.team2.id;
        } else {
          this.blueSidePlayers = this.teams.team2.players;
          this.redSidePlayers = this.teams.team1.players;
          this.map.red_side = this.teams.team1.id;
        }
        this.map.blue_baron_player = this.blueSidePlayers[0].id;
        this.map.blue_jungle_player = this.blueSidePlayers[1].id;
        this.map.blue_mid_player = this.blueSidePlayers[2].id;
        this.map.blue_dragon_player = this.blueSidePlayers[3].id;
        this.map.blue_sup_player = this.blueSidePlayers[4].id;
        this.map.red_baron_player = this.redSidePlayers[0].id;
        this.map.red_jungle_player = this.redSidePlayers[1].id;
        this.map.red_mid_player = this.redSidePlayers[2].id;
        this.map.red_dragon_player = this.redSidePlayers[3].id;
        this.map.red_sup_player = this.redSidePlayers[4].id;
     },
    },
    data() {
      return {
        teamsList: [this.teams.team1, this.teams.team2],
        blueSidePlayers: [],
        redSidePlayers: [],
      }
    },
  }
</script>
