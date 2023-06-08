<template>
  <div>
    <v-card>
      <v-card-title>
        <h2>{{ itemRecibido.nameTarea }}</h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p><b>Frecuencia:</b> {{ itemRecibido.selectedFrencunce }}</p>
        <p><b>Categoria:</b> {{ itemRecibido.category }}</p>
        <h3>Procedimiento:</h3>
        <ul>
          <li v-for="(dato, index) in itemRecibido.datos" :key="index">
            {{dato }}
          </li>
        </ul>
        <h3>Repuestos</h3>
        <ul>
          <li v-for="(repuesto, index) in itemRecibido.repuestos" :key="index">
            {{ repuesto.idRepuesto }} - {{ repuesto.name }}
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>
  
  <script>
import eventBus from '@/config/eventBus';

export default {
  data() {
    return {
      itemRecibido: null,
    };
  },
  created() {
    /**
     * Subscribes to the 'item-selected' event on the eventBus and handles the event by calling the 'procesarItem' method.
     * @returns {void}
     */
    eventBus.$on('item-selected', this.procesarItem);
  },
  methods: {
    /**
     * Processes the selected item received from the event.
     * @param {Object} item - The selected item.
     * @returns {void}
     */
    procesarItem(item) {
      this.itemRecibido = item;
    },
  },
};
</script>