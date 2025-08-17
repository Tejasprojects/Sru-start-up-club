
import React, { useState, useEffect } from "react";
import { AdminPageTemplate } from "@/components/admin/AdminPageTemplate";
import { Trophy, PlusCircle, Pencil, Trash2, CheckCircle, AlertCircle, Upload, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SuccessStory } from "@/lib/types";
import {
  getAllSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory
} from "@/lib/successStoriesHelpers";
import { useAuth } from "@/context/AuthContext";
import { useSuccessStoryImageUpload } from "@/hooks/useSuccessStoryImageUpload";

const successStorySchema = z.object({
  id: z.string().optional(),
  company_name: z.string().min(1, "Company name is required"),
  founder: z.string().min(1, "Founder name is required"),
  year: z.coerce.number().int().positive("Year must be a positive number").optional(),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  featured: z.boolean().default(false),
  image_url: z.string().optional().nullable(),
  achievements: z.array(z.string()).optional(),
});

type SuccessStoryFormData = z.infer<typeof successStorySchema>;

const ManageSuccessStories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { uploadImage, isUploading, progress, resetUpload, error: uploadError } = useSuccessStoryImageUpload();

  const { data: successStoriesResponse, isLoading, error: fetchError, refetch } = useQuery({
    queryKey: ["success-stories"],
    queryFn: () => getAllSuccessStories(),
    meta: {
      onSuccess: (data) => {
        console.log("Success stories query successful:", data);
        if (!data.success) {
          console.error("API returned success: false", data.error);
        }
      },
      onError: (error) => {
        console.error("Error fetching success stories:", error);
      }
    }
  });

  useEffect(() => {
    console.log("Current auth state:", user ? "Authenticated" : "Not authenticated");
    if (user) {
      console.log("User ID:", user.id);
    }
  }, [user]);

  useEffect(() => {
    if (successStoriesResponse) {
      setDebugInfo(`Query returned: success=${successStoriesResponse.success}, 
                   data=${successStoriesResponse.data ? 
                   `${successStoriesResponse.data.length} stories` : 'null or undefined'}`);
    } else {
      setDebugInfo("Query response is undefined");
    }
  }, [successStoriesResponse]);

  const form = useForm<SuccessStoryFormData>({
    resolver: zodResolver(successStorySchema),
    defaultValues: {
      company_name: "",
      founder: "",
      year: new Date().getFullYear(),
      industry: "",
      description: "",
      featured: false,
      image_url: "",
      achievements: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: SuccessStoryFormData) => {
      const storyData = {
        ...data,
        ...(user && { user_id: user.id }),
      };
      
      console.log("Creating success story with data:", storyData);
      return createSuccessStory(storyData);
    },
    onSuccess: (response) => {
      if (!response.success) {
        setApiError(response.error?.message || "Failed to create success story");
        return;
      }
      
      queryClient.invalidateQueries({ queryKey: ["success-stories"] });
      refetch();
      
      toast({
        title: "Success Story Created",
        description: "The success story was created successfully.",
      });
      setApiError(null);
      handleCloseDialog();
    },
    onError: (error: any) => {
      console.error("Error in create mutation:", error);
      setApiError(error.message || "Failed to create success story");
      toast({
        title: "Error",
        description: error.message || "Failed to create success story.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SuccessStoryFormData) => {
      if (!selectedStory) {
        throw new Error("No story selected for update");
      }
      
      const storyToUpdate = {
        ...selectedStory,
        ...data,
      };
      
      console.log("Updating success story with data:", storyToUpdate);
      return updateSuccessStory(storyToUpdate as SuccessStory);
    },
    onSuccess: (response) => {
      if (!response.success) {
        setApiError(response.error?.message || "Failed to update success story");
        return;
      }
      
      queryClient.invalidateQueries({ queryKey: ["success-stories"] });
      refetch();
      
      toast({
        title: "Success Story Updated",
        description: "The success story was updated successfully.",
      });
      setApiError(null);
      handleCloseDialog();
    },
    onError: (error: any) => {
      console.error("Error in update mutation:", error);
      setApiError(error.message || "Failed to update success story");
      toast({
        title: "Error",
        description: error.message || "Failed to update success story.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      console.log("Deleting success story with ID:", id);
      return deleteSuccessStory(id);
    },
    onSuccess: (response) => {
      if (!response.success) {
        setApiError(response.error?.message || "Failed to delete success story");
        return;
      }
      
      queryClient.invalidateQueries({ queryKey: ["success-stories"] });
      refetch();
      
      toast({
        title: "Success Story Deleted",
        description: "The success story was deleted successfully.",
      });
      setApiError(null);
      setIsConfirmDeleteOpen(false);
    },
    onError: (error: any) => {
      console.error("Error in delete mutation:", error);
      setApiError(error.message || "Failed to delete success story");
      toast({
        title: "Error",
        description: error.message || "Failed to delete success story.",
        variant: "destructive",
      });
    },
  });

  const addTestStory = async () => {
    const testStory = {
      company_name: "Test Company",
      founder: "Test Founder",
      year: 2023,
      industry: "Test Industry",
      description: "This is a test success story for debugging purposes.",
      featured: false,
      image_url: null,
      achievements: ["Test Achievement 1", "Test Achievement 2"]
    };

    try {
      console.log("Creating test story:", testStory);
      const result = await createSuccessStory(testStory);
      
      if (result.success) {
        console.log("Test story created successfully:", result.data);
        toast({
          title: "Test Story Created",
          description: "A test success story was created successfully.",
        });
        refetch();
      } else {
        console.error("Failed to create test story:", result.error);
        toast({
          title: "Error",
          description: result.error?.message || "Failed to create test story.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating test story:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting image upload...");
    const imageUrl = await uploadImage(selectedFile);
    
    if (imageUrl) {
      console.log("Image uploaded successfully:", imageUrl);
      form.setValue("image_url", imageUrl);
      setSelectedFile(null);
      setImagePreview(imageUrl);
      
      toast({
        title: "Image uploaded",
        description: "Image has been successfully uploaded and attached to the story.",
      });
    } else {
      console.log("Image upload failed");
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    form.setValue("image_url", "");
    resetUpload();
    
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleOpenDialog = (story?: SuccessStory) => {
    setApiError(null);
    setSelectedFile(null);
    setImagePreview(null);
    resetUpload();
    
    if (story) {
      console.log("Opening dialog to edit story:", story);
      setSelectedStory(story);
      setImagePreview(story.image_url || null);
      form.reset({
        id: story.id,
        company_name: story.company_name,
        founder: story.founder,
        year: story.year || new Date().getFullYear(),
        industry: story.industry || "",
        description: story.description,
        featured: story.featured || false,
        image_url: story.image_url || "",
        achievements: story.achievements || [],
      });
    } else {
      console.log("Opening dialog to create new story");
      setSelectedStory(null);
      form.reset({
        company_name: "",
        founder: "",
        year: new Date().getFullYear(),
        industry: "",
        description: "",
        featured: false,
        image_url: "",
        achievements: [],
      });
    }
    
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedStory(null);
    setApiError(null);
    setSelectedFile(null);
    setImagePreview(null);
    resetUpload();
    form.reset();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsConfirmDeleteOpen(true);
    setApiError(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const onSubmit = (data: SuccessStoryFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }

    setApiError(null);
    
    if (selectedStory) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (fetchError) {
    return (
      <AdminPageTemplate
        title="Manage Success Stories"
        description="Create, edit, and manage success stories featured on the homepage"
        icon={Trophy}
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load success stories. Please try again later.
          </AlertDescription>
        </Alert>
      </AdminPageTemplate>
    );
  }

  return (
    <AdminPageTemplate
      title="Manage Success Stories"
      description="Create, edit, and manage success stories featured on the homepage"
      icon={Trophy}
    >
      <div className="space-y-6">
        {debugInfo && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Debug Info</AlertTitle>
            <AlertDescription className="whitespace-pre-line">{debugInfo}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Success Stories</h2>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleOpenDialog()}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Success Story
            </Button>
            {process.env.NODE_ENV !== 'production' && (
              <Button 
                variant="outline"
                onClick={addTestStory}
              >
                Add Test Story
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => refetch()}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading success stories...</p>
          </div>
        ) : (
          <>
            {successStoriesResponse?.success === false && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {successStoriesResponse.error?.message || "Failed to fetch success stories"}
                </AlertDescription>
              </Alert>
            )}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Founder</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead className="w-24 text-center">Featured</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {successStoriesResponse?.success && successStoriesResponse.data && successStoriesResponse.data.length > 0 ? (
                  successStoriesResponse.data.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell>
                        {story.image_url ? (
                          <img 
                            src={story.image_url} 
                            alt={story.company_name}
                            className="w-12 h-12 object-cover rounded-md border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{story.company_name}</TableCell>
                      <TableCell>{story.founder}</TableCell>
                      <TableCell>{story.year}</TableCell>
                      <TableCell>{story.industry}</TableCell>
                      <TableCell className="text-center">
                        {story.featured && <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenDialog(story)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(story.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No success stories found. Add a new success story to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStory ? "Edit Success Story" : "Add New Success Story"}
            </DialogTitle>
          </DialogHeader>
          
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="founder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founder*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="2000"
                          max={new Date().getFullYear()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry*</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <FormLabel>Company Image</FormLabel>
                
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {form.getValues("image_url") && (
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                          ✓ Uploaded
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload an image for the success story
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </label>
                    </div>
                  </div>
                )}
                
                {selectedFile && !form.getValues("image_url") && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Selected: {selectedFile.name}</span>
                      <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    {isUploading && (
                      <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-center text-gray-600">{progress}% uploaded</p>
                      </div>
                    )}
                  </div>
                )}

                {uploadError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Alternative)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://example.com/image.jpg" 
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value && !selectedFile) {
                            setImagePreview(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        {...field}
                        placeholder="Describe the success story..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Feature on Homepage</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Display this success story in the featured section of the homepage.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || 
                    updateMutation.isPending || 
                    !user ||
                    !form.formState.isValid
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : selectedStory
                    ? "Update"
                    : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this success story? This action cannot be undone.
          </p>
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageTemplate>
  );
};

export default ManageSuccessStories;
