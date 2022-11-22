<template>
  <v-main fill-height>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-sheet class="pt-6" rounded="lg">
            <!-- {{search}} -->
            <!-- {{availableRoles}} -->
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
        <v-col>
          <v-sheet rounded="lg" class="pa-2">
            <v-row>
              <v-col cols="12" sm="12" md="5">
                <v-card class="" outlined v-if="search.champion_id !== null && search.champion_id !== undefined">
                  <v-card-title>
                    <v-container>
                      <v-row align="start">
                        <v-avatar size="100" rounded>
                          <img :alt="selectedChampion.name" :src="getImg(selectedChampion.name)">
                        </v-avatar>
                        <v-col cols="8" class="py-0">
                          <p class="display-1">
                            {{selectedChampion.name}}
                          </p>
                          <p class="headline">
                            {{avg_stats.avg_kills}} / {{avg_stats.avg_deaths}} / {{avg_stats.avg_assists}}
                          </p>
                          <p class="mb-0">
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
          <v-tabs v-model="tab">
            <v-tab>
              Matchups
            </v-tab>
            <v-tab>
              Jogadores
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12">
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-row>
                <v-col>
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
                <v-col>
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
            <v-tab-item>
              <v-data-table group-by="role" show-group-by hide-default-footer :headers="playerHeaders" :items="players"
                :items-per-page="-1" item-key="nickname" :sort-by="['qty_win', 'qty_games']" :sort-desc="[true, true]"
                multi-sort class="elevation-0">
                <template v-slot:[`item.gpm`]="{ item }">
                  {{item.gpm}}
                  <span class="green--text" v-if="item.gpm > avg_stats.gpm">
                    (+{{(item.gpm-avg_stats.gpm).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.gpm-avg_stats.gpm).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:[`item.ddpm`]="{ item }">
                  {{item.ddpm}}
                  <span class="green--text" v-if="item.ddpm > avg_stats.ddpm">
                    (+{{(item.ddpm-avg_stats.ddpm).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.ddpm-avg_stats.ddpm).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:[`item.avg_kills`]="{ item }">
                  {{item.avg_kills}}
                  <span class="green--text" v-if="item.avg_kills > avg_stats.avg_kills">
                    (+{{(item.avg_kills-avg_stats.avg_kills).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.avg_kills-avg_stats.avg_kills).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:i[`tem.avg_deaths`]="{ item }">
                  {{item.avg_deaths}}
                  <span class="red--text" v-if="item.avg_deaths > avg_stats.avg_deaths">
                    (+{{(item.avg_deaths-avg_stats.avg_deaths).toFixed(2)}})
                  </span>
                  <span class="green--text" v-else>
                    ({{(item.avg_deaths-avg_stats.avg_deaths).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:[`item.avg_assists`]="{ item }">
                  {{item.avg_assists}}
                  <span class="green--text" v-if="item.avg_assists > avg_stats.avg_assists">
                    (+{{(item.avg_assists-avg_stats.avg_assists).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.avg_assists-avg_stats.avg_assists).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:[`item.ddpg`]="{ item }">
                  {{item.ddpg}}
                  <span class="green--text" v-if="item.ddpg > avg_stats.ddpg">
                    (+{{(item.ddpg-avg_stats.ddpg).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.ddpg-avg_stats.ddpg).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:[`item.avg_kda`]="{ item }">
                  {{item.avg_kda}}
                  <span class="green--text" v-if="item.avg_kda > avg_stats.avg_kda">
                    (+{{(item.avg_kda-avg_stats.avg_kda).toFixed(2)}})
                  </span>
                  <span class="red--text" v-else>
                    ({{(item.avg_kda-avg_stats.avg_kda).toFixed(2)}})
                  </span>
                </template>
                <template v-slot:[`item.agt`]="{ item }">
                  {{item.agt}}
                  <span class="green--text" v-if="item.diff_agt.indexOf('-') > -1">
                    ({{item.diff_agt}})
                  </span>
                  <span class="red--text" v-else>
                    ({{item.diff_agt}})
                  </span>
                </template>
                <template v-slot:[`item.agt_win`]="{ item }">
                  {{item.agt_win}}
                  <span v-if="item.agt_win !== '-'">
                    <span class="green--text" v-if="item.diff_agt_win.indexOf('-') > -1">
                      ({{item.diff_agt_win}})
                    </span>
                    <span class="red--text" v-else>
                      ({{item.diff_agt_win}})
                    </span>
                  </span>
                </template>
                <template v-slot:[`item.agt_loss`]="{ item }">
                  {{item.agt_loss}}
                  <span v-if="item.agt_loss !== '-'">
                    <span class="green--text" v-if="item.diff_agt_loss.indexOf('-') == -1">
                      ({{item.diff_agt_loss}})
                    </span>
                    <span class="red--text" v-else>
                      ({{item.diff_agt_loss}})
                    </span>
                  </span>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
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
    },
    data: () => ({
      tab: null,
      tabs: [
        { tab: 'Jogados com'},
        { tab: 'Jogados contra'},
        { tab: 'Jogadores'},
      ],
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
          text: 'Win Rate',
          align: 'end',
          sortable: true,
          value: 'qty_win',
          groupable: false,
        },
      ],
      playerHeaders: [
        {
          text: 'Role',
          align: 'start',
          sortable: true,
          value: 'role',
          groupable: true,
        },
        {
          text: 'Player',
          align: 'start',
          sortable: true,
          value: 'nickname',
          groupable: false,
        },
        {
          text: 'GPM',
          align: 'end',
          sortable: true,
          value: 'gpm',
          groupable: false,
        },
        {
          text: 'DDPM',
          align: 'end',
          sortable: true,
          value: 'ddpm',
          groupable: false,
        },
        {
          text: 'DDPG',
          align: 'end',
          sortable: true,
          value: 'ddpg',
          groupable: false,
        },
        {
          text: 'AVG Kills',
          align: 'end',
          sortable: true,
          value: 'avg_kills',
          groupable: false,
        },
        {
          text: 'AVG deaths',
          align: 'end',
          sortable: true,
          value: 'avg_deaths',
          groupable: false,
        },
        {
          text: 'AVG Assists',
          align: 'end',
          sortable: true,
          value: 'avg_assists',
          groupable: false,
        },
        {
          text: 'AVG KDA',
          align: 'end',
          sortable: true,
          value: 'avg_kda',
          groupable: false,
        },
        {
          text: 'AGT',
          align: 'start',
          sortable: true,
          value: 'agt',
          groupable: false,
        },
        {
          text: 'AGT Win',
          align: 'start',
          sortable: true,
          value: 'agt_win',
          groupable: false,
        },
        {
          text: 'AGT Loss',
          align: 'start',
          sortable: true,
          value: 'agt_loss',
          groupable: false,
        },
        {
          text: 'Games',
          align: 'end',
          sortable: true,
          value: 'qty_games',
          groupable: true,
        },
        {
          text: 'Wins',
          align: 'end',
          sortable: true,
          value: 'qty_win',
        },
      ],
      championsWith: [],
      championsAgainst: [],
      patches: [],
      players: [],
      avg_stats: {},
      tournaments: [],
      search: {
        champion_id: 1,
        // role: ['mid'],
        t: 8,
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
      }
    },
    methods: {
      championRoles() {
      },
      getTournaments() {
        axios.get('v1/tournament').then(res => {
          this.tournaments = res.data.tournaments;
        });
      },
      roleChanged() {
        // this.getChampionsFromRole();
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
        this.getSideStats();
        this.getAllMatches();
        this.getPlayers();
      }
    }
  }
</script>

