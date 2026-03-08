import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { productAPI, adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Loader2, 
  Plus, 
  FolderOpen, 
  Edit, 
  Trash2, 
  Upload, 
  X, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Define Category type
interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', is_active: true });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const API_URL = 'http://127.0.0.1:8000';

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  useEffect(() => {
    // Clean up preview URL when component unmounts or image changes
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', is_active: true });
    setSelectedImage(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active
    });
    setImagePreview(category.image ? `${API_URL}${category.image}` : null);
    setSelectedImage(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    try {
      // Create FormData to send both text fields and image
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('is_active', String(form.is_active));
      
      // Append image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Log FormData contents for debugging
      console.log('Sending category data:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (editingCategory) {
        // Update existing category with FormData
        await adminAPI.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        // Create new category with FormData
        await adminAPI.createCategory(formData);
        toast.success('Category created successfully');
      }
      
      setDialogOpen(false);
      setEditingCategory(null);
      setForm({ name: '', description: '', is_active: true });
      handleRemoveImage();
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          `Failed to ${editingCategory ? 'update' : 'create'} category`;
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setDeleting(id);
    try {
      await adminAPI.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) return `${API_URL}${imagePath}`;
    return `${API_URL}/media/${imagePath}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
        </div>
        <Button onClick={handleAddNew} className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-5 hover:shadow-lg transition-shadow animate-fade-in">
              <div className="flex items-start gap-3">
                {/* Category Image */}
                <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {cat.image ? (
                    <img 
                      src={getImageUrl(cat.image) || ''} 
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><FolderOpen class="h-6 w-6 text-gray-400" /></div>';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{cat.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleExpand(cat.id)}
                    >
                      {expandedCategories.has(cat.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Compact View */}
                  {!expandedCategories.has(cat.id) && (
                    <>
                      {cat.description && (
                        <p className="text-xs text-gray-500 line-clamp-1 mt-1">{cat.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={cat.is_active ? 'outline' : 'destructive'} 
                          className={`text-xs ${cat.is_active ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
                        >
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatDate(cat.created_at)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Expanded View */}
                  {expandedCategories.has(cat.id) && (
                    <div className="mt-3 space-y-2">
                      {cat.description && (
                        <p className="text-sm text-gray-600">{cat.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={cat.is_active ? 'outline' : 'destructive'} 
                          className={`text-xs ${cat.is_active ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
                        >
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Created: {formatDate(cat.created_at)}
                        </span>
                      </div>
                      {cat.updated_at && cat.updated_at !== cat.created_at && (
                        <p className="text-xs text-gray-400">
                          Updated: {formatDate(cat.updated_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-50"
                    onClick={() => handleEdit(cat)}
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleting === cat.id}
                  >
                    {deleting === cat.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {categories.length === 0 && (
            <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No categories yet</p>
              <Button onClick={handleAddNew} variant="outline" className="mt-4 border-red-600 text-red-600 hover:bg-red-50">
                <Plus className="h-4 w-4 mr-2" /> Create your first category
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false);
          setEditingCategory(null);
          setForm({ name: '', description: '', is_active: true });
          handleRemoveImage();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label>Category Image</Label>
              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={saving}
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Upload className="h-3 w-3 mr-2" />
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </Button>
                    
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={saving}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Max 5MB. JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name"
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                className="mt-1 focus-visible:ring-red-500"
                placeholder="e.g., Burgers"
                disabled={saving}
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                className="mt-1 focus-visible:ring-red-500"
                placeholder="Brief description of the category"
                rows={3}
                disabled={saving}
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch 
                id="active"
                checked={form.is_active} 
                onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))}
                disabled={saving}
                className="data-[state=checked]:bg-red-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 border-gray-300"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingCategory(null);
                  setForm({ name: '', description: '', is_active: true });
                  handleRemoveImage();
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingCategory ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  editingCategory ? 'Update Category' : 'Create Category'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;