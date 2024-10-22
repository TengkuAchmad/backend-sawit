// LIBRARIES
const { v4: uuidv4 }       = require("uuid");
const { getStorage, getStream }       = require("firebase/storage");
const { ref }              = require("firebase/storage");
const { deleteObject }     = require("firebase/storage");
const { uploadBytes }      = require("firebase/storage");
const { getDownloadURL }   = require("firebase/storage");

// ESSENTIALS
exports.upload = async (category, file) => {
   try {
      if (!file?.length) {
         throw new Error("Invalid file!");
      }

      const fileContent = file[0];

      const storage = getStorage();

      const storageRef = ref(storage, `${category}/${uuidv4()}.png`);

      const snapshot = await uploadBytes(storageRef, fileContent.buffer);

      const fileUrl = await getDownloadURL(snapshot.ref);

      return fileUrl;

   } catch (error) {
      console.log(error);
      throw new Error(error.message)
   }
}

exports.delete = async (fileUrl) => {
   try {
       if (!fileUrl) {
           throw new Error("Invalid file url")
       }
       const storage = getStorage()
       const storageRef = ref(storage, `${fileUrl}`)
       
       deleteObject(storageRef).then(() => {
           console.log("File deleted successfully")
       }).catch((error) => {
           console.log("Error deleting file:", error)
       })

       return true
   } catch (error) {
       throw new Error(error.message)
   }
}