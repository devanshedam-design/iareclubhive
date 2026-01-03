import { useState, useEffect } from 'react';
import { useClubs, useEvents } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, Settings, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Club } from '@/types';

export default function AdminClubs() {
  const { getAdminClubs, createClub, loading, refreshClubs } = useClubs();
  const adminClubs = getAdminClubs();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.category) {
      toast({ title: 'Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }

    setCreating(true);
    const result = await createClub(formData);
    if (result) {
      toast({ title: 'Club created!', description: 'Your club has been created successfully.' });
      setIsCreateOpen(false);
      setFormData({ name: '', description: '', category: 'General' });
    } else {
      toast({ title: 'Error', description: 'Could not create club.', variant: 'destructive' });
    }
    setCreating(false);
  };

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
          <h1 className="text-3xl font-bold">Manage Clubs</h1>
          <p className="text-muted-foreground">View and manage your clubs</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Club
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Club</DialogTitle>
              <DialogDescription>Fill in the details for your new club.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Club Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tech Club"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Technology, Sports, Arts"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your club..."
                />
              </div>

              <Button onClick={handleCreate} className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Club'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {adminClubs.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No clubs yet</h3>
            <p className="text-muted-foreground">Create your first club to get started.</p>
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

function ClubAdminCard({ club }: { club: Club }) {
  const { events, getEventRegistrations } = useEvents(club.id);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  useEffect(() => {
    const fetchRegistrations = async () => {
      let total = 0;
      for (const event of events) {
        const regs = await getEventRegistrations(event.id);
        total += regs.length;
      }
      setTotalRegistrations(total);
    };
    fetchRegistrations();
  }, [events, getEventRegistrations]);

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
