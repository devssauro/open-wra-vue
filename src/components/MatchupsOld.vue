<template>
  <v-main fill-height >
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-sheet rounded="lg">
            <v-list color="transparent">
              <v-list-item link @click="newMatchup" v-if="isOperationalUser">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon>
                      add
                    </v-icon>
                      Nova Matchup
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="host" />
              <v-list-item>
               <v-list-item-content>
                <v-autocomplete
                  v-model="selectedTournaments"
                  :items="tournaments" class="mb-n8"
                  item-text="name"
                  item-value="id"
                  outlined dense label="Campeonatos" />
                </v-list-item-content>
              </v-list-item>
              <!-- <v-divider /> -->
            </v-list>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet
            min-height="70vh"
            rounded="lg">
            <!-- {{Matchups}} -->
            <v-list rounded>
              <template v-for="matchup in matchups">
                <v-list-item :key="matchup.id">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{matchup.team1.name}} X {{matchup.team2.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{matchup.datetime}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu bottom left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                          <v-icon>more_vert</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item link>
                          <v-list-item-title>Ver mapas</v-list-item-title>
                        </v-list-item>
                        <v-divider v-if="isOperationalUser" />
                        <v-list-item v-if="isOperationalUser" link>
                          <v-list-item-title @click="newMap(matchup.id)">Novo mapa</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="isOperationalUser" link>
                          <v-list-item-title>Selecionar MVP</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="`${matchup.id}-${matchup.id}`"/>
              </template>
            </v-list>        
          </v-sheet>
        </v-col>
      </v-row>
      <v-dialog max-width="650" v-model="matchupDialog">
        <matchup-dialog :tournament="selectedTournaments" v-if="matchupDialog" @saved="closeMatchupDialog" />
      </v-dialog>
      <v-dialog fullscreen v-model="mapDialog" persistent>
        <map-dialog v-if="mapDialog" @saved="closeMapDialog" :matchup="selectedMatchup" />
      </v-dialog>
    </v-container>
    <v-snackbar
      v-model="snackbar">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          icon
          v-bind="attrs"
          @click="snackbar = false">
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
  import {bus} from '@/main';
  import moment from 'moment';
  import axios from 'axios';
  import MatchupDialog from '@/components/dialogs/MatchupDialog'
  import MapDialog from '@/components/dialogs/MapDialog'
  export default {
    name: 'MatchupsComp',
    components: {
      MatchupDialog,
      MapDialog
    },
    computed: {
      isOperationalUser() {
        if (this.user !== null && this.user !== undefined) {
          return this.user.roles.indexOf('operational') > -1;
        } else
          return false;
      },
    },
    created() {
      this.getTournaments();
      bus.$on('login', (user) => {
        this.user = user;
      });
    },
    data: () => ({
      user: JSON.parse(localStorage.getItem('user')),
      host: window.location.host.indexOf('localhost') > -1,
      selectedTournaments: 8,
      tournaments: [],
      matchupDialog: false,
      mapDialog: false,
      snackText: '',
      snackbar: false,
      matchups: [],
      selectedMatchup: null
    }),
    watch: {
      selectedTournaments: function (t) {
        this.getMatchups(t);
      }
    },
    methods: {
      getMatchups(tournaments) {
        let params = new URLSearchParams();
        if (Array.isArray(tournaments))
          for (const t in tournaments) {
            params.append('t', tournaments[t]);
          }
        else {
          params = {t: tournaments}
        }
        axios.get('v1/matchup', {'params': params}).then(res => {
          this.matchups = res.data.matchups.map(m => {
            m.datetime = moment(`${m.datetime}-3`).format('DD/MM/YYYY HH:mm');
            return m;
          });
          if(this.matchups.length > 0)
            this.selectedMatchup = this.matchups[0].id;
          // this.mapDialog = true;
        });
      },
      getTournaments() {
        axios.get('v1/tournament').then(res => {
          this.tournaments = res.data.tournaments.map(m => {
            // m.datetime = moment(`${m.datetime}`).format('DD/MM/YYYY HH:mm');
            return m;
          });
          this.selectedTournaments = 8;
          this.getMatchups(this.selectedTournaments);
        });
      },
      newMatchup() {
        this.matchupDialog = true;
      },
      newMap(matchupId) {
        this.selectedMatchup = matchupId;
        this.mapDialog = true;
      },
      closeMatchupDialog() {
        this.getMatchups(this.selectedTournaments);
        this.matchupDialog = false;
        this.snackText = 'Nova matchup criada';
        this.snackbar = true;
      },
      closeMapDialog() {
        this.getMatchups();
        this.mapDialog = false;
        this.snackText = 'Novo mapa criado';
        this.snackbar = true;
      }
    }
  }
</script>
