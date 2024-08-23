import { useRef, useState, useCallback, useEffect } from "react"
import { ref, uploadBytesResumable,getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "@/services/firebase"

const useImageUploader = () => {
   const inputFileRef = useRef(null)
   const [progressPercent, setProgressPercent] = useState(0)
   const [imgUrl, setImgUrl] = useState(null)
   const [error, setError] = useState(null)
   const [imageName, setImageName] = useState(null)
   const [prevImg, setPrevImg] = useState(null)

   useEffect(() => {
    // delete prev file from firbase if user reselect image 
      if(imageName != prevImg && prevImg != null){
      
        const imgRef = ref(storage, `images/${prevImg}`);

        deleteObject(imgRef).then(() => {
          // File deleted successfully
          console.log("prev file deleted")
          setError(null)
        }).catch((error) => {
          // Uh-oh, an error occurred!
          setError(`Error on Deleting file` + error)
        });
      }
      // console.log({imageName, prevImg})
   }, [imageName, prevImg])

   const handleFileInputChange = useCallback(() => {
      if(inputFileRef.current){
         const file = inputFileRef.current?.files[0]
         if(!file) return
         const storageRef = ref(storage, `images/${file.name}`)
         const uploadTask = uploadBytesResumable(storageRef, file);
         setImageName(prev => {
            setPrevImg(prev)
            return file.name
         })

         uploadTask.on("state_changed",
            (snapshot) => {
              const progress =
                Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgressPercent(progress);
            },
            (error) => {
              alert(error);
              console.error(error?.message || error)
              setError(error?.message || error)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImgUrl(downloadURL)
              });
            }
          );
      }
   }, [inputFileRef])

  return { inputFileRef, handleFileInputChange, progressPercent, imgUrl, imageName, error}
}

export default useImageUploader