<template>
  <div class="space-y-6">
    <!-- Bulk Operations Header -->
    <Card class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Bulk Operations</h2>
          <p class="text-gray-600 dark:text-gray-400">Process multiple partners efficiently</p>
        </div>
        <div class="flex space-x-3">
          <Button variant="outline" @click="downloadTemplate">
            <Download class="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button @click="showUploadModal = true">
            <Upload class="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
        </div>
      </div>
    </Card>

    <!-- File Upload Section -->
    <Card v-if="showUploadModal" class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upload Partner Data</h3>
          <Button variant="ghost" @click="showUploadModal = false">
            <X class="w-4 h-4" />
          </Button>
        </div>

        <div
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          :class="{ 'border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragging }"
        >
          <Upload class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Drop your CSV file here, or
            <label class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer">
              browse
              <input
                type="file"
                accept=".csv"
                @change="handleFileSelect"
                class="hidden"
              />
            </label>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Supports CSV files up to 10MB with up to 1000 partners
          </p>
        </div>

        <div v-if="uploadedFile" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <FileText class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p class="font-medium text-blue-900 dark:text-blue-200">{{ uploadedFile.name }}</p>
                <p class="text-sm text-blue-600 dark:text-blue-400">{{ formatFileSize(uploadedFile.size) }}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" @click="removeFile">
              <X class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div v-if="uploadedFile" class="flex justify-end space-x-3">
          <Button variant="outline" @click="validateFile">
            <CheckCircle class="w-4 h-4 mr-2" />
            Validate Data
          </Button>
          <Button @click="processFile" :disabled="!isFileValid">
            <Play class="w-4 h-4 mr-2" />
            Process Partners
          </Button>
        </div>
      </div>
    </Card>

    <!-- Processing Status -->
    <Card v-if="isProcessing" class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Processing Status</h3>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ processedCount }}/{{ totalCount }} completed</span>
        </div>

        <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(processedCount / totalCount) * 100}%` }"
          ></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ successCount }}</div>
            <div class="text-sm text-green-700 dark:text-green-300">Successful</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ pendingCount }}</div>
            <div class="text-sm text-yellow-700 dark:text-yellow-300">Pending Review</div>
          </div>
          <div class="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ errorCount }}</div>
            <div class="text-sm text-red-700 dark:text-red-300">Errors</div>
          </div>
        </div>

        <div class="flex justify-center">
          <Button variant="outline" @click="cancelProcessing">
            <Square class="w-4 h-4 mr-2" />
            Cancel Processing
          </Button>
        </div>
      </div>
    </Card>

    <!-- Results Summary -->
    <Card v-if="processingComplete" class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Processing Complete</h3>
          <div class="flex space-x-2">
            <Button variant="outline" @click="downloadResults">
              <Download class="w-4 h-4 mr-2" />
              Download Results
            </Button>
            <Button variant="outline" @click="downloadErrors" v-if="errorCount > 0">
              <AlertTriangle class="w-4 h-4 mr-2" />
              Download Errors
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalCount }}</div>
            <div class="text-sm text-blue-700 dark:text-blue-300">Total Processed</div>
          </div>
          <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ successCount }}</div>
            <div class="text-sm text-green-700 dark:text-green-300">Auto-Approved</div>
          </div>
          <div class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ pendingCount }}</div>
            <div class="text-sm text-yellow-700 dark:text-yellow-300">Need Review</div>
          </div>
          <div class="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ errorCount }}</div>
            <div class="text-sm text-red-700 dark:text-red-300">Failed</div>
          </div>
        </div>

        <!-- Error Details -->
        <div v-if="errors.length > 0" class="space-y-3">
          <h4 class="font-semibold text-gray-900 dark:text-white">Processing Errors</h4>
          <div class="max-h-40 overflow-y-auto space-y-2">
            <div
              v-for="error in errors.slice(0, 5)"
              :key="error.id"
              class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
            >
              <div>
                <p class="font-medium text-red-900 dark:text-red-200">Row {{ error.row }}: {{ error.company }}</p>
                <p class="text-sm text-red-700 dark:text-red-300">{{ error.message }}</p>
              </div>
              <AlertTriangle class="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
          <p v-if="errors.length > 5" class="text-sm text-gray-600 dark:text-gray-400">
            And {{ errors.length - 5 }} more errors...
          </p>
        </div>

        <div class="flex justify-center">
          <Button @click="resetBulkOperation">
            <RefreshCw class="w-4 h-4 mr-2" />
            Start New Batch
          </Button>
        </div>
      </div>
    </Card>

    <!-- Recent Batch Operations -->
    <Card class="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Batch Operations</h3>
      <div class="space-y-3">
        <div
          v-for="batch in recentBatches"
          :key="batch.id"
          class="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          <div class="flex items-center space-x-4">
            <div :class="getBatchStatusClass(batch.status)">
              <component :is="getBatchStatusIcon(batch.status)" class="w-5 h-5" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ batch.filename }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ batch.totalCount }} partners • {{ formatDate(batch.createdAt) }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ batch.successCount }}/{{ batch.totalCount }} successful
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ batch.status }}</p>
            </div>
            <Button variant="ghost" size="sm" @click="viewBatchDetails(batch)">
              <Eye class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import { useValidationStore } from '@/stores/validation'
import {
  Download,
  Upload,
  X,
  FileText,
  CheckCircle,
  Play,
  Square,
  AlertTriangle,
  RefreshCw,
  Eye,
  Clock,
  XCircle
} from 'lucide-vue-next'

export default {
  name: 'BulkOperations',
  components: {
    Button,
    Card,
    Download,
    Upload,
    X,
    FileText,
    CheckCircle,
    Play,
    Square,
    AlertTriangle,
    RefreshCw,
    Eye,
    Clock,
    XCircle
  },
  setup() {
    const validationStore = useValidationStore()
    const showUploadModal = ref(false)
    const uploadedFile = ref(null)
    const isDragging = ref(false)
    const isFileValid = ref(false)
    const isProcessing = ref(false)
    const processingComplete = ref(false)

    const totalCount = ref(0)
    const processedCount = ref(0)
    const successCount = ref(0)
    const pendingCount = ref(0)
    const errorCount = ref(0)
    const errors = ref([])
    const parsedData = ref([])

    const recentBatches = ref([
      {
        id: 1,
        filename: 'partners_batch_2024_01.csv',
        status: 'completed',
        totalCount: 150,
        successCount: 142,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        filename: 'new_partners_q1.csv',
        status: 'processing',
        totalCount: 75,
        successCount: 45,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ])

    const handleDrop = (e) => {
      e.preventDefault()
      isDragging.value = false
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFile(files[0])
      }
    }

    const handleFileSelect = (e) => {
      const files = e.target.files
      if (files.length > 0) {
        handleFile(files[0])
      }
    }

    const handleFile = (file) => {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        uploadedFile.value = file
        isFileValid.value = true
      } else {
        alert('Please upload a CSV file')
      }
    }

    const removeFile = () => {
      uploadedFile.value = null
      isFileValid.value = false
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const validateFile = async () => {
      if (!uploadedFile.value) return

      try {
        const text = await uploadedFile.value.text()
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
          throw new Error('File must contain at least a header row and one data row')
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        const requiredHeaders = ['companyName', 'primaryAddress', 'city', 'country', 'email']

        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`)
        }

        // Parse data rows
        const data = []
        const validationErrors = []

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue // Skip empty lines

          // Handle CSV parsing with potential commas in quoted fields
          const values = parseCSVLine(line)

          if (values.length < headers.length) {
            validationErrors.push(`Row ${i + 1}: Insufficient columns (expected ${headers.length}, got ${values.length})`)
            continue
          }

          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim().replace(/"/g, '') : ''
          })

          // Validate required fields
          if (!row.companyName || !row.email) {
            validationErrors.push(`Row ${i + 1}: Missing required fields (companyName or email)`)
            continue
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(row.email)) {
            validationErrors.push(`Row ${i + 1}: Invalid email format`)
            continue
          }

          data.push(row)
        }

        if (validationErrors.length > 0 && data.length === 0) {
          throw new Error(`Validation failed:\n${validationErrors.slice(0, 5).join('\n')}${validationErrors.length > 5 ? '\n...and more' : ''}`)
        }

        parsedData.value = data
        totalCount.value = data.length
        isFileValid.value = true

        console.log(`Validated ${data.length} partners from CSV`)
        if (validationErrors.length > 0) {
          console.warn(`${validationErrors.length} rows had validation errors and were skipped`)
        }
      } catch (error) {
        console.error('File validation error:', error)
        alert(`File validation failed: ${error.message}`)
        isFileValid.value = false
      }
    }

    // Helper function to parse CSV line with quoted fields
    const parseCSVLine = (line) => {
      const result = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current)
          current = ''
        } else {
          current += char
        }
      }

      result.push(current)
      return result
    }

    const processFile = async () => {
      if (!parsedData.value.length) {
        await validateFile()
      }

      if (!parsedData.value.length) {
        alert('No valid data to process. Please validate the file first.')
        return
      }

      isProcessing.value = true
      processedCount.value = 0
      successCount.value = 0
      pendingCount.value = 0
      errorCount.value = 0
      errors.value = []

      console.log(`Starting to process ${parsedData.value.length} partners...`)

      // Process each partner
      for (let i = 0; i < parsedData.value.length; i++) {
        const partnerData = parsedData.value[i]

        try {
          // Create partner info object with proper validation
          const partnerInfo = {
            id: `bulk_${Date.now()}_${i}`, // Add unique ID for bulk uploads
            companyName: partnerData.companyName || '',
            website: partnerData.website || '',
            primaryAddress: partnerData.primaryAddress || '',
            city: partnerData.city || '',
            state: partnerData.state || '',
            country: partnerData.country || '',
            zipCode: partnerData.zipCode || '',
            businessType: partnerData.businessType || 'Not specified',
            description: partnerData.description || '',
            contactPerson: partnerData.contactPerson || '',
            email: partnerData.email || '',
            phone: partnerData.phone || ''
          }

          // Validate required fields before processing
          if (!partnerInfo.companyName || !partnerInfo.email) {
            throw new Error('Missing required fields: companyName or email')
          }

          // Generate AI results and submit to validation store
          const aiResults = validationStore.generateAIResults(partnerInfo)
          validationStore.addValidationResult(partnerInfo, aiResults)

          console.log(`Processed partner ${i + 1}/${parsedData.value.length}: ${partnerInfo.companyName}`)

          // Simulate processing delay for visual feedback
          await new Promise(resolve => setTimeout(resolve, 100))

          successCount.value++
        } catch (error) {
          console.error(`Error processing partner ${i + 1}:`, error)
          errorCount.value++
          errors.value.push({
            id: errorCount.value,
            row: i + 2, // +2 because of header row and 0-based index
            company: partnerData.companyName || 'Unknown',
            message: error.message || 'Processing failed'
          })
        }

        processedCount.value++
      }

      isProcessing.value = false
      processingComplete.value = true

      console.log(`Bulk processing complete: ${successCount.value} successful, ${errorCount.value} errors`)
    }

    const cancelProcessing = () => {
      isProcessing.value = false
    }

    const resetBulkOperation = () => {
      showUploadModal.value = false
      uploadedFile.value = null
      isFileValid.value = false
      isProcessing.value = false
      processingComplete.value = false
      totalCount.value = 0
      processedCount.value = 0
      successCount.value = 0
      pendingCount.value = 0
      errorCount.value = 0
      errors.value = []
    }

    const downloadTemplate = () => {
      // Create CSV template with proper headers
      const csvHeaders = [
        'companyName',
        'website',
        'primaryAddress',
        'city',
        'state',
        'country',
        'zipCode',
        'businessType',
        'description',
        'contactPerson',
        'email',
        'phone'
      ]

      // Create sample data row
      const sampleData = [
        'TechCorp Solutions Inc.',
        'https://techcorp.com',
        '123 Tech Street',
        'San Francisco',
        'CA',
        'USA',
        '94105',
        'Technology Services',
        'Software development and consulting services',
        'John Smith',
        'contact@techcorp.com',
        '+1 (555) 123-4567'
      ]

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        sampleData.join(','),
        // Add empty row for user to fill
        csvHeaders.map(() => '').join(',')
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'partner_upload_template.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    const downloadResults = () => {
      console.log('Downloading results...')
    }

    const downloadErrors = () => {
      console.log('Downloading errors...')
    }

    const getBatchStatusClass = (status) => {
      const baseClass = "w-10 h-10 rounded-full flex items-center justify-center"
      switch (status) {
        case 'completed':
          return `${baseClass} bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400`
        case 'processing':
          return `${baseClass} bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`
        case 'failed':
          return `${baseClass} bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400`
        default:
          return `${baseClass} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400`
      }
    }

    const getBatchStatusIcon = (status) => {
      switch (status) {
        case 'completed': return CheckCircle
        case 'processing': return Clock
        case 'failed': return XCircle
        default: return Clock
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const viewBatchDetails = (batch) => {
      console.log('Viewing batch details:', batch)
    }

    return {
      showUploadModal,
      uploadedFile,
      isDragging,
      isFileValid,
      isProcessing,
      processingComplete,
      totalCount,
      processedCount,
      successCount,
      pendingCount,
      errorCount,
      errors,
      recentBatches,
      handleDrop,
      handleFileSelect,
      removeFile,
      formatFileSize,
      validateFile,
      processFile,
      cancelProcessing,
      resetBulkOperation,
      downloadTemplate,
      downloadResults,
      downloadErrors,
      getBatchStatusClass,
      getBatchStatusIcon,
      formatDate,
      viewBatchDetails
    }
  }
}
</script>
