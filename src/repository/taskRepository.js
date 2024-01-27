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
} from "@/repository/dataBase";const COLLECTION_NAME = 'tareas';
export default {
   
  getCollectionRef() {
    return collection(db, COLLECTION_NAME);
  },
  subscribeToCollection(collectionRef, callback) {
    return onSnapshot(collectionRef, callback);
  },
    /**
     * Update a machine.
     * @param {Object} taskData - The machine data to update.
     * @returns {void}
     */
    async upDate(taskData) {
      console.log("Los datos que voy a añadir son " + taskData)
      try {
        const docRef = doc(db, COLLECTION_NAME, taskData.id);
        await updateDoc(docRef, taskData);
        } catch (error) {
        console.error('Error updating machine: ', error);
      }
    },
  
    /**
     * Delete a machine.
     * @param {Object} taskData - The machine data to delete.
     * @returns {void}
     */
    async delete(taskData) {
      try {
        const docRef = doc(db, COLLECTION_NAME, taskData.id);
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
              const tastks = snapshot.docs.map((doc) => {
                let tastkdata = doc.data();
                tastkdata.id = doc.id;
                return tastkdata;
              });
              resolve({ unsubscribe, tastks });
            },
            (error) => {
              console.log(error);
              reject(error);
            }
          );
        });
      } catch (error) {
        console.log(error);
        return { unsubscribe: null, tastks: [] };
      }
    },
  
    /**
     * Add a new machine to the database.
     * @param {Object} taskData - The machine data to add.
     * @returns {void}
     */
    async save(taskData) {
      try {
          await addDoc(collection(db, COLLECTION_NAME), taskData);
      } catch (error) {
        console.log(error);
      }
    },

  };

