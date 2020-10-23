<template>
  <div class="fill-height container--fluid">
    <div class="row justify-center">
      <v-col class="col-sm-8 col-md-6 col-12">
        <v-form>
          <v-card no-body class="p-4 login" elevation="12">
            <div class="justify-center text-center">
              <h1>Ai là triệu phú CMS</h1>

              <hr
                role="separator"
                aria-orientation="horizontal"
                class="my-8 v-divider theme--light"
              />

              <Notification v-if="error" class="text-center" :message="error" />
              <p class="text-muted"></p>

              <v-text-field
                v-model="username"
                :error-messages="usernameErrors"
                label="Tên đăng nhập"
                prepend-icon="mdi-account"
                required
                outlined
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :error-messages="passwordErrors"
                label="Mật khẩu"
                prepend-icon="mdi-lock"
                required
                outlined
                @click:append="showPassword = !showPassword"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              ></v-text-field>

              <v-btn color="primary" @click="login">Đăng nhập</v-btn>
            </div>
          </v-card>
        </v-form>
      </v-col>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import Notification from '~/components/Notification/Notification'

export default {
  validations: {
    username: { required, maxLength: maxLength(32) },
    password: { required, maxLength: maxLength(32) },
  },

  name: 'Login',
  layout: 'public',
  components: {
    Notification,
  },

  mixins: [validationMixin],

  data() {
    return {
      username: '',
      password: '',
      error: null,
      showPassword: false,
    }
  },

  computed: {
    ...mapGetters(['loggedInUser']),

    usernameErrors() {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.maxLength && errors.push('Sai tên đăng nhập')
      !this.$v.username.required &&
        errors.push('Tên đăng nhập không được bỏ trống.')
      return errors
    },

    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.maxLength && errors.push('Sai mật khẩu')
      !this.$v.password.required && errors.push('Mật khẩu không được bỏ trống.')
      return errors
    },
  },

  created() {
    this.logout()
  },

  methods: {
    async logout() {
      await this.$auth.logout()
    },
    async login() {
      try {
        const response = await this.$axios.post('auth/signin', {
          usernameOrEmail: this.username,
          password: this.password,
          channel: 'cms',
          transId: '2hmk3k',
        })

        await this.$auth.setToken(
          'local',
          'Bearer ' + response.data.accessToken
        )
        await this.$auth.setRefreshToken('local', response.data.refresh)
        await this.$auth.setUserToken(response.data.accessToken)
        await this.$router.push('/')
      } catch (e) {
        this.error = 'Sai tên đăng nhập hoặc mật khẩu.'
      }
    },
  },
}
</script>

<style>
.login {
  padding: 30px;
}
</style>
