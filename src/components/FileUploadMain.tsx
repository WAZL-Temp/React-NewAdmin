import React, { useEffect, useState, useRef } from "react";
import { FiUploadCloud, InputText, IoCheckmarkCircleSharp, RiDeleteBin6Fill } from "../sharedBase/globalImports";
import { useFileUploadService } from "../core/service/fileUpload.service";
import { useTranslation } from "../sharedBase/globalUtils";
import { CustomFile } from "../core/model/customfile";

interface FileUploadProps {
  initialData: string | null
  onFileUpload: (files: CustomFile[]) => void
  modelName: string
  propName: string
  multiple?: boolean
  accept?: string
  maxFileNumber?: number
}

export default function FileUploadMain({
  initialData,
  onFileUpload,
  modelName,
  multiple = false,
  accept = "",
  maxFileNumber = 100,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<CustomFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoadComplete, setIsLoadComplete] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUploadService = useFileUploadService(modelName);
  
  useEffect(() => {
    if (!isLoadComplete) {
      if (!initialData || initialData === "[]") {
        // setUploadedFiles([]);
        setIsLoadComplete(true);
        return
      }

      try {
        const parsedFiles = Array.isArray(initialData) ? initialData : JSON.parse(initialData);

        if (Array.isArray(parsedFiles)) {
          const formattedFiles = parsedFiles.map((img) => ({
            fileName: img.fileName,
            filePath: img.filePath,
            type: img.type,
          }));
          
          setUploadedFiles(formattedFiles);
        } 
        // else {
        //   setUploadedFiles([]);
        // }
        setIsLoadComplete(true);
      } catch (error) {
        console.error("Failed to parse image JSON:", error);
        // setUploadedFiles([]);
        setIsLoadComplete(true);
      }
    }
  }, [initialData, isLoadComplete])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const newUploadedFiles: CustomFile[] = [];

    for (const file of filesArray) {
      try {
        const tempFile: CustomFile = {
          fileName: file.name,
          filePath: "",
          type: file.type
        };
        setUploadedFiles((prev) => [...prev, tempFile]);

        const uploadPromise = fileUploadService.fileUpload(file);
        const progressInterval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.fileName === file.name ? { ...f, progress: Math.min((f.progress || 0) + 10, 90) } : f)),
          )
        }, 100);

        const response = await uploadPromise;
        clearInterval(progressInterval);

        const uploadedFile = {
          fileName: response.fileName,
          filePath: response.filePath,
          type: response.type
        }
        newUploadedFiles.push(uploadedFile);
        setUploadedFiles((prev) => prev.map((f) => (f.fileName === file.name ? uploadedFile : f)));
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Upload failed. Please try again.");
        setUploadedFiles((prev) => prev.filter((f) => f.fileName !== file.name));
      }
    }

    const allFiles = [...uploadedFiles, ...newUploadedFiles];    
    setUploadedFiles(allFiles);
    onFileUpload(allFiles);
    if (event.target) {
      event.target.value = ""
    }
  }

  const deleteAttachment = (file: CustomFile) => {
    const newFiles = uploadedFiles.filter((f) => f !== file);
    setUploadedFiles(newFiles);
    onFileUpload(newFiles);
  }

  const downloadFile = async (file: CustomFile) => {
    try {
      const response = await fileUploadService.fileDownload(file)
      const blob = new Blob([response]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
      setUploadError("Download failed. Please try again.");
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files;
      handleFileUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  return (
    <div className="file-attachments space-y-4">
      {maxFileNumber > uploadedFiles.length && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-2 w-full transition-colors flex justify-center ${isDragging ? "border-blue-500 bg-[#eff6ff]" : "border-[var(--color-border)] hover-border-custom"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="flex items-center gap-1 cursor-pointer">
            <FiUploadCloud className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-[10px] w-[180px] text-[var(--color-primary)]">{t("globals.browseFileToUpload")}</span>
            <InputText
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              className="hidden"
              multiple={multiple}
              maxLength={maxFileNumber}
            />
          </label>
        </div>
      )}

      <ul className="space-y-2">
        {uploadedFiles.map((file) => (
          <li key={file.filePath} className="border border-dashed border-[#9ca3af] text-[var(--color-dark)]  rounded-lg p-2 flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-grow min-w-0">
              <div
                className="text-xs font-medium cursor-pointer text-[var(--color-primary)] line-clamp-2 break-words"
                onClick={() => downloadFile(file)}
                title={file.fileName}
              >
                {file.fileName}
              </div>
              {file.progress !== undefined && file.progress < 100 && (
                <div className="w-full bg-[#e5e7eb] rounded-full h-1.5 mt-1">
                  <div
                    className="text-[var(--color-primary)] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
            {file.progress === 100 ? (
              <span className="text-xs text-[#22c55e] flex-shrink-0 font-semibold">{file.progress}%</span>
            ) : (
              <span className="text-xs text-[var(--color-primary)] flex-shrink-0"><IoCheckmarkCircleSharp size={16} /></span>
            )}
            <button
              onClick={() => deleteAttachment(file)}
              className="text-[var(--color-danger)]  transition-colors flex-shrink-0"
              aria-label={`Delete ${file.fileName}`}
            >
              <RiDeleteBin6Fill size={14} />
            </button>
          </li>
        ))}
      </ul>

      {uploadError && <p className="text-sm text-[var(--color-danger)] mt-2">{uploadError}</p>}
    </div>
  )
}