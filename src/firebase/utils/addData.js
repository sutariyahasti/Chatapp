import { ref, set } from 'firebase/database';
import { database } from '../firebase';

export default async function addData(collection, id, data) {
  let result = null;
  let error = null;

  try {
    // Set data in the Realtime Database
    await set(ref(database, `${collection}/${id}`), data);
    result = "Data added successfully!";
  } catch (e) {
    error = e.message;
  }

  return { result, error };
}
