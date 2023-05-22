<template>
  <v-card>
    <v-container>
      <v-form>
        <p><b>CARACTERISTICAS TÉCNICAS</b></p>

        <v-row>
          <v-col cols="4">
            <img :src="imageConvert" alt="Imagen" style="width: 200px; height: auto;">
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="text"
              label="Tipo de máquina"
              :value="itemRecibido.type"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="text"
              label="Ubicación"
              :value="itemRecibido.location"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              type="text"
              label="Código Máquina"
              :value="itemRecibido.machineCode"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="text"
              label="Departamento"
              :value="itemRecibido.department"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Potencia Motor Principal (CV)"
              :value="itemRecibido.mainMotorPower"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Potencia Motor Avances (CV)"
              :value="itemRecibido.feedMotorPower"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Potencia Motobomba (CV)"
              :value="itemRecibido.pumpMotorPower"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Corriente (V)"
              :value="itemRecibido.current"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Velocidad Máxima (RPM)"
              :value="itemRecibido.maximumSpeed"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Velocidad Mínima (RPM)"
              :value="itemRecibido.minimumSpeed"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Nº de Velocidades"
              :value="itemRecibido.numberOfSpeeds"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <p><b>AVANCES MÁXIMOS</b></p>
        <v-row>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Avance Máximo Longitudinal"
              :value="itemRecibido.maximumLongitudinalFeed"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Nº avances longitudinales"
              :value="itemRecibido.numberOfLongitudinalFeeds"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Avance Máximo Transversal"
              :value="itemRecibido.maximumTransversalFeed"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Nº avances Transversal"
              :value="itemRecibido.numberOfTransversalFeeds"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Avance Máximo Vertical"
              :value="itemRecibido.maximumVerticalFeed"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Nº avances Vertical"
              :value="itemRecibido.numberOfVerticalFeeds"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <p><b>AVANCES MÍNIMOS</b></p>
        <v-row>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Avance Mínimo Longitudinal"
              :value="itemRecibido.minimumLongitudinalFeed"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Avance Mínimo Transversal"
              :value="itemRecibido.minimumTransversalFeed"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              type="number"
              label="Avance Mínimo vertical"
              :value="itemRecibido.minimumVerticalFeed"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>

import eventBus from "@/config/eventBus";
export default {
  data() {
    return {
      itemRecibido: null,
      isReadOnly: true,
      originalItem: null,
      hasChanges: false,
      imageConvert: null

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
    confirmUpdate() {
      console.log("voy a actualizar " + this.itemRecibido.student)
      if (confirm("¿Estás seguro de que deseas actualizar?")) {
        this.upDate(this.itemRecibido);
      }
    },
    procesarItem(item) {
      this.itemRecibido = item;
      this.originalItem = JSON.parse(JSON.stringify(item));
      this.isReadOnly = true;
      this.hasChanges = false;
      this.convertBinaryToImage(item.image);

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
    convertBinaryToImage(binaryData) {
      const binaryString = atob(binaryData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      this.imageConvert = imageUrl;
    },

}
};
</script>