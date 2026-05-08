import DashboardLayout from '../../components/layout/DashboardLayout'
import { ProfileCard } from '../../lib/auth'

export default function ProfilePage() {
  return (
    <DashboardLayout variant="player" title="Profile" subtitle="Manage your basketball profile and academic details.">
      <div className="max-w-2xl">
        <ProfileCard editable />
      </div>
    </DashboardLayout>
  )
}
