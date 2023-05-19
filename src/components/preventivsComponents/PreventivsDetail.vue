<template>
  <v-card  class="custom-card">
    <v-card-title class="headline">Detalle del Preventivo</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-card class="mb-3">
              <v-card-title class="subtitle-1">Información General</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Nombre del Responsable"
                      v-model="itemRecibido.namePersonInCharge"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Código de acceso"
                      v-model="itemRecibido.accessCode"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Alumno"
                      v-model="itemRecibido.student"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Password"
                      v-model="itemRecibido.password"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Fecha de inicio"
                      v-model="itemRecibido.startDate"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Estado"
                      v-model="itemRecibido.state"
                      readonly
                      :class="estadoClase"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-col cols="12">
              <v-card class="mb-3">
                <v-card-title class="subtitle-1">Información de la Máquina</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Código de Máquina"
                        v-model="itemRecibido.machineCode.machineCode"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Nombre de la Máquina"
                        v-model="itemRecibido.machineCode.type"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Ubicación"
                        v-model="itemRecibido.machineCode.location"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Departamento"
                        v-model="itemRecibido.machineCode.department"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-col>
        </v-row>
        <v-card class="mb-3">
          <v-card-title class="subtitle-1">Tareas Pendientes</v-card-title>
          <v-list>
            <v-list-group
              no-action
              v-for="(tarea, index) in itemRecibido.tareas"
              :key="index"
            >
              <template v-slot:activator>
                <v-list-item-content class="headline">
                  {{ tarea.nameTarea | uppercase }}
                </v-list-item-content>
              </template>
              <v-list-item-subtitle class="text-center">Procesos de la tarea</v-list-item-subtitle>
              <v-list>
                <v-list-item
                  v-for="(datos, repuestoIndex) in tarea.datos"
                  :key="repuestoIndex"
                >
                  <v-list-item-content class="text-right">
                    {{ repuestoIndex + 1 + ". " + datos.dato }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list-item-subtitle class="text-center">Repuestos necesarios:</v-list-item-subtitle>
              <v-list>
                <v-list-item
                  v-for="(repuesto, repuestoIndex) in tarea.repuestos"
                  :key="repuestoIndex"
                >
                  <v-list-item-content class="text-right">
                    - {{ repuesto.nameRepuesto }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-list-group>
          </v-list>
        </v-card>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import eventBus from "@/config/eventBus";

export default {
  data() {
    return {
      itemRecibido: null,
    };
  },
  computed: {
    estadoClase() {
      const estado = this.itemRecibido.state;
      if (estado === "Acabado") {
        return "green--text"; // Class for green text
      } else if (estado === "En proceso") {
        return "orange--text"; // Class for orange text
      } else if (estado === "Pendiente") {
        return "red--text"; // Class for red text
      }
      return ""; // No additional class
    },
  },
  created() {
    eventBus.$on("item-selected", this.procesarItem);
  },
  methods: {
    procesarItem(item) {
      this.itemRecibido = item;
    },
  },
};
</script>

<style scoped>
.custom-card {
  border: 2px solid #ACF3DB; /* Color de borde #E1EA1F */
  border-radius: 4px; /* Opcional: agrega esquinas redondeadas */
}
.subtitle-1 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.green--text {
  color: green;
}

.orange--text {
  color: orange;
}

.red--text {
  color: red;
}
</style>
