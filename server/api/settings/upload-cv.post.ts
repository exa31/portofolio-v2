import {HttpError} from "~~/server/errors/HttpError"
import {withAuth} from "~~/server/utils/withAuth"
import {getMinioClient} from "~~/server/lib/minio"
import {updateUserCV} from "~~/server/repositories/settings.repository";
import {withTransaction} from "~~/server/db/postgres";

export default withAuth(async (event) => {
    const userId = event.context.user.id! as string
    return await withTransaction(
        async (client) => {


            try {
                // Get the uploaded file
                const files = await readMultipartFormData(event)
                if (!files || files.length === 0) {
                    throw new HttpError(400, 'NO_FILE', 'No file uploaded')
                }

                const fileData = files[0]
                if (!fileData.filename || !fileData.data) {
                    throw new HttpError(400, 'INVALID_FILE', 'Invalid file data')
                }

                // Validate file type (PDF only)
                const filename = fileData.filename.toLowerCase()
                if (!filename.endsWith('.pdf')) {
                    throw new HttpError(400, 'INVALID_FILE_TYPE', 'Only PDF files are allowed')
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024 // 5MB
                if (fileData.data.length > maxSize) {
                    throw new HttpError(413, 'FILE_TOO_LARGE', 'File size must be less than 5MB')
                }

                // Upload to MinIO
                const minio = getMinioClient()
                const bucketName = 'project'
                const key = `portofolio/resumes/${filename}-${crypto.randomUUID()}-${Date.now()}.pdf`

                try {
                    const url = minio.getPublicUrl(bucketName, key)

                    const ok = await updateUserCV(
                        client,
                        userId,
                        url
                    )

                    if (!ok) {
                        throw new HttpError(500, 'DB_UPDATE_FAILED', 'Failed to update user CV URL in database')
                    }

                    await minio.uploadFile(
                        bucketName,
                        key,
                        fileData.data,
                        'application/pdf'
                    )

                    return sendSuccess(event, {url}, 'CV uploaded successfully', 'cv_uploaded')
                } catch (minioError) {
                    console.error('MinIO upload error:', minioError)
                    throw new HttpError(500, 'UPLOAD_ERROR', 'Failed to upload file to storage')
                }
            } catch (error) {
                if (error instanceof HttpError) {
                    throw error
                }
                console.error('CV upload error:', error)
                throw new HttpError(500, 'UPLOAD_ERROR', 'Failed to upload CV')
            }
        }
    )
})

