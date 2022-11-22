<template>
  <v-main fill-height>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-sheet rounded="lg" class="pa-2">
            <v-row :style="{ 'visibility' : isLoading ? 'hidden' : 'visible' }">
              <v-col cols="12" sm="12" md="5">
                <v-card class="" outlined v-if="search.champion_id !== null && search.champion_id !== undefined">
                  <v-card-title>
                    <v-container>
                      <v-row align="start">
                        <v-avatar size="100" rounded class="mt-8">
                          <img :alt="selectedChampion.name" :src="getImg(selectedChampion.name)">
                        </v-avatar>
                        <v-col cols="8" class="py-0">
                          <p class="display-1">
                            {{selectedChampion.name}}
                          </p>
                          <p class="headline">
                            {{avg_stats.avg_kills}} / {{avg_stats.avg_deaths}} / {{avg_stats.avg_assists}}
                          </p>
                          <p class="mb-0" v-if="selectedChampionStats !== undefined">
                            <span>
                              {{selectedChampionStats.qty_picks}} PICKS
                            </span>
                            <span class="pl-2">
                              {{selectedChampionStats.qty_bans}} BANS
                            </span><br />
                            <span>
                              {{selectedChampionStats.percent_presence}}% PRESENÇA
                            </span>
                          </p>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-title>
                </v-card>
              </v-col>
              <v-col cols="12" sm="12" md="7">
                <v-card class="pa-2 py-3" outlined
                  v-if="search.champion_id !== null && search.champion_id !== undefined">
                  <v-row>
                    <v-col cols="6" class="text-center">
                      <span class="display-3">
                        {{sideStats.total_games}}
                      </span>
                      <span class="headline">Jogos</span>
                      <v-divider class="my-2" />
                      <v-row>
                        <v-col cols="6" class="blue--text">
                          <span class="display-1">
                            {{sideStats.blue_games}}
                          </span>
                          <span class="headline">Jogos</span><br />
                          <span>Blue side</span>
                        </v-col>
                        <v-col cols="6" class="red--text">
                          <span class="display-1">
                            {{sideStats.red_games}}
                          </span>
                          <span class="headline">Jogos</span><br />
                          <span>Red side</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="6" class="text-center">
                      <span class="display-3">
                        {{sideStats.percent_total_wins.toFixed(1)}}%
                      </span>
                      <span class="headline">Vitórias</span>
                      <v-divider class="my-2" />
                      <v-row>
                        <v-col cols="6" class="blue--text">
                          <span class="display-1">
                            {{sideStats.percent_total_blue_wins.toFixed(1)}}%
                          </span><br />
                          <span>Vitórias blue</span>
                        </v-col>
                        <v-col cols="6" class="red--text">
                          <span class="display-1">
                            {{ sideStats.percent_total_red_wins.toFixed(1)}}%
                          </span><br />
                          <span>Vitórias red</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
      </v-row>
      </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-sheet class="pt-6" rounded="lg">
          <v-row>
            <v-col cols="4">
              <v-autocomplete clearable @change="tournamentChanged" class="px-4 mb-n5" outlined label="Campeonato"
                v-model="search.t" :items="tournaments" item-text="name" item-value="id" />
            </v-col>
            <v-col cols="4">
              <v-autocomplete clearable @change="getChampions" class="px-4 mb-n5" outlined label="Patch"
                v-model="search.patch" :items="patches" />
            </v-col>
            <v-col cols="4">
              <v-autocomplete clearable @change="getChampions" class="px-4 mb-n5" outlined label="Side"
                v-model="search.side" :items="['red', 'blue']" />
            </v-col>
            <v-col cols="6">
              <champion-field @change="championChanged" class="px-4" :solo="false" side="grey darken-1" :map="search"
                label="Champion" field="champion_id" :champions="champions" />
            </v-col>
            <v-col cols="6">
              <v-autocomplete clearable multiple @change="getAllInfo" class="px-4 mb-n5" outlined label="Role"
                v-model="search.role" :items="availableRoles" item-text="title" item-value="tag" />
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" icon v-bind="attrs" @click="snackbar = false">
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
  import axios from 'axios'
  import ChampionField from '@/components/mapInfo/ChampionField'
  export default {
    name: 'Matchups',
    components: {
      ChampionField
    },
    created() {
      // this.getChampionsFromRole('mid');
      this.getChampions();
      this.getTournaments();
      this.getPatches();
      this.getChampionStats();
    },
  data: () => ({
    isLoading: false,
    championStats: [],
    patches: [],
    avg_stats: {},
    tournaments: [],
    search: {
      champion_id: 1,
      // role: ['mid'],
      t: null,
      patch: null,
      side: null
    },
    selectedChampion: {
      id: null,
      name: 'Ahri',
    },
    snackText: '',
    snackbar: false,
    champions: [],
    kda: {
      kills: 0,
      deaths: 0,
      assists: 0,
      total_avg: 0,
    },
    sideStats: {
      "blue_games": 0,
      "blue_wins": 0,
      "percent_blue_games": 0,
      "percent_red_games": 0,
      "percent_total_blue_wins": 0,
      "percent_total_red_wins": 0,
      "percent_total_wins": 0,
      "red_games": 0,
      "red_wins": 0,
      "total_games": 0,
      "total_wins": 0
    },
    roles: [
      {title: 'TOP', tag: 'baron'},
      {title: 'JG', tag: 'jungle'},
      {title: 'MID', tag: 'mid'},
      {title: 'ADC', tag: 'dragon'},
      {title: 'SUP', tag: 'sup'},
    ],
    availableRoles: []
  }),
  computed: {
    axiosParams() {
      const params = new URLSearchParams();
      for (let role in this.search.role) {
        if (this.search.role[role] !== null)
          params.append('role', this.search.role[role]);
      }
      if (this.search.t !== null)
        params.append('t', this.search.t);
      if (this.search.patch !== null)
        params.append('patch', this.search.patch);
      if (this.search.side !== null)
        params.append('side', this.search.side);
      console.log(params.toString());
      return params;
    },
    selectedChampionStats() {
      // return this.championStats;
      return this.championStats.filter(c => c.champion_id === this.search.champion_id)[0];
    },
  },
  methods: {
    getTournaments() {
      axios.get('v1/tournament').then(res => {
        this.tournaments = res.data.tournaments;
      });
    },
    roleChanged() {
      // this.getChampionsFromRole();
    },
    getChampionStats() {
      axios.get(`v1/view/stats/champion`, { params: this.search }).then(res => {
        this.championStats = res.data.champions;
      });
    },
    championChanged() { 
      this.selectedChampion = this.champions.filter(c => c.id === this.search.champion_id)[0];
      this.availableRoles = this.roles.filter(r => this.selectedChampion.roles.indexOf(r.tag) > -1);
      // this.search.role = this.selectedChampion.roles;
      this.getAllInfo();
    },
    getChampions() {
      axios.get(`v1/view/champion`, { params: this.search }).then(res => {
        this.champions = res.data.champions;
        const _champions = this.champions.filter(c => c.id === this.selectedChampion.id);
        if (this.selectedChampion.id === null || _champions.length === 0)
          this.selectedChampion = this.champions[0];
        this.search.champion_id = this.selectedChampion.id;
        this.availableRoles = this.roles.filter(r => this.selectedChampion.roles.indexOf(r.tag) > -1);
        this.getAllInfo();
        // this.selectedChampion = this.champions.filter(c => c.id === this.search.champion_id)[0];
        // this.availableRoles = this.roles.filter(r => r.tag in this.selectedChampion.roles);
      });
    },
    getChampionsFromRole() {
      axios.get(`v1/view/champion/role/${this.search.role}`, {params: this.axiosParams}).then(res => {
        this.champions = res.data.champions;
        const _champions = this.champions.filter(c => c.id === this.selectedChampion.id);
        if (this.selectedChampion.id === null || _champions.length === 0)
          this.selectedChampion = this.champions[0];
        this.search.champion_id = this.selectedChampion.id;
        this.getAllInfo();
      });
    },
    getSideStats() {
      axios.get(`v1/view/champion/${this.selectedChampion.id}/side`, {params: this.axiosParams}).then(res => {
        this.sideStats = res.data;
      });
    },
    getTop3() {
      axios.get(`v1/view/champion/${this.selectedChampion.id}/top3`, {params: this.axiosParams}).then(res => {
        this.teams_with = res.data.teams_with;
        this.teams_against = res.data.teams_against;
      });
    },
    getAllMatches() {
      axios.get(`v1/view/champion/${this.selectedChampion.id}/all_matches`, {params: this.axiosParams}).then(res => {
        this.championsWith = res.data.champions_with;
        this.championsAgainst = res.data.champions_against;
      });
    },
    getPlayers() {
      axios.get(`v1/view/champion/${this.selectedChampion.id}/players`, {params: this.axiosParams}).then(res => {
        this.players = res.data.players;
        this.avg_stats = res.data.general;
      });
    },
    getImg(champion) {
      return require(`@/assets/${champion}.png`);
    },
    getPatches() {
      axios.get(`v1/patch`, { params: this.axiosParams }).then(res => {
        const _patch = res.data.patches.filter(p => p === this.search.patch);
        if (_patch.length === 0)
          this.search.patch = null;
        this.patches = res.data.patches;
      });
    },
    tournamentChanged() {
      this.getPatches();
      this.getChampions();
    },
    getAllInfo() {
      this.isLoading = true;
      this.getSideStats();
      this.getPlayers();
      this.getChampionStats();
      setTimeout(() => { this.isLoading = false; }, 1000);
    }
  }
}
</script>

