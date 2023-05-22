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
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="prevents"
          :search="search"
          @click:row="(selectedTarea = $event), sendItem(selectedTarea)((dialogPreventivDetail = true))"
        >

        </v-data-table>
<PreventivsDetail/>
      </v-card>
    </v-app>
  </template>
  
  <script>
  import { db, collection, getDocs, deleteDoc, doc, query, where } from "@/main";
  import eventBus from "@/config/eventBus";
  import PreventivsDetail from '@/components/preventivsComponents/PreventivsDetail.vue'
  export default {
    data() {
      return {
        search: "",
        machines: [],
        selectedPreventiv: [],
        prevents: [],
        headers: [
          {
            text: "Cod.Acceso",
            align: "start",
            filterable: false,
            value: "accessCode",
          },
          { text: "Cod.Máquina", value: "machineCode.machineCode" },
          { text: "Alumno", value: "machineCode.student" },
          { text: "Cod.Máquina", value: "machineCode.machineCode" },

          { text: "Fecha Inicio", align: "center", value: "startDate" },
          { text: "Estado", align: "center", value: "state" },
        ],
      };
    },
  
    created() {
      eventBus.$on("item-selected", this.procesarItem);
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
    },
  components:{
    PreventivsDetail
  },
    methods: {
      async findByMachineCode() {
        
        const machineCode = this.itemRecibido.machineCode;
        try {
          const snapshot = await getDocs(
            query(collection(db, "preventivos"), where("machineCode.machineCode", "==", machineCode))
          );
          const preventivsDb = [];
  
          snapshot.forEach((doc) => {
            let preventivData = doc.data();
            preventivData.id = doc.id;
            preventivsDb.push(preventivData);
          });
  
          this.prevents = preventivsDb;
        } catch (error) {
            console.log(this.itemRecibido.machineCode)
          console.log(error);
        }
      },
  
      procesarItem(item) {
        this.itemRecibido = item;
        this.originalItem = JSON.parse(JSON.stringify(item));
        this.isReadOnly = true;
        this.hasChanges = false;
        this.findByMachineCode();
      },
  
      toggleEdit(prop) {
        if (this.itemRecibido.state !== "Acabado") {
          this.isReadOnly = !this.isReadOnly;
          if (!this.isReadOnly) {
            this.originalItem = JSON.parse(JSON.stringify(this.itemRecibido));
          } else {
            this.itemRecibido = JSON.parse(JSON.stringify(this.originalItem));
          }
          this.hasChanges = false;
        }
      },
  
      sendItem(item) {
        eventBus.$emit("item-selected", item);
      },
  
      async deletePreventivo(item) {
        try {
          const docRef = doc(db, "preventivos", item.id);
          await deleteDoc(docRef);
          this.getPreventivos();
        } catch (error) {
          console.log(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .disabled {
    opacity: 0.5;
  }
  </style>