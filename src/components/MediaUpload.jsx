import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiX, FiImage, FiVideo, FiPlay, FiTrash2, FiPlus, FiCamera, FiFile } = FiIcons;

const MediaUpload = ({ media = [], onMediaChange, maxFiles = 5, acceptedTypes = "image/*,video/*" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files) => {
    if (media.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    setUploading(true);
    
    const newMedia = [];
    
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert(`${file.name} is not a valid image or video file`);
        continue;
      }

      // Validate file size (50MB max for videos, 10MB for images)
      const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Max size is ${file.type.startsWith('video/') ? '50MB' : '10MB'}`);
        continue;
      }

      try {
        const mediaItem = await processFile(file);
        newMedia.push(mediaItem);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error processing ${file.name}`);
      }
    }

    onMediaChange([...media, ...newMedia]);
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const mediaItem = {
          id: Date.now() + Math.random(),
          file: file,
          url: e.target.result,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        // Generate thumbnail for videos
        if (mediaItem.type === 'video') {
          generateVideoThumbnail(file)
            .then(thumbnail => {
              mediaItem.thumbnail = thumbnail;
              resolve(mediaItem);
            })
            .catch(() => {
              // If thumbnail generation fails, use a default
              mediaItem.thumbnail = null;
              resolve(mediaItem);
            });
        } else {
          resolve(mediaItem);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const generateVideoThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1; // Seek to 1 second
      };
      
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnail);
      };
      
      video.onerror = () => reject(new Error('Failed to generate thumbnail'));
      
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMedia = (id) => {
    onMediaChange(media.filter(item => item.id !== id));
  };

  const reorderMedia = (fromIndex, toIndex) => {
    const newMedia = [...media];
    const [removed] = newMedia.splice(fromIndex, 1);
    newMedia.splice(toIndex, 0, removed);
    onMediaChange(newMedia);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : media.length >= maxFiles
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={media.length >= maxFiles || uploading}
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-600">Processing files...</p>
            </div>
          ) : media.length >= maxFiles ? (
            <div className="space-y-4">
              <SafeIcon icon={FiImage} className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600">Maximum files reached</p>
                <p className="text-sm text-gray-500">You can upload up to {maxFiles} files</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                <SafeIcon icon={FiImage} className="h-8 w-8 text-primary-500" />
                <SafeIcon icon={FiVideo} className="h-8 w-8 text-secondary-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Images (JPG, PNG, GIF) and Videos (MP4, MOV, AVI)
                </p>
                <p className="text-xs text-gray-500">
                  Max {maxFiles} files • Images: 10MB • Videos: 50MB
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4" />
                <span>Choose Files</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Preview Grid */}
      {media.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">
              Uploaded Media ({media.length}/{maxFiles})
            </h3>
            {media.length > 1 && (
              <p className="text-sm text-gray-500">Drag to reorder</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {media.map((item, index) => (
                <MediaPreviewCard
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={removeMedia}
                  onReorder={reorderMedia}
                  formatFileSize={formatFileSize}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

const MediaPreviewCard = ({ item, index, onRemove, formatFileSize }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Media Preview */}
        <div className="aspect-video relative bg-gray-100">
          {item.type === 'video' ? (
            <div className="relative w-full h-full">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <SafeIcon icon={FiVideo} className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setShowPreview(true)}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <SafeIcon icon={FiPlay} className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                VIDEO
              </div>
            </div>
          ) : (
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowPreview(true)}
            />
          )}
          
          {/* Primary indicator */}
          {index === 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              PRIMARY
            </div>
          )}
        </div>

        {/* Media Info */}
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(item.size)}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove"
            >
              <SafeIcon icon={FiTrash2} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <SafeIcon icon={FiX} className="h-8 w-8" />
              </button>
              
              {item.type === 'video' ? (
                <video
                  src={item.url}
                  controls
                  className="max-w-full max-h-full rounded-lg"
                  autoPlay
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  className="max-w-full max-h-full rounded-lg"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MediaUpload;