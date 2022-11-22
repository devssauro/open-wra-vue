<template>
  <v-main fill-height>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-sheet class="pt-6" rounded="lg">
            <v-row>
              <v-col cols="4">
                <v-autocomplete clearable class="px-4 mb-n5" outlined label="Campeonato" v-model="search.t"
                  :items="tournaments" item-text="name" item-value="id" @change="tournamentChanged" />
              </v-col>
              <v-col cols="4">
                <v-autocomplete @change="getStats" clearable class="px-4 mb-n5" outlined label="Time"
                  v-model="search.team" :items="teams" item-text="name" item-value="id" />
              </v-col>
              <v-col cols="4">
                <v-autocomplete @change="getStats" clearable class="px-4 mb-n5" outlined label="Patch"
                  v-model="search.patch" :items="patches" />
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
        <v-col cols="12">
          <v-tabs v-model="tab">
            <v-tab>Time</v-tab>
            <v-tab>Player</v-tab>
            <v-tab>Champion</v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="12">
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-card>
                    <v-data-table dense :headers="teamHeaders" :items="teamsStats" item-key="name" :items-per-page="-1"
                      :sort-by="pickRateSortBy" :sort-desc="[false, false]" multi-sort hide-default-footer
                      @update:group-by="updatePickGroupBy">
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
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-card>
                    <v-data-table dense :headers="playerHeaders" :items="playersStats" item-key="name" show-group-by
                      :items-per-page="-1" :sort-by="pickRateSortBy" :sort-desc="[false, false]" multi-sort
                      hide-default-footer @update:group-by="updatePickGroupBy" :group-by="playerStatsGroupBy">
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
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-card>
                    <v-data-table dense :headers="championHeaders" :items="championsStats" item-key="name"
                      :items-per-page="-1" :sort-by="pickRateSortBy" :sort-desc="[false, false]" multi-sort
                      hide-default-footer @update:group-by="updatePickGroupBy">
                      <template v-slot:[`item.champion_name`]="{ item }">
                        <v-avatar rounded size="32" v-if="item.champion_name !== underfined">
                          <img :alt="item.champion" :src="getImg(item.champion_name)">
                        </v-avatar>
                        <span class="pl-2 mr-2 subtitle-1">
                          {{item.champion_name}}
                        </span>
                      </template>
                      <template v-slot:[`item.agt`]="{ item }">
                        {{item.agt}}
                        <span class="green--text mr-1" v-if="item.diff_agt.indexOf('-') > -1">
                          ({{item.diff_agt}})
                        </span>
                        <span class="red--text mr-1" v-else>
                          ({{item.diff_agt}})
                        </span>
                      </template>
                      <template v-slot:[`item.agt_win`]="{ item }">
                        {{item.agt_win}}
                        <span v-if="item.agt_win !== '-'" class="mr-1">
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
                        <span v-if="item.agt_loss !== '-'" class="mr-1">
                          <span class="green--text" v-if="item.diff_agt_loss.indexOf('-') == -1">
                            ({{item.diff_agt_loss}})
                          </span>
                          <span class="red--text" v-else>
                            ({{item.diff_agt_loss}})
                          </span>
                        </span>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
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
  import PlayerField from '@/components/mapInfo/PlayerField'
  import ChampionField from '@/components/mapInfo/ChampionField'
  export default {
    name: 'Matchups',
    components: {
      ChampionField,
      PlayerField
    },
    created() {
      this.getTournaments();
      this.getTeams();
      this.getStats();
      this.getPatches();
    },
    data: () => ({
      tab: null,
      playerStatsGroupBy: 'role',
      pickRateSortBy: [],
      pickRateGroupBy: 'side',
      picksBansSortBy: 'qty_win',
      picksBansGroupBy: 'rotation',
      presenceSortBy: ['qty_picks', 'percent_win'],
      presenceSortDesc: [true, true],
      tournaments: [],
      teamsStats: [],
      championsStats: [],
      playersStats: [],
      patches: [],
      teamHeaders: [
        {
          text: 'Time',
          align: 'start',
          sortable: true,
          value: 'team_name',
          groupable: false,
        },
        {
          text: 'TAG',
          align: 'start',
          sortable: true,
          value: 'team_tag',
          groupable: false,
        },
        {
          text: 'Qtd games',
          align: 'end',
          sortable: true,
          value: 'qty_games',
          groupable: true,
        },
        {
          text: '%WR',
          align: 'end',
          sortable: true,
          value: 'wr',
          groupable: true,
        },
        {
          text: 'Blue games',
          align: 'end',
          sortable: true,
          value: 'qty_blue_games',
          groupable: true,
        },
        {
          text: 'Red games',
          align: 'end',
          sortable: true,
          value: 'qty_red_games',
          groupable: true,
        },
        {
          text: 'Blue %WR',
          align: 'end',
          sortable: true,
          value: 'wr_blue',
          groupable: true,
        },
        {
          text: 'Red %WR',
          align: 'end',
          sortable: true,
          value: 'wr_red',
          groupable: true,
        },
        {
          text: 'AGT',
          align: 'start',
          sortable: true,
          value: 'agt',
          groupable: true,
        },
        {
          text: 'AGT Win',
          align: 'start',
          sortable: true,
          value: 'agt_win',
          groupable: true,
        },
        {
          text: 'AGT Loss',
          align: 'start',
          sortable: true,
          value: 'agt_loss',
          groupable: true,
        },
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
          text: 'AVG Kills',
          align: 'end',
          sortable: true,
          value: 'avg_kills',
          groupable: true,
        },
        {
          text: 'AVG Deaths',
          align: 'end',
          sortable: true,
          value: 'avg_deaths',
          groupable: true,
        },
        {
          text: 'AVG Assists',
          align: 'end',
          sortable: true,
          value: 'avg_assists',
          groupable: true,
        },
        {
          text: 'AVG KDA',
          align: 'end',
          sortable: true,
          value: 'avg_kda',
          groupable: true,
        },
        {
          text: 'DDPM',
          align: 'end',
          sortable: true,
          value: 'ddpm',
          groupable: true,
        },
        {
          text: 'GPM',
          align: 'end',
          sortable: true,
          value: 'gpm',
          groupable: true,
        },
        {
          text: 'DDPG',
          align: 'end',
          sortable: true,
          value: 'ddpg',
          groupable: true,
        },
        {
          text: '%Presença',
          align: 'end',
          sortable: true,
          value: 'percent_presence',
          groupable: true,
        },
        {
          text: 'Qtd picks',
          align: 'end',
          sortable: true,
          value: 'qty_picks',
          groupable: true,
        },
        {
          text: 'Qtd bans',
          align: 'end',
          sortable: true,
          value: 'qty_bans',
          groupable: true,
        },
        {
          text: '%WR',
          align: 'end',
          sortable: true,
          value: 'wr',
          groupable: true,
        },
        {
          text: 'Blue games',
          align: 'end',
          sortable: true,
          value: 'qty_blue_games',
          groupable: true,
        },
        {
          text: 'Red games',
          align: 'end',
          sortable: true,
          value: 'qty_red_games',
          groupable: true,
        },
        {
          text: 'Blue %WR',
          align: 'end',
          sortable: true,
          value: 'wr_blue',
          groupable: true,
        },
        {
          text: 'Red %WR',
          align: 'end',
          sortable: true,
          value: 'wr_red',
          groupable: true,
        },
        {
          text: 'AGT',
          align: 'start',
          sortable: true,
          value: 'agt',
          groupable: true,
        },
        {
          text: 'AGT Win',
          align: 'start',
          sortable: true,
          value: 'agt_win',
          groupable: true,
        },
        {
          text: 'AGT Loss',
          align: 'start',
          sortable: true,
          value: 'agt_loss',
          groupable: true,
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
          groupable: true,
        },
        {
          text: 'AVG Kills',
          align: 'end',
          sortable: true,
          value: 'avg_kills',
          groupable: false,
        },
        {
          text: 'AVG Deaths',
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
          text: 'DDPM',
          align: 'end',
          sortable: true,
          value: 'ddpm',
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
          text: 'DDPG',
          align: 'end',
          sortable: true,
          value: 'ddpg',
          groupable: false,
        },
        {
          text: 'Qtd Games',
          align: 'end',
          sortable: true,
          value: 'qty_picks',
          groupable: false,
        },
        {
          text: '%WR',
          align: 'end',
          sortable: true,
          value: 'wr',
          groupable: false,
        },
        {
          text: 'Blue games',
          align: 'end',
          sortable: true,
          value: 'qty_blue_games',
          groupable: false,
        },
        {
          text: 'Red games',
          align: 'end',
          sortable: true,
          value: 'qty_red_games',
          groupable: false,
        },
        {
          text: 'Blue %WR',
          align: 'end',
          sortable: true,
          value: 'wr_blue',
          groupable: false,
        },
        {
          text: 'Red %WR',
          align: 'end',
          sortable: true,
          value: 'wr_red',
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
      ],
      search: {
        patch: null,
        t: 8,
        team: null,
        sort: 'name'
      },
      snackText: '',
      snackbar: false,
      teams: [],
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
        if (this.search.t !== null)
          params.append('t', this.search.t);
        if (this.search.team !== null)
          params.append('team', this.search.team);
        if (this.search.team !== null)
          params.append('team', this.search.team);
        if (this.search.patch !== null)
          params.append('patch', this.search.patch);
        params.append('sort', this.search.sort);
        console.log(params.toString());
        return params;
      }
    },
    methods: {
      updatePickGroupBy(val) {
        this.pickRateGroupBy = val;
      },
      updatePicksBansSortBy(val) {
        this.picksBansSortBy = val;
      },
      updatePresenceSortBy(val) {
        this.presenceSortBy = val;
      },
      updatePresenceSortDesc(val) {
        this.presenceSortDesc = val;
      },
      getTournaments() {
        axios.get('v1/tournament').then(res => {
          this.tournaments = res.data.tournaments.map(m => {
            return m;
          });
        });
      },
      tournamentChanged(val) { 
        this.getTeams();
        this.getStats();
        this.getPatches();
      },
      playerChanged(val) { 
        this.search.player_id = val;
        this.selectedPlayer = this.players.filter(c => c.id === val)[0];
        this.getAllInfo();
      },
      getTeamStats() {
        axios.get(`v1/view/stats/team`, { params: this.axiosParams }).then(res => {
          this.teamsStats = res.data.teams;
        });
      },
      getChampionStats() {
        axios.get(`v1/view/stats/champion`, { params: this.axiosParams }).then(res => {
          this.championsStats = res.data.champions;
        });
      },
      getPlayerStats() {
        axios.get(`v1/view/stats/player`, { params: this.axiosParams }).then(res => {
          this.playersStats = res.data.players;
        });
      },
      getPatches() {
        axios.get(`v1/patch`, { params: this.axiosParams }).then(res => {
          const _patch = res.data.patches.filter(p => p === this.search.patch);
          if (_patch.length === 0)
            this.search.patch = null;
          this.patches = res.data.patches;
        });
      },
      getStats() { 
        this.getTeamStats();
        this.getChampionStats();
        this.getPlayerStats();
      },
      getTeams() {
        axios.get(`v1/team`, {params: this.axiosParams}).then(res => {
          this.teams = res.data.teams;
        });
      },
      getImg(champion) {
        return require(`@/assets/${champion}.png`);
      },
      getAllInfo() {
      }
    }
  }
</script>

