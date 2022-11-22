<template>
  <v-data-table :loading="loading" :headers="headers" :items="players" :items-per-page="10" sort-by="name" class="elevation-0" :search="search" :custom-filter="filter">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Players</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-text-field
          dense
          v-model="search"
          label="Search"
          class="mx-4 mb-n2"/>
        <!-- <v-spacer></v-spacer> -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Novo Player
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <!-- {{selectedPlayer}} -->
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="selectedPlayer.nickname" label="Nickname" />
                  </v-col>
                  <v-col cols="12">
                    <v-select :items="roles" item-text="title" item-value="tag" v-model="selectedPlayer.role" label="Role" />
                  </v-col>
                  <!-- <v-col cols="12">
                    <v-select :items="teams" item-text="label" item-value="id" v-model="selectedPlayer.team_id" label="Team" />
                  </v-col> -->
                  <v-col cols="12">
                    <v-text-field v-model="selectedPlayer.flag" label="Flag" />
                  </v-col>
                </v-row>
              </v-container>
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
      <v-icon class="mr-2" @click="editPlayer(item)">
        edit
      </v-icon>
    </template>
    <template v-slot:item.team_id="{ item }">
      {{getTeamName(item.team_id)}}
    </template>
    <template v-slot:item.role="{ item }">
      {{getRole(item.role)}}
    </template>
  </v-data-table>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'PlayersTable',
    created() {
      this.getTeams();
      // this.getPlayers();
    },
    data: () => ({
      loading: false,
      search: null,
      players: [],
      teams: [],
      dialog: false,
      roles: [
        {title: 'TOP', tag: 'baron'},
        {title: 'JG', tag: 'jungle'},
        {title: 'MID', tag: 'mid'},
        {title: 'ADC', tag: 'dragon'},
        {title: 'SUP', tag: 'sup'},
      ],
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'nickname',
        },
        { text: 'Flag', value: 'flag' },
        { text: 'role', value: 'role' },
        { text: 'Actions', value: 'actions', align: 'end', sortable: false },
      ],
      selectedPlayer: {
        id: null,
        nickname: '',
        flag: '',
      }
    }),
    methods: {
      closeDialog() {
        this.selectPlayer = {
          id: null,
          nickname: '',
          flag: '',
        };
        this.dialog = false;
      },
      saveDialog() {
        const method = this.selectedPlayer.id === null ? axios.post : axios.put;
        method('v1/player', this.selectedPlayer).then(res => {
          this.getPlayers();
        })
        this.closeDialog();
      },
      editPlayer(player) {
        this.selectedPlayer = Object.assign({}, player);
        this.dialog = true;
      },
      getPlayers() {
        this.loading = true;
        axios.get('v1/player').then(res => {
          this.loading = false;
          this.players = res.data.players;
        });
      },
      getTeams() {
        axios.get('v1/team').then(res => {
          this.teams = res.data.teams;
          this.getPlayers();
        });
      },
      getTeamName(teamId) {
        return this.teams.filter(t => t.id == teamId)[0].tag;
      },
      getRole(role) {
        const _role = this.roles.filter(r => r.tag == role)[0];
        return _role === undefined ? '' : _role.title;
      },
      filter (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().indexOf(search) !== -1
      },
    },
    computed: {
      formTitle () {
        return this.selectedPlayer.id !== null ? 'Editar Player' : 'Novo Player'
      },
    },
  }
</script>
