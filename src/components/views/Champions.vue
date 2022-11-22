<template>
  <v-main fill-height>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-sheet class="pt-6" rounded="lg">
            <v-row class="mx-1">
              <v-select @change="roleChanged" class="px-4 mb-n5" outlined label="Role" v-model="search.roleId"
                :items="roles" item-text="title" item-value="tag" />
              <champion-field @change="championChanged" class="px-4" :solo="false" side="grey darken-1" :map="search"
                label="Champion" field="championId" :champions="champions" />
            </v-row>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet rounded="lg" class="pa-2">
            <v-row>
              <v-col cols="3">
                <v-card class="" outlined v-if="search.championId !== null && search.championId !== undefined">
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
                          <p class="headline mb-0">
                            {{avg_stats.avg_kills}} / {{avg_stats.avg_deaths}} / {{avg_stats.avg_assists}}
                          </p>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-title>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="pa-2 py-3" outlined v-if="search.championId !== null && search.championId !== undefined">
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
                          <span class="headline">Jogos</span>
                        </v-col>
                        <v-col cols="6" class="red--text">
                          <span class="display-1">
                            {{sideStats.red_games}}
                          </span>
                          <span class="headline">Jogos</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="6" class="text-center">
                      <span class="display-2">
                        {{sideStats.total_wins}}
                      </span>
                      <span class="headline">Vitórias</span>
                      <v-divider class="my-2" />
                      <v-row>
                        <v-col cols="6" class="blue--text">
                          <span class="display-1">
                            {{sideStats.blue_wins}}
                          </span>
                          <span class="headline">Vitórias</span>
                        </v-col>
                        <v-col cols="6" class="red--text">
                          <span class="display-1">
                            {{sideStats.red_wins}}
                          </span>
                          <span class="headline">Vitórias</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row class="mt-5 pb-6" v-if="false">
                    <v-col cols="2" class="pr-2">
                      <p class="display-2 mb-0 text-center">{{sideStats.total_games}}</p>
                      <p class="title text-center">Jogos</p>
                    </v-col>
                    <v-col cols="2">
                      <v-row class="text blue--text center">
                        <span class="display-2 mb-0 text-center">{{sideStats.blue_games}}</span>
                        <span class="overline">Jogos</span>
                      </v-row>
                      <v-row class="text red--text center">
                        <span class="display-2 mb-0 text-center">{{sideStats.red_games}}</span>
                        <span class="overline">Jogos</span>
                      </v-row>
                    </v-col>
                    <v-col cols="2" class="pr-2" align-self="center">
                      <p class="display-2 mb-0 text-center">{{sideStats.percent_total_wins}}</p>
                      <p class="title text-center">Vitórias</p>
                    </v-col>
                    <v-col cols="2">
                      <v-row class="text blue--text center">
                        <span class="display-2 mb-0 text-center">{{sideStats.percent_total_blue_wins}}%</span>
                        <span class="overline">Vitórias</span>
                      </v-row>
                      <v-row class="text red--text center">
                        <span class="display-2 mb-0 text-center">{{ sideStats.percent_total_red_wins}}%</span>
                        <span class="overline">Vitórias</span>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card outlined>
                  <v-card-title class="pb-0">
                    Top 3 jogados com em outras roles
                  </v-card-title>
                  <v-card-text>
                    <v-list dense>
                      <template v-for="(role) in roles" v-if="role.tag !== search.roleId">
                        <v-subheader :key="role.id">{{role.title}}</v-subheader>
                        <template v-for="(c, i) in teams_with[role.tag]">
                          <v-list-item :key="`${role.title}-${c.id}`">
                            <v-list-item-avatar>
                              <v-img :alt="getImg(c.name)" :src="getImg(c.name)" />
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>{{c.name}}</v-list-item-title>
                              <v-list-item-subtitle>{{c.frequency}} vezes</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider inset :key="`${c.id}-${i}`" v-if="i < teams_with[role.tag].length-1" />
                        </template>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card outlined>
                  <v-card-title class="pb-0">
                    Top 3 jogados contra em outras roles
                  </v-card-title>
                  <v-card-text>
                    <v-list dense>
                      <template v-for="(role) in roles" v-if="role.tag !== search.roleId">
                        <v-subheader :key="role.id">{{role.title}}</v-subheader>
                        <template v-for="(c, i) in teams_against[role.tag]">
                          <v-list-item :key="`${role.title}-${c.id}`">
                            <v-list-item-avatar>
                              <v-img :alt="getImg(c.name)" :src="getImg(c.name)" />
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>{{c.name}}</v-list-item-title>
                              <v-list-item-subtitle>{{c.frequency}} vezes</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider inset :key="`${c.id}-${i}`" v-if="i < teams_against[role.tag].length-1" />
                        </template>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card outlined>
                  <v-card-title class="pb-0">
                    Champions jogados contra na mesma role
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <template v-for="(c, index) in teams_against[search.roleId]">
                        <v-list-item :key="`${c.id}`">
                          <v-list-item-avatar>
                            <v-img :alt="getImg(c.name)" :src="getImg(c.name)" />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{c.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{c.frequency}} vezes</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-divider inset :key="`${c.id}-${index}`"
                          v-if="index < teams_against[search.roleId].length-1" />
                      </template>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
        <v-col cols="12">
          <v-data-table :headers="headers" :items="players" :items-per-page="-1" item-key="nickname"
            :sort-by="['qty_win', 'qty_games']" :sort-desc="[true, true]" multi-sort class="elevation-0">
            <template v-slot:item.gpm="{ item }">
              {{item.gpm}}
              <span class="green--text" v-if="item.gpm > avg_stats.gpm">
                (+{{(item.gpm-avg_stats.gpm).toFixed(2)}})
              </span>
              <span class="red--text" v-else>
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
      this.getChampionsFromRole('mid');
    },
    data: () => ({
      headers: [
        {
          text: 'Team',
          align: 'start',
          sortable: true,
          value: 'team',
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
      players: [],
      avg_stats: {},
      search: {
        championId: 1,
        roleId: 'mid'
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
      
    },
    methods: {
      roleChanged(val) {
        this.getChampionsFromRole(val);
        // this.getAllInfo();
      },
      championChanged(val) { 
        this.search.championId = val;
        this.selectedChampion = this.champions.filter(c => c.id === val)[0];
        this.getAllInfo();
      },
      getChampionsFromRole(role) {
        axios.get(`v1/view/champion/role/${role}`).then(res => {
          this.champions = res.data.champions;
          this.selectedChampion = this.champions[0];
          this.search.championId = this.selectedChampion.id;
          this.getAllInfo();
        });
      },
      getSideStats() {
        axios.get(`v1/view/champion/${this.selectedChampion.id}/side?role=${this.search.roleId}`).then(res => {
          this.sideStats = res.data;
        });
      },
      getTop3() {
        axios.get(`v1/view/champion/${this.selectedChampion.id}/top3?role=${this.search.roleId}`).then(res => {
          this.teams_with = res.data.teams_with;
          this.teams_against = res.data.teams_against;
        });
      },
      getPlayers() {
        axios.get(`v1/view/champion/${this.selectedChampion.id}/players?role=${this.search.roleId}`).then(res => {
          this.players = res.data.players;
          this.avg_stats = res.data.general;
        });
      },
      getImg(champion) {
        return require(`@/assets/${champion}.png`);
      },
      getAllInfo() {
        this.getSideStats();
        this.getTop3();
        this.getPlayers();
      }
    }
  }
</script>

