'use client';

import { useCallback, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Building2, TriangleAlert, X } from 'lucide-react';
import { toast } from 'sonner';

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
import { cn } from '@/lib/utils';
import { deleteOrganizationLogoAction } from '@/orpc/actions/organization/delete-organization-logo-action';
import { updateOrganizationLogoAction } from '@/orpc/actions/organization/update-organization-logo-action';
import { uploadOrganizationLogoAction } from '@/orpc/actions/organization/upload-organization-logo-action';

interface UpdateOrganizationLogoProps {
  organizationId: string;
  slug: string;
  logo: string | null;
}

export function UpdateOrganizationLogo({
  organizationId,
  slug,
  logo,
}: UpdateOrganizationLogoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Logo</CardTitle>
        <CardDescription>Update your organization logo below.</CardDescription>
      </CardHeader>
      <CardContent>
        <UploadOrganizationLogoForm
          imageUrl={logo}
          organizationId={organizationId}
          slug={slug}
        />
      </CardContent>
    </Card>
  );
}

function UploadOrganizationLogoForm(props: {
  imageUrl: string | null;
  organizationId: string;
  slug: string;
}) {
  const router = useRouter();

  const createToaster = useCallback((promise: () => Promise<unknown>) => {
    return toast.promise(promise, {
      success: 'Organization logo updated',
      error: 'Failed to update organization logo',
      loading: 'Updating organization logo',
    });
  }, []);

  const onFileChange = useCallback(
    (file: FileWithPreview | null) => {
      const removeExistingStorageFile = async () => {
        if (props.imageUrl) {
          const key = props.imageUrl.split('/').pop();

          if (key) {
            const [error] = await deleteOrganizationLogoAction({ key });
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
          const key = getLogoFileName(props.organizationId, extension);
          const [error, imageUrl] = await uploadOrganizationLogoAction({
            file: file.file as File,
            key,
          });
          if (error) {
            throw new Error('Failed to upload image');
          }

          const [updateError] = await updateOrganizationLogoAction({
            organizationId: props.organizationId,
            slug: props.slug,
            logo: imageUrl,
          });
          if (updateError) {
            throw new Error('Failed to update organization logo');
          }
          router.refresh();
        };

        createToaster(promise);
      } else if (file === null) {
        const promise = async () => {
          await removeExistingStorageFile();
          const [updateError] = await updateOrganizationLogoAction({
            organizationId: props.organizationId,
            slug: props.slug,
            logo: '',
          });
          if (updateError) {
            throw new Error('Failed to update organization logo');
          }
          router.refresh();
        };

        createToaster(promise);
      }
    },
    [createToaster, props.imageUrl, props.organizationId, props.slug, router],
  );

  return (
    <LogoUpload
      defaultLogo={props.imageUrl ?? undefined}
      onFileChange={onFileChange}
    />
  );
}

function getLogoFileName(organizationId: string, extension: string | undefined) {
  return `${organizationId}.${extension}`;
}

interface LogoUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultLogo?: string;
}

function LogoUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultLogo,
}: LogoUploadProps) {
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
    currentFile?.preview || defaultLogo,
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
      {/* Logo Preview */}
      <div className="relative">
        <div
          className={cn(
            'group/logo relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg border border-dashed transition-colors',
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
              alt="Organization Logo"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Building2 className="text-muted-foreground size-6" />
            </div>
          )}
        </div>

        {/* Remove Button - show when there's a file or existing logo */}
        {previewUrl && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="absolute end-0 top-0 size-6 rounded-full"
            aria-label="Remove logo"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="space-y-0.5 text-center">
        <p className="text-sm font-medium">
          {currentFile ? 'Logo uploaded' : 'Upload logo'}
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
