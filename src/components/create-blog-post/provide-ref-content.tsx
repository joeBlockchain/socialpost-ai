"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload, Trash2 } from "lucide-react";

interface ProvideRefContentProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ProvideRefContent({
  files,
  setFiles,
}: ProvideRefContentProps) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleTableDragOver = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTableDrop = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Reference Files</CardTitle>
        <CardDescription>
          Provide code files, project notes, or other relevant materials for
          content generation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {uploadProgress > 0 && (
          <Progress value={uploadProgress} className="w-full" />
        )}
        {files.length === 0 ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-6 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Label htmlFor="file-upload" className="cursor-pointer">
              <CloudUpload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <span className="mt-2 block text-sm font-semibold text-muted-foreground">
                Drag and drop files here, or click to select files
              </span>
              <Input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                multiple
              />
            </Label>
          </div>
        ) : (
          <div className="">
            <ul
              className=""
              onDragOver={handleTableDragOver}
              onDrop={handleTableDrop}
            >
              <li className="grid grid-cols-12 gap-2 text-sm font-semibold bg-muted/30 p-2 rounded-lg">
                <div className="col-span-5">Name</div>
                <div className="col-span-2 text-center">Size</div>
                <div className="col-span-3 text-center">Preview</div>
                <div className="col-span-2 text-center"></div>
              </li>
              {files.map((file, index) => (
                <li key={index} className="grid grid-cols-12 items-center px-2">
                  <div className="col-span-5 truncate">{file.name}</div>
                  <div className="col-span-2 text-center text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                  <div className="col-span-3 flex justify-center">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-8 h-8 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No preview
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
              <li className="grid grid-cols-12 items-center px-2 py-4 border-2 border-dashed border-border rounded-lg mt-2">
                <div className="col-span-12 text-center text-muted-foreground">
                  <CloudUpload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Drag and drop more files here
                  </span>
                </div>
              </li>
            </ul>
            <div className="flex flex-row space-x-2 items-center px-2 mt-4">
              <h4 className="text-sm">Uploaded files:</h4>
              <p className="text-sm text-muted-foreground">
                {files.length} file{files.length !== 1 ? "s" : ""} provided
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Button
          variant="secondary"
          onClick={() => console.log("Process files", files)}
          disabled={files.length === 0}
        >
          Process Files
        </Button>
        <Button
          variant="outline"
          onClick={() => setFiles([])}
          disabled={files.length === 0}
        >
          Delete All Files
        </Button>
      </CardFooter>
    </Card>
  );
}
