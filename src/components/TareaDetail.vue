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
        <h3>Datos:</h3>
        <ul>
          <li v-for="(dato, index) in itemRecibido.datos" :key="index">
            {{ dato.dato }}
          </li>
        </ul>
        <h3>Repuestos</h3>
        <ul>
          <li v-for="(repuesto, index) in itemRecibido.repuestos" :key="index">
            {{ repuesto.idRepuesto }} - {{ repuesto.nameRepuesto }}
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
     
      eventBus.$on('item-selected', this.procesarItem);
    },
    methods: {
      procesarItem(item) {
        this.itemRecibido = item;
        // Puedes realizar aquí cualquier lógica necesaria con el item recibido
      },
    },
  };
  </script>
