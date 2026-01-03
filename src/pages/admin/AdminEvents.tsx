import { useState, useEffect } from 'react';
import { useClubs, useEvents } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Plus, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Event } from '@/types';

export default function AdminEvents() {
  const { getAdminClubs, loading: clubsLoading } = useClubs();
  const { events, createEvent, getEventRegistrations, refreshEvents, loading: eventsLoading } = useEvents();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    club_id: '',
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 50,
  });

  const adminClubs = getAdminClubs();
  const adminClubIds = adminClubs.map((c) => c.id);
  const adminEvents = events.filter((e) => adminClubIds.includes(e.club_id));

  const getClubName = (clubId: string) => {
    return adminClubs.find((c) => c.id === clubId)?.name || 'Unknown Club';
  };

  const handleCreate = async () => {
    if (!formData.club_id || !formData.title || !formData.date || !formData.location) {
      toast({ title: 'Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }

    setCreating(true);
    const result = await createEvent({
      ...formData,
      capacity: formData.capacity || null,
      description: formData.description || null,
      image_url: null,
    });
    
    if (result) {
      toast({ title: 'Event created!', description: 'Your event has been created successfully.' });
      setIsCreateOpen(false);
      setFormData({
        club_id: '',
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: 50,
      });
    } else {
      toast({ title: 'Error', description: 'Could not create event.', variant: 'destructive' });
    }
    setCreating(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <p className="text-muted-foreground">Create and manage club events</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Fill in the details for your new event.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Club</Label>
                <Select value={formData.club_id} onValueChange={(v) => setFormData({ ...formData, club_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminClubs.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., AI Workshop"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event..."
                />
              </div>

              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Room 101"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 50 })}
                  />
                </div>
              </div>

              <Button onClick={handleCreate} className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {adminEvents.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No events yet</h3>
            <p className="text-muted-foreground">Create your first event to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminEvents.map((event) => (
            <EventCard key={event.id} event={event} getClubName={getClubName} getEventRegistrations={getEventRegistrations} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ 
  event, 
  getClubName, 
  getEventRegistrations 
}: { 
  event: Event; 
  getClubName: (id: string) => string;
  getEventRegistrations: (eventId: string) => Promise<any[]>;
}) {
  const [registrationCount, setRegistrationCount] = useState(0);
  const isPast = new Date(event.date) < new Date();

  useEffect(() => {
    getEventRegistrations(event.id).then((regs) => setRegistrationCount(regs.length));
  }, [event.id, getEventRegistrations]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge variant="outline">{getClubName(event.club_id)}</Badge>
          <Badge variant={isPast ? 'secondary' : 'default'}>
            {isPast ? 'Completed' : 'Upcoming'}
          </Badge>
        </div>
        <CardTitle className="mt-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {event.location}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{registrationCount}</span>
          <span className="text-muted-foreground">/ {event.capacity || '∞'} registered</span>
        </div>

        <div className="pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link to={`/admin/reports?event=${event.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
