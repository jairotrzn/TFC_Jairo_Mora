<template>
  <v-app
    id="inspire"
    :style="{ background: $vuetify.theme.themes.dark.background }"
  >
    <SideBar />
    <Navbar />
    <v-container>
      <v-col cols="12" sm="12">     
            </v-col>
      <TableCrudPreventivos />
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
