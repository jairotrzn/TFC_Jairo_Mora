<template>
  <v-app-bar color="white" app dark flat>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-card class="phrase-card" elevation="5">
            <v-card-text class="text-center">
              <v-row align="center" justify="center">
                <v-col cols="auto">
                  <v-icon x-large>{{ currentIcon }}</v-icon>
                </v-col>
                <v-col cols="auto">
                  <p class="phrase-text">{{ currentPhrase }}</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-spacer></v-spacer>

    <v-icon color="black" @click="confirmLogOut()">mdi-logout</v-icon>
  </v-app-bar>
</template>

<script>
import { auth, signOut } from '@/config/firebaseConfig'
export default {
  data() {
    return {
      phrases: [
  { text: "La seguridad es lo primero", icon: "mdi-shield-check" },
  { text: "La seguridad en el trabajo es responsabilidad de todos", icon: "mdi-account-group-outline" },
  { text: "Trabaja de manera segura para regresar a casa sano y salvo", icon: "mdi-home-heart" },
  { text: "El conocimiento de la seguridad es la mejor protección", icon: "mdi-security" },
  { text: "La seguridad es un hábito, no un acto", icon: "mdi-check-circle" },
  { text: "No sacrifiques la seguridad por la productividad", icon: "mdi-alert-circle" },
  { text: "La seguridad no tiene precio, pero las lesiones sí", icon: "mdi-currency-usd-off" },
  { text: "Una mala decisión puede cambiar tu vida, elige la seguridad", icon: "mdi-lightning-bolt" },
  { text: "La seguridad es el puente que te lleva al éxito", icon: "mdi-bridge" },
  { text: "La seguridad es un lenguaje universal en el lugar de trabajo", icon: "mdi-earth" },
  { text: "Un entorno de trabajo seguro es un entorno de trabajo feliz", icon: "mdi-emoticon-happy" },
  { text: "La seguridad no es un gasto, es una inversión en el futuro", icon: "mdi-cash" },
  { text: "Haz de la seguridad un hábito, no un pensamiento ocasional", icon: "mdi-repeat" },
  { text: "La seguridad laboral no es negociable", icon: "mdi-cancel" },
  { text: "Nunca ignores las señales de advertencia de seguridad", icon: "mdi-alert-octagon" },
  { text: "La seguridad es la clave para una productividad sostenible", icon: "mdi-chart-line" },
  { text: "La seguridad es el pilar fundamental de la eficiencia", icon: "mdi-pillar" },
  { text: "No comprometas tu seguridad por la comodidad", icon: "mdi-bed" },
  { text: "El trabajo seguro es el mejor trabajo que puedes hacer", icon: "mdi-thumb-up" },
  { text: "La seguridad es el cimiento de una cultura laboral sólida", icon: "mdi-home-outline" },
  { text: "La seguridad es el reflejo de tu compromiso con el bienestar", icon: "mdi-account-heart" },
  { text: "El éxito se construye sobre una base de seguridad", icon: "mdi-building" },
  { text: "La seguridad es una inversión inteligente, no un gasto innecesario", icon: "mdi-currency-sign" },
  { text: "La seguridad es un derecho que todos debemos proteger", icon: "mdi-hand-heart" },
  { text: "El cuidado de tu seguridad es un acto de amor propio", icon: "mdi-heart" },
  { text: "La seguridad es un hábito que te acompaña en cada tarea", icon: "mdi-hand-okay" },
  { text: "La prevención es el escudo que te protege de los accidentes", icon: "mdi-shield" },
  { text: "La seguridad laboral es el compromiso de todos los empleados", icon: "mdi-account-multiple-check" },
  { text: "La seguridad es el cimiento de una carrera exitosa", icon: "mdi-trophy-outline" },
  { text: "La seguridad es la base de la confianza en el lugar de trabajo", icon: "mdi-account-voice" },
  { text: "El respeto por la seguridad es el primer paso hacia el éxito", icon: "mdi-handshake" }
],
      currentPhrase: "",
      currentIcon: "",
      logoutDialogVisible: false,
    };
  },
  methods: {
    generateRandomPhrase() {
      const randomIndex = Math.floor(Math.random() * this.phrases.length);
      this.currentPhrase = this.phrases[randomIndex].text;
      this.currentIcon = this.phrases[randomIndex].icon;
    },
    startRandomPhraseTimer() {
      setInterval(() => {
        this.generateRandomPhrase();
      }, 5000); // Cambiar cada 5 segundos (5000 milisegundos)
    },
    showLogoutDialog() {
      this.logoutDialogVisible = true;
    },
    cancelLogout() {
      this.logoutDialogVisible = false;
    },
    confirmLogOut(){
      if(confirm("Deseas cerrar sesión")){
        this.performLogout()
      }
    },
    async performLogout() {
      console.log("Voy a cerrar sesión");
      try {
        
        await signOut(auth);
        console.log("Sesión cerrada");
        this.logoutDialogVisible = false;
        this.$router.push("/");
      } catch (err) {
        console.error(err.message);
        this.logoutDialogVisible = false;
      }
    },
  },
  created() {
    this.generateRandomPhrase();
    this.startRandomPhraseTimer();
  },
};
</script>

<style scoped>
.v-btn.withoutupercase {
  text-transform: none !important;
}

.phrase-card {
  background-color: #2784FF;
  padding: 8px;
  color: white;
}

.phrase-text {
  font-size: 18px;
  margin: 8px 0;
}
</style>
