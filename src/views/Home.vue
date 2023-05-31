<template>
  <v-app
    id="inspire"
    :style="{ background: $vuetify.theme.themes.dark.background }"
  >
    <SideBar />
    <Navbar />
    <v-container>
      <v-row>
          <v-row>
            <v-col cols="12" sm="12">     
            </v-col>
            <v-col cols="12" sm="12">
            <Agenda/>
            </v-col>
          </v-row>

      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// @ is an alias to /src
import SideBar from "@/components/SideBar.vue";
import Navbar from "../components/Navbar.vue";
import Agenda from "../components/Agenda.vue";

export default {
  data: () => ({
    
  }),
 
  components: {
    
    SideBar,
    Navbar,
    Agenda,
},
};
</script>
