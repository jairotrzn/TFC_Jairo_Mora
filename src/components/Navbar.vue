<template>
  <v-app-bar color="white" app dark flat>
    <v-icon color="black" @click="showLogoutDialog">fas fa-long-arrow-alt-left</v-icon>
    <h4 class="black--text ml-3">Mantenimientos Tubalcain</h4>
    
    <v-spacer></v-spacer>
    
    <v-icon color="black" @click="showLogoutDialog">mdi-logout</v-icon>

    <v-dialog v-model="logoutDialogVisible" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirmar cierre de sesión</v-card-title>
        <v-card-text>¿Estás seguro de que deseas cerrar sesión?</v-card-text>
        <v-card-actions>
          <v-btn text @click="cancelLogout">Cancelar</v-btn>
          <v-btn color="primary" @click="performLogout">Cerrar sesión</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    logoutDialogVisible: false,
  }),
  methods: {
    showLogoutDialog() {
      this.logoutDialogVisible = true;
    },
    cancelLogout() {
      this.logoutDialogVisible = false;
    },
    async performLogout() {
      console.log("Voy a cerrar sesion")
          try {
        const auth = getAuth();
        await signOut(auth);
        console.log('Sesión cerrada');
        this.logoutDialogVisible = false;
        this.$router.push('/');
      } catch (err) {
        console.error(err.message);
        this.logoutDialogVisible = false;
      }
    },
  },
};
</script>

<style>
.v-btn.withoutupercase {
  text-transform: none !important;
}
</style>
