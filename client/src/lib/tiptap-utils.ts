import { Editor } from "@tiptap/react"

export const MAX_FILE_SIZE = 1000 * 1024 * 1024 // 5MB

/**
 * Checks if a mark exists in the editor schema
 *
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 */
export const isMarkInSchema = (markName: string, editor: Editor | null) =>
  editor?.schema.spec.marks.get(markName) !== undefined

/**
 * Checks if a node exists in the editor schema
 *
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 */
export const isNodeInSchema = (nodeName: string, editor: Editor | null) =>
  editor?.schema.spec.nodes.get(nodeName) !== undefined

/**
 * Handles image upload with progress tracking and abort capability
 */
export const handleImageUpload = async (
  _file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  return convertFileToBase64WithProgress(_file, onProgress, abortSignal)
}

/**
 * Converts a File to base64 string
 */
export const convertFileToBase64WithProgress = (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onprogress = (event) => {
      if (abortSignal?.aborted) {
        reader.abort()
        reject(new Error("Upload cancelled"))
      }
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100)
        onProgress({ progress })
      }
    }

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = (err) => {
      reject(err)
    }

    reader.readAsDataURL(file)
  })
}