<template>
  <v-card>
    <v-card-title>
      Nova Matchup
    <v-spacer />
    </v-card-title>
    <!-- {{matchup}} -->
    <v-card-text class="pt-4 pb-0">
      <v-menu
        v-model="menuDate"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="computedDateFormatted"
            label="Data da matchup"
            prepend-icon="event"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined/>
        </template>
        <v-date-picker
          v-model="date"
          no-title
          @input="menuDate = false"
        ></v-date-picker>
      </v-menu>
      <v-menu
        ref="menu"
        v-model="menuTime"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="time"
            label="Horário"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined />
        </template>
        <v-time-picker
          v-if="menuTime"
          v-model="time"
          full-width
          @click:minute="$refs.menu.save(time)"
        ></v-time-picker>
      </v-menu>
      <v-select
        prepend-icon="group"
        v-model="matchup.team1_id"
        :items="teams"
        item-text="tag"
        item-value="id"
        label="Time 1"
        outlined />
      <v-select
        prepend-icon="group"
        v-model="matchup.team2_id"
        :items="teams"
        item-text="tag"
        item-value="id"
        label="Time 2"
        outlined />
      <v-select
        v-model="matchup.phase"
        prepend-icon="scoreboard"
        :items="tournament.phases"
        label="Estágio do Torneio"
        outlined />
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-btn dark block depressed color="green" @click="saveMatchup(matchup)">
        salvar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'MatchupDialog',
    created () {
      this.getTournament();
      this.getTeams();
    },
    props: {
      tournamentId: Number
    },
    data() {
      return {
        matchupDialog: true,
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
        dateFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)),
        menuDate: false,
        menuTime: false,
        teams: [],
        time: '00:00:00',
        tournament: {
          phases: [],
        },
        matchup: {
          tournament_id: this.tournamentId,
          datetime: `${(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)} 00:00:00`,
          team1_id: null,
          team2_id: null,
          phase: null
        }
      }
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date);
      },
    },
    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date);
        this.matchup.datetime = `${val} ${this.time}`;
      },
      time (val) {
        this.matchup.datetime = `${this.date} ${val}`;
      },
    },
    methods: {
      getTeams() {
        axios.get('http://localhost:5010/v1/team', {params: {t: this.tournamentId, sort: 'tag'}}).then(res => {
          this.teams = res.data.teams;
          this.matchup.team1_id = this.teams[0].id;
          this.matchup.team2_id = this.teams[1].id;
        });
      },
      getTournament() {
        axios.get(`v1/tournament/${this.tournamentId}`).then(res => {
          this.tournament = res.data.tournament;
          console.log(this.tournament);
          this.matchup.phase = this.tournament.phases[0];
        });
      },
      saveMatchup(matchup) {
        axios.post('/v1/matchup', matchup).then(res => {
          this.$emit('saved', true);
        });
      },
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },
  }
</script>
