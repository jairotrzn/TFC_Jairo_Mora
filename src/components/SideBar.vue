<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="#2784FF"
    expand-on-hover
    mini-variant
    mini-variant-width="80"
  >  
    <v-avatar class="d-block text-center mx-auto mt-4 mb-16" color="" size="100">

    </v-avatar>

    <v-list flat class="mt-16" justify-center>
      <v-list-item-group v-model="selectedItem" justify-center>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          tag="v-list-item"
          active-class="border"
          :ripple="false"
          @mouseover="selectedItem = i"
          @mouseleave="selectedItem = null"
          :class="{ hover: selectedItem === i }"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" :color="selectedItem === i ? 'white' : ''"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="item.text" class="ml-2"></v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <div
      style="
        position: absolute;
        bottom: 24px;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
      "
    >
    
      <br />
  <v-icon color="white" @click="abrirPDF">fas fa-info-circle</v-icon>
   </div>
  </v-navigation-drawer>
</template>

<script>
import { VListItem } from "vuetify/lib";
import myPDF from '@/assets/Manual.pdf'
export default {
  data: () => ({
    selectedItem: null,
    drawer: null,
    items: [
      { icon: "mdi-home", to: "/home", text: "Home" },
      { icon: "precision_manufacturing", to: "machines", text: "Machines" },
      { icon: "build", to: "repuestos", text: "Repuestos" },
      { icon: "mdi-calendar-check", to:"tareas", text: "Tareas" },
      { icon: "mdi-tools", to:"preventivos", text: "Preventivos" },
       { icon: " mdi-alert",to:"averias" ,text: "Averias" },
    ],
  }),

  components: {
    VListItem,
  },
  methods:{
    abrirPDF(){
      window.open('../assets/Manual.9efd3ee4.pdf');
    }
  }
};
</script>

<style>

.v-list-item-group .v-list-item--active {
  color: white !important;
}
.material-symbols-rounded:before {
  content: "\E049";
  font-family: "precision_manufacturing";
  font-size: 24px;
}
.material-symbols-rounded:before {
  content: "\E049";
  font-family: "build";
  font-size: 24px;
}

</style>