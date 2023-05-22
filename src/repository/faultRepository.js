import  {db, collection, getDocs, addDoc, doc, deleteDoc, query, where ,updateDoc} from '@/repository/dataBase'
const COLLECTION_NAME = 'averias';
export default {
   

    /**
     * Update a machine.
     * @param {Object} faultData - The machine data to update.
     * @returns {void}
     */
    async upDate(faultData) {
      try {
        const docRef = doc(db, COLLECTION_NAME, faultData.id);
        await updateDoc(docRef, faultData);
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
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        const faults = [];
  
        snapshot.forEach((doc) => {
          let faultData = doc.data();
          faultData.id = doc.id;
          faults.push(faultData);
        });
  
        return faults;
      } catch (error) {
        console.log(error);
        return [];
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
  };