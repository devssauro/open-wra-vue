<template>
  <v-main fill-height>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-sheet class="pt-6" rounded="lg">
            <v-row>
              <v-col cols="3">
                <v-select @change="roleChanged" class="px-4 mb-n5" outlined label="Role" v-model="search.role"
                  :items="roles" item-text="title" item-value="tag" />
              </v-col>
              <v-col cols="3">
                <v-autocomplete clearable @change="getPatches" class="px-4 mb-n5" outlined label="Campeonato"
                  v-model="search.t" :items="tournaments" item-text="name" item-value="id" />
              </v-col>
              <v-col cols="3">
                <v-autocomplete clearable @change="getPlayersFromRole" class="px-4 mb-n5" outlined label="Patch"
                  v-model="search.patch" :items="patches" />
              </v-col>
              <v-col cols="3">
                <v-autocomplete clearable @change="getPlayersFromRole" class="px-4 mb-n5" outlined label="Side"
                  v-model="search.side" :items="['red', 'blue']" />
              </v-col>
              <v-col cols="12">
                <player-field @change="playerChanged" class="px-4" :solo="false" side="grey darken-1" :map="search"
                  label="Player" field="player_id" :players="players" />
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet rounded="lg" class="pa-2">
            <v-row>
              <v-col cols="3" sm="12" md="5">
                <v-card class="" outlined v-if="search.player_id !== null && search.player_id !== undefined">
                  <v-card-title>
                    <v-container>
                      <v-row align="start">
                        <v-avatar size="100" rounded>
                          <v-icon x-large>person</v-icon>
                        </v-avatar>
                        <v-col cols="8" class="py-0">
                          <p class="display-1">
                            {{selectedPlayer.nickname}}
                          </p>
                          <p class="headline">
                            {{avg_stats.avg_kills}} / {{avg_stats.avg_deaths}} / {{avg_stats.avg_assists}}
                          </p>
                          <p class=" mb-0">
                            <span>
                              {{avg_stats.ddpm}} DDPM
                            </span>
                            <span class="pl-4">
                              {{avg_stats.gpm}} GPM
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
                            {{sideStats.percent_total_red_wins.toFixed(1)}}%
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
          <v-tabs v-model="tab">
            <v-tab>
              Champion pool
            </v-tab>
            <v-tab>
              Matchups
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12">
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-data-table hide-default-footer :headers="headers" :items="playerChampions" :items-per-page="-1"
                class="elevation-0" :sort-by="['qty_win', 'qty_games']" :sort-desc="[true, true]" multi-sort>
                <template v-slot:item.name="{ item }">
                  <v-avatar rounded size="36">
                    <img :alt="item.champion" :src="getImg(item.name)">
                  </v-avatar>
                  <span class="pl-2 subtitle-1">
                    {{item.name}}
                  </span>
                </template>
                <template v-slot:item.gpm="{ item }">
                  {{item.gpm}}
                  <span class="green--text" v-if="item.gpm > avg_stats.gpm">
                    (+{{(item.gpm-avg_stats.gpm).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else-if="item.gpm < avg_stats.gpm">
                    ({{(item.gpm-avg_stats.gpm).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:item.ddpm="{ item }">
                  {{item.ddpm}}
                  <span class="green--text" v-if="item.ddpm > avg_stats.ddpm">
                    (+{{(item.ddpm-avg_stats.ddpm).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.ddpm-avg_stats.ddpm).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:item.avg_kills="{ item }">
                  {{item.avg_kills}}
                  <span class="green--text" v-if="item.avg_kills > avg_stats.avg_kills">
                    (+{{(item.avg_kills-avg_stats.avg_kills).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.avg_kills-avg_stats.avg_kills).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:item.avg_deaths="{ item }">
                  {{item.avg_deaths}}
                  <span class="red--text" v-if="item.avg_deaths > avg_stats.avg_deaths">
                    (+{{(item.avg_deaths-avg_stats.avg_deaths).toFixed(2)}})
                  </span>
                  <span class="green--text" v-else>
                    ({{(item.avg_deaths-avg_stats.avg_deaths).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:item.avg_assists="{ item }">
                  {{item.avg_assists}}
                  <span class="green--text" v-if="item.avg_assists > avg_stats.avg_assists">
                    (+{{(item.avg_assists-avg_stats.avg_assists).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.avg_assists-avg_stats.avg_assists).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:item.ddpg="{ item }">
                  {{item.ddpg}}
                  <span class="green--text" v-if="item.ddpg > avg_stats.ddpg">
                    (+{{(item.ddpg-avg_stats.ddpg).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.ddpg-avg_stats.ddpg).toFixed(2)}})
                  </span>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col cols="12">
                  <champion-field @change="championChanged" class="px-4 pt-2" :solo="false" side="grey darken-1"
                    :map="search" label="Selecione o champion" field="champion_id" :champions="playerChampions" />
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>Jogados com</v-card-title>
                    <v-data-table hide-default-footer :headers="championHeaders" :items="championsWith"
                      :items-per-page="-1" show-group-by group-by="role" class="elevation-0" multi-sort
                      :sort-by="['qty_win', 'qty_match']" :sort-desc="[true, true]">
                      <template v-slot:[`item.champion_name`]="{ item }">
                        <v-avatar rounded size="36">
                          <img :alt="item.champion" :src="getImg(item.champion_name)">
                        </v-avatar>
                        <span class="pl-2 subtitle-1">
                          {{item.champion_name}}
                        </span>
                      </template>
                      <template v-slot:[`item.role`]="{ item }">
                        {{item.role}}
                      </template>
                      <template v-slot:[`item.qty_win`]="{ item }">
                        {{((item.qty_win / item.qty_match) * 100).toFixed(1)}}%
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>Jogados contra</v-card-title>
                    <v-data-table hide-default-footer :headers="championHeaders" :items="championsAgainst"
                      :items-per-page="-1" show-group-by group-by="role" class="elevation-0" multi-sort
                      :sort-by="['qty_win', 'qty_match']" :sort-desc="[true, true]">
                      <template v-slot:[`item.champion_name`]="{ item }">
                        <v-avatar rounded size="36">
                          <img :alt="item.champion" :src="getImg(item.champion_name)">
                        </v-avatar>
                        <span class="pl-2 subtitle-1">
                          {{item.champion_name}}
                        </span>
                      </template>
                      <template v-slot:[`item.role`]="{ item }">
                        {{item.role}}
                      </template>
                      <template v-slot:[`item.qty_win`]="{ item }">
                        {{((item.qty_win / item.qty_match) * 100).toFixed(1)}}%
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
        <v-col cols="12">
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
  import PlayerField from '@/components/mapInfo/PlayerField'
  import ChampionField from '@/components/mapInfo/ChampionField'
  export default {
    name: 'Matchups',
    components: {
      ChampionField,
      PlayerField
    },
    created() {
      this.getPlayersFromRole('mid');
      this.getTournaments();
      this.getPatches();
    },
    data: () => ({
      tab: null,
      tournaments: [],
      championHeaders: [
        {
          text: 'Champion',
          align: 'start',
          sortable: true,
          value: 'champion_name',
          groupable: false,
        },
        {
          text: 'Role',
          align: 'start',
          sortable: true,
          value: 'role',
          groupable: true,
        },
        {
          text: 'Qtd Partidas',
          align: 'end',
          sortable: true,
          value: 'qty_match',
          groupable: false,
        },
        {
          text: 'Qtd Vitórias',
          align: 'end',
          sortable: true,
          value: 'qty_win',
          groupable: false,
        },
      ],
      headers: [
        {
          text: 'Champion',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'GPM',
          align: 'end',
          sortable: true,
          value: 'gpm',
        },
        {
          text: 'DDPM',
          align: 'end',
          sortable: true,
          value: 'ddpm',
        },
        {
          text: 'DDPG',
          align: 'end',
          sortable: true,
          value: 'ddpg',
        },
        {
          text: 'AVG Kills',
          align: 'end',
          sortable: true,
          value: 'avg_kills',
        },
        {
          text: 'AVG deaths',
          align: 'end',
          sortable: true,
          value: 'avg_deaths',
        },
        {
          text: 'AVG Assists',
          align: 'end',
          sortable: true,
          value: 'avg_assists',
        },
        {
          text: 'Games',
          align: 'end',
          sortable: true,
          value: 'qty_games',
        },
        {
          text: 'Wins',
          align: 'end',
          sortable: true,
          value: 'qty_win',
        },
      ],
      patches: [],
      players: [],
      playerChampions: [],
      championsWith: [],
      championsAgainst: [],
      avg_stats: {},
      search: {
        player_id: 1,
        champion_id: null,
        role: 'mid',
        patch: null,
        t: 8,
        side: null,
      },
      selectedPlayer: {
        id: null,
        nickname: ''
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
        "percent_total_wins": 0,
        "red_games": 0,
        "red_wins": 0,
        "total_games": 0,
        "total_wins": 0
      },
      teams_with: {
        baron: [],
        jungle: [],
        mid: [],
        dragon: [],
        sup: []
      },
      teams_against: {
        baron: [],
        jungle: [],
        mid: [],
        dragon: [],
        sup: []
      },
      roles: [
        {title: 'TOP', tag: 'baron'},
        {title: 'JG', tag: 'jungle'},
        {title: 'MID', tag: 'mid'},
        {title: 'ADC', tag: 'dragon'},
        {title: 'SUP', tag: 'sup'},
      ],
    }),
    computed: {
      axiosParams() {
        const params = new URLSearchParams();
        params.append('role', this.search.role);
        if (this.search.t !== null)
          params.append('t', this.search.t);
        if (this.search.patch !== null)
          params.append('patch', this.search.patch);
        if (this.search.side !== null)
          params.append('side', this.search.side);
        console.log(params.toString());
        return params;
      }
    },
    methods: {
      getTournaments() {
        axios.get('v1/tournament').then(res => {
          this.tournaments = res.data.tournaments.map(m => {
            return m;
          });
        });
      },
      championChanged(val) { 
        this.search.champion_id = val;
        this.selectedChampion = this.playerChampions.filter(c => c.name === val)[0];
        this.getChampionMatches(this.selectedChampion.champion_id);
        // this.getAllInfo();
      },
      roleChanged() {
        this.getPlayersFromRole();
      },
      playerChanged(val) { 
        this.search.player_id = val;
        this.selectedPlayer = this.players.filter(c => c.id === val)[0];
        this.getAllInfo();
      },
      getPlayersFromRole() {
        axios.get(`v1/view/player/role/${this.search.role}`, {params: this.axiosParams}).then(res => {
          this.players = res.data.players;
          const _players = this.players.filter(c => c.id === this.selectedPlayer.id);
          if (this.selectedPlayer.id === null || _players.length === 0)
            this.selectedPlayer = this.players[0];
          this.search.player_id = this.selectedPlayer.id;
          this.getAllInfo();
        });
      },
      getSideStats() {
        axios.get(`v1/view/player/${this.selectedPlayer.id}/side`, {params: this.axiosParams}).then(res => {
          this.sideStats = res.data;
        });
      },
      getTop3() {
        axios.get(`v1/view/player/${this.selectedPlayer.id}/top3`, {params: this.axiosParams}).then(res => {
          this.championsWith = res.data.champions_with;
          this.championsAgainst = res.data.champions_against;
        });
      },
      getChampionMatches(val) {
        axios.get(`v1/view/player/${this.selectedPlayer.id}/${this.selectedChampion.champion_id}/all_matches`, {params: this.axiosParams}).then(res => {
          this.championsWith = res.data.champions_with;
          this.championsAgainst = res.data.champions_against;
        });
      },
      getChampions() {
        axios.get(`v1/view/player/${this.selectedPlayer.id}/champions`, {params: this.axiosParams}).then(res => {
          this.playerChampions = res.data.champions;
          this.selectedChampion = this.playerChampions[0];
          this.search.champion_id = this.selectedChampion.champion_id;
          this.avg_stats = res.data.general;
        });
      },
      getPatches() {
        axios.get(`v1/patch`, { params: this.axiosParams }).then(res => {
          const _patch = res.data.patches.filter(p => p === this.search.patch);
          if (_patch.length === 0)
            this.search.patch = null;
          this.patches = res.data.patches;
          this.getPlayersFromRole();
        });
      },
      getImg(champion) {
        return require(`@/assets/${champion}.png`);
      },
      tournamentChanged() {
        this.getPatches();
        this.getChampions();
      },
      getAllInfo() {
        this.getSideStats();
        this.getChampions();
      }
    }
  }
</script>

