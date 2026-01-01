import { useClubs, useEvents, useAnnouncements } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Bell, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function MyClubs() {
  const { getMyClubs, clubs, joinClub } = useClubs();
  const myClubs = getMyClubs();

  const otherClubs = clubs.filter(
    (club) => !myClubs.some((mc) => mc.id === club.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Clubs</h1>
        <p className="text-muted-foreground">View your clubs, events, and announcements</p>
      </div>

      <Tabs defaultValue="my-clubs">
        <TabsList>
          <TabsTrigger value="my-clubs">My Clubs ({myClubs.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my-clubs" className="mt-6">
          {myClubs.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No clubs yet</h3>
                <p className="text-muted-foreground">Join a club to see it here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {myClubs.map((club) => (
                <ClubCard key={club.id} club={club} isMember />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="mt-6">
          {otherClubs.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">You've joined all available clubs!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {otherClubs.map((club) => (
                <ClubCard key={club.id} club={club} onJoin={() => joinClub(club.id)} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClubCard({
  club,
  isMember,
  onJoin,
}: {
  club: { id: string; name: string; description: string };
  isMember?: boolean;
  onJoin?: () => void;
}) {
  const { events } = useEvents(club.id);
  const { announcements } = useAnnouncements(club.id);
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{club.name}</CardTitle>
            <CardDescription className="mt-1">{club.description}</CardDescription>
          </div>
          {isMember ? (
            <Badge>Member</Badge>
          ) : (
            <Button size="sm" onClick={onJoin}>
              Join
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMember && (
          <>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <Calendar className="h-4 w-4" /> Upcoming Events
              </h4>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.id}
                      to="/events"
                      className="block rounded border p-2 text-sm hover:bg-accent"
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="text-muted-foreground">
                        {format(new Date(event.date), 'MMM d')} • {event.venue}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                <Bell className="h-4 w-4" /> Announcements
              </h4>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No announcements</p>
              ) : (
                <div className="space-y-2">
                  {announcements.slice(0, 2).map((ann) => (
                    <div key={ann.id} className="rounded border p-2 text-sm">
                      <p className="font-medium">{ann.title}</p>
                      <p className="text-muted-foreground line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
