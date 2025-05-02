import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

// Define the shape of the methods you want to expose
export type ImageUploadHandle = {
  reset: () => void;
  openIamgePicker: () => void;
};

const ImageUpload = forwardRef<ImageUploadHandle, { defaultValue?: File }>(
  ({ defaultValue }, ref) => {
    const filePickRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [imageDimensions, setImageDimensions] = useState<{
      width: number;
      height: number;
    } | null>(null);

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
        <div>
          <div className="my-4">
            {previewUrl ? (
              <div>
                <div
                  className={`w-[${imageDimensions?.width}px] flex justify-end m-1 `}
                >
                  <button
                    onClick={removeImageHandler}
                    className="mt-2 text-sm text-gray-200 underline"
                  >
                    <XCircleIcon className="h-9 w-9 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                <img
                  src={previewUrl}
                  alt="Preview"
                  width={imageDimensions?.width}
                  height={imageDimensions?.height}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No image picked
              </p>
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
  }
);

export default ImageUpload;
