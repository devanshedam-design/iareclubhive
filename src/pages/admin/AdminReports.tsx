import { useClubs, useEvents } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { format } from 'date-fns';
import { Download, FileText } from 'lucide-react';
import { getItem, STORAGE_KEYS } from '@/lib/storage';
import { User } from '@/types';

export default function AdminReports() {
  const { getAdminClubs } = useClubs();
  const { events, getEventRegistrations } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  const adminClubs = getAdminClubs();
  const adminClubIds = adminClubs.map((c) => c.id);
  const adminEvents = events.filter((e) => adminClubIds.includes(e.clubId));

  const event = adminEvents.find((e) => e.id === selectedEvent);
  const registrations = selectedEvent ? getEventRegistrations(selectedEvent) : [];
  const users = getItem<User[]>(STORAGE_KEYS.USERS) || [];

  const getUser = (userId: string) => users.find((u) => u.id === userId);

  const downloadReport = () => {
    if (!event) return;
    const reportData = {
      event: event.title,
      date: event.date,
      venue: event.venue,
      totalRegistrations: registrations.length,
      attendees: registrations.map((r) => {
        const user = getUser(r.userId);
        return { name: user?.name, email: user?.email, department: user?.department, year: user?.year, registeredAt: r.registeredAt };
      }),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_report.json`;
    a.click();
  };

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
                <SelectItem key={e.id} value={e.id}>{e.title} - {format(new Date(e.date), 'MMM d, yyyy')}</SelectItem>
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
              <CardDescription>{format(new Date(event.date), 'MMMM d, yyyy')} • {event.venue}</CardDescription>
            </div>
            <Button onClick={downloadReport}><Download className="mr-2 h-4 w-4" />Download Report</Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold">{registrations.length}</p>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold">{event.capacity}</p>
                <p className="text-sm text-muted-foreground">Capacity</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold">{Math.round((registrations.length / event.capacity) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Fill Rate</p>
              </div>
            </div>

            {registrations.length === 0 ? (
              <div className="text-center py-8"><FileText className="mx-auto h-12 w-12 text-muted-foreground" /><p className="mt-2 text-muted-foreground">No registrations yet</p></div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead><TableHead>Year</TableHead><TableHead>Registered</TableHead></TableRow></TableHeader>
                <TableBody>
                  {registrations.map((r) => {
                    const user = getUser(r.userId);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{user?.name || 'Unknown'}</TableCell>
                        <TableCell>{user?.email}</TableCell>
                        <TableCell>{user?.department || '-'}</TableCell>
                        <TableCell>{user?.year || '-'}</TableCell>
                        <TableCell>{format(new Date(r.registeredAt), 'MMM d, h:mm a')}</TableCell>
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
