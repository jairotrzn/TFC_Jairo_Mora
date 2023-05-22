<template>
    <v-app>
    
    <v-sheet class="bg-deep-white pa-12" rounded>
        <v-card class="mx-auto px-6 py-8" max-width="344">
          <v-form v-model="form" @submit.prevent="onSubmit">
            <v-text-field
              v-model="email"
              :readonly="loading"
              :rules="[required, validateEmail]"
              :error-messages="emailErrors"
              class="mb-2"
              clearable
              label="Email"
              @blur="checkEmailFormat"
            ></v-text-field>
    
            <v-text-field
              v-model="password"
              :readonly="loading"
              :rules="[required]"
              clearable
              label="Password"
              placeholder="Introduce tu contraseña"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
    
            <br>
    
            <v-btn
              :disabled="!form"
              :loading="loading"
              block
              color="success"
              size="large"
              type="submit"
              variant="elevated"
              @click="autentication"
            >
              Sign In
            </v-btn>
          </v-form>
        </v-card>
      </v-sheet>
    </v-app>
      
    </template>
    
    <script>
    import { Auth, signInWithEmailAndPassword, onAuthStateChanged } from '@/config/firebaseConfig';
    
    
    export default {
      created() {
        onAuthStateChanged(Auth, user => {
          if (user) {
            console.log(`Usuario autenticado: ${user.email}`);
               this.$router.push('/home');
    
          }
        });
      },
    
      data() {
        return {
          form: false,
          email: null,
          password: null,
          loading: false,
          showPassword: false,
          emailErrors: []
        }
      },
    
      methods: {
        autentication () {
          signInWithEmailAndPassword(Auth, this.email, this.password)
            .then(userCredential => {
              // La autenticación se realizó correctamente
              const user = userCredential.user;
             
            })
            .catch(error => {
              // Si se produce un error en la autenticación, se muestra en la consola
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error(`Error de autenticación: ${errorCode} - ${errorMessage}`);
            });
        },
    
        onSubmit() {
          if (!this.form) return;
          this.loading = true;
          setTimeout(() => (this.loading = false), 2000);
        },
    
        required(v) {
          return !!v || "Este campo es obligatorio";
        },
    
        validateEmail(v) {
          if (!v) return true;
          const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailFormat.test(v) || "Formato de email no valido";
        },
    
        checkEmailFormat() {
          if (this.email && !this.validateEmail(this.email)) {
            this.emailErrors.push("Formarto de email no valido");
          } else {
            this.emailErrors = [];
          }
        }
      }
    };
    </script>
    
    
    