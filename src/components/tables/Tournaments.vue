<template>
  <v-data-table :loading="loading" :headers="headers" :items="tournaments" :items-per-page="10" sort-by="name" class="elevation-0">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Campeonatos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-spacer></v-spacer>
        <v-dialog fullscreen v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Novo Campeonato
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-tabs v-model="tab">
                <v-tab>Informações Básicas</v-tab>
                <v-tab>Line ups</v-tab>
              </v-tabs>
              <v-tabs-items fill-height v-model="tab">
                <v-tab-item>
                  <v-container>
                    <v-row>
                      <v-col class="mb-n8" cols="12">
                        <v-text-field v-model="selectedTournament.name" outlined label="Nome" />
                      </v-col>
                      <v-col class="mb-n8" cols="12">
                        <v-text-field v-model="selectedTournament.tag" outlined label="Tag" />
                      </v-col>
                      <v-col class="mb-n8" cols="12">
                        <v-text-field v-model="selectedTournament.region" outlined label="Região" />
                      </v-col>
                      <v-col class="mb-n8" cols="12">
                        <v-text-field v-model="selectedTournament.split" outlined label="Split" />
                      </v-col>
                      <v-col class="mb-n8" cols="12">
                        <v-text-field v-model="selectedTournament.phases" outlined label="Fases do campeonato (separados por vírgula)" />
                      </v-col>
                      <v-col class="mb-n8" cols="12">
                        <v-checkbox v-model="selectedTournament.female_only" label="Campeonato feminino" />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-tab-item>
                <v-tab-item>
                  <v-container fill-height>
                    <v-row>
                      <v-col cols="12">
                        <v-btn block dark depressed color="blue" @click="newLineup">Nova lineup</v-btn>
                      </v-col>
                      <v-col v-if="editLineup" cols="12" class="mb-n8">
                         <v-autocomplete v-model="currentLineup.team_id" :items="teams" item-text="name" item-value="id" dense outlined label="Time" />
                      </v-col>
                      <v-col v-if="editLineup" cols="12" class="mb-n8">
                         <v-autocomplete v-model="currentLineup.players" multiple :items="players" item-text="nickname" item-value="id" dense outlined label="Jogadores" />
                      </v-col>
                      <v-col v-if="editLineup" cols="12" class="mb-n8">
                        <v-text-field v-model="currentLineup.entry_phase" outlined dense label="Fases de entrada" />
                      </v-col>
                      <v-col v-if="editLineup" cols="12">
                        <v-btn block dark depressed color="blue" @click="saveLineup">Salvar lineup</v-btn>
                      </v-col>
                      <v-col>
                        <v-list>
                          <template v-for="(item, index) in selectedTournament.lineups">
                            <v-list-item :key="index">
                              <v-list-item-title>{{getTeamName(item.team_id)}}</v-list-item-title>
                              <v-list-item-action>
                                <v-btn icon @click="changeLineup(item, index)">
                                  <v-icon>edit</v-icon>
                                </v-btn>
                              </v-list-item-action>
                            </v-list-item>
                            <v-divider :key="`${index}-${index}`" />
                          </template>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeDialog">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveDialog">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="mr-2" @click="editTournament(item)">
        edit
      </v-icon>
    </template>
    <template class="text-center" v-slot:item.female_only="{ item }">
      <v-icon class="text-center" v-if="item.female_only">
        check_circle
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'TournamentsTable',
    created() {
      this.getTournaments();
      this.getTeams();
      this.getPlayers();
    },
    data: () => ({
      loading: false,
      tab: 0,
      tournaments: [],
      teams: [],
      players: [],
      dialog: false,
      editLineup: true,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Tag', value: 'tag' },
        { text: 'Região', value: 'region' },
        { text: 'Split', value: 'split' },
        { text: 'Fases', value: 'phases' },
        { text: 'Feminino', value: 'female_only', align: 'end' },
        { text: 'Actions', value: 'actions', align: 'end', sortable: false },
      ],
      currentLineup: {
        team_id: null,
        entry_phase: null,
        players: []
      },
      currentLineupIndex: null,
      selectedTournament: {
        id: null,
        name: '',
        tag: '',
        start_date: null,
        end_date: null,
        lineups: []
      }
    }),
    methods: {
      changeLineup(lineup, index) {
        this.currentLineup = Object.assign({}, lineup);
        this.currentLineupIndex = index;
        this.editLineup = true;
      },
      newLineup() {
        this.currentLineup = {
          team_id: null,
          entry_phase: null,
          players: null
        };
        this.editLineup = true;
      },
      saveLineup() {
        if (this.currentLineupIndex === null)
          this.selectedTournament.lineups.push(Object.assign({}, this.currentLineup));
        else
          this.selectedTournament.lineups[this.currentLineupIndex] = Object.assign({}, this.currentLineup);
        this.currentLineupIndex = null;
        this.editLineup = false;
      },
      closeDialog() {
        this.selectedTournament = {
          id: null,
          name: '',
          tag: '',
          flag: '',
          start_date: null,
          end_date: null,
          lineups: []
        };
        this.dialog = false;
      },
      saveDialog() {
        const method = this.selectedTournament.id === null ? axios.post : axios.put;
        method('v1/tournament', this.selectedTournament).then(res => {
          this.getTournaments();
        })
        this.closeDialog();
      },
      editTournament(tournament) {
        this.getTournamentId(tournament.id);
        // this.selectedTournament = Object.assign({}, tournament);
        this.dialog = true;
      },
      getTournaments() {
        this.loading = true;
        axios.get('v1/tournament').then(res => {
          this.loading = false;
          this.tournaments = res.data.tournaments;
        })
      },
      getTournamentId(id) {
        this.loading = true;
        axios.get(`v1/tournament/${id}`).then(res => {
          this.loading = false;
          this.selectedTournament = res.data.tournament;
        })
      },
      getTeamName(id) {
        return this.teams.filter(t => t.id === id)[0].name
      },
      getTeams() {
        axios.get('v1/team').then(res => {
          this.teams = res.data.teams;
        })
      },
      getPlayers() {
        axios.get('v1/player').then(res => {
          this.players = res.data.players;
        });
      },
    },
    computed: {
      formTitle () {
        return this.selectedTournament.id !== null ? 'Editar Campeonato' : 'Novo Campeonato'
      },
    },
  }
</script>
