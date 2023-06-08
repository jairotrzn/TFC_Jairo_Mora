<template>
  <v-app>
    <v-main class="center-content">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-img src="@/assets/LogoProyecto.jpg" height="250"></v-img>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    required
                    :error-messages="emailErrors"
                    @blur="validateEmail"
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    label="Contraseña"
                    required
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                  <v-btn type="submit" color="primary" block>Iniciar sesión</v-btn>
                </v-form>
                <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '@/config/firebaseConfig';

export default {
  data() {
    return {
      email: "",
      password: "",
      emailErrors: [],
      errorMessage: "",
      showPassword: false
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
    if (user) {
      if (this.$route.path !== '/home') {
        this.$router.push('/home');
      }
    }
  });
  },
  methods: {
    login() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (this.$route.path !== '/home') {
        this.$router.push('/home');
      }        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(`Error de autenticación: ${errorCode} - ${errorMessage}`);
          if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
            this.errorMessage = "Email o contraseña incorrectos";
          } else {
            this.errorMessage = "Error de autenticación";
          }
        });
    },
    validateEmail() {
      if (this.email && !this.validateEmailFormat(this.email)) {
        this.emailErrors = ["Formato de email no válido"];
      } else {
        this.emailErrors = [];
      }
    },
    validateEmailFormat(email) {
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailFormat.test(email);
    }
  }
};
</script>

<style>
.elevation-12 {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>