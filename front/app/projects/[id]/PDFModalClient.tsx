'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Download, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface PDFModalClientProps {
  projectId: string;
  hasPdf: boolean;
}

const PDFModalClient: React.FC<PDFModalClientProps> = ({ projectId, hasPdf: initialHasPdf }) => {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [currentHasPdf, setCurrentHasPdf] = useState(initialHasPdf);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Select a valid PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too heavy.');
      return;
    }

    uploadPdf(file);
  };

  const uploadPdf = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
  
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
  
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const GROUP_TOKEN = process.env.NEXT_PUBLIC_GROUP_TOKEN;
  
      const response = await fetch(`${API_BASE_URL}/startups/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Group-Authorization': GROUP_TOKEN || '',
        },
        body: JSON.stringify({ pdf: base64 }),
      });
  
      if (!response.ok) {
        throw new Error(`Upload error: ${response.statusText}`);
      }
  
      setUploadSuccess(true);
      setCurrentHasPdf(true);
      setTimeout(() => {
        setIsPdfModalOpen(false);
        window.location.reload();
      }, 2000);
  
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Error uploading PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDownload = () => {
    const downloadUrl = `/api/projects/${projectId}`;
    window.open(downloadUrl, '_blank');
  };

  const resetModal = () => {
    setUploadSuccess(false);
    setUploadError(null);
    setIsUploading(false);
    setIsPdfModalOpen(false);
  };

  const openModal = () => {
    setIsPdfModalOpen(true);
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Documentation
        </h3>
        {currentHasPdf ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-green-700 flex-1">PDF available</span>
            </div>
            <button
              onClick={openModal}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg hover:from-blue-200 hover:to-cyan-200 transition-all duration-200 group w-full"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 group-hover:text-blue-800">Download PDF</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700">No pdf available</span>
            </div>
            <button
              onClick={openModal}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-200 group w-full"
            >
              <Upload className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 group-hover:text-purple-800">Ajouter un PDF</span>
            </button>
          </div>
        )}
      </div>

      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Documentation PDF</h2>
                  <p className="text-sm text-gray-500">Project #{projectId}</p>
                </div>
              </div>
              <button
                onClick={resetModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {currentHasPdf ? (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto flex items-center justify-center">
                    <FileText className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      PDF available
                    </h3>
                    <p className="text-gray-600">
                      Pdf i downloable
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    
                    <button
                      onClick={resetModal}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {uploadSuccess ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">Upload done !</h3>
                        <p className="text-green-600">PDF added with success</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          add pdf
                        </h3>
                        <p className="text-gray-600 text-sm">
                          drag & drop
                        </p>
                      </div>

                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                          dragActive
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDrag}
                        onDragEnter={handleDragIn}
                        onDragLeave={handleDragOut}
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                          }}
                          className="hidden"
                          disabled={isUploading}
                        />

                        {isUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                            <p className="text-purple-600 font-medium">Uploading...</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-center">
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Upload className="w-6 h-6 text-purple-600" />
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-700 font-medium">
                                drag & drop
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                PDF only, max 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {uploadError && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-red-800 font-medium">Erreur d'upload</p>
                            <p className="text-red-700 text-sm">{uploadError}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={resetModal}
                          disabled={isUploading}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFModalClient;