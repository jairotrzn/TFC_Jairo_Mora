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

        async findByMachineCode(machineCode) {
        
        try {
          const snapshot = await getDocs(
            query(collection(db, COLLECTION_NAME), where("machineCode.machineCode", "==", machineCode))
          );
          const preventivsDb = [];
  
          snapshot.forEach((doc) => {
            let preventivData = doc.data();
            preventivData.id = doc.id;
            preventivsDb.push(preventivData);
          });
  
        return preventivsDb;
        } catch (error) {
          console.log(error);
          return []
        }
      },
  /**
   * Update a machine.
   * @param {Object} preventvData - The machine data to update.
   * @returns {void}
   */
  async upDate(faultData) {
    try {
      const collectionRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(query(collectionRef, where("accessCode", "==", faultData.accessCode)));
      
      if (querySnapshot.size === 1) {
        const docRef = doc(collectionRef, querySnapshot.docs[0].id);
        await updateDoc(docRef, faultData);
      } else if (querySnapshot.size === 0) {
        console.log("No se encontró ningún documento con el accessCode proporcionado.");
      } else {
        console.log("Se encontraron múltiples documentos con el mismo accessCode.");
      }
    } catch (error) {
      console.error('Error updating machine: ', error);
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

  async getPrevntivTask() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const tareas = [];
  
      snapshot.forEach((doc) => {
        const preventivoData = doc.data();
        const tareasPreventivo = preventivoData.tareas || [];
  
        tareasPreventivo.forEach((tarea) => {
          if (tarea.start !== null && tarea.end !== null) {
            tarea.namePersonInCharge = preventivoData.namePersonInCharge
            tarea.machineData = preventivoData.machineCode.machineCode
            console.log(tarea)
            tareas.push(tarea);
          }
        });
      });
  
      return tareas;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
};
