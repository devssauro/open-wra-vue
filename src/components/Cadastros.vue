<template>
  <v-main >
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-sheet rounded="lg">
            <v-list color="transparent">
              <v-list-item link @click="selectedTable = 'team'">
                <v-list-item-content>
                  <v-list-item-title>
                    Times
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item link @click="selectedTable = 'player'">
                <v-list-item-content>
                  <v-list-item-title>
                    Jogadores
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list-item link @click="selectedTable = 'tournament'">
                <v-list-item-content>
                  <v-list-item-title>
                    Campeonatos
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-col>
        <v-col>
          <teams v-if="selectedTable === 'team'" />
          <players v-if="selectedTable === 'player'" />
          <tournaments v-if="selectedTable === 'tournament'" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>

</template>

<script>
  import Teams from '@/components/tables/Teams'
  import Players from '@/components/tables/Players'
  import Tournaments from '@/components/tables/Tournaments'
  export default {
    name: 'CadastrosCom',
    components: {
      Teams,
      Players,
      Tournaments
    },
    data: () => ({
      selectedTable: 'team'
    }),
    methods: {
    },
    computed: {
    },
  }
</script>
