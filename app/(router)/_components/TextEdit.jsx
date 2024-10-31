"use client";

import { createPost, hidePost } from "@/app/redux/PostSlice";
import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

const TextEdit = () => {
  const { toast } = useToast();
  const [postDetail, setPostDetails] = useState({
    title: "",
    description: "",
    image: "",
    userId: "",
  });
  const [imageUploaded, setImageUploaded] = useState(false);
  const dispatch = useDispatch();
  
  const userId = useSelector((state) => state.user.entity.data.id);

  // Update postDetails when userId changes
  useEffect(() => {
    setPostDetails((prevDetails) => ({
      ...prevDetails,
      userId: userId,
    }));
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setPostDetails({
      ...postDetail,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload success
  const handleImageUpload = (imageData) => {
    console.log("Image Data:", imageData); // Debug: Check the structure of imageData
    if (imageData && imageData.info?.secure_url) {
      setPostDetails((prevDetails) => ({
        ...prevDetails,
        image: imageData.info.secure_url,
      }));
      setImageUploaded(true);
      toast({
        title: "Image Uploaded",
        description: "Image uploaded successfully.",
        variant: "default",
      });
    } else {
      setImageUploaded(false);
      toast({
        title: "Image Upload Failed",
        description: "Please try uploading the image again.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageUploaded) {
      toast({
        title: "Image Required",
        description: "Please upload an image to create a post.",
        variant: "destructive",
      });
      return;
    }

    const serializablePostDetail = {
      title: postDetail.title,
      description: postDetail.description,
      userId: postDetail.userId,
      image: postDetail.image,
    };

    try {
      // Dispatch actions to create a post
      dispatch(createPost({ postDetail: serializablePostDetail }));
      dispatch(hidePost());

      toast({
        title: "Post Created",
        description: "Your post has been created successfully.",
        variant: "default",
      });

      // Reset the form after submission
      setPostDetails({
        title: "",
        description: "",
        image: "",
        userId: userId,
      });
      setImageUploaded(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center relative p-5 flex-col bg-indigo-800 rounded-md shadow-md dark:bg-gray-800"
    >
      <div className="flex w-full">
        <label htmlFor="title" className="w-full text-white dark:text-gray-200">
          Title:
          <input
            type="text"
            name="title"
            id="title"
            value={postDetail.title}
            onChange={handleChange}
            className="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            placeholder="Title"
            required
          />
        </label>
      </div>
      <div className="flex w-full mt-4">
        <label htmlFor="description" className="w-full text-white dark:text-gray-200">
          Description:
          <textarea
            name="description"
            id="description"
            rows="3"
            value={postDetail.description}
            onChange={handleChange}
            className="w-full px-3 py-2 placeholder-gray-400 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            placeholder="Description"
            required
          ></textarea>
        </label>
      </div>
      <div className="flex w-full mt-4">
        {postDetail.title && postDetail.description && (
         <CldUploadWidget
         options={{
           sources: ["local", "url", "unsplash"],
           multiple: false,
           maxFiles: 1,
           uploadPreset: "your_upload_preset", // Ensure this is set correctly
         }}
         signatureEndpoint="/api/sign-image" // The endpoint to get the signature
         onSuccess={handleImageUpload}
       >
         {({ open }) => (
           <button
             onClick={open}
             className="w-full px-3 py-2 text-white bg-gray-700 rounded-md"
           >
             Upload Image
           </button>
         )}
       </CldUploadWidget>
       

        )}
      </div>
      <div className="flex w-full mt-4">
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-black rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TextEdit;
