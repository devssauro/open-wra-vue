<template>
  <v-app id="inspire">
    <v-app-bar app flat>
      <v-container class="py-0 fill-height">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="mr-1" v-bind="attrs" v-on="on">
              Relatórios
            </v-btn>
          </template>
          <v-list>
            <template v-for="(item, index) in items">
              <v-list-item link :key="index" @click="goTo(item.to)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
        <template v-for="link in links">
          <v-btn @click="goTo(link.to)" :key="link.title" text class="mr-1" v-if="link.toShow"> {{ link.title }} </v-btn>
        </template>
        <v-spacer />
        <v-btn text @click="openLoginDialog">
          Login
        </v-btn>
        <v-dialog max-width="500" v-model="dialog">
          <v-card
            class="pa-2"
            outlined>
            <v-card-title>
              Acesse sua conta
            </v-card-title>
            <v-card-text class="pb-0">
              <v-text-field outlined label="Usuário" v-model="login.username"/>
              <v-text-field outlined type="password" label="Senha" v-model="login.password"/>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-btn depressed color="secondary" @click="doLogin(login)" :loading="loginBtnLoading">
                Entrar
              </v-btn>
              <v-btn depressed @click="newPasswdDialog = true;">
                Esqueci minha senha
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app-bar>
    <v-main fill-height class="pt-0">
      <router-view fill-height />
    </v-main>
  </v-app>
</template>

<script>

import {bus} from '@/main';

export default {
  name: 'App',
  created() {
    this.links[1].toShow = this.isOperationalUser;
  },
  data: function() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      dialog: false,
      loginBtnLoading: false,
      login: {
        username: '',
        password: ''
      },
      links: [
        { title: 'Matchups', to: '/', toShow: true},
        { title: 'Cadastros', to: '/cadastros', toShow: true },
        { title: 'Download', to: '/download', toShow: true },
      ],
      items: [
        { title: 'Champion', to: '/view/champion' },
        { title: 'Player', to: '/view/player' },
        { title: 'Picks & Bans', to: '/view/picks_bans' },
        { title: 'Stats Geral', to: '/view/stats' },
      ],
    }
  },
  computed: {
    isOperationalUser() {
      if (this.user !== null && this.user !== undefined) {
        return this.user.roles.indexOf('operational') > -1;
      } else
        return false;
    },
  },
  methods: {
    checkData(user) {
      user = JSON.parse(localStorage.getItem('user'))
      if (user.roles.indexOf('admin') > -1 || user.roles.indexOf('operational') > -1)
        this.links[1].toShow = true;
      return false;
    },
    openLoginDialog() {
      localStorage.clear();
      this.autoLogout();
      this.dialog = true;
    },
    goTo(path) {
      this.$router.push(path);
    },
    autoLogout() {
      axios.get('api/logout').then(() => {
          localStorage.clear('user');
          localStorage.clear('auth_token');
          localStorage.clear('csrf_token');
          delete window.axios.defaults.headers.common['Authentication-Token'];
          this.$forceUpdate();
          bus.$emit('login', null);
          this.user = null;
          this.checkData();
      });
    },
    doLogin(user) {
      this.loginBtnLoading = true;
      axios.post('api/login?include_auth_token', user).then(
        (response) => {
          const user = response.data.response.user;
          localStorage.setItem('auth_token', user.authentication_token);
          localStorage.setItem('csrf_token', response.data.response.csrf_token);
          localStorage.setItem('user', JSON.stringify(user));
          window.axios.defaults.headers.common['Authentication-Token'] = user.authentication_token;
          window.axios.defaults.headers.common['X-CSRF-Token'] = response.data.response.csrf_token;
          window.axios.defaults.headers.common['X-XSRF-Token'] = response.data.response.csrf_token;
          this.loginBtnLoading = false;
          this.dialog = false;
          this.checkData(user);
          bus.$emit('login', user);
        }, (err) => {
          this.loginBtnLoading = false;
          if (err.response.data.response.errors) {
            if (err.response.data.response.errors.email) {
              this.errorText = "Usuário não encontrado no sistema";
            }
            if (err.response.data.response.errors.password) {
              this.errorText = "Senha inválida";
            }
          }
          this.snackbar = true;
        }
      );
    }
  }
};
</script>
