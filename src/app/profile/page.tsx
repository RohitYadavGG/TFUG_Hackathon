import ProfileCard from '@/components/profile/profile-card';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">User Profile</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your account details.
        </p>
      </div>
      <ProfileCard />
    </div>
  );
}
