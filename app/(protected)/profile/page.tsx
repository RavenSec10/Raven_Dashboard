import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Settings, Shield, Plus, MoreVertical, X } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information</p>
          </div>
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <X className="h-5 w-5" />
            </Button>
          </Link>
        </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-2xl shadow-gray-900/20 dark:shadow-black/40">
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                        <AvatarImage 
                          src={session.user.image || '/default-avatar.png'} 
                          alt={session.user.name || "User Avatar"} 
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-xl font-semibold">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white shadow-md"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {session.user.name || 'User'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Email Addresses Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Email addresses</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm"> {/* Added shadow */}
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{session.user.email}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Primary
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button variant="outline" className="w-full justify-start gap-2 h-12 border-dashed hover:shadow-sm transition-shadow"> {/* Added hover shadow */}
                      <Plus className="h-4 w-4" />
                      Add an email address
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Connected Accounts Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connected accounts</h3>
                  <div className="space-y-3">
                    {session.user.email && (
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-sm"> {/* Added shadow */}
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm border">
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full justify-start gap-2 h-12 border-dashed hover:shadow-sm transition-shadow"> {/* Added hover shadow */}
                      <Plus className="h-4 w-4" />
                      Connect account
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Danger Zone */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Danger</h3>
                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/10 shadow-md"> {/* Added shadow */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-100">Delete Account</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          Delete your account and all its associated data
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        className="ml-4 bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md transition-shadow" 
                      >
                        DELETE ACCOUNT
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Debug Information (Optional - Remove in production) */}
                <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner"> {/* Added inner shadow */}
                  <details className="cursor-pointer">
                    <summary className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Debug Information (Development Only)
                    </summary>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}