export default {
  state: {
    name: 'Luke Siedle',
    email: 'luke@example.com',
    has_active_session: false
  },

  mutations: {
    logIn( state ){
      state.has_active_session = true
      state.user = state.user;
      state.token = state.token;
    },
    clearSession( state ){
      state.has_active_session = false
      state.token = null;
      state.user = null;
    }
  },
  actions: {
    async logIn( { commit, state }, payload ){
      const result = await this._vm.$gernzy.graphql.query(`
        mutation LogIn($email: String!, $password: String!) {
          logIn( input: {
            email: $email,
            password: $password
          }){
            user {
              id
            }
            token
          }
        }
      `, {
        email: payload.email,
        password: payload.password
      });

      if( !result.errors && result.data.logIn.user ){
        const { user, token } = result.data.logIn;
        commit('logIn', {
          user,
          token
        });
        return {
          success: true,
          error: null
        }
      }

      return {
        success: false,
        error: {
          msg: result.errors ? result.errors[0].message : 'Unknown failure',
          code: '403'
        }
      }
    },
    clearSession( {commit, state} ){
      commit('clearSession');
    }
  },
  getters: { }
}
