<template>
  <v-card>
    <v-container>
      <v-form ref="form" @submit.prevent="addAveria">
        <p><b>CREAR NUEVO CORRECTIVO</b></p>

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
        <v-textarea
          v-model="descriptionDefault"
          label="Descripción de la averia"
          auto-grow
          outlined
          rows="3"
          row-height="25"
          shaped
        ></v-textarea>

        <br />
        <v-btn
          type="submit"
          color="primary"
          class="mr-4"
          @click.stop="validateForm"
          :disabled="isFormIncomplete"
          >Crear Nuevo Correctivo</v-btn
        >
        <br />
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
/**
 * Component for creating a new corrective task.
 */
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/main";
import { v4 as uuidv4 } from "uuid";

export default {
  /**
   * Component data.
   */
  data() {
    return {
      /** Default description of the task. */
      descriptionDefault: "",
      /** Start date of the task. */
      startDate: "",
      /** Machine code for the task. */
      machineCode: "",
      /** Available machines. */
      machines: [],
      /** Name of the responsible person. */
      namePersonInCharge: "",
      /** State of the task. */
      state: "Pendiente",
      /** Password for the task. */
      password: "",
    };
  },

  /**
   * Lifecycle hook: Called when the component is created.
   */
  created() {
    this.getMachines();
  },

  /**
   * Computed properties.
   */
  computed: {
    /**
     * Get the error message for the machine code.
     * @returns {string} The error message if the machine code is invalid, empty string otherwise.
     */
    getMachineCodeError() {
      return this.machineCode && !this.machines.includes(this.machineCode)
        ? "Option not available"
        : "";
    },
    /**
     * Check if the form is incomplete.
     * @returns {boolean} True if any of the form fields are incomplete, false otherwise.
     */
    isFormIncomplete() {
      return (
        !this.namePersonInCharge ||
        !this.machineCode ||
        !this.startDate ||
        !this.descriptionDefault
      );
    },
  },

  /**
   * Component methods.
   */
  methods: {
    /**
     * Validate the form.
     */
    validateForm() {
      this.$refs.form.validate();
    },

    /**
     * Fetch the available machines.
     */
    async getMachines() {
      try {
        const snapshot = await getDocs(collection(db, "machines"));
        this.machines = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * Generates a unique ID with a maximum length of 6 characters.
     * @returns {string} The generated unique ID.
     */
    generateUniqueId() {
      const uniqueId = uuidv4();
      const truncatedId = uniqueId.substr(0, 6);
      return truncatedId;
    },
    /**
     * Add a new task.
     */
    async addAveria() {
      try {
        await addDoc(collection(db, "averias"), {
          namePersonInCharge: this.namePersonInCharge,
          machineCode: this.machineCode,
          startDate: this.startDate,
          description: this.descriptionDefault,
          accessCode: this.generateUniqueId(),
          state: this.state,
          password: this.password,
        });
        this.$emit("averiaCreated");
      } catch (error) {
        console.log(error);
      }

      this.initializeForm();
    },

    /**
     * Initialize the form.
     */
    initializeForm() {
      this.namePersonInCharge = "";
      this.machineCode = "";
      this.startDate = "";
      this.descriptionDefault = "";
    },
  },
};
</script>

<style scoped>
.disabled {
  opacity: 0.5;
}
</style>
