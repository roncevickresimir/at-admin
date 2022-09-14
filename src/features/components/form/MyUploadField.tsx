import { FieldAttributes, FieldInputProps, useField } from "formik";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setFile } from "../../../slices/fileUploadSlice";

type UploadFileType = {
  setFieldValue: (field: string, value: any) => void;
  removePreviewOnUnmount?: boolean;
  imagePreview?: any[];
} & FieldAttributes<{}>;

const UploadFile: FC<UploadFileType> = ({
  setFieldValue,
  removePreviewOnUnmount,
  ...props
}) => {
  const { t } = useTranslation();

  const [field, meta, helper] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  const [preview, setImagePreview] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any>([]);

  useEffect(() => {
    setFieldValue(field.name, preview);
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": ["jpeg"],
      "image/svg": ["svg"],
    },
    //maxSize: 2000000,
    onDropAccepted: (acceptedFiles: File[]) => {
      setImagePreview((old) => [...old, acceptedFiles[0]]);
      helper.setTouched(true);
    },
  });

  return (
    <>
      <div className="flex flex--center flex--wrap">
        <div className="flex flex--center w--100 mb-4">
          {preview.map((p, index) => {
            return (
              <aside className="upload__images mr-6" key={index}>
                <img alt="" src={URL.createObjectURL(p)} />
              </aside>
            );
          })}
          {Array.isArray(props.imagePreview) &&
            props.imagePreview?.map((image, index) => {
              return (
                <aside className="upload__images mr-6" key={index}>
                  <img alt="" src={`http://${image.filePath}`} />
                </aside>
              );
            })}
        </div>

        <div {...getRootProps({ className: "upload" })}>
          {isDragActive ? <div className="upload__drag-overlay"></div> : ""}
          <input {...getInputProps()} />
          <div className="upload__text" role="presentation">
            {preview ? (
              <div className="flex--primary flex--col">
                <i className="icon icon--base icon--upload icon--grey"></i>
                <div className="type--color--tertiary type--wgt--regular">
                  {t("QUESTS.FORM.IMAGE_PLACEHOLDER")}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="field__validation">{errorText ? errorText : ""}</div>
    </>
  );
};

export default UploadFile;
