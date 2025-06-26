import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/sign-in');
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <img src={session.user.image ?? '/default-avatar.png'} alt="User avatar" className="w-16 h-16 rounded-full" />
            <div>
              <p className="font-semibold text-lg">{session.user.name}</p>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <pre className="mt-4 p-4 bg-secondary rounded-md overflow-x-auto text-sm">
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}