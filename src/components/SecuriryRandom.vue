<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="phrase-card" elevation="5">
          <v-card-title class="phrase-card-title">
            <v-icon class="security-icon">mdi-shield-check</v-icon>
            <h2 class="phrase-title">Frase Aleatoria de Seguridad Laboral</h2>
          </v-card-title>
          <v-card-text>
            <p class="phrase-text">{{ currentPhrase }}</p>
          </v-card-text>
    
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      phrases: [
        "La seguridad es lo primero",
        "La seguridad en el trabajo es responsabilidad de todos",
        "Trabaja de manera segura para regresar a casa sano y salvo",
        "El conocimiento de la seguridad es la mejor protección",
        "La seguridad es un hábito, no un acto",
        "No sacrifiques la seguridad por la productividad",
        "La seguridad no tiene precio, pero las lesiones sí",
        "Una mala decisión puede cambiar tu vida, elige la seguridad",
        "La seguridad es el puente que te lleva al éxito",
        "La seguridad es un lenguaje universal en el lugar de trabajo",
        "Un entorno de trabajo seguro es un entorno de trabajo feliz",
        "La seguridad no es un gasto, es una inversión en el futuro",
        "Haz de la seguridad un hábito, no un pensamiento ocasional",
        "La seguridad laboral no es negociable",
        "Nunca ignores las señales de advertencia de seguridad",
        "La seguridad es la clave para una productividad sostenible",
        "La seguridad es el pilar fundamental de la eficiencia",
        "No comprometas tu seguridad por la comodidad",
        "El trabajo seguro es el mejor trabajo que puedes hacer",
        "La seguridad es el cimiento de una cultura laboral sólida",
      ],
      currentPhrase: "",
    };
  },
  methods: {
    generateRandomPhrase() {
      const randomIndex = Math.floor(Math.random() * this.phrases.length);
      this.currentPhrase = this.phrases[randomIndex];
    },
    startRandomPhraseTimer() {
      setInterval(() => {
        this.generateRandomPhrase();
      }, 50000); 
    },
  },
  created() {
    this.generateRandomPhrase();
    this.startRandomPhraseTimer();
  },
};
</script>

<style scoped>
.phrase-card {
  background-color: #f5f5f5;
  text-align: center;
  padding: 16px;
}

.phrase-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
}

.security-icon {
  font-size: 32px;
  margin-right: 8px;
}

.phrase-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.phrase-text {
  font-size: 18px;
  margin: 16px 0;
}

.generate-btn {
  color: #fff;
}
</style>
