<template>
  <div>
    <v-card class="fade-in">
      <v-card-title class="slide-left">
        <h2>
          {{ itemRecibido.name }}
        </h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="fade-in">
        <p><b><v-icon>mdi-timer</v-icon> Frecuencia:</b> {{ itemRecibido.selectedFrencunce }}</p>
        <p><b><v-icon>mdi-tag</v-icon> Categoria:</b> {{ itemRecibido.category }}</p>
        <h3><v-icon>mdi-cogs</v-icon> Procedimiento:</h3>
        <ul>
          <li v-for="(dato, index) in itemRecibido.datos" :key="index" class="slide-up">
            {{ dato }}
          </li>
        </ul>
        <h3><v-icon>mdi-tools</v-icon> Repuestos</h3>
        <ul>
          <li v-for="(repuesto, index) in itemRecibido.repuestos" :key="index" class="slide-up">
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

<style>
.fade-in {
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slide-left {
  animation: slide-left 0.5s ease;
}

@keyframes slide-left {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-up {
  animation: slide-up 0.5s ease;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>