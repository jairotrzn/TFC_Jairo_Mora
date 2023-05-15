<template>
  <v-app
    id="inspire"
    :style="{ background: $vuetify.theme.themes.dark.background }"
  >
    <SideBar />
    <Navbar />
    <v-container>
      <v-row>
        <v-col cols="12" sm="9">
          <v-row>
            <v-col cols="12" sm="12">
              <Contact />
            </v-col>
            <v-col cols="12" sm="12">
              <TableCrudMachine />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="3">
          <Doctor />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// @ is an alias to /src
import SideBar from "@/components/SideBar.vue";
import Navbar from "../components/Navbar.vue";
import Contact from "../components/Contact.vue";
import Doctor from "../components/LateralBar.vue";
import TableCrudMachine from "../components/TableCrudMachines.vue";

export default {
  data: () => ({}),

  components: {
    SideBar,
    Navbar,
    Contact,
    Doctor,
    TableCrudMachine,
  },
};
</script>
