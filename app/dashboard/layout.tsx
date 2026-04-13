import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'

// DEMO MODE: Auth bypassed until Supabase is connected
const demoUser = {
  name: 'Demo User',
  email: 'demo@clinicpages.io',
  image: null,
  credits: 99,
  plan: 'demo',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // When Supabase is ready, uncomment auth check:
  // const session = await getServerSession(authOptions)
  // if (!session?.user) redirect('/login')

  return (
    <div className="flex h-screen bg-[#070710] overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={demoUser} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
