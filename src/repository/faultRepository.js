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
} from "@/repository/dataBase";const COLLECTION_NAME = 'averias';
export default {
  getCollectionRef() {
    return collection(db, COLLECTION_NAME);
  },
  subscribeToCollection(collectionRef, callback) {
    return onSnapshot(collectionRef, callback);
  },
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
 * @param {Object} faultData - The machine data to update.
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
     * @param {Object} faultData - The machine data to delete.
     * @returns {void}
     */
    async delete(faultData) {
      try {
        const docRef = doc(db, COLLECTION_NAME, faultData.id);
        await deleteDoc(docRef);
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
              const notifications = snapshot.docs.map((doc) => {
                let machineData = doc.data();
                machineData.id = doc.id;
                return machineData;
              });
              resolve({ unsubscribe, notifications });
            },
            (error) => {
              console.log(error);
              reject(error);
            }
          );
        });
      } catch (error) {
        console.log(error);
        return { unsubscribe: null, notifications: [] };
      }
    },
  
    /**
     * Add a new machine to the database.
     * @param {Object} faultData - The machine data to add.
     * @returns {void}
     */
    async save(faultData) {
      try {
          await addDoc(collection(db, COLLECTION_NAME), faultData);
  
      } catch (error) {
        console.log(error);
      }
    },
    async getFaultToCalendar() {
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
  };