'use client';

import { useCallback, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TriangleAlert, User, X } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { deleteAccountImageAction } from '@/orpc/actions/account/delete-account-image-action';
import { uploadAccountImageAction } from '@/orpc/actions/account/upload-account-image-action';

export function UpdateAccountImage() {
  const auth = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your profile picture below.</CardDescription>
      </CardHeader>
      <CardContent>
        <UploadProfileAvatarForm
          imageUrl={auth?.user?.image ?? null}
          userId={auth?.user?.id ?? ''}
        />
      </CardContent>
    </Card>
  );
}

function UploadProfileAvatarForm(props: {
  imageUrl: string | null;
  userId: string;
}) {
  const router = useRouter();

  const createToaster = useCallback((promise: () => Promise<unknown>) => {
    return toast.promise(promise, {
      success: 'Profile picture updated',
      error: 'Failed to update profile picture',
      loading: 'Updating profile picture',
    });
  }, []);

  const onFileChange = useCallback(
    (file: FileWithPreview | null) => {
      const removeExistingStorageFile = async () => {
        if (props.imageUrl) {
          const key = props.imageUrl.split('/').pop();

          if (key) {
            const [error] = await deleteAccountImageAction({ key });
            if (error) {
              console.error('Failed to delete existing image:', error);
            }
          }
        }
      };

      if (file && file.file instanceof File) {
        const promise = async () => {
          await removeExistingStorageFile();
          const extension = file.file.name.split('.').pop();
          const key = getAvatarFileName(props.userId, extension);
          const [error, imageUrl] = await uploadAccountImageAction({
            file: file.file as File,
            key,
          });
          if (error) {
            throw new Error('Failed to upload image');
          }

          await authClient.updateUser({
            image: imageUrl,
          });
          router.refresh();
        };

        createToaster(promise);
      } else if (file === null) {
        const promise = async () => {
          await removeExistingStorageFile();
          await authClient.updateUser({
            image: null,
          });
          router.refresh();
        };

        createToaster(promise);
      }
    },
    [createToaster, props.imageUrl, props.userId, router],
  );

  return (
    <AvatarUpload
      defaultAvatar={props.imageUrl ?? undefined}
      onFileChange={onFileChange}
    />
  );
}

function getAvatarFileName(userId: string, extension: string | undefined) {
  return `${userId}.${extension}`;
}

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

function AvatarUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarUploadProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files) => {
      setPreviewUrl(files[0]?.preview);
      onFileChange?.(files[0] || null);
    },
  });

  const currentFile = files[0];
  const [previewUrl, setPreviewUrl] = useState(
    currentFile?.preview || defaultAvatar,
  );

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
    setPreviewUrl(undefined);
    onFileChange?.(null);
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            'group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/20',
            previewUrl && 'border-solid',
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />

          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="text-muted-foreground size-6" />
            </div>
          )}
        </div>

        {/* Remove Button - show when there's a file or existing avatar */}
        {previewUrl && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="absolute end-0 top-0 size-6 rounded-full"
            aria-label="Remove avatar"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="space-y-0.5 text-center">
        <p className="text-sm font-medium">
          {currentFile ? 'Avatar uploaded' : 'Upload avatar'}
        </p>
        <p className="text-muted-foreground text-xs">
          PNG, JPG up to {formatBytes(maxSize)}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
