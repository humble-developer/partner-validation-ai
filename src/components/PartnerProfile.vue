<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Partner Header -->
    <Card class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg">
            <Building class="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ partner.companyName }}</h1>
            <p class="text-gray-600 dark:text-gray-400">{{ partner.businessType }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <span :class="getStatusClass(partner.status)">
                {{ getStatusLabel(partner.status) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Validated {{ formatDate(partner.validatedAt) }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex space-x-3">
          <Button variant="outline" @click="editPartner">
            <Edit class="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button @click="revalidatePartner">
            <RefreshCw class="w-4 h-4 mr-2" />
            Re-validate
          </Button>
        </div>
      </div>
    </Card>

    <!-- Partner Details Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Company Information -->
      <div class="lg:col-span-2 space-y-6">
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Website" :value="partner.website" type="link" />
            <InfoField label="Industry" :value="partner.industry" />
            <InfoField label="Founded" :value="partner.founded" />
            <InfoField label="Employees" :value="partner.employeeCount" />
            <InfoField label="Revenue" :value="partner.revenue" />
            <InfoField label="Registration Number" :value="partner.registrationNumber" />
          </div>
        </Card>

        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Primary Contact" :value="partner.primaryContact" />
            <InfoField label="Email" :value="partner.email" type="email" />
            <InfoField label="Phone" :value="partner.phone" type="phone" />
            <InfoField label="Address" :value="partner.fullAddress" type="address" />
          </div>
        </Card>

        <!-- Validation History -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Validation History</h3>
          <div class="space-y-3">
            <div
              v-for="validation in partner.validationHistory"
              :key="validation.id"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div :class="getValidationIconClass(validation.result)">
                  <component :is="getValidationIcon(validation.result)" class="w-4 h-4" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ validation.type }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(validation.date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-white">{{ validation.confidence }}%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ validation.result }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Confidence Score -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confidence Score</h3>
          <div class="text-center">
            <div class="relative w-24 h-24 mx-auto mb-4">
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-gray-200 dark:text-gray-600"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  :stroke-dasharray="`${partner.confidence * 2.51} 251`"
                  :class="getConfidenceColor(partner.confidence)"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ partner.confidence }}%</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Overall Validation Score</p>
          </div>
        </Card>

        <!-- Risk Assessment -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Assessment</h3>
          <div class="space-y-3">
            <RiskIndicator
              label="Financial Risk"
              :level="partner.risks.financial"
              :score="partner.risks.financialScore"
            />
            <RiskIndicator
              label="Compliance Risk"
              :level="partner.risks.compliance"
              :score="partner.risks.complianceScore"
            />
            <RiskIndicator
              label="Operational Risk"
              :level="partner.risks.operational"
              :score="partner.risks.operationalScore"
            />
          </div>
        </Card>

        <!-- Quick Actions -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <Button variant="outline" class="w-full justify-start" @click="downloadReport">
              <Download class="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="scheduleReview">
              <Calendar class="w-4 h-4 mr-2" />
              Schedule Review
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="addNote">
              <FileText class="w-4 h-4 mr-2" />
              Add Note
            </Button>
            <Button variant="outline" class="w-full justify-start" @click="viewDocuments">
              <Folder class="w-4 h-4 mr-2" />
              View Documents
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import InfoField from '@/components/InfoField.vue'
import RiskIndicator from '@/components/RiskIndicator.vue'
import {
  Building,
  Edit,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Calendar,
  FileText,
  Folder
} from 'lucide-vue-next'

export default {
  name: 'PartnerProfile',
  components: {
    Button,
    Card,
    InfoField,
    RiskIndicator,
    Building,
    Edit,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Download,
    Calendar,
    FileText,
    Folder
  },
  props: {
    partnerId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    // Mock partner data - in real app, this would come from API
    const partner = ref({
      id: props.partnerId,
      companyName: 'TechCorp Solutions Inc.',
      businessType: 'Technology Services',
      status: 'approved',
      confidence: 94,
      website: 'https://techcorp.com',
      industry: 'Software Development',
      founded: '2015',
      employeeCount: '250-500',
      revenue: '$10M - $50M',
      registrationNumber: 'TC-2015-001234',
      primaryContact: 'John Smith',
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      fullAddress: '123 Tech Street, San Francisco, CA 94105, USA',
      validatedAt: new Date().toISOString(),
      risks: {
        financial: 'low',
        financialScore: 85,
        compliance: 'medium',
        complianceScore: 72,
        operational: 'low',
        operationalScore: 88
      },
      validationHistory: [
        {
          id: 1,
          type: 'Initial Validation',
          result: 'Approved',
          confidence: 94,
          date: new Date().toISOString()
        },
        {
          id: 2,
          type: 'Annual Review',
          result: 'Approved',
          confidence: 91,
          date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    })

    const getStatusClass = (status) => {
      const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      switch (status) {
        case 'approved':
          return `${baseClass} bg-green-100 text-green-800`
        case 'pending':
          return `${baseClass} bg-yellow-100 text-yellow-800`
        case 'rejected':
          return `${baseClass} bg-red-100 text-red-800`
        default:
          return `${baseClass} bg-gray-100 text-gray-800`
      }
    }

    const getStatusLabel = (status) => {
      switch (status) {
        case 'approved': return 'Approved'
        case 'pending': return 'Pending Review'
        case 'rejected': return 'Rejected'
        default: return 'Unknown'
      }
    }

    const getConfidenceColor = (confidence) => {
      if (confidence >= 90) return 'text-green-500'
      if (confidence >= 75) return 'text-blue-500'
      if (confidence >= 60) return 'text-yellow-500'
      return 'text-red-500'
    }

    const getValidationIcon = (result) => {
      switch (result.toLowerCase()) {
        case 'approved': return CheckCircle
        case 'rejected': return XCircle
        default: return AlertTriangle
      }
    }

    const getValidationIconClass = (result) => {
      const baseClass = "w-8 h-8 rounded-full flex items-center justify-center"
      switch (result.toLowerCase()) {
        case 'approved': return `${baseClass} bg-green-100 text-green-600`
        case 'rejected': return `${baseClass} bg-red-100 text-red-600`
        default: return `${baseClass} bg-yellow-100 text-yellow-600`
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const editPartner = () => {
      console.log('Edit partner')
    }

    const revalidatePartner = () => {
      console.log('Re-validate partner')
    }

    const downloadReport = () => {
      console.log('Download report')
    }

    const scheduleReview = () => {
      console.log('Schedule review')
    }

    const addNote = () => {
      console.log('Add note')
    }

    const viewDocuments = () => {
      console.log('View documents')
    }

    return {
      partner,
      getStatusClass,
      getStatusLabel,
      getConfidenceColor,
      getValidationIcon,
      getValidationIconClass,
      formatDate,
      editPartner,
      revalidatePartner,
      downloadReport,
      scheduleReview,
      addNote,
      viewDocuments
    }
  }
}
</script>
