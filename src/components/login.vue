<template>
  <form @submit="checkForm" method="post">

    <label for="email">Email</label>
    <input id="email" type="email" placeholder="youremail@example.com" v-model="email">

    <label for="password">Password</label>
    <input id="password" type="password" placeholder="******************" v-model="password">

    <button type="submit">Sign In</button>
    <a href="#">Forgot Password?</a>

  </form>
</template>

<script>

  import { mapState } from 'vuex'

  export default {
    data: () => ({
      email: '',
      password: ''
    }),
    computed: mapState({
      name: state => state.session.name
    }),
    methods:{
      checkForm: async function (event) {
        const { email, password, $store } = this
        event.preventDefault();
        if( email && password ){
          const { success, error } = await $store.dispatch('logIn', {
            email,
            password
          })
          if( error ) {
            const { msg, code } = error
            this.errors = [ msg ]
          }
        } else {
          $store.dispatch('clearSession')
          this.errors = [
            'Please complete all fields'
          ]
        }
      }
    }
  }
</script>
