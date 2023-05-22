<template>
  <v-app
    id="inspire"
    :style="{ background: $vuetify.theme.themes.dark.background }"
  >
    <SideBar />
    <Navbar />
    <v-container>
      <Contact />
      <br />
      <TableCrudPreventivos />
    </v-container>
  </v-app>
</template>

<script>
// @ is an alias to /src
import SideBar from "@/components/SideBar.vue";
import Navbar from "../components/Navbar.vue";
import Contact from "../components/Contact.vue";
import TableCrudPreventivos from "@/components/preventivsComponents/TableCrudPreventivos.vue";

export default {
  data: () => ({}),

  components: {
    
    SideBar,
    Navbar,
    Contact,
    TableCrudPreventivos,
  },
};
</script>
