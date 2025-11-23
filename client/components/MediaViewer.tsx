import { useState } from "react";
import { X, Maximize2, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaFile {
  name: string;
  url: string;
  type: string;
}

interface MediaViewerProps {
  mediaFiles: MediaFile[];
  postTitle: string;
}

export default function MediaViewer({
  mediaFiles,
  postTitle,
}: MediaViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentMedia = mediaFiles[activeIndex];
  const isImage = currentMedia.type.startsWith("image/");
  const isVideo = currentMedia.type.startsWith("video/");
  const isAudio = currentMedia.type.startsWith("audio/");

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === mediaFiles.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentMedia.url;
    link.download = currentMedia.name;
    link.click();
  };

  if (mediaFiles.length === 0) return null;

  return (
    <>
      {/* Media Grid */}
      <div className="border-t border-border pt-12">
        <h2 className="text-2xl font-bold mb-6">📎 Attached Media</h2>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {mediaFiles.map((file, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                setLightboxOpen(true);
              }}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all hover:border-accent ${
                activeIndex === idx && lightboxOpen
                  ? "border-accent"
                  : "border-border"
              }`}
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12"%3EImage Error%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : file.type.startsWith("video/") ? (
                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">▶</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Video</p>
                  </div>
                </div>
              ) : file.type.startsWith("audio/") ? (
                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Audio</p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-xs text-muted-foreground">File</p>
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-white" />
              </div>
            </button>
          ))}
        </div>

        {/* Current Media Preview */}
        {mediaFiles.length > 1 && (
          <div className="bg-muted rounded-lg overflow-hidden border border-border">
            <div className="relative">
              {isImage && (
                <img
                  src={currentMedia.url}
                  alt={currentMedia.name}
                  className="w-full max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="384"%3E%3Crect fill="%23333" width="800" height="384"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20"%3EImage not available%3C/text%3E%3C/svg%3E';
                  }}
                />
              )}

              {isVideo && (
                <video
                  key={`video-${activeIndex}`}
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                  crossOrigin="anonymous"
                  className="w-full max-h-96 object-contain bg-black"
                >
                  <source src={currentMedia.url} type={currentMedia.type} />
                </video>
              )}

              {isAudio && (
                <div className="w-full bg-black flex flex-col items-center justify-center p-8 min-h-32 gap-4">
                  <div className="text-4xl">🎵</div>
                  <audio
                    key={`audio-${activeIndex}`}
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                    crossOrigin="anonymous"
                    className="w-full"
                  >
                    <source src={currentMedia.url} type={currentMedia.type} />
                  </audio>
                </div>
              )}

              {/* Navigation Buttons */}
              {mediaFiles.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Media Counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                {activeIndex + 1} / {mediaFiles.length}
              </div>
            </div>

            {/* Media Info and Actions */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground truncate">
                  {currentMedia.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentMedia.type}
                </p>
              </div>
              <div className="flex gap-2">
                {(isImage || isVideo) && (
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="p-2 rounded-lg bg-card border border-border hover:border-accent text-foreground hover:text-accent transition-all"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-card border border-border hover:border-accent text-foreground hover:text-accent transition-all"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-6xl max-h-[90vh] w-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {isImage && (
              <img
                src={currentMedia.url}
                alt={currentMedia.name}
                className="flex-1 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23333" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20"%3EImage not available%3C/text%3E%3C/svg%3E';
                }}
              />
            )}

            {isVideo && (
              <video
                key={`lightbox-video-${activeIndex}`}
                controls
                controlsList="nodownload"
                preload="metadata"
                crossOrigin="anonymous"
                className="flex-1 object-contain bg-black"
                autoPlay
              >
                <source src={currentMedia.url} type={currentMedia.type} />
              </video>
            )}

            {/* Lightbox Navigation */}
            {mediaFiles.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Lightbox Info */}
            <div className="mt-4 flex items-center justify-between text-white">
              <div>
                <p className="font-medium truncate">{currentMedia.name}</p>
                <p className="text-sm text-gray-400">
                  {activeIndex + 1} / {mediaFiles.length}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Video Modal */}
      {isFullscreen && isVideo && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <video
            key={`fullscreen-video-${activeIndex}`}
            controls
            controlsList="nodownload"
            preload="metadata"
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
            autoPlay
            onClick={(e) => e.stopPropagation()}
          >
            <source src={currentMedia.url} type={currentMedia.type} />
          </video>
        </div>
      )}
    </>
  );
}
