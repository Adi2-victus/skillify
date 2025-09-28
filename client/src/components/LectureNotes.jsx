


import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  useGetLectureNotesQuery, 
  useUploadLectureNoteMutation 
} from '@/features/api/lectureNoteApi.js';
import { Loader2, File, X } from 'lucide-react';
import { toast } from 'sonner'; // Added toast import

const LectureNotes = ({ courseId, lectureId, canUpload }) => {
  const { 
    data: notes = [], 
    isLoading, 
    isError,
    refetch 
  } = useGetLectureNotesQuery({ courseId, lectureId });
  
  const [uploadNotes, { isLoading: isUploading }] = useUploadLectureNoteMutation();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    const formData = new FormData();
    // formData.append('file', file);
    formData.append('note', file); 
    formData.append('courseId', courseId);
    formData.append('lectureId', lectureId);
    
    try {
      await uploadNotes(formData).unwrap();
      toast.success("Notes uploaded successfully!");
      refetch();
      setFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.data?.message || "Failed to upload notes");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) return (
    <div className="text-center py-4">
      <Loader2 className="animate-spin mx-auto h-6 w-6" />
    </div>
  );
  
  if (isError) return (
    <div className="text-red-500 text-center py-4">
      Failed to load notes. Please try again later.
    </div>
  );

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      {/* Upload section for instructors */}
      {canUpload && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Upload Notes</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.txt,.pptx,.ppt"
              />
              <label 
                htmlFor="file-upload" 
                className="px-4 py-2 border rounded-md text-sm font-medium cursor-pointer bg-gray-50 hover:bg-gray-100 text-black"
              >
                Choose File
              </label>
              
              {file ? (
                <div className="flex items-center gap-2 ml-2">
                  <File className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </span>
                  <button 
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500 ml-2">
                  No file chosen
                </span>
              )}
            </div>
            
            <Button 
              onClick={handleFileUpload}
              disabled={!file || isUploading}
              className="w-full sm:w-auto text-black"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2 " />
                  Uploading...
                </>
              ) : 'Upload'}
            </Button>
          </div>
        </div>
      )}

      {/* Notes display for everyone */}
      <div>
        <h3 className="font-semibold text-lg mb-3 text-black">
          {canUpload ? "Available Notes" : "Lecture Notes"}
        </h3>
        
        {notes.length > 0 ? (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li 
                key={note._id} 
                className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center truncate">
                  <File className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <span className="font-medium truncate text-black">
                    {note.fileName}
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  {/* <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(note.uploadedAt).toLocaleDateString()}
                  </span> */}
                
{/* handling */}
                  {/* {notes?.map(note => ( */}
  <a 
    href={note.fileUrl} 
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    {note.fileName}
  </a>
{/* ))} */}

                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 border rounded-md bg-gray-50">
            <File className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">
              {canUpload 
                ? "No notes uploaded yet" 
                : "No notes available for this lecture"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureNotes;