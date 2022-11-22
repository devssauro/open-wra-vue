<template>
  <v-menu v-model="showMenu" absolute offset-y v-if="isOperationalUser">
    <template v-slot:activator="{ on, attrs }">
      <v-card :color="`${map.winner_side} darken-3`" v-bind="attrs" v-on="on">
        <v-card-title>
          {{matchup[map.winner].tag}}
          <v-spacer />
          {{map.length}}
        </v-card-title>
      </v-card>
    </template>
    <v-list>
      <v-list-item @click="viewMap(matchup.id, map.id)">
        <v-list-item-title>Visualizar jogo</v-list-item-title>
      </v-list-item>
      <v-list-item @click="openVod">
        <v-list-item-title>Abrir VOD</v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item @click="editMap(matchup.id, map.id)"> 
        <v-list-item-title>Editar</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-card @click="openVod" :color="`${map.winner_side} darken-3`" v-else>
    <v-card-title>
      {{matchup[map.winner].tag}}
      <v-spacer />
      {{map.length}}
    </v-card-title>
  </v-card>
</template>

<script>
  import {bus} from '@/main';
  export default {
    props: {
      map: Object,
      matchup: Object
    },
    created() {
      bus.$on('login', (user) => {
        this.user = user;
      });
    },
    computed: {
      isOperationalUser() {
        if (this.user !== null && this.user !== undefined) {
          return this.user.roles.indexOf('operational') > -1;
        } else
          return false;
      },
    },
    watch: { 
    },
    data () {
      return {
        showMenu: false,
        user: JSON.parse(localStorage.getItem('user')),
      }
    },
    methods: {
      openVod() {
        if (this.map.vod_link !== undefined && this.map.vod_link !== null) {
          window.open(this.map.vod_link, '_blank');
        }
      },
      viewMap(matchupId, mapId) {
        this.$emit('viewMap', {matchupId: matchupId, mapId: mapId});
      },
      editMap(matchupId, mapId) {
        this.$emit('editMap', {matchupId: matchupId, mapId: mapId});
      },
    }
  }
</script>

<style>

</style>