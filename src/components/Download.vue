<template>
  <v-main fill-height>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-sheet class="pt-6" rounded="lg">
            <v-row>
              <v-col cols="4">
                <v-autocomplete multiple clearable class="px-4 mb-n5" outlined label="Campeonato" v-model="search.t"
                  :items="tournaments" item-text="name" item-value="id" @change="tournamentChanged" />
              </v-col>
              <v-col cols="4">
                <v-autocomplete :disabled="search.t.length > 1" multiple clearable class="px-4 mb-n5" outlined
                  label="Time" v-model="search.team" :items="teams" item-text="name" item-value="id" />
              </v-col>
              <v-col cols="4">
                <v-autocomplete multiple clearable class="px-4 mb-n5" outlined label="Patch" v-model="search.patch"
                  :items="['3.2a', '3.2b', '3.2c', '3.3']" />
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-card class="pb-4">
            <v-card-title>Picks & Bans</v-card-title>
            <v-card-text>
              <v-select label="winner_loser" filled dense v-model="search.winner_loser" :items="winnerLoser"
                item-text="title" item-value="value" />
              <v-select label="blind_response" filled dense v-model="search.blind_response" :items="blindResponse"
                item-text="title" item-value="value" />
              <v-select label="pick_rotation" filled dense v-model="search.pick_rotation" :items="pickRotation"
                item-text="title" item-value="value" />
              <v-select label="Campos de objetivos" filled @change="changeObjectiveValues" :items="objectiveTypes"
                item-text="title" item-value="value" v-model="objectiveFieldsValue" v-if="isAnalystUser" />
              <template v-for="binField in binFields" v-if="false">
                <v-select :key="binField" :label="binField" filled dense v-model="search.first_blood" :items="objectiveTypes"
                  item-text="title" item-value="value" />
              </template>
            </v-card-text>
            <v-card-actions class="mt-n4">
              <v-row>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="downloadPicksBans">Download</v-btn>
                </v-col>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="copyPicksBansLink(true)">Copy download link</v-btn>
                </v-col>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="copyPicksBansImportdata(true)">Copy importdata</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="pb-4">
            <v-card-title>Times</v-card-title>
            <v-card-text>
              <v-select label="winner_loser" filled dense v-model="search.winner_loser" :items="winnerLoser"
                item-text="title" item-value="value" />
            </v-card-text>
            <v-card-actions class="mt-n4">
              <v-row>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="downloadMatchStats">Download</v-btn>
                </v-col>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="copyMatchStatsLink(true)">Copy download link</v-btn>
                </v-col>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="copyMatchStatsImportdata(true)">Copy importdata</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        <!-- </v-col>
        <v-col cols="4"> -->
          <v-card class="pb-4 mt-4">
            <v-card-title>Jogos</v-card-title>
            <v-card-text>
            </v-card-text>
            <v-card-actions class="mt-n4">
              <v-row>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="downloadMap">Download</v-btn>
                </v-col>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="copyMapLink(true)">Copy download link</v-btn>
                </v-col>
                <v-col cols="12" class="my-n2">
                  <v-btn block @click="copyMapImportdata(true)">Copy importdata</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-snackbar v-model="snackbar">
          {{ snackText }}
          <template v-slot:action="{ attrs }">
            <v-btn color="pink" icon v-bind="attrs" @click="snackbar = false">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import {bus} from '@/main';
import axios from 'axios';
export default {
  created() {
    this.getTournaments();
    this.getTeams();
    bus.$on('login', (user) => {
      this.user = user;
    });
  },
  computed: {
    isAnalystUser() {
      if (this.user !== null && this.user !== undefined) {
        return this.user.roles.indexOf('analyst') > -1;
      } else
        return false;
    },
    axiosParams() {
      const params = new URLSearchParams();
      if (this.user !== null && this.user !== undefined) {
        params.append('auth_token', this.user.authentication_token);
      }
      for (let t in this.search.t) {
        if (this.search.t[t] !== null)
          params.append('t', this.search.t[t]);
      }
      if (this.search.t.length < 2)
        for (let t in this.search.team) {
          if (this.search.team[t] !== null)
            params.append('team', this.search.team[t]);        
        }
      for (let t in this.search.patch) {
        if (this.search.patch[t] !== null)
          params.append('patch', this.search.patch[t]);
      }
      params.append('winner_loser', this.search.winner_loser);
      params.append('blind_response', this.search.blind_response);
      params.append('pick_rotation', this.search.pick_rotation);
      for (let field in this.binFields)
        params.append(this.binFields[field], this.objectiveFieldsValue);
      // console.log(params.toString());
      return params;
    }
  },
  data: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    snackText: 'AAAAAAAA',
    snackbar: false,
    tournaments: [],
    teams: [],
    route: window.axios.defaults.baseURL,
    objectiveFieldsValue: 'numeric',
    search: {
      patch: [null],
      t: [8],
      team: [null],
      sort: 'name',
      winner_loser: 'numeric',
      blind_response: 'numeric',
      pick_rotation: 'explicit_eng',
      first_blood: 'numeric',
      is_player_first_blood: 'numeric',
      is_player_first_death: 'numeric',
      first_herald: 'numeric',
      first_herald_teamfight: 'numeric',
      first_herald_stealed: 'numeric',
      first_herald: 'numeric',
      first_herald_teamfight: 'numeric',
      first_herald_stealed: 'numeric',
      first_tower: 'numeric',
      first_tower_herald: 'numeric',
      first_drake: 'numeric',
      first_drake_teamfight: 'numeric',
      first_drake_stealed: 'numeric',
      second_drake: 'numeric',
      second_drake_teamfight: 'numeric',
      second_drake_stealed: 'numeric',
      third_drake: 'numeric',
      third_drake_teamfight: 'numeric',
      third_drake_stealed: 'numeric',
    },
    binFields: [
      'first_herald',
      'first_herald_teamfight', 
      'first_herald_stealed',
      'second_herald',
      'second_herald_teamfight', 
      'second_herald_stealed',
      'first_tower', 
      'first_tower_herald', 
      'first_drake', 
      'first_drake_teamfight', 
      'first_drake', 
      'first_drake_teamfight', 
      'first_drake_stealed',
      'second_drake', 
      'second_drake_teamfight', 
      'second_drake_stealed',
      'third_drake', 
      'third_drake_teamfight',
      'second_drake_stealed'
    ],
    objectiveTypes: [
      {
        'title': 'Numérico (1/0)',
        'value': 'numeric'
      },
      {
        'title': 'Binário (true/false)',
        'value': 'binary'
      }
    ],
    winnerLoser: [
      {
        'title': 'English (winner/loser)', 
        'value': 'explicit_eng'
      },
      {
        'title': 'English (W/L)',
        'value': 'letter_eng'
      },
      {
        'title': 'Português (vitória/derrota)',
        'value': 'explicit_pt'
      },
      {
        'title': 'Português (V/D)',
        'value': 'letter_pt'
      },
      {
        'title': 'Numérico (1/0)',
        'value': 'numeric'
      },
      {
        'title': 'Binário (true/false)',
        'value': 'binary'
      },
    ],
    pickRotation: [
      {
        'title': 'English (B1,B2/B3... R1/R2, R3)',
        'value': 'explicit_eng'
      },
      {
        'title': 'Português (A1,A2/A3... V1/V2, V3)',
        'value': 'explicit_pt'
      },
      {
        'title': 'Numérico (1, 2, 3, 4)',
        'value': 'numeric'
      },
    ],
    blindResponse: [
      {
        'title': 'English (blind/response)',
        'value': 'explicit_eng'
      },
      {
        'title': 'English (B/R)',
        'value': 'letter_eng'
      },
      {
        'title': 'Numérico (1/0)',
        'value': 'numeric'
      },
      {
        'title': 'Binário (true/false)',
        'value': 'binary'
      },
    ],
  }),
  methods: {
    changeObjectiveValues(v) {
      for (var field in this.binField)
        this.search[field] = v;

    },
    getTournaments() {
      axios.get('v1/tournament').then(res => {
        this.tournaments = res.data.tournaments.map(m => {
          return m;
        });
      });
    },
    tournamentChanged(val) {
      this.search.team = [null];
      this.getTeams(true);
    },
    getTeams(notify) {
      axios.get(`v1/team`, { params: this.axiosParams }).then(res => {
        this.teams = res.data.teams;
        if (notify) this.search.team = [null];
      });
    },
    tournamentChanged(val) {
      this.getTeams();
    },
    downloadPicksBans() {
      // axios({
      //   url: `${this.route}/v1/download/picks_bans?${this.axiosParams.toString()}`,
      //   method: 'GET',
      //   responseType: 'blob', // important
      // }).then((response) => {
      //   console.log(response.headers['content-disposition']);
      //   const url = window.URL.createObjectURL(new Blob([response.data]));
      //   const link = document.createElement('a');
      //   link.href = url;
      //   link.setAttribute('download',  'file.csv');
      //   document.body.appendChild(link);
      //   link.click();
      // });
      window.location = `${this.route}/v1/download/picks_bans?${this.axiosParams.toString()}`;
    },
    copyPicksBansLink(notify) {
      const route = `${this.route}/v1/download/picks_bans?${this.axiosParams.toString()}`;
      navigator.clipboard.writeText(route);
      this.snackText = 'link copiado para a área de transferência';
      this.snackbar = notify;
      return route;
    },
    copyPicksBansImportdata(notify) {
      const comando = `=IMPORTDATA("${this.copyPicksBansLink(false)}")`;
      navigator.clipboard.writeText(comando);
      this.snackText = 'Comando para a área de transferência';
      this.snackbar = notify;
      return comando;
    },
    downloadMatchStats() {
      window.location = `${this.route}/v1/download/match_stats?${this.axiosParams.toString()}`;
    },
    copyMatchStatsLink(notify) {
      const route = `${this.route}/v1/download/match_stats?${this.axiosParams.toString()}`;
      navigator.clipboard.writeText(route);
      this.snackText = 'link copiado para a área de transferência';
      this.snackbar = notify;
      return route;
    },
    copyMatchStatsImportdata(notify) {
      const comando = `=IMPORTDATA("${this.copyMatchStatsLink(false)}")`;
      navigator.clipboard.writeText(comando);
      this.snackText = 'Comando para a área de transferência';
      this.snackbar = notify;
      return comando;
    },
    downloadMap() {
      window.location = `${this.route}/v1/download/map?${this.axiosParams.toString()}`;
    },
    copyMapLink(notify) {
      const route = `${this.route}/v1/download/map?${this.axiosParams.toString()}`;
      navigator.clipboard.writeText(route);
      this.snackText = 'link copiado para a área de transferência';
      this.snackbar = notify;
      return route;
    },
    copyMapImportdata(notify) {
      const comando = `=IMPORTDATA("${this.copyMapLink(false)}")`;
      navigator.clipboard.writeText(comando);
      this.snackText = 'Comando para a área de transferência';
      this.snackbar = notify;
      return comando;
    }
  }
}
</script>

<style>

</style>