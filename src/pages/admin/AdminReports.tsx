import { useClubs, useEvents, useProfiles } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Profile, EventRegistration } from '@/types';

export default function AdminReports() {
  const { getAdminClubs, loading: clubsLoading } = useClubs();
  const { events, getEventRegistrations, loading: eventsLoading } = useEvents();
  const { getProfiles } = useProfiles();
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const adminClubs = getAdminClubs();
  const adminClubIds = adminClubs.map((c) => c.id);
  const adminEvents = events.filter((e) => adminClubIds.includes(e.club_id));

  const event = adminEvents.find((e) => e.id === selectedEvent);

  useEffect(() => {
    if (selectedEvent) {
      setLoadingData(true);
      getEventRegistrations(selectedEvent).then(async (regs) => {
        setRegistrations(regs);
        const userIds = regs.map((r) => r.user_id);
        const profs = await getProfiles(userIds);
        setProfiles(profs);
        setLoadingData(false);
      });
    }
  }, [selectedEvent, getEventRegistrations, getProfiles]);

  const getProfile = (userId: string) => profiles.find((p) => p.id === userId);

  const downloadReport = () => {
    if (!event) return;
    const reportData = {
      event: event.title,
      date: event.date,
      location: event.location,
      totalRegistrations: registrations.length,
      attendees: registrations.map((r) => {
        const profile = getProfile(r.user_id);
        return { 
          name: profile?.full_name, 
          email: profile?.email, 
          registeredAt: r.registered_at,
          attended: r.attended
        };
      }),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_report.json`;
    a.click();
  };

  const loading = clubsLoading || eventsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Event Reports</h1>
        <p className="text-muted-foreground">View attendance and download reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
          <CardDescription>Choose an event to view its report</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {adminEvents.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.title} - {format(new Date(e.date), 'MMM d, yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {event && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {format(new Date(event.date), 'MMMM d, yyyy')} • {event.location}
              </CardDescription>
            </div>
            <Button onClick={downloadReport} disabled={loadingData}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold">{loadingData ? '...' : registrations.length}</p>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold">{event.capacity || '∞'}</p>
                <p className="text-sm text-muted-foreground">Capacity</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold">
                  {loadingData ? '...' : event.capacity ? Math.round((registrations.length / event.capacity) * 100) : '--'}%
                </p>
                <p className="text-sm text-muted-foreground">Fill Rate</p>
              </div>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No registrations yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Attended</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((r) => {
                    const profile = getProfile(r.user_id);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{profile?.full_name || 'Unknown'}</TableCell>
                        <TableCell>{profile?.email || '-'}</TableCell>
                        <TableCell>{format(new Date(r.registered_at), 'MMM d, h:mm a')}</TableCell>
                        <TableCell>{r.attended ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
