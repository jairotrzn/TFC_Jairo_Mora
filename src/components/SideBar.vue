<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="#2784FF"
    expand-on-hover
    mini-variant
    mini-variant-width="80"
  >
    <v-avatar class="d-block text-center mx-auto mt-4 mb-16" color="" size="40">
      <v-icon color="white" x-large>fab fa-artstation</v-icon>
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
      <v-icon class="mb-5" color="white">fas fa-cog</v-icon>
      <br />
      <v-icon color="white">fas fa-info-circle</v-icon>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { VListItem } from "vuetify/lib";

export default {
  data: () => ({
    selectedItem: null,
    drawer: null,
    items: [
      { icon: "mdi mdi-home", to: "/", text: "Home" },
      { icon: "precision_manufacturing", to: "machines", text: "Machines" },
      { icon: "mdi mdi-home", to: "repuestos", text: "Repuestos" },
      { icon: "mdi mdi-home", text: "Item 4" },
      { icon: "mdi mdi-home", text: "Item 5" },
    ],
  }),

  components: {
    VListItem,
  },
};
</script>

<style>

.v-list-item-group .v-list-item--active {
  color: white !important;
}
.material-symbols-rounded:before {
  content: "\E048";
  font-family: "precision_manufacturing";
  font-size: 24px;
}
</style>