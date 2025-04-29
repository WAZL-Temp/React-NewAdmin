import { useFileUploadService } from '../core/services/fileUpload.service';
import { useEffect, useState } from 'react';
import { AiFillCloseCircle, MdDownloadForOffline, Tooltip } from '../sharedBase/globalImports';
import { CustomFile } from '../core/model/customfile';
import { useTranslation } from '../sharedBase/globalUtils';

interface ImageViewerProps {
  files: string | null;
  modelName: string;
}

export default function ImgViewer({ files, modelName }: ImageViewerProps) {

  const parseAndFormatImages = (imageData: string | null) => {
    if (!imageData) return [];
    try {
      const parsedFiles = JSON.parse(imageData);
      if (!Array.isArray(parsedFiles)) {
        return [];
      }
      return parsedFiles.map((img: CustomFile) => ({
        fileName: img.fileName,
        filePath: img.filePath.replace(/\\/g, '/'),
        type: img.type,
      }));
    } catch (error) {
      console.error('Failed to parse image data:', error);
      return [];
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState<CustomFile[]>(parseAndFormatImages(files));;
  const { t } = useTranslation();
  const fileUploadService = useFileUploadService(modelName);
  const [scale, setScale] = useState(1);
  const scaleStep = 0.1;
  const [imageShowDialog, setImageShowDialog] = useState(false);
  const [imageShowUrl, setImageShowUrl] = useState<string | null>(null);

  useEffect(() => {
    setUploadedFiles(parseAndFormatImages(files));
  }, [files])

  const handleScroll = (event: React.WheelEvent<HTMLImageElement>) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      setScale((prevScale) => prevScale + scaleStep);
    } else {
      setScale((prevScale) => Math.max(1, prevScale - scaleStep));
    }
  };

  const downloadFile = async (file: CustomFile) => {
    try {
      const response = await fileUploadService.fileDownload(file);
      const blob = new Blob([response]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {uploadedFiles.length > 0 ? (
          <ul className="uploaded-files-grid">
            {uploadedFiles.map((file) => (
              <li key={file.filePath} className="flex items-center space-x-4">
                {/* p-1 shadow-md rounded */}
                {!file.filePath.includes('pdf') ? (
                  <>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setImageShowDialog(true);
                        setImageShowUrl(`${import.meta.env.VITE_API_URL}/ImportFiles/${file.filePath.replace(/\\/g, "/")}`);
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}/ImportFiles/${file.filePath.replace(/\\/g, "/")}`}
                        alt={file.fileName}
                        className="h-14 w-12 object-cover rounded"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-start justify-center">
                      <span className="font-medium truncate text-xs text-[var(--color-dark)]">{file.fileName}</span>
                    </div>
                  </>
                )}
                <button
                  onClick={() => downloadFile(file)}
                  className="text-[var(--color-primary)] text-sm"
                  data-pr-tooltip={t("globals.downloadFile")}
                  data-pr-position="top"
                  id="download-btn"
                >
                  <MdDownloadForOffline size={24} />
                </button>
                <Tooltip target="#download-btn" className='text-xs lg:text-sm p-0 hide-tooltip-mobile' />
              </li>
            ))}
          </ul>
        ) : (
          <p className="bg-[#6B7280] text-sm"></p>
        )}
      </div>

      {imageShowDialog && imageShowUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-dark)] bg-opacity-80">
          <div className="relative w-full h-full max-w-full max-h-full my-16 p-4">
            <div
              className="absolute top-4 right-4 cursor-pointer text-[var(--color-white)]"
              onClick={() => {
                setImageShowDialog(false);
                setImageShowUrl(null);
                setScale(1);
              }}
            >
              <AiFillCloseCircle className="h-8 w-8 text-[var(--color-white)]" />
            </div>
            <div className="w-full h-full flex justify-center items-center pt-16 pb-16">
              <img
                src={imageShowUrl}
                onWheel={handleScroll}
                style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}
                className="w-auto h-auto max-h-full max-w-full"
                alt="Preview"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
