<template>
  <v-data-table :loading="loading" :headers="headers" :items="teams" :items-per-page="10" sort-by="name" class="elevation-0" :search="search" :custom-filter="filter">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Times</v-toolbar-title>
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
              Novo Time
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="selectedTeam.name" label="Nome" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="selectedTeam.tag" label="Tag" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="selectedTeam.flag" label="Flag" />
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
      <v-icon class="mr-2" @click="editTeam(item)">
        edit
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'TeamsTable',
    created() {
      this.getTeams()
    },
    data: () => ({
      loading: false,
      search: null,
      teams: [],
      dialog: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Tag', value: 'tag' },
        { text: 'Flag', value: 'flag' },
        { text: 'Actions', value: 'actions', align: 'end', sortable: false },
      ],
      selectedTeam: {
        id: null,
        name: '',
        tag: '',
        flag: '',
      }
    }),
    methods: {
      closeDialog() {
        this.selectTeam = {
          id: null,
          name: '',
          tag: '',
          flag: '',
        };
        this.dialog = false;
      },
      saveDialog() {
        const method = this.selectedTeam.id === null ? axios.post : axios.put;
        method('v1/team', this.selectedTeam).then(res => {
          this.getTeams();
        })
        this.closeDialog();
      },
      editTeam(team) {
        this.selectedTeam = Object.assign({}, team);
        this.dialog = true;
      },
      getTeams() {
        this.loading = true;
        axios.get('v1/team').then(res => {
          this.loading = false;
          this.teams = res.data.teams;
        })
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
        return this.selectedTeam.id !== null ? 'Editar Time' : 'Novo Time'
      },
    },
  }
</script>
