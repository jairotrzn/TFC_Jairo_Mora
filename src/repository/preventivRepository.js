import {
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "@/repository/dataBase";
const COLLECTION_NAME = "preventivos";
export default {
  /**
   * Update a machine.
   * @param {Object} preventvData - The machine data to update.
   * @returns {void}
   */
  async upDate(preventvData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, preventvData.id);
      await updateDoc(docRef, preventvData);

      // Update UI or perform other actions
    } catch (error) {
      console.error("Error updating machine: ", error);
    }
  },

  /**
   * Delete a machine.
   * @param {Object} preventvData - The machine data to delete.
   * @returns {void}
   */
  async delete(preventvData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, preventvData.id);
      await deleteDoc(docRef);

      // Update UI or perform other actions
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * Retrieve the list of machines from the database.
   * @returns {Array} - Array of machine objects.
   */
  async getAll() {
    console.log("Estoy en el repositorio");
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const machines = [];

      snapshot.forEach((doc) => {
        let preventvData = doc.data();
        preventvData.id = doc.id;
        machines.push(preventvData);
      });

      return machines;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  /**
   * Add a new machine to the database.
   * @param {Object} preventvData - The machine data to add.
   * @returns {void}
   */
  async save(preventvData) {
    try {
      await addDoc(collection(db, COLLECTION_NAME), preventvData);
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * Comprueba si existe un documento con un código de acceso específico.
   * @param {Object} preventvData - Datos de preventv.
   * @param {string} preventvData.accesoCode - Código de acceso a comprobar.
   * @returns {Promise<boolean>} - Devuelve una promesa que se resuelve en `true` si el documento existe, o `false` si no existe.
   */
  async isExist(preventvData) {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("accesoCode", "==", preventvData.accesoCode)
        )
      );
      if (querySnapshot.size === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
