import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { getApiUrl } from '@/lib/utils';

interface StudentProfile {
  name: string;
  email: string;
  bio: string;
  photo: string;
}

interface ProfileSettingsFormProps {
  address: string;
}

export function ProfileSettingsForm({ address }: ProfileSettingsFormProps) {
  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    email: '',
    bio: '',
    photo: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (address) {
      fetchProfile();
    }
  }, [address]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/api/student/profile/${address}`);
      if (response.data) {
        setProfile({
          name: response.data.name || '',
          email: response.data.email || '',
          bio: response.data.bio || '',
          photo: response.data.photo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setIsSaving(true);
    try {
      await axios.post(`${getApiUrl()}/api/student/profile`, {
        walletAddress: address,
        ...profile,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <Input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="glass-card border-primary/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email Address</label>
        <Input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="glass-card border-primary/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Profile Photo URL</label>
        <Input
          type="url"
          name="photo"
          value={profile.photo}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className="glass-card border-primary/20"
        />
        {profile.photo && (
          <div className="mt-3">
            <img
              src={profile.photo}
              alt="Profile preview"
              className="w-24 h-24 rounded-lg object-cover border border-primary/20"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <Textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          className="glass-card border-primary/20 min-h-[120px]"
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Wallet: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </form>
  );
}
