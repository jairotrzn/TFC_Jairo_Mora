<template>
  <v-app
    id="inspire"
    :style="{ background: $vuetify.theme.themes.dark.background }"
  >
    <SideBar />
    <Navbar />
    <v-container>
      <v-col cols="12" sm="12">
        <h1>Preventivos</h1>
      </v-col>
      <v-col cols="12" sm="12">
        <TableCrudPreventivos />
      </v-col>
    </v-container>
  </v-app>
</template>

<script>
// @ is an alias to /src
import SideBar from "@/components/SideBar.vue";
import Navbar from "../components/Navbar.vue";
import TableCrudPreventivos from "@/components/preventivsComponents/TableCrudPreventivos.vue";

export default {
  data: () => ({}),

  components: {
    SideBar,
    Navbar,
    TableCrudPreventivos,
  },
};
</script>
