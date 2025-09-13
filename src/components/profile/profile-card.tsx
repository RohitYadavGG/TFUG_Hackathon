import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProfileCard() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Account Information</CardTitle>
        <CardDescription>
          This is your profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                alt="User Avatar"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Safety Admin</h2>
            <p className="text-muted-foreground">safety.admin@smartguard.com</p>
          </div>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold">Role</h3>
            <Badge>Administrator</Badge>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold">Team</h3>
            <p className="text-muted-foreground">Central Command Unit</p>
        </div>
         <div className="space-y-2">
            <h3 className="font-semibold">Member Since</h3>
            <p className="text-muted-foreground">January 1, 2024</p>
        </div>
      </CardContent>
    </Card>
  );
}
