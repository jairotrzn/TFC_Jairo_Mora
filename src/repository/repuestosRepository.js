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
  onSnapshot,
  ref,
  storage,
  deleteObject,
} from "@/repository/dataBase";const COLLECTION_NAME = 'repuestos';
export default {
  getCollectionRef() {
    return collection(db, COLLECTION_NAME);
  },
  subscribeToCollection(collectionRef, callback) {
    return onSnapshot(collectionRef, callback);
  },

    /**
     * Update a machine.
     * @param {Object} repuestoData - The machine data to update.
     * @returns {void}
     */
    async upDate(repuestoData) {
      try {
        const docRef = doc(db, COLLECTION_NAME, repuestoData.id);
        await updateDoc(docRef, repuestoData);
  
        // Update UI or perform other actions
      } catch (error) {
        console.error('Error updating machine: ', error);
      }
    },
  
    /**
     * Delete a machine.
     * @param {Object} repuestoData - The machine data to delete.
     * @returns {void}
     */
    async delete(repuestoData) {
      try {
        const docRef = doc(db, COLLECTION_NAME, repuestoData.id);
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
        return new Promise((resolve, reject) => {
          const unsubscribe = onSnapshot(
            collection(db, COLLECTION_NAME),
            (snapshot) => {
              const repuestos = snapshot.docs.map((doc) => {
                let repuestoData = doc.data();
                repuestoData.id = doc.id;
                return repuestoData;
              });
              resolve({ unsubscribe, repuestos });
            },
            (error) => {
              console.log(error);
              reject(error);
            }
          );
        });
      } catch (error) {
        console.log(error);
        return { unsubscribe: null, repuestos: [] };
      }
    },
  
    /**
     * Add a new machine to the database.
     * @param {Object} repuestoData - The machine data to add.
     * @returns {void}
     */
    async save(repuestoData) {
      try {
   
          await addDoc(collection(db, COLLECTION_NAME), repuestoData);
     
      } catch (error) {
        console.log(error);
      }
    },
  };