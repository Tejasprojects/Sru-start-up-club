import React, { useState, useEffect } from "react";
import { PageTemplate } from "@/components/common/PageTemplate";
import { UserPlus, Search, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, IntroductionRequest } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { createIntroductionRequest, getUserIntroductionRequests } from "@/lib/startupsHelpers";

const RequestIntroductions = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [intermediaries, setIntermediaries] = useState<User[]>([]);
  const [selectedIntermediary, setSelectedIntermediary] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [introRequests, setIntroRequests] = useState<IntroductionRequest[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch users for potential connections
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);
        
        if (usersError) {
          throw usersError;
        }
        
        if (usersData) {
          setUsers(usersData as User[]);
        }
        
        // Fetch existing intro requests
        const requestsData = await getUserIntroductionRequests(user.id);
        setIntroRequests(requestsData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchData();
    } else {
      // If no user, stop loading
      setLoading(false);
    }
  }, [user, toast]);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
      (user.profession || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company || '').toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleUserSelect = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    
    // Find potential intermediaries
    // This uses a simplified approach to find intermediaries
    // In a real app, you'd implement more sophisticated logic
    const potentialIntermediaries = users
      .filter(u => u.id !== selectedUser.id)
      .sort(() => 0.5 - Math.random()) // Random sort for demo purposes
      .slice(0, 3);
    
    setIntermediaries(potentialIntermediaries);
    setSelectedIntermediary(null); // Reset selected intermediary
  };
  
  const handleSubmitRequest = async () => {
    if (!user?.id || !selectedUser || !selectedIntermediary) {
      toast({
        title: "Incomplete Information",
        description: "Please select both a person you want to connect with and an intermediary.",
        variant: "destructive",
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please add a message explaining why you want to connect.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await createIntroductionRequest(
        user.id,
        selectedIntermediary.id,
        selectedUser.id,
        message
      );
      
      if (result.success && result.request) {
        setIntroRequests(prev => [...prev, result.request]);
        setSelectedUser(null);
        setSelectedIntermediary(null);
        setMessage("");
        
        toast({
          title: "Introduction Requested",
          description: "Your introduction request has been sent successfully.",
        });
      } else {
        throw new Error(result.error || "Failed to create introduction request");
      }
    } catch (error) {
      console.error("Error submitting introduction request:", error);
      toast({
        title: "Error",
        description: "Failed to submit introduction request. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <PageTemplate
      title="Request Introductions"
      description="Ask for warm introductions to people in our community network."
      icon={UserPlus}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Find Someone to Connect With</h2>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search by name, role, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {loading ? (
                <p>Loading users...</p>
              ) : filteredUsers.length === 0 ? (
                <p>No users found matching your search criteria.</p>
              ) : (
                filteredUsers.slice(0, 6).map(user => (
                  <Card 
                    key={user.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedUser?.id === user.id ? 'border-primary' : ''
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.photo_url || ""} />
                        <AvatarFallback>
                          {user.first_name?.[0] || ""}{user.last_name?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                        <p className="text-sm text-gray-500">{user.profession || "Member"}</p>
                        {user.company && (
                          <p className="text-xs text-gray-400">{user.company}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {selectedUser && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select a Common Connection</h2>
              <p className="text-gray-600 mb-4">
                Choose someone who knows both you and {selectedUser.first_name} to facilitate an introduction.
              </p>
              
              {intermediaries.length === 0 ? (
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-medium text-yellow-700">No common connections found</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Try connecting with more people in the community to increase your network.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {intermediaries.map(intermediary => (
                    <Card 
                      key={intermediary.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedIntermediary?.id === intermediary.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedIntermediary(intermediary)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={intermediary.photo_url || ""} />
                          <AvatarFallback>
                            {intermediary.first_name?.[0] || ""}{intermediary.last_name?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{intermediary.first_name} {intermediary.last_name}</h3>
                          <p className="text-sm text-gray-500">{intermediary.profession || "Member"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {selectedIntermediary && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Add a Personal Message</h3>
                  <Textarea 
                    placeholder={`Hi ${selectedIntermediary.first_name}, I'd appreciate if you could introduce me to ${selectedUser.first_name}. I'm interested in connecting because...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handleSubmitRequest}
                      disabled={!message.trim()}
                    >
                      Send Introduction Request
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Introduction Requests</h2>
          
          {introRequests.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600">You haven't made any introduction requests yet.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {introRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Request to connect with:</span>
                          <span>{users.find(u => u.id === request.target_id)?.first_name} {users.find(u => u.id === request.target_id)?.last_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>Through:</span>
                          <span>{users.find(u => u.id === request.intermediary_id)?.first_name} {users.find(u => u.id === request.intermediary_id)?.last_name}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Requested on {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Introduction Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Status</h4>
                              <p className="capitalize">{request.status}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Requesting introduction to</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={users.find(u => u.id === request.target_id)?.photo_url || ""} />
                                  <AvatarFallback>
                                    {users.find(u => u.id === request.target_id)?.first_name?.[0] || ""}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p>{users.find(u => u.id === request.target_id)?.first_name} {users.find(u => u.id === request.target_id)?.last_name}</p>
                                  <p className="text-xs text-gray-500">{users.find(u => u.id === request.target_id)?.profession}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Through intermediary</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={users.find(u => u.id === request.intermediary_id)?.photo_url || ""} />
                                  <AvatarFallback>
                                    {users.find(u => u.id === request.intermediary_id)?.first_name?.[0] || ""}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p>{users.find(u => u.id === request.intermediary_id)?.first_name} {users.find(u => u.id === request.intermediary_id)?.last_name}</p>
                                  <p className="text-xs text-gray-500">{users.find(u => u.id === request.intermediary_id)?.profession}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Your message</h4>
                              <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{request.message}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <div className="self-center">
                        <span className={`text-sm px-2 py-1 rounded ${
                          request.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

export default RequestIntroductions;
