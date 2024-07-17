import { ref, update } from "firebase/database";
import { database } from '../firebase';

const updateData = async (collection, docId, data) => {
  const docRef = ref(database, `${collection}/${docId}`);
  try {
    await update(docRef, data);
    return { result: "success" };
  } catch (error) {
    return { error };
  }
};

export default updateData;
