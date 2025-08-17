
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlideImage } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Move, Trash } from "lucide-react";

interface SlideCardProps {
  slide: SlideImage;
  index: number;
  totalSlides: number;
  onEdit: (slide: SlideImage) => void;
  onDelete: (slideId: string) => void;
  onMove: (slideId: string, direction: 'up' | 'down') => void;
}

export function SlideCard({ 
  slide, 
  index, 
  totalSlides, 
  onEdit, 
  onDelete, 
  onMove 
}: SlideCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  return (
    <>
      <Card className="overflow-hidden">
        <div className="aspect-video relative">
          <img 
            src={slide.image_url} 
            alt={slide.title} 
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {index + 1}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 overflow-hidden">
              <h3 className="font-semibold text-lg truncate">{slide.title}</h3>
              {slide.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{slide.description}</p>
              )}
            </div>
            <div className="flex space-x-1 ml-4">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                disabled={index === 0}
                onClick={() => onMove(slide.id, 'up')}
                title="Move up"
              >
                <Move className="h-4 w-4 rotate-90" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                disabled={index === totalSlides - 1}
                onClick={() => onMove(slide.id, 'down')}
                title="Move down"
              >
                <Move className="h-4 w-4 -rotate-90" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                onClick={() => onEdit(slide)}
                title="Edit slide"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={() => setDeleteDialogOpen(true)}
                title="Delete slide"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{slide.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => onDelete(slide.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
