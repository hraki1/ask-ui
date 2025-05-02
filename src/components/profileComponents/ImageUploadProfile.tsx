import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import profileImg from "../../assets/images/download.png";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";

// Define the shape of the methods you want to expose
export type ImageUploadHandle = {
  reset: () => void;
  openIamgePicker: () => void;
};

const ImageUploadProfile = forwardRef<
  ImageUploadHandle,
  { defaultValue?: File }
>(({ defaultValue }, ref) => {
  const filePickRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);


  const auth = useAppSelector((state: RootState) => state.auth);


  const pickImageHandler = () => {
    filePickRef.current?.click();
  };

  const fileChangeHandler = () => {
    const file = filePickRef.current?.files?.[0];

    if (file && file.type.match(/image\/(jpeg|png|jpg)/)) {
      setIsValid(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);

        const img = new Image();
        img.src = result;
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
      };
      reader.readAsDataURL(file);
    } else {
      setIsValid(false);
      setPreviewUrl(null);
      setImageDimensions(null);
    }
  };

  const removeImageHandler = () => {
    setPreviewUrl(null);
    setIsValid(false);
    setImageDimensions(null);
    if (filePickRef.current) {
      filePickRef.current.value = ""; // clear file input
    }
  };

  // Expose method to parent
  useImperativeHandle(ref, () => ({
    reset() {
      removeImageHandler();
    },
    openIamgePicker: () => {
      filePickRef.current?.click();
    },
  }));

  return (
    <div>
      <input
        id="image-upload"
        name="image"
        ref={filePickRef}
        type="file"
        className="hidden"
        accept=".jpg,.png,.jpeg"
        onChange={fileChangeHandler}
      />
      <div className="flex flex-col items-center">
        <div className="my-4">
          {previewUrl ? (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-[#1F2A40] object-cover"
              />
            </div>
          ) : (
            <div className="mb-4">
              <img
                src={
                  auth.user?.imageUrl && auth.user?.imageUrl !== ""
                    ? `${process.env.REACT_APP_ASSET_URL}/${auth.user?.imageUrl}`
                    : profileImg
                }
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-[#1F2A40] object-cover"
              />
            </div>
          )}
        </div>

        {!isValid && previewUrl && (
          <p className="text-red-500 text-sm mb-2">
            Please pick a valid image file (.jpg, .png, .jpeg)
          </p>
        )}

        <button
          type="button"
          onClick={pickImageHandler}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Pick Image
        </button>
      </div>
    </div>
  );
});

export default ImageUploadProfile;
