import PageBuilderWizard from '@/components/wizard/PageBuilderWizard'

export default function NewPagePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Build a Treatment Page</h1>
        <p className="text-gray-500">Complete the steps below to generate your clinic landing page.</p>
      </div>
      <PageBuilderWizard />
    </div>
  )
}
