import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import '../../../styles/addUser.css';

const ImageUploader = ({ imagePreview, onImageChange, onImageRemove }) => {
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/png, image/jpeg, image/jpg, image/gif"
        style={{ display: 'none' }}
      />

      <div
        className="add-user-upload-box"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {imagePreview ? (
          <div className="add-user-upload-preview">
            <img
              src={imagePreview.url}
              alt="Preview"
              className="add-user-upload-img"
            />
            <span className="add-user-upload-filename">
              {imagePreview.name || 'uploaded_image.png'}
            </span>
            <button
              type="button"
              className="btn-remove-upload"
              onClick={(e) => {
                e.stopPropagation();
                onImageRemove();
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={20} className="add-user-upload-icon" />
            <span className="add-user-upload-text">
              <strong>Click to upload</strong> or drag and drop PNG, JPG or JPEG (Max. 2MB)
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
