import { useClubs, useEvents } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminClubs() {
  const { getAdminClubs } = useClubs();
  const adminClubs = getAdminClubs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Clubs</h1>
          <p className="text-muted-foreground">View and manage your clubs</p>
        </div>
      </div>

      {adminClubs.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No clubs assigned</h3>
            <p className="text-muted-foreground">You don't have any clubs to manage.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminClubs.map((club) => (
            <ClubAdminCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
}

function ClubAdminCard({ club }: { club: { id: string; name: string; description: string } }) {
  const { events, getEventRegistrations } = useEvents(club.id);
  
  const totalRegistrations = events.reduce((sum, event) => {
    return sum + getEventRegistrations(event.id).length;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{club.name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{club.description}</CardDescription>
          </div>
          <Badge variant="secondary">Admin</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-3 text-center">
            <Calendar className="mx-auto h-5 w-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{events.length}</p>
            <p className="text-xs text-muted-foreground">Events</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <Users className="mx-auto h-5 w-5 text-muted-foreground" />
            <p className="mt-1 text-2xl font-bold">{totalRegistrations}</p>
            <p className="text-xs text-muted-foreground">Registrations</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link to="/admin/events">
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
