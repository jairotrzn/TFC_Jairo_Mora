
<template>
    <v-app>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <template>
            <div class="text-center">
              <v-btn
                class="mx-2"
                fab
                dark
                color="indigo"
                @click="(dialogCreatPreventivo = true), getMachines()"
              >
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </div>
          </template>
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="prevents"
          :search="search"
          @click:row="
            (selectedTarea = $event)
              
          "
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" color="red" @click="deleteRepuesto(item)"
              >mdi-delete</v-icon
            >
            <v-icon
              small
              color="blue"
              @click="
                selectedRepuesto = item;
                dialogUpdateRepuesto = true;
              "
              >mdi-pencil</v-icon
            >
          </template>
        </v-data-table>
        <!--MOdal dialogo Detalles preventivo-->
        
        <v-dialog v-model="dialogPreventivDetail">
          <h1>ljkfnvdfskj.vnkds,mvx.mx,c</h1>
          <v-card>
    <v-card-title >Detalle del Preventivo</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-card>
              <v-card-title>Información General</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Nombre del Responsable"
                      v-model="selectedTarea.namePersonInCharge"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Código de acceso"
                      v-model="selectedTarea.accessCode"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Alumno"
                      v-model="selectedTarea.student"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Password"
                      v-model="selectedTarea.password"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Fecha de inicio"
                      v-model="selectedTarea.startDate"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Estado"
                      v-model="selectedTarea.state"
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
              <v-card>
                <v-card-title>Información de la Máquina</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Código de Máquina"
                        v-model="selectedTarea.machineCode.machineCode"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Nombre de la Máquina"
                        v-model="selectedTarea.machineCode.type"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Ubicación"
                        v-model="selectedTarea.machineCode.location"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Departamento"
                        v-model="selectedTarea.machineCode.department"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-card> </v-card>
          </v-col>
          <br />
        </v-row>
        <v-card>
          <v-card-title>Tareas Pendientes</v-card-title>
          <v-list>
            <v-list-group
              no-action
              v-for="(tarea, index) in selectedTarea.tareas"
              :key="index"
            >
              <template v-slot:activator>
                <v-list-item-content>{{
                  tarea.nameTarea | uppercase
                }}</v-list-item-content>
              </template>
              <v-list-item-subtitle class="text-center"
                >Procesos de la tarea</v-list-item-subtitle
              >
              <v-list>
                <v-list-item
                  v-for="(datos, repuestoIndex) in tarea.datos"
                  :key="repuestoIndex"
                >
                  <v-list-item-content class="text-right">{{
                    repuestoIndex + 1 + ". " + datos.dato
                  }}</v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list-item-subtitle class="text-center"
                >Repuestos necesarios:</v-list-item-subtitle
              >
              <v-list>
                <v-list-item
                  v-for="(repuesto, repuestoIndex) in tarea.repuestos"
                  :key="repuestoIndex"
                >
                  <v-list-item-content class="text-right">{{
                    "- " + repuesto.nameRepuesto
                  }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-list-group>
          </v-list>
        </v-card>
        <v-row> </v-row>
      </v-container>
    </v-card-text>
  </v-card>
        </v-dialog>
        <!--Modal dialogo crear Preventivo -->
        <v-dialog v-model="dialogCreatPreventivo">
          <v-card>
            <v-container>
              <v-form ref="form" @submit.prevent="addPreventivo">
                <p><b>CREAR NUEVO PREVENTIVO</b></p>
  
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      type="text"
                      label="Agregar nombre de responsable"
                      v-model="namePersonInCharge"
                      :rules="[(v) => !!v || 'Este campo es obligatorio']"
                      required
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-combobox
                      v-model="machineCode"
                      :items="machines"
                      label="Código Máquina"
                      item-text="machineCode"
                      required
                      dense
                      filterable
                      :error-messages="getMachineCodeError"
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      type="date"
                      label="Fecha de inicio"
                      v-model="startDate"
                      required
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-data-table
                  v-model="selectedPreventiv"
                  :headers="headersTablaTareas"
                  :items="filteredTareas"
                  :single-select="singleSelectTarea"
                  item-key="nameTarea"
                  show-select
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title>Tareas</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-toolbar>
                  </template>
                </v-data-table>
  
                <br />
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  @click.stop="validateForm"
                  :disabled="isFormIncomplete"
                  >Crear Nuevo Preventivo</v-btn
                >
                <br />
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
      </v-card>
    </v-app>
  </template>
  
  <script>
  import { updateDoc } from "firebase/firestore";
  import { db, collection, getDocs, addDoc, deleteDoc, doc } from "../main";
  import eventBus from "@/config/eventBus";
  import { v4 as uuidv4 } from "uuid";
  import PreventivsDetail from "@/components/preventivsComponents/PreventivsDetail.vue";
  export default {
    components: {
      PreventivsDetail,
    },
    data() {
      return {
        dialogPreventivDetail: false,
        singleSelectTarea: false,
        startDate: "",
        machineCode: "",
        singleSelect: false,
        search: "",
        dialogCreatPreventivo: false,
        machines: [],
        selectedPreventiv: null,
        tareas: [],
        namePersonInCharge: "",
        prevents: [],
        isMachineCodeValid: true,
        headersTablaTareas: [
          { text: "Nombre", value: "nameTarea" },
          {
            text: "Categoria",
            align: "start",
            filterable: false,
            value: "category",
          },
          { text: "Frecuencia", align: "center", value: "selectedFrencunce" },
        ],
  
        headers: [
          {
            text: "Cod.Acceso",
            align: "start",
            filterable: false,
            value: "accessCode",
          },
          { text: "Cod.Máquina", value: "machineCode.machineCode" },
          { text: "Alumno", align: "center", value: "student" },
          { text: "Password", align: "center", value: "password" },
          { text: "Fecha Inicio", align: "center", value: "startDate" },
          { text: "Estado", align: "center", value: "state" },
          { text: "Acciones", align: "center", value: "actions" },
        ],
      };
    },
  
    created() {
      this.getPreventivos();
      this.getTareas();
    },
    computed: {
      filteredTareas() {
        return this.tareas.filter((tareas) => {
          const searchTerm = this.search.toLowerCase();
          return (
            tareas.nameTarea.toLowerCase().includes(searchTerm) ||
            tareas.category.toLowerCase().includes(searchTerm) ||
            tareas.selectedFrencunce.toLowerCase().includes(searchTerm)
          );
        });
      },
      getMachineCodeError() {
        if (this.machineCode && !this.machines.includes(this.machineCode)) {
          return "Opción no disponible";
        } else {
          return "";
        }
      },
      isFormIncomplete() {
        return (
          !this.namePersonInCharge ||
          !this.machineCode ||
          !this.startDate ||
          this.selectedPreventiv.length === 0
        );
      },
    },
  
    methods: {
      async getTareas() {
        try {
          const snapshot = await getDocs(collection(db, "tareas"));
          const tareasDb = [];
  
          snapshot.forEach((doc) => {
            let tareasData = doc.data();
            tareasData.id = doc.id;
            tareasDb.push(tareasData);
          });
  
          this.tareas = tareasDb;
        } catch (error) {
          console.log(error);
        }
      },
      validateForm() {
        this.$refs.form.validate();
      },
      sendItem(item) {
        console.log({ item });
        eventBus.$emit("item-selected", item);
      },
      async deleteDato(item) {
        const index = this.datos.indexOf(item);
        if (index !== -1) {
          this.datos.splice(index, 1);
        }
      },
      agregarDato() {
        this.datos.push({ dato: this.nuevoDato });
        this.nuevoDato = "";
      },
  
      async deletePreventivo(item) {
        try {
          const docRef = doc(db, "tareas", item.id);
          await deleteDoc(docRef);
          this.getTareas();
        } catch (error) {
          console.log(error);
        }
      },
      async getMachines() {
       
        try {
          const snapshot = await getDocs(collection(db, "machines"));
          const machines = [];
  
          snapshot.forEach((doc) => {
            let machinesData = doc.data();
            machinesData.id = doc.id;
            machines.push(machinesData);
          });
  
          this.machines = machines;
        } catch (error) {
          console.log(error);
        }
      },
      async getPreventivos() {
        try {
          const snapshot = await getDocs(collection(db, "averias"));
          const preventivsDb = [];
  
          snapshot.forEach((doc) => {
            let preventivData = doc.data();
            preventivData.id = doc.id;
            preventivsDb.push(preventivData);
          });
  
          this.prevents = preventivsDb;
        } catch (error) {
          console.log(error);
        }
      },
      async addPreventivo() {
        try {
          await addDoc(collection(db, "averias"), {
            namePersonInCharge: this.namePersonInCharge,
            accessCode: this.generateUniqueId(),
            machineCode: this.machineCode,
            tareas: this.selectedPreventiv,
            startDate: this.startDate,
            state: "Pendiente",
          });
        } catch (error) {
          console.log(error);
        }
        this.getPreventivos();
        this.inizialite();
      },
      generateUniqueId() {
        const uniqueId = uuidv4();
        const truncatedId = uniqueId.substr(0, 6);
        return truncatedId;
      },
      inizialite() {
        this.nameTarea = "";
        this.category = "";
        this.selectedFrencunce = "";
        this.datos = "";
        this.selectedRepuesto = [];
      },
    },
  };
  </script>
  <style scoped>
  .disabled {
    opacity: 0.5;
  }
  </style>
  