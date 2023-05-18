<template>
    <v-card>
      <v-card-title>Detalle del Preventivo</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-card>
                <v-card-title>Información General</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="Nombre del Responsable" v-model="itemRecibido.namePersonInCharge" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="Código de acceso" v-model="itemRecibido.accessCode" readonly></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="Alumno" v-model="itemRecibido.student" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="Password" v-model="itemRecibido.password" readonly></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="Fecha de inicio" v-model="itemRecibido.startDate" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="Estado" v-model="itemRecibido.state" readonly  :class="estadoClase"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-title>Información de la Máquina</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="Código de Máquina" v-model="itemRecibido.machineCode.machineCode" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="Nombre de la Máquina" v-model="itemRecibido.machineCode.type" readonly></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field label="Ubicación" v-model="itemRecibido.machineCode.location" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field label="Departamento" v-model="itemRecibido.machineCode.department" readonly></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card>
                <v-card-title>Tareas Pendientes</v-card-title>
                <v-card-text>

                    <v-carousel v-model="model" hide-delimiters>
                  <v-carousel-item v-for="(tarea, index) in itemRecibido.tareas" :key="index">
                        <v-row>
                            <v-col>
                                <v-text-field label="Nombre Tarea" v-model="tarea.nameTarea" readonly></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field label="Categoria" v-model="itemRecibido.machineCode.department" readonly></v-text-field>
                            </v-col>
                        </v-row>
                      
                    <v-layout align-center justify-center>
                           
                      <div>
                          
                        <v-row>
                          <v-col cols="12">
                            <v-card-title>Procesos de la tarea</v-card-title>
                            <v-list>
                              <v-list-item v-for="(datos, repuestoIndex) in tarea.datos" :key="repuestoIndex">
                                <v-list-item-title>{{ (repuestoIndex + 1) + ". " + datos.dato }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-card-title>Repuestos necesarios</v-card-title>
                            <v-list>
                              <v-list-item v-for="(repuesto, repuestoIndex) in tarea.repuestos" :key="repuestoIndex">
                                <v-list-item-title>{{ "- " + repuesto.nameRepuesto }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                      </div>
                    </v-layout>
                  </v-carousel-item>
                </v-carousel>
                  
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </template>
<script>
import eventBus from '@/config/eventBus';

export default {
  data() {
    return {
      itemRecibido: null,
    };
  },
  computed: {
  estadoClase() {
    const estado = this.itemRecibido.state;
    console.log(estado)
    if (estado === 'Acabado') {
      return 'green-text'; // Clase CSS para texto verde
    } else if (estado === 'En proceso') {
      return 'orange-text'; // Clase CSS para texto naranja
    } else if (estado === 'Pendiente') {
      return 'red-text'; // Clase CSS para texto rojo
    }
    return ''; // Sin clase adicional
  }
},
  created() {
   
    eventBus.$on('item-selected', this.procesarItem);
  },
  methods: {
    procesarItem(item) {
      this.itemRecibido = item;
    },
  },
};
</script>
<style>
.green-text {
  color: green;
}

.orange-text {
  color: orange;
}

.red-text {
  color: red;
}
</style>