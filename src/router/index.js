import Vue from 'vue'
import VueRouter from 'vue-router'
import CadastrosView from '@/views/CadastrosView.vue'
import MatchupsView from '@/views/MatchupsView.vue'
import ChampionsView from '@/views/ChampionsView.vue'
import PlayersView from '@/views/PlayersView.vue'
import PicksBansView from '@/views/PicksBansView.vue'
import GeneralStatsView from '@/views/GeneralStatsView.vue'
import DownloadView from '@/views/DownloadView.vue'
import TransmissionView from '@/views/TransmissionView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'matchups',
    component: MatchupsView
  },
  {
    path: '/cadastros',
    name: 'cadastros',
    component: CadastrosView
  },
  {
    path: '/view/champion',
    name: 'championsView',
    component: ChampionsView
  },
  {
    path: '/view/player',
    name: 'playersView',
    component: PlayersView
  },
  {
    path: '/view/picks_bans',
    name: 'picksBansView',
    component: PicksBansView
  },
  {
    path: '/view/stats',
    name: 'generalStatsView',
    component: GeneralStatsView
  },
  {
    path: '/download',
    name: 'downloadView',
    component: DownloadView
  },
  {
    path: '/transmission',
    name: 'transmissionView',
    component: TransmissionView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
